import { Router } from "express";
import { db, fees, students, users } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, requireRole, requireSchool, type AuthRequest } from "../middlewares/auth.js";

const router = Router();

router.get("/fees", requireAuth, requireRole("DIRECTOR", "CASHIER", "VICE_ADMIN"), requireSchool, async (req: AuthRequest, res) => {
  try {
    const schoolId = req.dbUser!.schoolId;

    // Scope fees to students of the user's school only
    const schoolStudents = schoolId
      ? await db.select({ id: students.id }).from(students).where(eq(students.schoolId, schoolId))
      : await db.select({ id: students.id }).from(students);
    const studentIds = schoolStudents.map(s => s.id);

    const rows = studentIds.length
      ? await db.select().from(fees)
      : [];

    const result = await Promise.all(rows
      .filter(f => !schoolId || studentIds.includes(f.studentId))
      .map(async f => {
        const [s] = await db.select().from(students).where(eq(students.id, f.studentId));
        const u = s ? (await db.select().from(users).where(eq(users.id, s.userId)))[0] : null;
        return { ...f, student: { ...s, user: u ? { firstName: u.firstName, lastName: u.lastName } : null } };
      }));
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/fees/:feeId/payment", requireAuth, requireRole("CASHIER", "DIRECTOR"), requireSchool, async (req: AuthRequest, res) => {
  try {
    const feeId = String(req.params.feeId);
    const { amount } = req.body;
    const schoolId = req.dbUser!.schoolId;

    const [fee] = await db.select().from(fees).where(eq(fees.id, feeId));
    if (!fee) { res.status(404).json({ error: "Fee not found" }); return; }

    // Verify the fee belongs to a student of the user's school
    if (schoolId) {
      const [student] = await db.select().from(students).where(eq(students.id, fee.studentId));
      if (!student || student.schoolId !== schoolId) {
        res.status(403).json({ error: "Forbidden: fee does not belong to your school" });
        return;
      }
    }

    const newPaid = fee.paidAmount + amount;
    const newStatus = newPaid >= fee.amount ? "PAID" : newPaid > 0 ? "PARTIAL" : "UNPAID";

    const [updated] = await db.update(fees)
      .set({ paidAmount: newPaid, status: newStatus as any, updatedAt: new Date() })
      .where(eq(fees.id, feeId))
      .returning();
    res.json(updated);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
