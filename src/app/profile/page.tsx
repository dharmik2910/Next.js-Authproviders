import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/ProfileForm";
import Link from "next/link";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login?callbackUrl=/profile");
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 p-10">
            <div className="max-w-2xl mx-auto">
                <header className="mb-10">
                    <Link href="/" className="text-blue-600 hover:text-blue-500 text-sm font-medium flex items-center mb-4 transition-colors">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
                    <p className="text-gray-500">Manage your account information.</p>
                </header>

                <main>
                    <ProfileForm />
                </main>
            </div>
        </div>
    );
}
