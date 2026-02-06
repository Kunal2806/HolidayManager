/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// ===== 1. UPDATED SCHEMA (schema.ts) =====
import { InferModel } from "drizzle-orm";
import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  date,
  varchar,
  decimal,
  unique
} from "drizzle-orm/pg-core";

// ===== ENUMS =====
export const UserRole = pgEnum("user_role", ["ADMIN", "MANAGER", "EMPLOYEE"]);
export const VerificationStatus = pgEnum("verification_status", ["PENDING", "APPROVED", "REJECTED"]);
export const ProjectStatus = pgEnum("project_status", ["DRAFT", "PUBLISHED", "ARCHIVED"]);

// ===== USERS =====
export const UsersTable = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    password: text("password").notNull(),
    phone: text("phone"),
    phoneVerified: timestamp("phone_verified", { mode: "date" }),
    role: UserRole("role").default("EMPLOYEE").notNull(),
    // organizationId: uuid("organization_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("users_email_key").on(table.email),
    index("users_name_email_phone_idx").on(table.name, table.email, table.phone),
    // index("users_organization_idx").on(table.organizationId),
  ]
);

export type User = InferModel<typeof UsersTable>;
export type NewUser = InferModel<typeof UsersTable, "insert">;

// ===== PROJECTS =====
export const ProjectsTable = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    name: text("name").notNull(),
    description: text("description"),
    logo: text("logo"),
    status: ProjectStatus("status").default("DRAFT").notNull(),
    coverImage: text("cover_image"),
    websiteUrl:text("website_url"),
    bio:text("bio"),
    slug: text("slug"), // Added for URL-friendly project identification
    userId: uuid("user_id").notNull(),
    contentJson: jsonb("content_json"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("projects_slug_key").on(table.slug),
    index("projects_user_idx").on(table.userId),
    index("projects_name_idx").on(table.name),
    index("projects_status_idx").on(table.status),
    index("projects_created_at_idx").on(table.createdAt),
  ]
);

export type Project = InferModel<typeof ProjectsTable>;
export type NewProject = InferModel<typeof ProjectsTable, "insert">;

// Type definitions for JSON content
export interface ProjectContentItem {
  id: string;
  heading: string;
  description: string;
  order?: number;
}

export interface ProjectContent {
  sections: ProjectContentItem[];
  metadata?: {
    version?: string;
    lastModified?: string;
    [key: string]: any;
  };
}

// ===== AUTH TABLES (keeping existing) =====
export const EmailVerificationTokenTable = pgTable(
  "email_verification_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    email: text("email").notNull(),
    token: uuid("token").notNull(),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  },
  (table) => [
    uniqueIndex("email_verification_tokens_email_token_key").on(table.email, table.token),
    uniqueIndex("email_verification_tokens_token_key").on(table.token),
  ]
);

export const PhoneVerificationTable = pgTable(
  "phone_verification_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    phone: text("phone").notNull(),
    otp: text("otp").notNull(),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  },
  (table) => [
    uniqueIndex("phone_verification_tokens_phone_otp_key").on(table.phone, table.otp),
    uniqueIndex("phone_verification_tokens_otp_key").on(table.otp),
  ]
);

export const PasswordResetTokenTable = pgTable(
  "password_reset_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    email: text("email").notNull(),
    token: uuid("token").notNull(),
    expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
  },
  (table) => [
    uniqueIndex("password_reset_tokens_email_token_key").on(table.email, table.token),
    uniqueIndex("password_reset_tokens_token_key").on(table.token),
  ]
);



/* ENUMS */

export const projectStatusEnum = pgEnum("project_status", [
  "active",
  "completed",
  "on_hold",
])

export const dayTypeEnum = pgEnum("day_type", [
  "working",
  "wfh",
  "half_day",
  "leave",
  "holiday",
])

export const logStatusEnum = pgEnum("log_status", [
  "draft",
  "submitted",
  "approved",
])

/* EMPLOYEES */

export const employees = pgTable("employees", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => UsersTable.id)
    .notNull()
    .unique(),
  managerId: uuid("manager_id")
    .references(() => UsersTable.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

/* PROJECTS */

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 150 }).notNull(),
  description: text("description"),
  status: projectStatusEnum("status").default("active"),
  createdAt: timestamp("created_at").defaultNow(),
})

/* MANAGER → PROJECT */

export const managerProjects = pgTable("manager_projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  managerId: uuid("manager_id")
    .references(() => UsersTable.id)
    .notNull(),
  projectId: uuid("project_id")
    .references(() => projects.id)
    .notNull(),
  assignedAt: timestamp("assigned_at").defaultNow(),
})

/* EMPLOYEE → PROJECT */

export const employeeProjects = pgTable("employee_projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  employeeId: uuid("employee_id")
    .references(() => employees.id)
    .notNull(),
  projectId: uuid("project_id")
    .references(() => projects.id)
    .notNull(),
  assignedAt: timestamp("assigned_at").defaultNow(),
})

/* WORK LOGS */

export const workLogs = pgTable(
  "work_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    employeeId: uuid("employee_id")
      .references(() => employees.id)
      .notNull(),

    projectId: uuid("project_id")
      .references(() => projects.id),

    workDate: date("work_date").notNull(),

    dayType: dayTypeEnum("day_type").notNull(),

    hours: decimal("hours").default("0"),

    workDescription: text("work_description"),

    status: logStatusEnum("status").default("draft"),

    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    uniqueEmployeeDate: unique().on(
      table.employeeId,
      table.workDate
    ),
  })
)

