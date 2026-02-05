CREATE TYPE "public"."project_status" AS ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('ADMIN', 'USER');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('PENDING', 'APPROVED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('accepted', 'denied', 'pending');--> statement-breakpoint
CREATE TYPE "public"."request_type" AS ENUM('work_from_home', 'holiday', 'halfday', 'other');--> statement-breakpoint
CREATE TABLE "email_verification_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token" uuid NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token" uuid NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "phone_verification_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" text NOT NULL,
	"otp" text NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"logo" text,
	"status" "project_status" DEFAULT 'DRAFT' NOT NULL,
	"cover_image" text,
	"website_url" text,
	"bio" text,
	"slug" text,
	"user_id" uuid NOT NULL,
	"content_json" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" timestamp,
	"password" text NOT NULL,
	"phone" text,
	"phone_verified" timestamp,
	"role" "user_role" DEFAULT 'USER' NOT NULL,
	"organization_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employee_request" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"name" text,
	"email" text,
	"type" "request_type",
	"reason" text,
	"start_date" date,
	"end_date" date,
	"status" "request_status" DEFAULT 'pending'
);
--> statement-breakpoint
ALTER TABLE "employee_request" ADD CONSTRAINT "employee_request_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "email_verification_tokens_email_token_key" ON "email_verification_tokens" USING btree ("email","token");--> statement-breakpoint
CREATE UNIQUE INDEX "email_verification_tokens_token_key" ON "email_verification_tokens" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX "password_reset_tokens_email_token_key" ON "password_reset_tokens" USING btree ("email","token");--> statement-breakpoint
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens" USING btree ("token");--> statement-breakpoint
CREATE UNIQUE INDEX "phone_verification_tokens_phone_otp_key" ON "phone_verification_tokens" USING btree ("phone","otp");--> statement-breakpoint
CREATE UNIQUE INDEX "phone_verification_tokens_otp_key" ON "phone_verification_tokens" USING btree ("otp");--> statement-breakpoint
CREATE UNIQUE INDEX "projects_slug_key" ON "projects" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "projects_user_idx" ON "projects" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "projects_name_idx" ON "projects" USING btree ("name");--> statement-breakpoint
CREATE INDEX "projects_status_idx" ON "projects" USING btree ("status");--> statement-breakpoint
CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_key" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_name_email_phone_idx" ON "users" USING btree ("name","email","phone");--> statement-breakpoint
CREATE INDEX "users_organization_idx" ON "users" USING btree ("organization_id");