interface HerProps {
    showButton: boolean;
    onClick: () => void;
}
import Link from "next/link";
import { ArrowLeft, FileText, Sparkles } from "lucide-react";

export default function Hero({ showButton, onClick }: HerProps) {
    return (
        <div className="min-h-[80vh] w-full flex flex-col relative overflow-hidden bg-white text-gray-900">
            {/* Background Decorations - Matching Portfolio */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-200/40 via-white to-white z-0" />

            <div className="z-10 p-6 relative">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-200 group bg-white/50 px-4 py-2 rounded-full border border-black/5 backdrop-blur-sm shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>
            </div>

            {showButton && (
                <div className="flex-1 flex flex-col justify-center items-center gap-8 z-10 p-4 text-center animate-fade-in-up">
                    <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-4 ring-4 ring-indigo-50/50">
                        <FileText className="w-12 h-12 text-indigo-600" />
                    </div>

                    <div className="space-y-4 max-w-2xl">
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 pb-2">
                            Craft Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Perfect Resume</span>
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed font-light mx-auto max-w-lg">
                            Build a professional, ATS-friendly resume in minutes. Real-time preview, modern templates, and instant download.
                        </p>
                    </div>

                    <button
                        onClick={onClick}
                        className="group relative inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-3.5 rounded-full font-semibold text-base transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Start Building Now</span>
                    </button>

                    <div className="flex items-center gap-6 text-xs text-gray-400 font-medium mt-8">
                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>No sign-up required</span>
                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Free to use</span>
                        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>Privacy focused</span>
                    </div>
                </div>
            )}
        </div>
    );
}