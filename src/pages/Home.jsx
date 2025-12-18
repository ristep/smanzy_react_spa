import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';

export default function Home() {
    return (
        <div className="relative">
            {/* Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-[50%] -left-[20%] w-[70%] h-[70%] rounded-full bg-blue-500/20 blur-[120px]" />
                <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-violet-500/20 blur-[100px]" />
            </div>

            {/* Hero Section */}
            <div className="pt-20 pb-16 text-center lg:pt-32">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <h1 className="max-w-4xl mx-auto text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
                        Foundations for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-500">Modern Media</span>
                    </h1>
                    <p className="max-w-2xl mx-auto mt-6 text-lg text-slate-400">
                        Smanzy provides a robust full-stack solution for managing your digital assets.
                        Built with Go and React for unwavering performance.
                    </p>
                    <div className="flex justify-center mt-10 space-x-4">
                        <Link
                            to="/register"
                            className="flex items-center px-8 py-3.5 text-base font-bold text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
                        >
                            Get Started
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                        <Link
                            to="/about"
                            className="flex items-center px-8 py-3.5 text-base font-bold text-slate-300 transition-all border border-white/10 rounded-lg hover:bg-white/5 hover:text-white backdrop-blur-sm"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-slate-900/50">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
                        <FeatureCard
                            icon={<Zap className="w-6 h-6 text-blue-400" />}
                            title="Lightning Fast"
                            description="Powered by a Go backend, Smanzy delivers responses in milliseconds, ensuring your users never wait."
                        />
                        <FeatureCard
                            icon={<Shield className="w-6 h-6 text-violet-400" />}
                            title="Enterprise Security"
                            description="Built-in authentication and role-based access control to keep your data safe and compliant."
                        />
                        <FeatureCard
                            icon={<Globe className="w-6 h-6 text-teal-400" />}
                            title="Global Scale"
                            description="Designed to handle millions of requests. Deploy anywhere and scale effortlessy with our modern architecture."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="p-8 transition-all border rounded-2xl bg-slate-950/50 border-white/5 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/10 group">
            <div className="flex items-center justify-center w-12 h-12 mb-6 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                {icon}
            </div>
            <h3 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-blue-400">{title}</h3>
            <p className="text-slate-400 leading-relaxed">
                {description}
            </p>
        </div>
    );
}
