import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        // Check if user exists
        const existing = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );
        if (existing.rows.length > 0) {
            return NextResponse.json({ error: "Email already in use" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO users (id, name, email, password) 
            VALUES (gen_random_uuid(), $1, $2, $3)`,
            [name, email, hashedPassword]
        );

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("REGISTER ERROR:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}