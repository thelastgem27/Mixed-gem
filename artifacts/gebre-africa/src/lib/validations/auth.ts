import { z } from 'zod';

const RoleEnum = z.enum([
  'DIRECTOR', 'VICE_ACADEMIC', 'VICE_ADMIN', 'RECORD_OFFICE',
  'HR', 'CASHIER', 'TEACHER', 'STUDENT', 'PARENT',
  'WOREDA_ADMIN', 'ZONE_ADMIN', 'REGION_ADMIN', 'MINISTRY_ADMIN', 'EXAM_OFFICER'
]);

export const SchoolTypeEnum = z.enum(['GOVERNMENT', 'PRIVATE', 'COMMUNITY_FAITH_BASED']);
export const EducationalLevelEnum = z.enum(['KINDERGARTEN', 'PRIMARY', 'SECONDARY']);

export const SCHOOL_TYPE_LABELS: Record<z.infer<typeof SchoolTypeEnum>, string> = {
  GOVERNMENT:           'Government',
  PRIVATE:              'Private',
  COMMUNITY_FAITH_BASED:'Community / Faith-based School',
};

export const EDUCATIONAL_LEVEL_LABELS: Record<z.infer<typeof EducationalLevelEnum>, string> = {
  KINDERGARTEN: 'Kindergarten / Pre-primary',
  PRIMARY:      'Primary School',
  SECONDARY:    'Secondary School',
};

export const step1Schema = z.object({
  firstName:  z.string().trim().min(2, 'First name is too short').max(50),
  middleName: z.string().trim().min(2, 'Middle name is too short').max(50),
  lastName:   z.string().trim().min(2, 'Last name is too short').max(50),
});

export const step2Schema = z.object({
  email:           z.string().email('Invalid email address'),
  password:        z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const verifySchema = z.object({
  code: z.string().length(8, 'Verification code must be 8 digits'),
});

export const directorOnboardingSchema = z.object({
  schoolName: z.string().min(3, 'School name is too short'),
  schoolType: SchoolTypeEnum,
  levels:     z.array(EducationalLevelEnum).min(1, 'Select at least one educational level'),
  countryId:  z.string().min(1, 'Country is required'),
  regionId:   z.string().min(1, 'Region is required'),
  zoneId:     z.string().min(1, 'Zone is required'),
  woredaId:   z.string().min(1, 'Woreda is required'),
  address:    z.string().min(5, 'Address is too short'),
  phone:      z.string().min(10, 'Invalid phone number'),
  logo:       z.string().optional(),
});

export const lookupSchema = z.object({
  schoolCode: z.string().min(1, 'Required'),
  idCode:     z.string().min(1, 'Required'),
  firstName:  z.string().trim().min(2, 'First name is too short').max(50),
  middleName: z.string().trim().min(2, 'Middle name (Father\'s name) is too short').max(50),
  lastName:   z.string().trim().min(2, 'Last name is too short').max(50),
});

export const signupSchema = z.object({
  email:     z.string().email('Invalid email address'),
  password:  z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(2, 'First name is too short'),
  lastName:  z.string().min(2, 'Last name is too short'),
  role:      RoleEnum,
});

export const loginSchema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type SignupInput              = z.infer<typeof signupSchema>;
export type LoginInput               = z.infer<typeof loginSchema>;
export type Step1Input               = z.infer<typeof step1Schema>;
export type Step2Input               = z.infer<typeof step2Schema>;
export type DirectorOnboardingInput  = z.infer<typeof directorOnboardingSchema>;
export type LookupInput              = z.infer<typeof lookupSchema>;
export type SchoolType               = z.infer<typeof SchoolTypeEnum>;
export type EducationalLevel         = z.infer<typeof EducationalLevelEnum>;
