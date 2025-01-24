import React from 'react';

export default function Welcome({ auth }) {
    // If user is authenticated, redirect to dashboard
    if (auth.user) {
        window.location.href = '/dashboard';
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
            <header className="absolute top-0 left-0 right-0 z-10 p-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="text-3xl font-black text-blue-900 tracking-tight">
                        Faiza Constructions
                    </div>
                    <a
                        href="/login"
                        className="px-6 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                    >
                        Login
                    </a>
                </div>
            </header>

            <main className="flex-grow flex items-center justify-center relative">
                <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\' viewBox=\'0 0 100 100\'%3E%3Cg fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\'%3E%3Cpath opacity=\'.5\' d=\'M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9z\'/%3E%3Cpath d=\'M6 5V0H5v5H0v1h5v94h1V6h94V5H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
                }}></div>
                <div className="text-center relative z-20 max-w-2xl px-6">
                    <h1 className="text-6xl font-extrabold text-blue-900 mb-6 leading-tight">
                        Building Dreams, Constructing Futures
                    </h1>
                    <p className="text-xl text-blue-800 mb-10 font-medium leading-relaxed">
                        Transforming visions into reality with precision, passion, and unparalleled craftsmanship.
                    </p>
                    <div className="space-x-4">
                        <a
                            href="/login"
                            className="px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold shadow-xl hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 inline-block"
                        >
                            Get Started
                        </a>
                    </div>
                </div>
            </main>

            <footer className="absolute bottom-0 left-0 right-0 p-6 text-center text-blue-900 opacity-70">
                © {new Date().getFullYear()} Faiza Constructions. All rights reserved.
            </footer>
        </div>
    );
}
