'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'

const PdfEditorWorkspace = dynamic(() => import('./pdfeditorworkspace'), {
    ssr: false,
})

export default function PdfEditorClient() {
    const [file, setFile] = useState<File | null>(null)
    const [isEditorOpen, setIsEditorOpen] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
        }
    }

    if (isEditorOpen && file) {
        return <PdfEditorWorkspace file={file} onBack={() => setIsEditorOpen(false)} />
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl transition-all hover:shadow-2xl">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">PDF Editor</h1>

                {!file ? (
                    <div className="flex flex-col items-center">
                        <label className="w-full flex flex-col items-center px-4 py-10 bg-blue-50 text-blue rounded-xl shadow-inner tracking-wide uppercase border border-blue-100 cursor-pointer hover:bg-blue-100 hover:text-blue-600 transition-colors duration-300">
                            <svg className="w-10 h-10 mb-3 text-blue-500" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c5 .38 16.88 9.1 16.88 9.1zM10 9a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0v-4a1 1 0 0 0-1-1z" />
                            </svg>
                            <span className="mt-2 text-base leading-normal font-semibold text-blue-500">Select PDF File</span>
                            <input type='file' accept='.pdf' className="hidden" onChange={handleFileChange} />
                        </label>
                        <p className="mt-4 text-sm text-gray-400">Supported format: .pdf</p>
                    </div>
                ) : (
                    <div className="text-center animate-fade-in">
                        <div className="p-4 mb-4 bg-green-50 rounded-lg border border-green-100">
                            <p className="text-green-700 font-medium truncate max-w-xs mx-auto">
                                {file.name}
                            </p>
                            <p className="text-xs text-green-500 mt-1">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setIsEditorOpen(true)}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md shadow-blue-200"
                            >
                                Confirm Upload
                            </button>
                            <button
                                onClick={() => setFile(null)}
                                className="px-6 py-2 bg-white text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Change File
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
