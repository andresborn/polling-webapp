import {
  account,
  option,
  poll,
  session,
  user,
  verification,
  vote,
} from "./schema";

export type User = typeof user.$inferSelect;
export type Account = typeof account.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Verification = typeof verification.$inferSelect;

export type Poll = typeof poll.$inferSelect;
export type Option = typeof option.$inferSelect;
export type Vote = typeof vote.$inferSelect;
