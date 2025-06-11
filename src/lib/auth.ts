/**
 * NextAuth.js authentication configuration for the dashboard
 * 
 * This module configures authentication providers, session management,
 * and custom authentication flows for the News Dashboard application.
 * 
 * Features:
 * - Email/password authentication with mock user database
 * - Google OAuth integration for seamless sign-in
 * - GitHub OAuth integration for developer convenience
 * - Role-based access control (admin/user)
 * - JWT-based session management
 * - Custom authentication pages
 */

import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

/**
 * Mock user database for demonstration purposes
 * 
 * PRODUCTION NOTE: Replace this with actual database queries
 * - Use proper password hashing (bcrypt, argon2, etc.)
 * - Store user data in a secure database (PostgreSQL, MongoDB, etc.)
 * - Implement proper user registration flows
 * - Add email verification and password reset functionality
 */
const users = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    password: "admin123", // WARNING: Never store plain text passwords in production!
    role: "admin",        // Admin users have access to payout management
  },
  {
    id: "2",
    name: "Regular User",
    email: "user@example.com",
    password: "user123",  // Use bcrypt or similar for password hashing in production
    role: "user",         // Regular users have dashboard and news access only
  },
];

/**
 * NextAuth configuration object
 * 
 * Defines authentication providers, session strategy, callbacks,
 * and custom pages for the authentication flow.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    /**
     * Email/Password authentication provider
     * 
     * Handles traditional username/password authentication
     * with custom validation logic against the mock user database.
     */
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      /**
       * Custom authorization function
       * 
       * Validates user credentials against the mock database.
       * In production, this should:
       * - Query a real database
       * - Use proper password hashing validation
       * - Implement rate limiting
       * - Add account lockout mechanisms
       */
      async authorize(credentials) {
        // Validate required credentials
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user in mock database (replace with DB query in production)
        const user = users.find((user) => user.email === credentials.email);

        // Verify user exists and password matches
        if (!user || user.password !== credentials.password) {
          return null;
        }

        // Return user object for successful authentication
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role as "admin" | "user",
        };
      },
    }),

    /**
     * Google OAuth provider
     * 
     * Enables "Sign in with Google" functionality
     * Requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables
     */
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    /**
     * GitHub OAuth provider
     * 
     * Enables "Sign in with GitHub" functionality
     * Requires GITHUB_ID and GITHUB_SECRET environment variables
     */
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],

  /**
   * Session strategy configuration
   * 
   * Using JWT strategy for stateless authentication.
   * Alternative: "database" strategy for server-side sessions.
   */
  session: {
    strategy: "jwt",
  },

  /**
   * JWT and session callbacks for custom user data
   * 
   * These callbacks allow us to include custom data (like user roles)
   * in the JWT token and session object.
   */
  callbacks: {
    /**
     * JWT callback - customizes the JWT token
     * 
     * Runs whenever a JWT is created, updated, or accessed.
     * Used to include custom user data in the token.
     */
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },

    /**
     * Session callback - customizes the session object
     * 
     * Runs whenever a session is checked.
     * Used to include custom user data in the session.
     */
    async session({ session, token }) {
      if (token.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },

  /**
   * Custom pages for authentication flows
   * 
   * Redirects users to custom authentication pages
   * instead of NextAuth's default pages.
   */
  pages: {
    signIn: "/login",
    // signUp: "/register", // Uncomment if using custom registration
  },
};
