"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function CartDrawer({ isOpen, onClose }) {
    const [mounted, setMounted] = useState(false);

    // Mount check so document is available (avoid SSR issues)
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Prevent body scroll when drawer is open
    useEffect(() => {
        if (!mounted) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = isOpen ? "hidden" : prev || "";
        return () => {
            document.body.style.overflow = prev || "";
        };
    }, [isOpen, mounted]);

    if (!mounted) return null;

    return createPortal(
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 w-screen h-screen bg-black transition-opacity duration-300 z-[999] ${isOpen ? "opacity-50 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            />

            {/* Desktop: Slide from right */}
            <div
                className={`not-sm:hidden fixed top-0 right-0 h-screen w-full sm:w-96 shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] z-[1000] ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                style={{
                    backgroundColor: "#1a1a1a",
                    borderLeft: "2px solid #362222",
                }}
                aria-hidden={!isOpen}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="px-6 py-6 border-b" style={{ borderColor: "#362222" }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-white">YOUR CART</h2>
                                <p className="text-gray-400 text-sm mt-1">6 items</p>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                        <div className="text-gray-400">Cart functionality coming soon!</div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-6 border-t" style={{ borderColor: "#362222" }}>
                        <button
                            className="cursor-pointer w-full py-3 text-white font-bold rounded transition-all duration-300 hover:scale-105 active:scale-95"
                            style={{ backgroundColor: "#8B4545" }}
                        >
                            CHECKOUT
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Sheet */}
            <div
                className={`sm:hidden fixed bottom-0 left-0 right-0 w-full shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] z-[1000] rounded-t-2xl ${isOpen ? "translate-y-0" : "translate-y-full"
                    }`}
                style={{
                    backgroundColor: "#1a1a1a",
                    borderTop: "2px solid #362222",
                    maxHeight: "85vh",
                }}
                aria-hidden={!isOpen}
            >
                <div className="h-full flex flex-col">
                    <div className="pt-3 pb-2 flex justify-center">
                        <div className="w-12 h-1 rounded-full" style={{ backgroundColor: "#362222" }} />
                    </div>

                    <div className="px-6 py-4 border-b" style={{ borderColor: "#362222" }}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-white">YOUR CART</h2>
                                <p className="text-gray-400 text-sm mt-1">6 items</p>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 py-6">
                        <div className="text-gray-400">Cart functionality coming soon!</div>
                    </div>

                    <div className="px-6 py-4 border-t" style={{ borderColor: "#362222" }}>
                        <button
                            className="cursor-pointer w-full py-3 text-white font-bold rounded transition-all duration-300 active:scale-95"
                            style={{ backgroundColor: "#8B4545" }}
                        >
                            CHECKOUT
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}
