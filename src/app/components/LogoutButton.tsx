'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-sm text-slate-600 hover:text-teal-600 transition-colors font-medium"
        >
            Logout
        </button>
    );
}
