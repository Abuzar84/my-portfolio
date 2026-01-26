'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { User, Briefcase, GraduationCap, Wrench, FileText, Plus, Trash2, Download } from 'lucide-react';
import ResumePDF, { ResumeData, EducationItem, ExperienceItem } from './Resumepdf';

const PDFViewer = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFViewer), {
    ssr: false,
    loading: () => <div className="h-[600px] flex items-center justify-center bg-gray-100 text-gray-500 rounded-lg shadow-inner">Loading PDF Engine...</div>,
});

const PDFDownloadLink = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink), {
    ssr: false,
});

type TabId = 'personal' | 'experience' | 'education' | 'skills' | 'summary';
type ResumeProps = {
    themeColor: string;
};

export default function Resume({ themeColor }: ResumeProps) {
    const [activeTab, setActiveTab] = useState<TabId>('personal');
    const [formData, setFormData] = useState<ResumeData>({
        name: '',
        email: '',
        phone: '',
        address: '',
        summary: '',
        education: [],
        experience: [],
        skills: '',
        themeColor: themeColor,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Experience Handlers
    const addExperience = () => {
        setFormData({
            ...formData,
            experience: [
                ...formData.experience,
                { id: Date.now().toString(), company: '', role: '', year: '', description: '' }
            ]
        });
    };

    const updateExperience = (index: number, field: keyof ExperienceItem, value: string) => {
        const newExp = [...formData.experience];
        newExp[index] = { ...newExp[index], [field]: value };
        setFormData({ ...formData, experience: newExp });
    };

    const removeExperience = (index: number) => {
        setFormData({
            ...formData,
            experience: formData.experience.filter((_, i) => i !== index)
        });
    };

    // Education Handlers
    const addEducation = () => {
        setFormData({
            ...formData,
            education: [
                ...formData.education,
                { id: Date.now().toString(), institution: '', degree: '', year: '', description: '' }
            ]
        });
    };

    const updateEducation = (index: number, field: keyof EducationItem, value: string) => {
        const newEdu = [...formData.education];
        newEdu[index] = { ...newEdu[index], [field]: value };
        setFormData({ ...formData, education: newEdu });
    };

    const removeEducation = (index: number) => {
        setFormData({
            ...formData,
            education: formData.education.filter((_, i) => i !== index)
        });
    };

    const tabs = [
        { id: 'personal', label: 'Personal', icon: User },
        { id: 'summary', label: 'Summary', icon: FileText },
        { id: 'experience', label: 'Experience', icon: Briefcase },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'skills', label: 'Skills', icon: Wrench },
    ];

    return (
        <div className="min-h-screen bg-[#faf9f6]/50 font-sans text-gray-900">
            {/* Navbar / Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-black/5 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-lg font-bold flex items-center gap-2 text-gray-900">
                        <div className="bg-indigo-50 p-1.5 rounded-lg border border-indigo-100">
                            <FileText className="w-5 h-5 text-indigo-600" />
                        </div>
                        ResumeBuilder
                    </h1>
                    <div className="flex gap-4">
                        <PDFDownloadLink
                            document={<ResumePDF data={formData} />}
                            fileName={`${formData.name || 'Resume'}_CV.pdf`}
                            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-sm transition-all transform hover:-translate-y-0.5"
                        >
                            {({ loading }) => (
                                <>
                                    <Download className="w-4 h-4" />
                                    {loading ? 'Preparing...' : 'Download PDF'}
                                </>
                            )}
                        </PDFDownloadLink>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-80px)]">
                <div className="flex flex-col lg:flex-row gap-8 h-full">
                    {/* Left Panel: Form Input */}
                    <div className="w-full lg:w-1/2 flex flex-col h-full bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden ring-1 ring-black/5">
                        {/* Tabs */}
                        <div className="flex bg-gray-50/50 border-b border-gray-100 overflow-x-auto no-scrollbar p-1 gap-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as TabId)}
                                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs uppercase tracking-wide font-semibold rounded-xl transition-all duration-200 ${isActive
                                            ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
                                            }`}
                                    >
                                        <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-500' : 'text-gray-400'}`} />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Form Body */}
                        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">

                            {/* Personal Info Tab */}
                            {activeTab === 'personal' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-gray-900">Personal Details</h2>
                                        <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">01/05</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="group">
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="John Doe"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500/20 rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium placeholder:text-gray-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="john@example.com"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500/20 rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium placeholder:text-gray-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone</label>
                                            <input
                                                type="text"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+1 234 567 890"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500/20 rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium placeholder:text-gray-400"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                placeholder="New York, USA"
                                                className="w-full px-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500/20 rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Summary Tab */}
                            {activeTab === 'summary' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-gray-900">Professional Summary</h2>
                                        <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">02/05</span>
                                    </div>
                                    <div>
                                        <textarea
                                            name="summary"
                                            value={formData.summary}
                                            onChange={handleChange}
                                            rows={8}
                                            placeholder="Write a compelling professional summary that highlights your key achievements and skills..."
                                            className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500/20 rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none font-medium text-gray-600 placeholder:text-gray-400 leading-relaxed"
                                        />
                                        <p className="text-xs text-gray-400 mt-2 text-right font-medium">Recommended: 20-50 words.</p>
                                    </div>
                                </div>
                            )}

                            {/* Experience Tab */}
                            {activeTab === 'experience' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold text-gray-900">Experience History</h2>
                                        <button
                                            onClick={addExperience}
                                            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-lg transition-all hover:shadow-md"
                                        >
                                            <Plus className="w-3 h-3" /> Add Position
                                        </button>
                                    </div>

                                    {formData.experience.length === 0 && (
                                        <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-black/5">
                                                <Briefcase className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <p className="text-gray-900 font-medium">No experience added yet</p>
                                            <p className="text-sm text-gray-500">Click the button above to add your first role.</p>
                                        </div>
                                    )}

                                    {formData.experience.map((exp, index) => (
                                        <div key={exp.id} className="relative bg-white p-5 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-shadow group ring-1 ring-black/5">
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => removeExperience(index)}
                                                    className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                    title="Remove"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                                <input
                                                    placeholder="Job Title"
                                                    value={exp.role}
                                                    onChange={(e) => updateExperience(index, 'role', e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500/20 rounded-lg focus:ring-2 focus:ring-indigo-500/10 outline-none font-semibold text-gray-900 placeholder:text-gray-400"
                                                />
                                                <input
                                                    placeholder="Company Name"
                                                    value={exp.company}
                                                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500/20 rounded-lg focus:ring-2 focus:ring-indigo-500/10 outline-none font-medium text-gray-700 placeholder:text-gray-400"
                                                />
                                                <input
                                                    placeholder="Date Range (e.g. 2020 - Present)"
                                                    value={exp.year}
                                                    onChange={(e) => updateExperience(index, 'year', e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500/20 rounded-lg focus:ring-2 focus:ring-indigo-500/10 outline-none md:col-span-2 text-sm text-gray-500 placeholder:text-gray-400"
                                                />
                                            </div>
                                            <textarea
                                                placeholder="Description of responsibilities and achievements..."
                                                value={exp.description}
                                                onChange={(e) => updateExperience(index, 'description', e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500/20 rounded-lg focus:ring-2 focus:ring-indigo-500/10 outline-none resize-none text-sm text-gray-600 placeholder:text-gray-400"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Education Tab */}
                            {activeTab === 'education' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-xl font-bold text-gray-900">Education Details</h2>
                                        <button
                                            onClick={addEducation}
                                            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-lg transition-all hover:shadow-md"
                                        >
                                            <Plus className="w-3 h-3" /> Add Education
                                        </button>
                                    </div>

                                    {formData.education.length === 0 && (
                                        <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-black/5">
                                                <GraduationCap className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <p className="text-gray-900 font-medium">No education added yet</p>
                                            <p className="text-sm text-gray-500">Click the button above to add your academic background.</p>
                                        </div>
                                    )}

                                    {formData.education.map((edu, index) => (
                                        <div key={edu.id} className="relative bg-white p-5 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-shadow group ring-1 ring-black/5">
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => removeEducation(index)}
                                                    className="text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                    title="Remove"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                                <input
                                                    placeholder="School / University"
                                                    value={edu.institution}
                                                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500/20 rounded-lg focus:ring-2 focus:ring-indigo-500/10 outline-none font-semibold text-gray-900 placeholder:text-gray-400"
                                                />
                                                <input
                                                    placeholder="Degree / Major"
                                                    value={edu.degree}
                                                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500/20 rounded-lg focus:ring-2 focus:ring-indigo-500/10 outline-none font-medium text-gray-700 placeholder:text-gray-400"
                                                />
                                                <input
                                                    placeholder="Year (e.g. 2024)"
                                                    value={edu.year}
                                                    onChange={(e) => updateEducation(index, 'year', e.target.value)}
                                                    className="w-full px-3 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500/20 rounded-lg focus:ring-2 focus:ring-indigo-500/10 outline-none md:col-span-2 text-sm text-gray-500 placeholder:text-gray-400"
                                                />
                                            </div>
                                            <textarea
                                                placeholder="Additional Details (e.g. CGPA, Honors)..."
                                                value={edu.description}
                                                onChange={(e) => updateEducation(index, 'description', e.target.value)}
                                                rows={2}
                                                className="w-full px-3 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500/20 rounded-lg focus:ring-2 focus:ring-indigo-500/10 outline-none resize-none text-sm text-gray-600 placeholder:text-gray-400"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Skills Tab */}
                            {activeTab === 'skills' && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-gray-900">Skills & Expertise</h2>
                                        <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">05/05</span>
                                    </div>
                                    <div>
                                        <textarea
                                            name="skills"
                                            value={formData.skills}
                                            onChange={handleChange}
                                            rows={8}
                                            placeholder="Reaction, Node.js, Python, Leadership, Public Speaking..."
                                            className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500/20 rounded-xl focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none resize-none font-medium text-gray-600 placeholder:text-gray-400 leading-relaxed"
                                        />
                                        <p className="text-xs text-gray-400 mt-2 text-right font-medium">Separate skills with commas or new lines.</p>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Right Panel: Preview */}
                    <div className="hidden lg:flex w-full lg:w-1/2 bg-gray-100/50 rounded-2xl shadow-inner overflow-hidden flex-col items-center justify-center p-8 border border-black/5">
                        <div className="w-full h-full bg-white rounded shadow-xl overflow-hidden ring-1 ring-black/5">
                            <PDFViewer width="100%" height="100%" className='border-none'>
                                <ResumePDF data={formData} />
                            </PDFViewer>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}