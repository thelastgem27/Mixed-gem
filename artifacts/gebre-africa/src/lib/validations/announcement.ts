// lib/validations/announcement.ts
import { z } from 'zod';

export const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Content is required'),
  targetRoles: z.array(z.string()).min(1, 'At least one target role is required'),
});

export type AnnouncementValues = z.infer<typeof announcementSchema>;
