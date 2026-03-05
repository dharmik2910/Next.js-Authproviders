import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-10">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-10 border-b border-gray-200 pb-5">
          <div className="flex items-center gap-4">
            <div className="text-right">
              <h1 className="text-2xl font-bold italic">Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome, {session.user?.email}</p>
            </div>
            <a
              href="/profile"
              className="px-4 py-2 bg-white border border-gray-300 rounded shadow-sm text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Profile
            </a>
            <LogoutButton />
          </div>
        </header>

        <section className="bg-white border border-gray-200 rounded-lg p-10 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Hello, {session.user?.name || "User"}!</h2>
          <p className="text-gray-600 mb-6">
            You are now logged in.
          </p>
        </section>
      </div>
    </div>
  );
}
