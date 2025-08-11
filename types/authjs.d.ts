import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id?: string;
    username?: string;
    punchcard?: string;
    notesvisibility?: boolean;
    activity?: boolean;
  }

  interface Session {
    user: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
      username?: string;
      punchcard?: string;
      notesvisibility?: boolean;
      activity?: boolean;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string;
    punchcard?: string;
    notesvisibility?: boolean;
    activity?: boolean;
  }
}
