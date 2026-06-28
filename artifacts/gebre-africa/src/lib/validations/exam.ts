import { z } from 'zod';

const QuestionTypeEnum = z.enum(['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER', 'ESSAY']);
const ExamStatusEnum = z.enum(['DRAFT', 'PUBLISHED', 'CLOSED']);

export const questionSchema = z.object({
  subject: z.string().min(1),
  gradeLevel: z.string().min(1),
  question: z.string().min(1),
  type: QuestionTypeEnum,
  options: z
    .array(
      z.object({
        label: z.string(),
        isCorrect: z.boolean(),
      })
    )
    .optional(),
  answer: z.string().optional(),
  explanation: z.string().optional(),
  difficulty: z.number().int().min(1).max(5).default(1),
});

export const examCreateSchema = z.object({
  title: z.string().min(1),
  subject: z.string().min(1),
  gradeLevel: z.string().min(1),
  durationMinutes: z.number().int().min(1),
  questionIds: z.array(z.string()).min(1),
  status: ExamStatusEnum.default('DRAFT'),
});

export const examAnswerSchema = z.object({
  examId: z.string(),
  answers: z.record(z.string(), z.string()),
});
