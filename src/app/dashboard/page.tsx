import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <h1 className="text-2xl font-semibold text-slate-900 mb-4">Dashboard</h1>

                    <div className="space-y-3">
                        <p className="text-slate-700">
                            Welcome, <span className="font-medium text-teal-700">{session.user?.name}</span>! You are authenticated.
                        </p>
                        <p className="text-sm text-slate-600">
                            Your user ID is: <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-800">{session.user?.id}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
