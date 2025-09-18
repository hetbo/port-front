import NextAuth, {NextAuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * A simple helper object to encapsulate the logic for communicating with our Laravel API.
 * This keeps the main configuration cleaner.
 */
const api = {
    async login(credentials: Record<"email" | "password", string> | undefined) {
        if (!credentials) {
            throw new Error("Invalid credentials provided.");
        }

        // We must use a server-side environment variable here.
        // NEXT_PUBLIC_* variables are exposed to the browser, which is a security risk for API URLs.
        const apiUrl = process.env.LARAVEL_API_URL;
        if (!apiUrl) {
            throw new Error("API URL is not configured. Please set LARAVEL_API_URL in your .env file.");
        }

        const res = await fetch(`${apiUrl}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await res.json();

        if (!res.ok) {
            // If the API returns a 4xx or 5xx status, throw an error with the message from the API
            throw new Error(data.message || 'Authentication failed');
        }

        // The API call was successful, return the data (user object and token)
        return data;
    }
};

/**
 * The main configuration object for Auth.js.
 * This defines our authentication strategies, callbacks, and other settings.
 */
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "email"},
                password: {label: "Password", type: "password"}
            },

            /**
             * This function is the core of the Credentials provider.
             * It's called when you use the `signIn` function on the client-side.
             * Its job is to take the credentials, verify them against our backend,
             * and return a user object if they are valid.
             */
            async authorize(credentials) {
                try {
                    // Call our API login function to authenticate with the Laravel backend
                    const data = await api.login(credentials);

                    // If the API response includes a user object and a token, we consider it a success.
                    if (data.user && data.token) {
                        // The object returned here will be passed to the `jwt` callback's `user` parameter.
                        // This structure must match the `User` interface in our `next-auth.d.ts` file.
                        return {
                            id: data.user.id,
                            name: data.user.name,
                            email: data.user.email,
                            apiToken: data.token, // This is our custom property
                        };
                    }

                    // If the API response is not what we expect, return null to indicate failure.
                    return null;
                } catch (error: any) {
                    // If our API call threw an error (e.g., 401 Unauthorized), we can log it
                    // and must return null to signify that authentication has failed.
                    console.error("Authorize error:", error.message);
                    return null;
                }
            }
        })
    ],

    /**
     * Callbacks are functions that are executed at different points in the auth flow.
     * They allow us to control and customize the contents of the JWT and the session object.
     */
    callbacks: {
        /**
         * The `jwt` callback is executed whenever a JSON Web Token is created or updated.
         * This is where we persist our `apiToken` from the backend into the secure JWT.
         * @param token - The token that will be stored in the cookie.
         * @param user - The user object returned from the `authorize` callback (only available on initial sign-in).
         */
        async jwt({token, user}) {
            // On the initial sign-in, the `user` object from `authorize` is available.
            if (user) {
                // We add our custom properties from the `user` object to the `token`.
                token.apiToken = user.apiToken;
                token.sub = user.id.toString(); // `sub` (subject) is a standard JWT claim for the user ID.
            }
            return token;
        },

        /**
         * The `session` callback is executed whenever a session is accessed (e.g., with `useSession` or `getServerSession`).
         * Its job is to take the data from the JWT (the `token` parameter) and provide a safe,
         * client-side-friendly version of it for the session object.
         * @param session - The session object that will be available on the client.
         * @param token - The JWT containing our custom data from the `jwt` callback.
         */
        async session({session, token}) {
            // We add a check to ensure token.sub is not undefined before assigning it.
            if (token && session.user && token.sub) {
                session.user.id = token.sub;
            }
            return session;
        }
    },

    // Use JSON Web Tokens for session management.
    session: {
        strategy: "jwt",
    },

    // Specify our custom login page, so Auth.js redirects to it when a user needs to sign in.
    pages: {
        signIn: '/login',
    },
};

// Export the handler, which creates the GET and POST API routes for NextAuth.js.
const handler = NextAuth(authOptions);
export {handler as GET, handler as POST};