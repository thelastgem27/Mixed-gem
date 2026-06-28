import { Router } from "express";
import { db, students, teachers, fees, users, schools, regions, zones, woredas, grades, sections } from "@workspace/db";
import { eq, count, sql, and, notInArray } from "drizzle-orm";
import { requireAuth, requireRole, requireSchool, type AuthRequest } from "../middlewares/auth.js";
import { createId } from "@paralleldrive/cuid2";
import { supabase } from "../lib/supabase.js";

const router = Router();

// ── ensure dynamic tables exist ────────────────────────────
async function ensureAcademicTables() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS school_subjects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      grade_id TEXT,
      school_id TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS academic_years (
      id TEXT PRIMARY KEY,
      year TEXT NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT FALSE,
      school_id TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
}

// ── Stats ──────────────────────────────────────────────────
router.get("/director/stats", requireAuth, requireRole("DIRECTOR", "VICE_ACADEMIC", "VICE_ADMIN"), requireSchool, async (req: AuthRequest, res) => {
  try {
    const schoolId = req.dbUser!.schoolId;

    const [{ value: studentCount }] = await db
      .select({ value: count() })
      .from(students)
      .where(schoolId ? eq(students.schoolId, schoolId) : sql`1=1`);

    const [{ value: teacherCount }] = await db
      .select({ value: count() })
      .from(teachers)
      .where(schoolId ? eq(teachers.schoolId, schoolId) : sql`1=1`);

    const [{ value: staffCount }] = await db
      .select({ value: count() })
      .from(users)
      .where(
        schoolId
          ? and(eq(users.schoolId, schoolId), notInArray(users.role, ["STUDENT", "PARENT"]))
          : sql`1=1`
      );

    const [{ value: feeRevenue }] = await db
      .select({ value: sql<number>`COALESCE(SUM(paid_amount), 0)` })
      .from(fees);

    res.json({
      students: Number(studentCount),
      teachers: Number(teacherCount),
      staff: Number(staffCount),
      attendance: 0,
      revenue: Number(feeRevenue),
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ── School ─────────────────────────────────────────────────
router.get("/director/school", requireAuth, requireRole("DIRECTOR", "VICE_ACADEMIC", "VICE_ADMIN"), requireSchool, async (req: AuthRequest, res) => {
  try {
    const schoolId = req.dbUser!.schoolId!;
    const [school] = await db.select().from(schools).where(eq(schools.id, schoolId));
    if (!school) { res.status(404).json({ error: "School not found" }); return; }

    let regionName: string | null = null;
    let zoneName: string | null = null;
    let woredaName: string | null = null;

    if (school.regionId) {
      const [r] = await db.select({ name: regions.name }).from(regions).where(eq(regions.id, school.regionId));
      regionName = r?.name ?? null;
    }
    if (school.zoneId) {
      const [z] = await db.select({ name: zones.name }).from(zones).where(eq(zones.id, school.zoneId));
      zoneName = z?.name ?? null;
    }
    if (school.woredaId) {
      const [w] = await db.select({ name: woredas.name }).from(woredas).where(eq(woredas.id, school.woredaId));
      woredaName = w?.name ?? null;
    }

    res.json({ ...school, regionName, zoneName, woredaName });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.put("/director/school", requireAuth, requireRole("DIRECTOR"), requireSchool, async (req: AuthRequest, res) => {
  try {
    const schoolId = req.dbUser!.schoolId!;
    const { name, address, phone } = req.body;
    const [updated] = await db
      .update(schools)
      .set({ name, address, phone, updatedAt: new Date() })
      .where(eq(schools.id, schoolId))
      .returning();
    res.json(updated);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ── Staff ──────────────────────────────────────────────────
router.get("/director/staff", requireAuth, requireRole("DIRECTOR", "VICE_ADMIN", "HR"), requireSchool, async (req: AuthRequest, res) => {
  try {
    const schoolId = req.dbUser!.schoolId!;
    const staff = await db
      .select()
      .from(users)
      .where(and(
        eq(users.schoolId, schoolId),
        notInArray(users.role, ["STUDENT", "PARENT"]),
      ));

    const teacherRecords = await db
      .select()
      .from(teachers)
      .where(eq(teachers.schoolId, schoolId));

    const teacherByUserId = Object.fromEntries(teacherRecords.map(t => [t.userId, t]));

    const result = staff.map(u => ({
      id: u.id,
      firstName: u.firstName,
      middleName: u.middleName,
      lastName: u.lastName,
      email: u.email,
      phone: u.phone,
      role: u.role,
      isActive: u.isActive,
      staffCode: teacherByUserId[u.id]?.staffCode ?? null,
      qualification: teacherByUserId[u.id]?.qualification ?? null,
      subjects: teacherByUserId[u.id]?.subjects ?? [],
      createdAt: u.createdAt,
    }));

    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/director/staff", requireAuth, requireRole("DIRECTOR", "HR"), requireSchool, async (req: AuthRequest, res) => {
  try {
    const { firstName, middleName, lastName, email, phone, role, qualification, subjects } = req.body;
    const schoolId = req.dbUser!.schoolId!;

    // Create real Supabase auth user so they can log in with password reset
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { firstName, middleName, lastName },
    });

    if (authError || !authData?.user) {
      res.status(400).json({ error: authError?.message || "Failed to create auth account for staff member" });
      return;
    }

    const authUserId = authData.user.id;
    const staffCode = `STF-${createId().slice(0, 8).toUpperCase()}`;

    const [newUser] = await db.insert(users).values({
      id: createId(),
      authUserId,
      email,
      role,
      firstName,
      middleName,
      lastName,
      phone,
      schoolId,
      isActive: true,
      onboardingDone: true,
    }).returning();

    let teacherRecord = null;
    if (role === "TEACHER") {
      const [t] = await db.insert(teachers).values({
        id: createId(),
        userId: newUser.id,
        schoolId,
        staffCode,
        qualification,
        subjects: subjects || [],
      }).returning();
      teacherRecord = t;
    }

    res.status(201).json({
      ...newUser,
      staffCode: teacherRecord?.staffCode ?? staffCode,
      qualification: teacherRecord?.qualification ?? null,
      subjects: teacherRecord?.subjects ?? [],
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message, cause: e.cause?.message });
  }
});

router.delete("/director/staff/:userId", requireAuth, requireRole("DIRECTOR"), requireSchool, async (req: AuthRequest, res) => {
  try {
    const schoolId = req.dbUser!.schoolId!;
    const userId = String(req.params.userId);

    const [target] = await db.select().from(users).where(and(eq(users.id, userId), eq(users.schoolId, schoolId)));
    if (!target) { res.status(404).json({ error: "Staff member not found" }); return; }
    if (target.role === "DIRECTOR") { res.status(400).json({ error: "Cannot remove the director" }); return; }

    await db.delete(teachers).where(eq(teachers.userId, userId));
    await db.update(users).set({ isActive: false }).where(eq(users.id, userId));

    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ── Academic: Grades ───────────────────────────────────────
router.get("/director/academic/grades", requireAuth, requireRole("DIRECTOR", "VICE_ACADEMIC"), requireSchool, async (req: AuthRequest, res) => {
  try {
    const schoolId = req.dbUser!.schoolId!;
    const gradeRows = await db.select().from(grades).where(eq(grades.schoolId, schoolId));
    // attach section counts
    const sectionRows = await db.select().from(sections);
    const countByGrade: Record<string, number> = {};
    for (const s of sectionRows) countByGrade[s.gradeId] = (countByGrade[s.gradeId] || 0) + 1;
    res.json(gradeRows.map(g => ({ ...g, sectionCount: countByGrade[g.id] || 0 })));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/director/academic/grades", requireAuth, requireRole("DIRECTOR", "VICE_ACADEMIC"), requireSchool, async (req: AuthRequest, res) => {
  try {
    const schoolId = req.dbUser!.schoolId!;
    const { name } = req.body;
    if (!name?.trim()) { res.status(400).json({ error: "Grade name is required" }); return; }
    const [grade] = await db.insert(grades).values({ id: createId(), name: name.trim(), schoolId }).returning();
    res.status(201).json(grade);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/director/academic/grades/:gradeId", requireAuth, requireRole("DIRECTOR"), requireSchool, async (req: AuthRequest, res) => {
  try {
    const schoolId = req.dbUser!.schoolId!;
    const gradeId = String(req.params.gradeId);
    const [grade] = await db.select().from(grades).where(and(eq(grades.id, gradeId), eq(grades.schoolId, schoolId)));
    if (!grade) { res.status(404).json({ error: "Grade not found" }); return; }
    await db.delete(sections).where(eq(sections.gradeId, gradeId));
    await db.delete(grades).where(eq(grades.id, gradeId));
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ── Academic: Sections ─────────────────────────────────────
router.get("/director/academic/sections", requireAuth, requireRole("DIRECTOR", "VICE_ACADEMIC"), requireSchool, async (req: AuthRequest, res) => {
  try {
    const schoolId = req.dbUser!.schoolId!;
    const gradeRows = await db.select().from(grades).where(eq(grades.schoolId, schoolId));
    const gradeIds = gradeRows.map(g => g.id);
    if (gradeIds.length === 0) { res.json([]); return; }

    const sectionRows = await db.select().from(sections)
      .where(sql`${sections.gradeId} = ANY(${sql.raw(`ARRAY[${gradeIds.map(id => `'${id}'`).join(",")}]::text[]`)})`)
      ;

    const gradeById = Object.fromEntries(gradeRows.map(g => [g.id, g]));

    // fetch teacher names for classTeacherIds
    const teacherUserIds = [...new Set(sectionRows.map(s => s.classTeacherId).filter(Boolean))] as string[];
    let teacherNames: Record<string, string> = {};
    if (teacherUserIds.length > 0) {
      const teacherUsers = await db.select({ id: users.id, firstName: users.firstName, lastName: users.lastName })
        .from(users)
        .where(sql`${users.id} = ANY(${sql.raw(`ARRAY[${teacherUserIds.map(id => `'${id}'`).join(",")}]::text[]`)})`);
      teacherNames = Object.fromEntries(teacherUsers.map(u => [u.id, `${u.firstName} ${u.lastName}`]));
    }

    res.json(sectionRows.map(s => ({
      ...s,
      gradeName: gradeById[s.gradeId]?.name ?? "Unknown",
      classTeacherName: s.classTeacherId ? (teacherNames[s.classTeacherId] ?? null) : null,
    })));
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/director/academic/sections", requireAuth, requireRole("DIRECTOR", "VICE_ACADEMIC"), requireSchool, async (req: AuthRequest, res) => {
  try {
    const schoolId = req.dbUser!.schoolId!;
    const { name, gradeId, classTeacherId } = req.body;
    if (!name?.trim()) { res.status(400).json({ error: "Section name is required" }); return; }
    if (!gradeId) { res.status(400).json({ error: "Grade is required" }); return; }
    const [grade] = await db.select().from(grades).where(and(eq(grades.id, gradeId), eq(grades.schoolId, schoolId)));
    if (!grade) { res.status(404).json({ error: "Grade not found" }); return; }
    const [section] = await db.insert(sections).values({
      id: createId(),
      name: name.trim(),
      gradeId,
      classTeacherId: classTeacherId || null,
    }).returning();
    res.status(201).json({ ...section, gradeName: grade.name });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.patch("/director/academic/sections/:sectionId", requireAuth, requireRole("DIRECTOR", "VICE_ACADEMIC"), requireSchool, async (req: AuthRequest, res) => {
  try {
    const schoolId = req.dbUser!.schoolId!;
    const sectionId = String(req.params.sectionId);
    const { classTeacherId } = req.body;
    const [section] = await db.select().from(sections).where(eq(sections.id, sectionId));
    if (!section) { res.status(404).json({ error: "Section not found" }); return; }
    const [grade] = await db.select().from(grades).where(and(eq(grades.id, section.gradeId), eq(grades.schoolId, schoolId)));
    if (!grade) { res.status(403).json({ error: "Not authorized" }); return; }
    const [updated] = await db.update(sections).set({ classTeacherId: classTeacherId || null }).where(eq(sections.id, sectionId)).returning();
    res.json(updated);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/director/academic/sections/:sectionId", requireAuth, requireRole("DIRECTOR"), requireSchool, async (req: AuthRequest, res) => {
  try {
    const schoolId = req.dbUser!.schoolId!;
    const sectionId = String(req.params.sectionId);
    const [section] = await db.select().from(sections).where(eq(sections.id, sectionId));
    if (!section) { res.status(404).json({ error: "Section not found" }); return; }
    const [grade] = await db.select().from(grades).where(and(eq(grades.id, section.gradeId), eq(grades.schoolId, schoolId)));
    if (!grade) { res.status(403).json({ error: "Not authorized" }); return; }
    await db.delete(sections).where(eq(sections.id, sectionId));
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ── Academic: Subjects ─────────────────────────────────────
router.get("/director/academic/subjects", requireAuth, requireRole("DIRECTOR", "VICE_ACADEMIC"), requireSchool, async (req: AuthRequest, res) => {
  try {
    await ensureAcademicTables();
    const schoolId = req.dbUser!.schoolId!;
    const rows = await db.execute(sql`SELECT * FROM school_subjects WHERE school_id = ${schoolId} ORDER BY name`);
    res.json(rows.rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/director/academic/subjects", requireAuth, requireRole("DIRECTOR", "VICE_ACADEMIC"), requireSchool, async (req: AuthRequest, res) => {
  try {
    await ensureAcademicTables();
    const schoolId = req.dbUser!.schoolId!;
    const { name, gradeId } = req.body;
    if (!name?.trim()) { res.status(400).json({ error: "Subject name is required" }); return; }
    const id = createId();
    await db.execute(sql`
      INSERT INTO school_subjects (id, name, grade_id, school_id)
      VALUES (${id}, ${name.trim()}, ${gradeId || null}, ${schoolId})
    `);
    const rows = await db.execute(sql`SELECT * FROM school_subjects WHERE id = ${id}`);
    res.status(201).json(rows.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/director/academic/subjects/:subjectId", requireAuth, requireRole("DIRECTOR"), requireSchool, async (req: AuthRequest, res) => {
  try {
    await ensureAcademicTables();
    const schoolId = req.dbUser!.schoolId!;
    const { subjectId } = req.params;
    await db.execute(sql`DELETE FROM school_subjects WHERE id = ${subjectId} AND school_id = ${schoolId}`);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ── Academic: Academic Years ───────────────────────────────
router.get("/director/academic/years", requireAuth, requireRole("DIRECTOR", "VICE_ACADEMIC"), requireSchool, async (req: AuthRequest, res) => {
  try {
    await ensureAcademicTables();
    const schoolId = req.dbUser!.schoolId!;
    const rows = await db.execute(sql`SELECT * FROM academic_years WHERE school_id = ${schoolId} ORDER BY year DESC`);
    res.json(rows.rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/director/academic/years", requireAuth, requireRole("DIRECTOR"), requireSchool, async (req: AuthRequest, res) => {
  try {
    await ensureAcademicTables();
    const schoolId = req.dbUser!.schoolId!;
    const { year } = req.body;
    if (!year?.trim()) { res.status(400).json({ error: "Year is required" }); return; }
    const id = createId();
    await db.execute(sql`
      INSERT INTO academic_years (id, year, is_active, school_id)
      VALUES (${id}, ${year.trim()}, FALSE, ${schoolId})
    `);
    const rows = await db.execute(sql`SELECT * FROM academic_years WHERE id = ${id}`);
    res.status(201).json(rows.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.patch("/director/academic/years/:yearId/activate", requireAuth, requireRole("DIRECTOR"), requireSchool, async (req: AuthRequest, res) => {
  try {
    await ensureAcademicTables();
    const schoolId = req.dbUser!.schoolId!;
    const { yearId } = req.params;
    await db.execute(sql`UPDATE academic_years SET is_active = FALSE WHERE school_id = ${schoolId}`);
    await db.execute(sql`UPDATE academic_years SET is_active = TRUE WHERE id = ${yearId} AND school_id = ${schoolId}`);
    const rows = await db.execute(sql`SELECT * FROM academic_years WHERE id = ${yearId}`);
    res.json(rows.rows[0]);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.delete("/director/academic/years/:yearId", requireAuth, requireRole("DIRECTOR"), requireSchool, async (req: AuthRequest, res) => {
  try {
    await ensureAcademicTables();
    const schoolId = req.dbUser!.schoolId!;
    const { yearId } = req.params;
    await db.execute(sql`DELETE FROM academic_years WHERE id = ${yearId} AND school_id = ${schoolId}`);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// ── Teachers list for section assignment ───────────────────
router.get("/director/academic/teachers", requireAuth, requireRole("DIRECTOR", "VICE_ACADEMIC"), requireSchool, async (req: AuthRequest, res) => {
  try {
    const schoolId = req.dbUser!.schoolId!;
    const teacherRows = await db
      .select({ id: users.id, firstName: users.firstName, middleName: users.middleName, lastName: users.lastName })
      .from(users)
      .where(and(eq(users.schoolId, schoolId), eq(users.role as any, "TEACHER"), eq(users.isActive, true)));
    res.json(teacherRows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
