"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export function ProfileForm() {
    const { data: session, update, status } = useSession();
    const [name, setName] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        if (session?.user?.name) {
            setName(session.user.name);
        }
    }, [session]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage(null);

        try {
            const newSession = await update({ name });

            if (newSession) {
                setMessage({ type: "success", text: "Profile updated successfully!" });
            } else {
                setMessage({ type: "error", text: "Failed to update session." });
            }
        } catch (error) {
            setMessage({ type: "error", text: "An error occurred during update." });
        } finally {
            setIsUpdating(false);
        }
    };

    if (status === "loading") {
        return <div className="animate-pulse bg-gray-200 h-64 rounded-lg"></div>;
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>

            <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        disabled
                        value={session?.user?.email || ""}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-400 italic">Email cannot be changed.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                        placeholder="Your full name"
                    />
                </div>

                {message && (
                    <div className={`p-3 rounded-md text-sm ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                        }`}>
                        {message.text}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isUpdating || name === session?.user?.name}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isUpdating ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}
