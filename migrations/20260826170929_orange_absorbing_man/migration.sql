CREATE TABLE "account" (
	"id" text PRIMARY KEY,
	"issuer" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "options" RENAME TO "option";--> statement-breakpoint
ALTER TABLE "polls" RENAME TO "poll";--> statement-breakpoint
ALTER TABLE "option" DROP CONSTRAINT "options_poll_id_polls_id_fkey";--> statement-breakpoint
ALTER TABLE "poll" DROP CONSTRAINT "polls_user_id_users_id_fkey";--> statement-breakpoint
DROP TABLE "users";--> statement-breakpoint
ALTER TABLE "option" DROP CONSTRAINT "options_pkey";--> statement-breakpoint
ALTER TABLE "poll" DROP CONSTRAINT "polls_pkey";--> statement-breakpoint
ALTER TABLE "option" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "poll" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "poll" ALTER COLUMN "user_id" SET DATA TYPE text USING "user_id"::text;--> statement-breakpoint
CREATE UNIQUE INDEX "account_issuer_accountId_uidx" ON "account" ("issuer","account_id");--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" ("identifier");--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "option" ADD CONSTRAINT "option_poll_id_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "poll"("id");--> statement-breakpoint
ALTER TABLE "poll" ADD CONSTRAINT "poll_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id");