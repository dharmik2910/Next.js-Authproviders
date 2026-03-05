"use client";

import { signIn } from "next-auth/react";
import { Suspense, useState } from "react";
import { LoginForm } from "../../components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");

    const handleEmailLogin = () => {
        signIn("email", { email });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-sm border border-gray-200">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Sign in</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Welcome back! Please enter your details.
                    </p>
                </div>

                <Suspense fallback={<div className="text-center py-4">Loading form...</div>}>
                    <LoginForm />
                </Suspense>

                {/* Email login link */}
                <div className="space-y-2">
                    <input
                        type="email"
                        placeholder="Enter email for link"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border p-2 rounded"
                    />

                    <button
                        onClick={handleEmailLogin}
                        className="w-full bg-blue-600 text-white py-2 rounded"
                    >
                        Login with Email
                    </button>
                </div>

                <div className="text-center text-sm">
                    <p className="text-gray-500">
                        Don't have an account?{" "}
                        <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}