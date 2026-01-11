'use client';

import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Word {
    id: string;
    page: number;
    text: string;
    x: number;
    y: number;
    w: number;
    h: number;
    originalText: string;
}

export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.5);
    const [extractedWords, setExtractedWords] = useState<Word[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingWordId, setEditingWordId] = useState<string | null>(null);

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setExtractedWords([]);
            setPageNumber(1);
            handleUpload(selectedFile);
        }
    };

    const handleUpload = async (selectedFile: File) => {
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const res = await fetch('/api/process-pdf', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            setExtractedWords(data.words);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleWordChange = (id: string, newText: string) => {
        setExtractedWords(prev => prev.map(w => w.id === id ? { ...w, text: newText } : w));
    };

    const handleSave = async () => {
        if (!file) return;
        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        // Only send words that were actually modified to the backend
        const modifications = extractedWords.filter(w => w.text !== w.originalText);
        formData.append('edits', JSON.stringify(modifications));

        try {
            const res = await fetch('/api/generate-pdf', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Generation failed');

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'edited.pdf';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    const currentPageWords = extractedWords.filter(w => w.page === pageNumber);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8 text-black">
            <h1 className="text-3xl font-bold mb-6">Visual PDF Editor</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8 w-full max-w-4xl flex items-center justify-between">
                <div>
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={onFileChange}
                        className="mb-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {file && <p className="text-sm text-gray-600">Selected: {file.name}</p>}
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleSave}
                        disabled={loading || !file}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                    >
                        {loading ? 'Processing...' : 'Download Edited PDF'}
                    </button>
                </div>
            </div>

            {error && <p className="text-red-500 mb-4 bg-red-50 p-3 rounded-lg border border-red-200">{error}</p>}

            {file && (
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-4 mb-4 bg-white p-2 rounded-full shadow-sm">
                        <button
                            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                            disabled={pageNumber <= 1}
                            className="bg-gray-200 px-4 py-1 rounded-full disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <span>Page {pageNumber} of {numPages}</span>
                        <button
                            onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                            disabled={pageNumber >= numPages}
                            className="bg-gray-200 px-4 py-1 rounded-full disabled:opacity-50"
                        >
                            Next
                        </button>
                        <div className="h-4 w-px bg-gray-300 mx-2" />
                        <button onClick={() => setScale(s => Math.max(0.5, s - 0.2))} className="px-2 font-bold">-</button>
                        <span>{Math.round(scale * 100)}%</span>
                        <button onClick={() => setScale(s => Math.min(3, s + 0.2))} className="px-2 font-bold">+</button>
                    </div>

                    <div className="relative shadow-2xl border-4 border-white bg-white">
                        <Document
                            file={file}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={<div className="p-10">Loading PDF...</div>}
                        >
                            <Page
                                pageNumber={pageNumber}
                                scale={scale}
                                renderAnnotationLayer={false}
                                renderTextLayer={true}
                            />
                        </Document>

                        {/* Interaction Layer */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                width: '100%',
                                height: '100%'
                            }}
                        >
                            {currentPageWords.map((word) => (
                                <div
                                    key={word.id}
                                    className={`absolute pointer-events-auto cursor-text transition-all ${word.text !== word.originalText ? 'bg-yellow-200/50' : 'hover:bg-blue-100/50'
                                        }`}
                                    style={{
                                        left: `${word.x * scale}px`,
                                        top: `${word.y * scale}px`,
                                        width: `${word.w * scale}px`,
                                        height: `${word.h * scale}px`,
                                    }}
                                    onClick={() => setEditingWordId(word.id)}
                                >
                                    {editingWordId === word.id ? (
                                        <input
                                            autoFocus
                                            className="absolute inset-0 w-full h-full bg-blue-50 border-none outline-none text-xs leading-none"
                                            value={word.text}
                                            onChange={(e) => handleWordChange(word.id, e.target.value)}
                                            onBlur={() => setEditingWordId(null)}
                                            onKeyDown={(e) => e.key === 'Enter' && setEditingWordId(null)}
                                            style={{ fontSize: `${word.h * scale * 0.8}px` }}
                                        />
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}