ALTER TABLE "vote" ADD CONSTRAINT "vote_poll_user_uidx" UNIQUE("poll_id","user_id");--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_poll_anon_uidx" UNIQUE("poll_id","anon_id");