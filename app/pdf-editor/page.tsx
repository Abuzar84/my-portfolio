"use client";

import { useState, useEffect } from "react";
import { Upload, FileText, ArrowLeft, Download, Type, Image as ImageIcon, PenTool, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import Link from "next/link";
import dynamic from 'next/dynamic';

// Dynamically import react-pdf components to avoid SSR issues
const Document = dynamic(() => import('react-pdf').then(mod => mod.Document), { ssr: false });
const Page = dynamic(() => import('react-pdf').then(mod => mod.Page), { ssr: false });

// Configure PDF.js worker only on client side
if (typeof window !== 'undefined') {
    import('react-pdf').then((pdfjs) => {
        pdfjs.pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.pdfjs.version}/build/pdf.worker.min.mjs`;
    });
}

export default function PdfEditor() {
    const [file, setFile] = useState<File | null>(null);
    const [isEditorMode, setIsEditorMode] = useState(false);
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);
    const [pdfUrl, setPdfUrl] = useState<string>("");

    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setPdfUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [file]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    const changePage = (offset: number) => {
        setPageNumber(prevPageNumber => Math.min(Math.max(1, prevPageNumber + offset), numPages));
    };

    const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.0));
    const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

    if (isEditorMode && file && pdfUrl) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100">
                {/* Editor Toolbar */}
                <header className="h-16 border-b border-black/5 dark:border-white/10 bg-white dark:bg-black flex items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsEditorMode(false)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <span className="font-medium truncate max-w-[200px]">{file.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors" title="Add Text">
                            <Type className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors" title="Add Image">
                            <ImageIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors" title="Sign">
                            <PenTool className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>

                        <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2" />

                        <button onClick={zoomOut} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors" title="Zoom Out">
                            <ZoomOut className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                        <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem] text-center">
                            {Math.round(scale * 100)}%
                        </span>
                        <button onClick={zoomIn} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors" title="Zoom In">
                            <ZoomIn className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium text-sm">
                        <Download className="w-4 h-4" />
                        <span>Export</span>
                    </button>
                </header>

                {/* Editor Workspace */}
                <main className="flex-1 flex overflow-hidden">
                    {/* Sidebar */}
                    <aside className="w-64 border-r border-black/5 dark:border-white/10 bg-white dark:bg-black hidden md:flex flex-col">
                        <div className="p-4 border-b border-black/5 dark:border-white/10">
                            <h3 className="font-medium text-sm text-gray-500 uppercase tracking-wider">Pages</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
                                {Array.from(new Array(numPages), (el, index) => (
                                    <div
                                        key={`thumb_${index + 1}`}
                                        className={`aspect-[3/4] bg-white border shadow-sm rounded-lg overflow-hidden relative group cursor-pointer transition-all ${pageNumber === index + 1
                                            ? 'ring-2 ring-indigo-500 border-indigo-500'
                                            : 'border-gray-200 dark:border-white/10 hover:ring-2 hover:ring-indigo-300'
                                            }`}
                                        onClick={() => setPageNumber(index + 1)}
                                    >
                                        <div className="absolute top-2 left-2 w-6 h-6 bg-gray-900/10 dark:bg-white/10 rounded flex items-center justify-center text-xs font-medium z-10">
                                            {index + 1}
                                        </div>
                                        <Page
                                            pageNumber={index + 1}
                                            width={200}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                        />
                                    </div>
                                ))}
                            </Document>
                        </div>
                    </aside>

                    {/* Main Canvas Area */}
                    <div className="flex-1 bg-gray-100 dark:bg-zinc-900 overflow-auto flex flex-col">
                        <div className="flex-1 p-8 flex justify-center items-start">
                            <div className="bg-white shadow-2xl">
                                <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
                                    <Page
                                        pageNumber={pageNumber}
                                        scale={scale}
                                        renderTextLayer={true}
                                        renderAnnotationLayer={true}
                                    />
                                </Document>
                            </div>
                        </div>

                        {/* Page Navigation */}
                        <div className="h-16 border-t border-black/5 dark:border-white/10 bg-white dark:bg-black flex items-center justify-center gap-4">
                            <button
                                onClick={() => changePage(-1)}
                                disabled={pageNumber <= 1}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-sm font-medium">
                                Page {pageNumber} of {numPages}
                            </span>
                            <button
                                onClick={() => changePage(1)}
                                disabled={pageNumber >= numPages}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <nav className="p-6">
                <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back to Portfolio</span>
                </Link>
            </nav>

            <main className="flex-1 flex flex-col items-center justify-center p-4 animate-fade-in-up">
                <div className="max-w-xl w-full text-center space-y-8">
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <FileText className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">PDF Editor</h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Upload your document to start editing, signing, or organizing pages.
                        </p>
                    </div>

                    <div
                        className="border-2 border-dashed border-gray-300 dark:border-zinc-800 rounded-3xl p-12 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer group"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-4 rounded-full bg-gray-100 dark:bg-white/10 group-hover:scale-110 transition-transform duration-300">
                                <Upload className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                            </div>
                            <div className="space-y-2">
                                <p className="font-semibold text-lg">Click to upload or drag and drop</p>
                                <p className="text-sm text-gray-500 dark:text-gray-500">PDF files up to 10MB</p>
                            </div>
                            <input
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                id="file-upload"
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="file-upload"
                                className="absolute inset-0 cursor-pointer"
                            >
                                <span className="sr-only">Upload file</span>
                            </label>
                        </div>
                    </div>

                    {file && (
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl flex items-center justify-between border border-indigo-100 dark:border-indigo-500/30 animate-fade-in-up">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="text-left truncate">
                                    <p className="font-medium text-sm truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditorMode(true)}
                                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                            >
                                Go to Editor
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
