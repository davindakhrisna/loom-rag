import { Session } from "next-auth"

export interface SessionProps {
  session: Session | null;
}
