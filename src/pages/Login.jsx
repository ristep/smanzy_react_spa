import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Mail, Lock, Loader2, LogIn } from 'lucide-react';
import api from '../services/api';
import Button from '../components/Button';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (data) => api.post('/auth/login', data),
        onSuccess: (data) => {
            // Smanzy backend logic: returns { "data": { "access_token": "...", "user": ... } }
            // Adjust path if needed based on actual API response
            const token = data.data?.data?.access_token || data.data?.access_token;
            if (token) {
                localStorage.setItem('token', token);
            }
            navigate('/profile');
        },
        onError: (err) => {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        mutation.mutate({ email, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-violet-500/20 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10 relative z-10 transition-all duration-300 hover:shadow-blue-500/10 hover:border-white/20">
                <div className="mb-8 text-center">
                    <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 ring-1 ring-blue-500/20">
                        <LogIn className="w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h2>
                    <p className="text-slate-400 text-sm">Sign in to continue to Smanzy</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 text-red-200 p-4 rounded-xl mb-6 text-sm border border-red-500/20 flex items-center shadow-sm">
                        <span className="mr-2">⚠️</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 block ml-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                type="text" // kept as text per original, but email type is better usually
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-slate-500 transition-all duration-200 hover:bg-slate-950/70"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-sm font-medium text-slate-300 block">Password</label>
                        </div>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-slate-500 transition-all duration-200 hover:bg-slate-950/70"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={mutation.isPending}
                        variant="login"
                    >
                        {mutation.isPending ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Signing in...</span>
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </Button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors hover:underline decoration-blue-500/30 underline-offset-4">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}
