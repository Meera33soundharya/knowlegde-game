import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-background font-sans antialiased">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-14 items-center pl-4">
                    <div className="font-bold text-xl mr-4 text-primary">EduPlatform</div>
                    <nav className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
                        {/* Placeholder Nav */}
                        <a href="/" className="hover:text-foreground">Home</a>
                        <a href="/ask" className="hover:text-foreground">Ask AI</a>
                        <a href="/dashboard" className="hover:text-foreground">Dashboard</a>
                    </nav>
                </div>
            </header>
            <main className="flex-1">
                {children}
            </main>
            <footer className="border-t py-6 md:py-0">
                <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row pl-4">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        Built by EduPlatform. The source code is available on GitHub.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
