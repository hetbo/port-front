// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

// 1. Extend the User type
declare module "next-auth" {
    /**
     * The User object returned from the `authorize` callback.
     * We are adding the `apiToken` and `id` from our Laravel API.
     */
    interface User extends DefaultUser {
        id: string | number;
        apiToken: string;
    }

    /**
     * The Session object returned from `useSession`, `getSession`, etc.
     * We are adding the `id` to the user object in the session.
     */
    interface Session {
        user: {
            id: string | number;
        } & DefaultSession["user"]; // Keep the default properties like name, email
    }
}

// 2. Extend the JWT type
declare module "next-auth/jwt" {
    /**
     * The JWT token passed to the `jwt` and `session` callbacks.
     * We are adding the `apiToken` to it.
     */
    interface JWT extends DefaultJWT {
        apiToken: string;
    }
}