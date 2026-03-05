"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="px-4 py-2 border border-gray-300 rounded shadow-sm text-sm font-medium hover:bg-white transition-colors"
        >
            Log Out
        </button>
    );
}
