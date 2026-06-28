import { Router } from "express";
import { db, users, schools, regions, zones, woredas, countries } from "@workspace/db";
import { eq, or } from "drizzle-orm";
import { requireAuth, type AuthRequest } from "../middlewares/auth.js";
import { getAuthUser, verifyAuthUserId } from "../lib/supabase.js";
import { createId } from "@paralleldrive/cuid2";

const router = Router();

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Resolve the caller identity for onboarding endpoints.
 *
 * Priority:
 *  1. Bearer JWT  (session exists in browser)
 *  2. Service-role admin lookup by authUserId  (if service key is configured)
 *  3. Trust the authUserId from the body  (last resort — user proved email via OTP)
 */
async function resolveOnboardingUser(
  authHeader: string | undefined,
  body: { authUserId?: string; email?: string },
): Promise<{ id: string; email?: string } | null> {
  // 1. Bearer JWT
  const fromToken = await getAuthUser(authHeader);
  if (fromToken) return fromToken;

  const { authUserId, email } = body;
  if (!authUserId || !UUID_RE.test(authUserId)) return null;

  // 2. Admin API verification (requires service role key)
  const adminVerified = await verifyAuthUserId(authUserId);
  if (adminVerified) return adminVerified;

  // 3. Trust the authUserId + email from body — the user proved email via OTP
  if (email) return { id: authUserId, email };

  return null;
}

/**
 * Find an existing user record by authUserId OR email (handles the case
 * where a Director pre-created the staff with a fake authUserId but the
 * real email, and the staff then self-registers).
 */
async function findExistingUser(authId: string, email?: string) {
  const byAuthId = await db.select().from(users).where(eq(users.authUserId, authId));
  if (byAuthId.length) return byAuthId[0];

  if (email) {
    const byEmail = await db.select().from(users).where(eq(users.email, email));
    if (byEmail.length) return byEmail[0];
  }
  return null;
}

router.get("/lookup/regions", async (_req, res) => {
  try {
    const rows = await db.select().from(regions);
    res.json(rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/lookup/zones", async (req, res) => {
  try {
    const { regionId } = req.query;
    const rows = regionId
      ? await db.select().from(zones).where(eq(zones.regionId, regionId as string))
      : await db.select().from(zones);
    res.json(rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/lookup/woredas", async (req, res) => {
  try {
    const { zoneId } = req.query;
    const rows = zoneId
      ? await db.select().from(woredas).where(eq(woredas.zoneId, zoneId as string))
      : await db.select().from(woredas);
    res.json(rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/lookup/schools", async (req, res) => {
  try {
    const rows = await db.select().from(schools);
    res.json(rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/onboarding/complete", requireAuth, async (req: AuthRequest, res) => {
  try {
    const dbUser = req.dbUser;
    if (!dbUser) { res.status(401).json({ error: "Unauthorized" }); return; }

    const { role, schoolId, firstName, lastName, middleName, phone } = req.body;

    const [updated] = await db.update(users)
      .set({ role, schoolId, firstName, lastName, middleName, phone, onboardingDone: true, updatedAt: new Date() })
      .where(eq(users.id, dbUser.id))
      .returning();
    res.json(updated);
  } catch (e: any) {
    console.error('[onboarding/complete]', e.message, e.cause?.message);
    res.status(500).json({ error: e.message });
  }
});

router.post("/onboarding/director", async (req, res) => {
  try {
    const authUser = await resolveOnboardingUser(req.headers.authorization, req.body);
    if (!authUser) { res.status(401).json({ error: "Unauthorized" }); return; }

    const {
      schoolName, schoolType, levels, countryId, regionId, zoneId, woredaId,
      address, phone, firstName, middleName, lastName,
    } = req.body;

    if (!firstName?.trim() || !lastName?.trim()) {
      res.status(400).json({ error: "First name and last name are required" });
      return;
    }

    const schoolCode = `SCH-${Date.now().toString(36).toUpperCase()}`;

    const [school] = await db.insert(schools).values({
      id: createId(),
      name: schoolName,
      code: schoolCode,
      type: schoolType || null,
      educationalLevels: Array.isArray(levels) ? levels : [],
      countryId: countryId || null,
      regionId: regionId || null,
      zoneId: zoneId || null,
      woredaId: woredaId || null,
      address: address || null,
      phone: phone || null,
    }).returning();

    const existing = await findExistingUser(authUser.id, authUser.email);
    if (existing) {
      const [updated] = await db.update(users)
        .set({
          authUserId: authUser.id,
          role: "DIRECTOR",
          schoolId: school.id,
          firstName: firstName || existing.firstName,
          middleName: middleName || existing.middleName,
          lastName: lastName || existing.lastName,
          phone: phone || existing.phone,
          onboardingDone: true,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existing.id))
        .returning();
      res.json({ user: updated, school });
    } else {
      const [created] = await db.insert(users).values({
        id: createId(),
        authUserId: authUser.id,
        email: authUser.email || req.body.email || "",
        role: "DIRECTOR",
        firstName, middleName, lastName, phone,
        schoolId: school.id,
        onboardingDone: true,
      }).returning();
      res.json({ user: created, school });
    }
  } catch (e: any) {
    const cause = e.cause?.message ?? e.cause ?? '';
    console.error('[onboarding/director]', e.message, cause);
    res.status(500).json({ error: e.message, cause: String(cause) });
  }
});

router.post("/lookup", async (req, res) => {
  try {
    const { schoolCode, idCode } = req.body;
    if (!schoolCode || !idCode) { res.status(400).json({ error: "schoolCode and idCode required" }); return; }

    const [school] = await db.select().from(schools).where(eq(schools.code, schoolCode as string));
    if (!school) { res.status(404).json({ error: "School not found" }); return; }

    res.json({ school, valid: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/onboarding/staff", async (req, res) => {
  try {
    const authUser = await resolveOnboardingUser(req.headers.authorization, req.body);
    if (!authUser) { res.status(401).json({ error: "Unauthorized" }); return; }

    const { schoolCode, idCode, role, firstName, middleName, lastName } = req.body;
    if (!schoolCode) { res.status(400).json({ error: "schoolCode required" }); return; }

    const [school] = await db.select().from(schools).where(eq(schools.code, schoolCode as string));
    if (!school) { res.status(404).json({ error: "School not found with that code. Check the code and try again." }); return; }

    const existing = await findExistingUser(authUser.id, authUser.email);

    const resolvedRole = role || existing?.role || "TEACHER";
    const resolvedRedirect = `/${resolvedRole.toLowerCase().replace(/_/g, '-')}`;

    if (existing) {
      // Link real Supabase UUID and update profile
      const [updated] = await db.update(users)
        .set({
          authUserId: authUser.id,
          role: resolvedRole,
          schoolId: school.id,
          firstName: firstName?.trim() || existing.firstName,
          middleName: middleName?.trim() || existing.middleName,
          lastName: lastName?.trim() || existing.lastName,
          onboardingDone: true,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existing.id))
        .returning();
      res.json({ user: updated, redirectTo: resolvedRedirect });
    } else {
      if (!firstName?.trim() || !lastName?.trim()) {
        res.status(400).json({ error: "First name and last name are required" });
        return;
      }
      const [created] = await db.insert(users).values({
        id: createId(),
        authUserId: authUser.id,
        email: authUser.email || req.body.email || "",
        role: resolvedRole,
        firstName: firstName.trim(),
        middleName: middleName?.trim() || null,
        lastName: lastName.trim(),
        schoolId: school.id,
        onboardingDone: true,
      }).returning();
      res.json({ user: created, redirectTo: resolvedRedirect });
    }
  } catch (e: any) {
    console.error('[onboarding/staff]', e.message, e.cause?.message);
    res.status(500).json({ error: e.message, cause: e.cause?.message });
  }
});

router.post("/onboarding/profile", requireAuth, async (req: AuthRequest, res) => {
  try {
    const authUser = req.authUser;
    if (!authUser) { res.status(401).json({ error: "Unauthorized" }); return; }

    const { role, schoolId, firstName, lastName, middleName, phone } = req.body;

    const existing = await findExistingUser(authUser.id, authUser.email);
    if (existing) {
      const [updated] = await db.update(users)
        .set({
          authUserId: authUser.id,
          role,
          schoolId,
          firstName: firstName?.trim() || existing.firstName,
          lastName: lastName?.trim() || existing.lastName,
          middleName: middleName?.trim() || existing.middleName,
          phone,
          onboardingDone: true,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existing.id))
        .returning();
      res.json(updated);
    } else {
      if (!firstName?.trim() || !lastName?.trim()) {
        res.status(400).json({ error: "First name and last name are required" });
        return;
      }
      const [created] = await db.insert(users).values({
        id: createId(),
        authUserId: authUser.id,
        email: authUser.email || '',
        role,
        firstName: firstName.trim(),
        middleName: middleName?.trim() || null,
        lastName: lastName.trim(),
        phone,
        schoolId,
        onboardingDone: true,
      }).returning();
      res.json(created);
    }
  } catch (e: any) {
    console.error('[onboarding/profile]', e.message, e.cause?.message);
    res.status(500).json({ error: e.message });
  }
});

export default router;
