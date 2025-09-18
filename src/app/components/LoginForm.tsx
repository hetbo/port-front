'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: email,
                password: password,
            });

            if (result?.error) {
                setError('Invalid email or password. Please try again.');
            } else if (result?.ok) {
                router.push('/dashboard');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-3">
            <div className="w-full max-w-sm bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h1 className="text-xl font-semibold text-slate-900 mb-6 text-center">Login</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors disabled:bg-slate-50 disabled:text-slate-500"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                        disabled={isSubmitting}
                        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-colors disabled:bg-slate-50 disabled:text-slate-500"
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white py-2 px-4 rounded-md text-sm font-medium transition-colors focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 outline-none"
                    >
                        {isSubmitting ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
