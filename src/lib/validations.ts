import { z } from "zod";

export const createContactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
  status: z.enum(["lead", "qualified", "customer", "inactive"]).default("lead"),
  source: z.string().optional(),
  notes: z.string().optional(),
  companyId: z.string().optional(),
});

export const updateContactSchema = createContactSchema.partial();

export const createCompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  industry: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  notes: z.string().optional(),
});

export const createDealSchema = z.object({
  title: z.string().min(1, "Deal title is required"),
  value: z.number().min(0, "Value must be positive").default(0),
  stage: z.enum(["lead", "qualified", "proposal", "negotiation", "closed-won", "closed-lost"]).default("lead"),
  probability: z.number().min(0).max(100).default(0),
  expectedCloseDate: z.string().optional(),
  status: z.enum(["open", "closed"]).default("open"),
  notes: z.string().optional(),
  contactId: z.string().optional(),
  companyId: z.string().optional(),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["pending", "in-progress", "completed"]).default("pending"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  dueDate: z.string().optional(),
  contactId: z.string().optional(),
  dealId: z.string().optional(),
});

export const createActivitySchema = z.object({
  type: z.enum(["call", "email", "meeting", "note"]),
  description: z.string().min(1, "Description is required"),
  date: z.string().optional(),
  contactId: z.string().optional(),
  dealId: z.string().optional(),
  userId: z.string().optional(),
});
