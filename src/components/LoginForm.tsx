"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/";
    const authError = searchParams.get("error");

    const getErrorMessage = (error: string | null) => {
        if (!error) return null;
        switch (error) {
            case "Signin":
            case "OAuthSignin":
            case "OAuthCallback":
            case "OAuthCreateAccount":
            case "EmailCreateAccount":
            case "Callback":
                return "There was a problem signing in with your Google account. Please try again.";
            case "OAuthAccountNotLinked":
                return "To confirm your identity, sign in with the same account you used originally.";
            case "EmailSignin":
                return "Check your email address.";
            case "CredentialsSignin":
                return "Sign in failed. Check the details you provided are correct.";
            default:
                return "An unexpected error occurred. Please try again.";
        }
    };

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(getErrorMessage(authError));
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
            callbackUrl,
        });

        if (res?.error) {
            setError("Invalid email or password");
            setLoading(false);
        } else {
            router.push(callbackUrl);
            router.refresh();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm border border-red-200">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="email@example.com"
                />
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                        Forgot password?
                    </a>
                </div>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                    placeholder="Enter Password"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
                {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button
                    type="button"
                    onClick={() => signIn("google", { callbackUrl })}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Google
                </button>
                <button
                    type="button"
                    onClick={() => signIn("github", { callbackUrl })}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    GitHub
                </button>
            </div>
        </form>
    );
}
