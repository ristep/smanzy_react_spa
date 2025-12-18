import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { User, Mail, Lock, Loader2, UserPlus } from 'lucide-react';
import api from '../services/api';
import Button from '../components/Button';

export default function Register() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (data) => api.post('/auth/register', data),
        onSuccess: () => {
            navigate('/login');
        },
        onError: (err) => {
            setError(err.response?.data?.error || 'Registration failed.');
        },
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        mutation.mutate(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10 relative z-10 transition-all duration-300 hover:shadow-emerald-500/10 hover:border-white/20">
                <div className="mb-8 text-center">
                    <div className="mx-auto w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 ring-1 ring-emerald-500/20">
                        <UserPlus className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h2>
                    <p className="text-slate-400 text-sm">Join Smanzy today</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 text-red-200 p-4 rounded-xl mb-6 text-sm border border-red-500/20 flex items-center shadow-sm">
                        <span className="mr-2">⚠️</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 block ml-1">Full Name</label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                                <User className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-white placeholder-slate-500 transition-all duration-200 hover:bg-slate-950/70"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 block ml-1">Email Address</label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-white placeholder-slate-500 transition-all duration-200 hover:bg-slate-950/70"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 block ml-1">Password</label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                                <Lock className="w-5 h-5" />
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 text-white placeholder-slate-500 transition-all duration-200 hover:bg-slate-950/70"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={mutation.isPending}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 py-3.5 rounded-xl text-lg shadow-emerald-500/25 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        {mutation.isPending ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            'Register'
                        )}
                    </Button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors hover:underline decoration-emerald-500/30 underline-offset-4">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}
