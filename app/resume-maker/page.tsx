'use client'
import Hero from "@/components/resume-compo/hero"
import Resume from "@/components/resume-compo/resume"
import { useState } from "react";
import { Check, Palette, ArrowRight } from "lucide-react";

type ResumeTheme = {
    id: string;
    name: string;
    color: string;
    description: string;
};

const THEMES: ResumeTheme[] = [
    { id: 'modern', name: 'Modern Indigo', color: '#4f46e5', description: 'Professional and clean with indigo accents.' },
    { id: 'classic', name: 'Classic Charcoal', color: '#374151', description: 'Timeless and serious, perfect for corporate roles.' },
    { id: 'nature', name: 'Forest Green', color: '#059669', description: 'Calm and grounded, great for environmental or creative fields.' },
    { id: 'creative', name: 'Creative Purple', color: '#7c3aed', description: 'Bold and vibrant, stands out in a pile.' },
    { id: 'warm', name: 'Warm Amber', color: '#d97706', description: 'Friendly and energetic.' },
    { id: 'ocean', name: 'Ocean Blue', color: '#0284c7', description: 'Trustworthy and calm.' },
];

function ThemeSelection({ onSelect }: { onSelect: (color: string) => void }) {
    const [selectedId, setSelectedId] = useState<string>(THEMES[0].id);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-300">
            <div className="max-w-4xl w-full text-center space-y-8">
                <div className="space-y-2">
                    <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl shadow-sm mb-4">
                        <Palette className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Choose Your Style</h1>
                    <p className="text-gray-600 text-lg">Select a color theme for your resume. You can change this later.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {THEMES.map((theme) => (
                        <button
                            key={theme.id}
                            onClick={() => setSelectedId(theme.id)}
                            className={`group relative p-6 bg-white rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-lg ${selectedId === theme.id
                                    ? 'border-indigo-600 ring-4 ring-indigo-50'
                                    : 'border-transparent hover:border-gray-200 shadow-sm'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm"
                                    style={{ backgroundColor: theme.color }}
                                >
                                    Aa
                                </div>
                                {selectedId === theme.id && (
                                    <div className="bg-indigo-600 text-white p-1 rounded-full">
                                        <Check className="w-4 h-4" />
                                    </div>
                                )}
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg mb-1">{theme.name}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{theme.description}</p>
                        </button>
                    ))}
                </div>

                <div className="pt-8">
                    <button
                        onClick={() => onSelect(THEMES.find(t => t.id === selectedId)?.color || THEMES[0].color)}
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition-all hover:scale-105 shadow-lg hover:shadow-indigo-500/25"
                    >
                        Continue to Editor <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ResumeMaker() {
    const [step, setStep] = useState<'hero' | 'theme' | 'builder'>('hero');
    const [selectedThemeColor, setSelectedThemeColor] = useState<string>('#4f46e5');

    const handleThemeSelect = (color: string) => {
        setSelectedThemeColor(color);
        setStep('builder');
    };

    return (
        <div>
            {step === 'hero' && (
                <Hero showButton={true} onClick={() => setStep('theme')} />
            )}

            {step === 'theme' && (
                <ThemeSelection onSelect={handleThemeSelect} />
            )}

            {step === 'builder' && (
                <Resume themeColor={selectedThemeColor} />
            )}
        </div>
    );
}
