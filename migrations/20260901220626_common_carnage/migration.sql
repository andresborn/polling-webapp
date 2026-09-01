CREATE TABLE "vote" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text,
	"poll_id" uuid NOT NULL,
	"option_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "poll" ADD COLUMN "published" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "poll" ADD COLUMN "authenticated_voting" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "poll" ADD COLUMN "expires_at" timestamp;--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id");--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_poll_id_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "poll"("id");--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_option_id_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "option"("id");