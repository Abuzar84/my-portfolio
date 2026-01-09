'use client'

import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import TextType from '@/components/pdfeditortools/texttype'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

// Configure worker safely
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PdfEditorWorkspaceProps {
    file: File
    onBack: () => void
}

interface TextElement {
    id: number
    page: number
    x: number
    y: number
    text: string
    fontSize: number
    width: number
    height: number
}

export default function PdfEditorWorkspace({ file, onBack }: PdfEditorWorkspaceProps) {
    const [numPages, setNumPages] = useState<number | null>(null)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [scale, setScale] = useState<number>(1.0)
    const [textElements, setTextElements] = useState<TextElement[]>([])
    const [isDownloading, setIsDownloading] = useState(false)

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages)
    }

    const addText = () => {
        const newId = Math.max(0, ...textElements.map(e => e.id)) + 1
        setTextElements([...textElements, {
            id: newId,
            page: pageNumber,
            x: 50,
            y: 50,
            text: "New Text",
            fontSize: 16,
            width: 200,
            height: 50
        }])
    }

    const updateTextElement = (id: number, newText: string | null, newX: number | null, newY: number | null, newFontSize: number | null, newWidth: number | null, newHeight: number | null) => {
        setTextElements(textElements.map(el => {
            if (el.id === id) {
                return {
                    ...el,
                    text: newText !== null ? newText : el.text,
                    x: newX !== null ? newX : el.x,
                    y: newY !== null ? newY : el.y,
                    fontSize: newFontSize !== null ? newFontSize : el.fontSize,
                    width: newWidth !== null ? newWidth : el.width,
                    height: newHeight !== null ? newHeight : el.height
                }
            }
            return el
        }))
    }

    const deleteTextElement = (id: number) => {
        setTextElements(textElements.filter(el => el.id !== id))
    }

    const handleDownload = async () => {
        if (!file) return
        setIsDownloading(true)

        try {
            const fileBuffer = await file.arrayBuffer()
            const pdfDoc = await PDFDocument.load(fileBuffer)
            const pages = pdfDoc.getPages()
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

            textElements.forEach(el => {
                const pageIndex = el.page - 1
                if (pageIndex >= 0 && pageIndex < pages.length) {
                    const page = pages[pageIndex]
                    const { width, height } = page.getSize()

                    // PDF pages can have a CropBox origin that isn't (0,0)
                    // We must account for this offset
                    const cropBox = page.getCropBox()
                    const offsetX = cropBox.x || 0
                    const offsetY = cropBox.y || 0

                    // PDF coordinates start from bottom-left
                    // HTML is top-left. 
                    // Visible Top of page in PDF = offsetY + height
                    // We subtract el.y to get the top of our text box in PDF space.
                    // pdf-lib's drawText y is the baseline. 
                    // We subtract roughly 0.9 * fontSize to account for the top-gap in the HTML line-box and the ascent.
                    const pdfY = (height + offsetY) - el.y - (el.fontSize * 0.9)
                    const pdfX = el.x + offsetX

                    page.drawText(el.text, {
                        x: pdfX,
                        y: pdfY,
                        size: el.fontSize,
                        font: font,
                        color: rgb(0, 0, 0),
                        maxWidth: el.width,
                        lineHeight: el.fontSize * 1.2
                    })
                }
            })

            const pdfBytes = await pdfDoc.save()
            const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `edited_${file.name}`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Error generating PDF:', error)
            alert('Failed to generate PDF. Please try again.')
        } finally {
            setIsDownloading(false)
        }
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
            {/* Toolbar */}
            <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm z-10 w-full">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded hover:bg-gray-100"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h1 className="text-lg font-semibold text-gray-800 truncate max-w-xs">{file.name}</h1>
                </div>

                <div className="flex items-center gap-4">
                    {/* Tools */}
                    <button
                        onClick={addText}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors shadow-sm"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Add Text
                    </button>

                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setScale(s => Math.max(0.5, s - 0.1))}
                            className="p-1.5 text-gray-600 hover:bg-white rounded-md shadow-sm transition-all"
                            title="Zoom Out"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                        </button>
                        <span className="text-sm font-medium w-12 text-center text-gray-600">{Math.round(scale * 100)}%</span>
                        <button
                            onClick={() => setScale(s => Math.min(3, s + 0.1))}
                            className="p-1.5 text-gray-600 hover:bg-white rounded-md shadow-sm transition-all"
                            title="Zoom In"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDownloading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Download
                            </>
                        )}
                    </button>
                    <div className="text-sm text-gray-500 border-l pl-4 border-gray-200">
                        Page {pageNumber} of {numPages || '--'}
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* PDF Container */}
                <main className="flex-1 overflow-auto bg-gray-200 p-8 flex justify-center">
                    <div className="shadow-2xl relative">
                        <Document
                            file={file}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={
                                <div className="flex items-center justify-center p-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            }
                            error={
                                <div className="text-red-500 bg-white p-4 rounded shadow">
                                    Failed to load PDF
                                </div>
                            }
                        >
                            <Page
                                pageNumber={pageNumber}
                                scale={scale}
                                className="bg-white shadow-lg"
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                            >
                                {textElements
                                    .filter(el => el.page === pageNumber)
                                    .map(el => (
                                        <TextType
                                            key={el.id}
                                            id={el.id}
                                            initialText={el.text}
                                            fontSize={el.fontSize}
                                            width={el.width}
                                            height={el.height}
                                            x={el.x}
                                            y={el.y}
                                            scale={scale}
                                            onUpdate={updateTextElement}
                                            onDelete={deleteTextElement}
                                        />
                                    ))
                                }
                            </Page>
                        </Document>
                    </div>
                </main>
            </div>

            {/* Page Navigation - Bottom Floating or Sticky */}
            {numPages && numPages > 1 && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur shadow-lg rounded-full px-4 py-2 flex items-center gap-4 border border-gray-200 z-50">
                    <button
                        disabled={pageNumber <= 1}
                        onClick={() => setPageNumber(p => p - 1)}
                        className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-30 disabled:hover:bg-transparent text-gray-700 transition"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <span className="text-sm font-medium text-gray-700">
                        {pageNumber} / {numPages}
                    </span>
                    <button
                        disabled={pageNumber >= (numPages || 1)}
                        onClick={() => setPageNumber(p => p + 1)}
                        className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-30 disabled:hover:bg-transparent text-gray-700 transition"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            )}
        </div>
    )
}
