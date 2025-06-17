CREATE TABLE "assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"file_type" text NOT NULL,
	"file_size" integer NOT NULL,
	"folder_id" uuid,
	"user_id" text NOT NULL,
	"is_favorite" boolean DEFAULT false,
	"is_trashed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "folders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"parent_id" uuid,
	"user_id" text NOT NULL,
	"is_favorite" boolean DEFAULT false,
	"is_trashed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "shared_access" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shared_by" text NOT NULL,
	"shared_with" text NOT NULL,
	"type" text NOT NULL,
	"item_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"profile_image_url" text,
	"storage_used" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
