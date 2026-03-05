import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import PostgresAdapter from "@auth/pg-adapter";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import EmailProvider from "next-auth/providers/email";

export const authOptions: NextAuthOptions = {
    adapter: PostgresAdapter(pool),
    providers: [
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST!,
                port: Number(process.env.EMAIL_SERVER_PORT!),
                auth: {
                    user: process.env.EMAIL_SERVER_USER!,
                    pass: process.env.EMAIL_SERVER_PASSWORD!,
                },
            },
            from: process.env.EMAIL_FROM!,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            allowDangerousEmailAccountLinking: true,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {

                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const { rows } = await pool.query(
                    `SELECT * FROM users WHERE email = $1 LIMIT 1`,
                    [credentials.email]
                );

                const user = rows[0];

                if (!user || !user.password) {
                    return null;
                }

                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) {
                    return null;
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                };
            },
        }),
    ],

    session: {
        strategy: "jwt",
    },

    pages: {
        signIn: "/login",
        error: "/login",
    },

    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
            }

            if (trigger === "update" && session?.name) {
                token.name = session.name;

                try {
                    // Update the user's name in the database
                    await pool.query("UPDATE users SET name = $1 WHERE id = $2", [session.name, token.id]);
                } catch (err) {
                    console.error("Failed to update user name in database:", err);
                }
            }

            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                if (token.name) {
                    session.user.name = token.name;
                }
            }
            return session;
        },
    },
};