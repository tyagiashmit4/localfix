import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    phone?: string | null;
  }

  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      phone?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    id?: string;
    phone?: string | null;
  }
}
