'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import LogoutButton from './LogoutButton';

export default function Navbar() {
    const { data: session, status } = useSession();

    return (
        <nav className="bg-white border-b border-slate-200 px-4 py-3">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
                <Link href="/" className="text-lg font-semibold text-teal-700 hover:text-teal-800 transition-colors">
                    Home
                </Link>

                <div className="flex items-center gap-4">
                    {status === 'loading' && (
                        <span className="text-sm text-slate-500">Loading...</span>
                    )}

                    {status === 'authenticated' && (
                        <>
                            <Link href="/dashboard" className="text-sm text-slate-600 hover:text-teal-600 transition-colors font-medium">
                                Dashboard
                            </Link>
                            <LogoutButton />
                        </>
                    )}

                    {status === 'unauthenticated' && (
                        <Link href="/login" className="text-sm text-slate-600 hover:text-teal-600 transition-colors font-medium">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
