import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import styles from './Home.module.scss';
import clsx from 'clsx';

export default function Home() {
    return (
        <div className={styles.home}>
            {/* Background Gradients */}
            <div className={styles.backgroundEffects}>
                <div className={styles.effect1} />
                <div className={styles.effect2} />
            </div>

            {/* Hero Section */}
            <div className={styles.hero}>
                <div className={styles.heroContainer}>
                    <h1 className={styles.title}>
                        Foundations for <span className={styles.gradientText}>Modern Media</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Smanzy provides a robust full-stack solution for managing your digital assets.
                        Built with Go and React for unwavering performance.
                    </p>
                    <div className={styles.heroActions}>
                        <Link
                            to="/register"
                            className={styles.btnPrimary}
                        >
                            Get Started
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                        <Link
                            to="/about"
                            className={styles.btnSecondary}
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className={styles.features}>
                <div className={styles.heroContainer}>
                    <div className={styles.featureGrid}>
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
        <div className={styles.featureCard}>
            <div className={styles.iconWrapper}>
                {icon}
            </div>
            <h3 className={styles.featureTitle}>{title}</h3>
            <p className={styles.featureDesc}>
                {description}
            </p>
        </div>
    );
}
