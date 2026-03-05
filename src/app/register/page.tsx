import RegisterForm from "@/components/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-sm border border-gray-200">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Sign up</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Create an account to get started.
                    </p>
                </div>

                <RegisterForm />

                <div className="text-center text-sm">
                    <p className="text-gray-500">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}