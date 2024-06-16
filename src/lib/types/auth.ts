import type { Session, User } from "lucia";

export type Authed = {
  authenticated: true;
  user: User;
  session: Session;
};

export type Unauthed = {
  authenticated: false;
};
