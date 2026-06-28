import { Router } from "express";
import { db, attendance, students, users, sections, grades } from "@workspace/db";
import { eq, and, sql } from "drizzle-orm";
import { requireAuth, requireRole, requireSchool, type AuthRequest } from "../middlewares/auth.js";
import { createId } from "@paralleldrive/cuid2";

const router = Router();

/**
 * Verify a section belongs to the caller's school.
 * Returns true if the check passes; sends 403 and returns false otherwise.
 * Admin roles (no schoolId) skip the check.
 */
async function assertSectionOwnership(
  sectionId: string,
  userSchoolId: string | null | undefined,
  res: any,
): Promise<boolean> {
  if (!userSchoolId) return true; // admin role — skip ownership check
  const [section] = await db.select().from(sections).where(eq(sections.id, sectionId));
  if (!section) {
    (res as any).status(404).json({ error: "Section not found" });
    return false;
  }
  const [grade] = await db.select().from(grades).where(eq(grades.id, section.gradeId));
  if (!grade || grade.schoolId !== userSchoolId) {
    (res as any).status(403).json({ error: "Forbidden: section does not belong to your school" });
    return false;
  }
  return true;
}

router.get("/attendance/section/:sectionId", requireAuth, requireRole("TEACHER", "DIRECTOR", "VICE_ACADEMIC", "RECORD_OFFICE"), requireSchool, async (req: AuthRequest, res) => {
  try {
    const sectionId = String(req.params.sectionId);
    const date = req.query.date as string | undefined;

    if (!(await assertSectionOwnership(sectionId, req.dbUser!.schoolId, res))) return;

    const sectionStudents = await db.select().from(students).where(eq(students.sectionId, sectionId));

    const result = await Promise.all(sectionStudents.map(async s => {
      const [u] = await db.select().from(users).where(eq(users.id, s.userId));
      let status = null;
      if (date) {
        const dateStr = new Date(date).toISOString().split("T")[0];
        const [att] = await db.select().from(attendance)
          .where(and(
            eq(attendance.studentId, s.id),
            sql`${attendance.date}::date = ${dateStr}::date`,
          ));
        status = att?.status ?? null;
      }
      return {
        id: s.id,
        studentId: s.studentId,
        name: u ? `${u.firstName} ${u.lastName}` : "Unknown",
        status,
      };
    }));
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/attendance", requireAuth, requireRole("TEACHER", "DIRECTOR"), requireSchool, async (req: AuthRequest, res) => {
  try {
    const { studentId, date, status } = req.body;
    const dbUser = req.dbUser!;
    if (!date) { res.status(400).json({ error: "date is required" }); return; }

    // Verify the student belongs to the caller's school
    if (dbUser.schoolId) {
      const [student] = await db.select().from(students).where(eq(students.id, studentId));
      if (!student || student.schoolId !== dbUser.schoolId) {
        res.status(403).json({ error: "Forbidden: student does not belong to your school" });
        return;
      }
    }

    const dateStr = new Date(date).toISOString().split("T")[0];

    const [existing] = await db.select().from(attendance).where(
      and(
        eq(attendance.studentId, studentId),
        sql`${attendance.date}::date = ${dateStr}::date`,
      ),
    );

    if (existing) {
      const [updated] = await db.update(attendance)
        .set({ status })
        .where(eq(attendance.id, existing.id))
        .returning();
      res.json(updated);
    } else {
      const [created] = await db.insert(attendance).values({
        id: createId(),
        studentId,
        date: new Date(date),
        status,
        markedById: dbUser.id,
      }).returning();
      res.status(201).json(created);
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
