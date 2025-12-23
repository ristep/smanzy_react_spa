export default function Footer() {
    return (
        <footer className="bg-background border-t border-card-border mt-auto" >
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm text-card-text-muted">
                    &copy; {new Date().getFullYear()} Smanzy App. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
