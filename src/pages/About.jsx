export default function About() {
    return (
        <div className="max-w-prose mx-auto py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">About Smanzy</h1>
            <div className="prose prose-blue text-gray-600 space-y-4">
                <p>
                    Smanzy is a demonstration of modern web architecture, combining the performance
                    of a Go backend with the interactivity of a React frontend.
                </p>
                <p>
                    <strong>Tech Stack:</strong>
                </p>
                <ul className="list-disc pl-5">
                    <li>Backend: Go (Golang), Gin, GORM, PostgreSQL</li>
                    <li>Frontend: React, Vite, Tailwind CSS, TanStack Query</li>
                    <li>Authentication: JWT (JSON Web Tokens)</li>
                </ul>
            </div>
        </div>
    );
}
