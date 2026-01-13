'use client'

import { Pen, Undo, Redo } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import TextType from '@/components/pdfeditortools/texttype'
import SimplePenTool from '@/components/pdfeditortools/pentool'
import { PDFDocument, rgb, StandardFonts, LineCapStyle } from 'pdf-lib'
import { AnalyticsTracker } from '@/components/analytics-tracker'

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

interface DrawingPath {
    id: number
    page: number
    d: string // SVG path data
    color: string
    strokeWidth: number
}

export default function PdfEditorWorkspace({ file, onBack }: PdfEditorWorkspaceProps) {
    const [numPages, setNumPages] = useState<number | null>(null)
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [scale, setScale] = useState<number>(1.0)
    const [textElements, setTextElements] = useState<TextElement[]>([])
    const [paths, setPaths] = useState<DrawingPath[]>([])
    const [activeTool, setActiveTool] = useState<'text' | 'pen'>('text')
    const [strokeColor, setStrokeColor] = useState('#ff0000')
    const [strokeWidth, setStrokeWidth] = useState(3)
    const [isDownloading, setIsDownloading] = useState(false)
    const [renderedPageSize, setRenderedPageSize] = useState<{ [key: number]: { width: number, height: number, originalWidth: number, originalHeight: number, rotation: number } }>({})
    const [selectedTextId, setSelectedTextId] = useState<number | null>(null)

    // History State
    const [history, setHistory] = useState<{ textElements: TextElement[], paths: DrawingPath[] }[]>([{ textElements: [], paths: [] }])
    const [historyIndex, setHistoryIndex] = useState(0)

    // Helper to add state to history
    const addToHistory = (newTextElements: TextElement[], newPaths: DrawingPath[]) => {
        const newHistory = history.slice(0, historyIndex + 1)
        newHistory.push({ textElements: newTextElements, paths: newPaths })
        setHistory(newHistory)
        setHistoryIndex(newHistory.length - 1)
        setTextElements(newTextElements)
        setPaths(newPaths)
    }

    const undo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1
            setHistoryIndex(newIndex)
            setTextElements(history[newIndex].textElements)
            setPaths(history[newIndex].paths)
        }
    }

    const redo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1
            setHistoryIndex(newIndex)
            setTextElements(history[newIndex].textElements)
            setPaths(history[newIndex].paths)
        }
    }

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault()
                undo()
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                e.preventDefault()
                redo()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [history, historyIndex])

    // Arrow Key Movement
    useEffect(() => {
        const handleArrowMove = (e: KeyboardEvent) => {
            if (!selectedTextId) return

            const isArrowKey = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)
            if (!isArrowKey) return

            // If user is typing in a textarea/input, don't move UNLESS they hold Shift or Ctrl
            const isTyping = document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT'
            if (isTyping && !e.shiftKey && !e.ctrlKey) return

            e.preventDefault()

            const step = e.shiftKey ? 10 : 1
            let dx = 0, dy = 0
            if (e.key === 'ArrowUp') dy = -step
            if (e.key === 'ArrowDown') dy = step
            if (e.key === 'ArrowLeft') dx = -step
            if (e.key === 'ArrowRight') dx = step

            setTextElements(prev => prev.map(el => {
                if (el.id === selectedTextId) {
                    return { ...el, x: el.x + dx, y: el.y + dy }
                }
                return el
            }))
        }

        window.addEventListener('keydown', handleArrowMove)
        return () => window.removeEventListener('keydown', handleArrowMove)
    }, [selectedTextId])

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages)
        // Set initial scale for mobile
        if (window.innerWidth < 768) {
            setScale(0.6)
        }
    }

    const onPageLoadSuccess = (page: any) => {
        // viewport.width/height is the actual rendered size in pixels at scale=1
        // page.width/height is the original PDF point size
        const { width, height, rotation } = page;
        const viewport = page.getViewport({ scale: 1 });

        setRenderedPageSize(prev => ({
            ...prev,
            [page.pageNumber]: {
                width: viewport.width,
                height: viewport.height,
                originalWidth: width,
                originalHeight: height,
                rotation: rotation
            }
        }));
    };

    const addText = () => {
        setActiveTool('text')
        const newId = Math.max(0, ...textElements.map(e => e.id)) + 1
        const newTextElements = [...textElements, {
            id: newId,
            page: pageNumber,
            x: 50,
            y: 50,
            text: "New Text",
            fontSize: 16,
            width: 200,
            height: 50
        }]
        addToHistory(newTextElements, paths)
    }

    const handlePathComplete = (pathData: string) => {
        const newId = Math.max(0, ...paths.map(p => p.id)) + 1
        const newPaths = [...paths, {
            id: newId,
            page: pageNumber,
            d: pathData,
            color: strokeColor,
            strokeWidth: strokeWidth
        }]
        addToHistory(textElements, newPaths)
    }

    const updateTextElement = (id: number, newText: string | null, newX: number | null, newY: number | null, newFontSize: number | null, newWidth: number | null, newHeight: number | null) => {
        const newTextElements = textElements.map(el => {
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
        })
        addToHistory(newTextElements, paths)
    }

    const deleteTextElement = (id: number) => {
        const newTextElements = textElements.filter(el => el.id !== id)
        addToHistory(newTextElements, paths)
    }

    const handleDownload = async () => {
        if (!file) return
        setIsDownloading(true)

        try {
            const fileBuffer = await file.arrayBuffer()
            const pdfDoc = await PDFDocument.load(fileBuffer)
            const pages = pdfDoc.getPages()
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

            // Draw paths using native pdf-lib operators
            paths.forEach(p => {
                const pageIndex = p.page - 1
                if (pageIndex >= 0 && pageIndex < pages.length) {
                    const page = pages[pageIndex]
                    const pageInfo = renderedPageSize[p.page]
                    if (!pageInfo) return;

                    const { width, height } = page.getSize()

                    // Parse the SVG path "M x y L x y..." back into points
                    const points = p.d.split(/[ML]/).filter(s => s.trim() !== '').map(pair => {
                        const [x, y] = pair.trim().split(/\s+/).map(parseFloat)
                        return { x, y }
                    })

                    if (points.length < 2) return

                    const scaleX = width / pageInfo.width
                    const scaleY = height / pageInfo.height

                    // Set stroke properties
                    const r = parseInt(p.color.slice(1, 3), 16) / 255
                    const g = parseInt(p.color.slice(3, 5), 16) / 255
                    const b = parseInt(p.color.slice(5, 7), 16) / 255

                    // Draw each segment of the path using native pdf-lib drawLine
                    for (let i = 0; i < points.length - 1; i++) {
                        const startX = points[i].x * scaleX
                        const startY = height - (points[i].y * scaleY)
                        const endX = points[i + 1].x * scaleX
                        const endY = height - (points[i + 1].y * scaleY)

                        page.drawLine({
                            start: { x: startX, y: startY },
                            end: { x: endX, y: endY },
                            thickness: p.strokeWidth * scaleX,
                            color: rgb(r, g, b),
                            opacity: 1,
                            lineCap: LineCapStyle.Round,
                        })
                    }
                }
            })

            textElements.forEach(el => {
                const pageIndex = el.page - 1
                if (pageIndex >= 0 && pageIndex < pages.length) {
                    const page = pages[pageIndex]
                    const pageInfo = renderedPageSize[el.page]
                    if (!pageInfo) return;

                    const { width, height } = page.getSize()
                    const cropBox = page.getCropBox()
                    const offsetX = cropBox.x || 0
                    const offsetY = cropBox.y || 0

                    // Calculate mapping from browser pixels (at scale 1) to PDF points
                    const scaleX = width / pageInfo.width
                    const scaleY = height / pageInfo.height

                    const pdfX = (el.x * scaleX) + offsetX
                    const pdfY = (height + offsetY) - (el.y * scaleY) - (el.fontSize * 0.8)

                    page.drawText(el.text, {
                        x: pdfX,
                        y: pdfY,
                        size: el.fontSize,
                        font: font,
                        color: rgb(0, 0, 0),
                        maxWidth: el.width * scaleX,
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
            <AnalyticsTracker page={`/pdf-editor/workspace/view-page-${pageNumber}`} />
            {/* Toolbar */}
            <header className="flex flex-col bg-white border-b border-gray-200 shadow-sm z-20 w-full">
                <div className="flex items-center justify-between px-4 md:px-6 py-2 md:py-3">
                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            onClick={onBack}
                            className="text-gray-500 hover:text-gray-700 transition-colors p-1.5 rounded-lg hover:bg-gray-100"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <h1 className="text-sm md:text-lg font-semibold text-gray-800 truncate max-w-[120px] md:max-w-xs">{file.name}</h1>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Undo/Redo - Hidden on very small screens, or grouped */}
                        <div className="hidden sm:flex items-center gap-1 border-r border-gray-200 pr-2 md:pr-4 mr-1 md:mr-2">
                            <button
                                onClick={undo}
                                disabled={historyIndex === 0}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                title="Undo (Ctrl+Z)"
                            >
                                <Undo className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                            <button
                                onClick={redo}
                                disabled={historyIndex === history.length - 1}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                title="Redo (Ctrl+Y)"
                            >
                                <Redo className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        </div>

                        {/* Tools */}
                        <div className="flex items-center gap-1 md:gap-2">
                            <button
                                onClick={addText}
                                className={`flex items-center justify-center gap-2 p-2 md:px-3 md:py-1.5 border rounded-lg text-sm font-medium transition-colors shadow-sm ${activeTool === 'text' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                title="Add Text"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                <span className="hidden md:inline">Add Text</span>
                            </button>
                            <button
                                onClick={() => setActiveTool('pen')}
                                className={`flex items-center justify-center gap-2 p-2 md:px-3 md:py-1.5 border rounded-lg text-sm font-medium transition-colors shadow-sm ${activeTool === 'pen' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                title="Pen Tool"
                            >
                                <Pen className="w-4 h-4" />
                                <span className="hidden md:inline">Pen</span>
                            </button>
                        </div>

                        {/* Zoom - Condence on mobile */}
                        <div className="hidden md:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setScale(s => Math.max(0.3, s - 0.1))}
                                className="p-1 text-gray-600 hover:bg-white rounded-md shadow-sm transition-all"
                                title="Zoom Out"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                            </button>
                            <button
                                onClick={() => {
                                    if (window.innerWidth < 768) setScale(0.6);
                                    else setScale(1.0);
                                }}
                                className="px-2 py-1 text-[10px] font-bold text-gray-500 hover:bg-white rounded transition-all"
                            >
                                FIT
                            </button>
                            <span className="text-xs font-medium w-9 text-center text-gray-600">{Math.round(scale * 100)}%</span>
                            <button
                                onClick={() => setScale(s => Math.min(3, s + 0.1))}
                                className="p-1 text-gray-600 hover:bg-white rounded-md shadow-sm transition-all"
                                title="Zoom In"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="flex items-center gap-2 p-2 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Download PDF"
                        >
                            {isDownloading ? (
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            )}
                            <span className="hidden sm:inline">{isDownloading ? 'Saving...' : 'Download'}</span>
                        </button>
                        <div className="hidden lg:block text-sm text-gray-500 border-l pl-4 border-gray-200">
                            Page {pageNumber} of {numPages || '--'}
                        </div>
                    </div>
                </div>

                {/* Sub-toolbar for Pen Settings on Mobile or active tool options */}
                {activeTool === 'pen' && (
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200 overflow-x-auto no-scrollbar">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                {['#000000', '#ffffff', '#ff0000', '#0000ff', '#008000', '#ffa500'].map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setStrokeColor(color)}
                                        className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${strokeColor === color ? 'border-blue-500 scale-110' : 'border-white shadow-sm'}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                                <div className="relative w-6 h-6 overflow-hidden rounded-full border-2 border-white shadow-sm">
                                    <input
                                        type="color"
                                        value={strokeColor}
                                        onChange={(e) => setStrokeColor(e.target.value)}
                                        className="absolute -inset-1 w-10 h-10 cursor-pointer p-0 border-none"
                                    />
                                </div>
                            </div>

                            <div className="h-4 w-[1px] bg-gray-300 mx-1" />

                            <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Size</span>
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    value={strokeWidth}
                                    onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
                                    className="w-20 md:w-32 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <span className="text-xs font-medium text-gray-600 w-4">{strokeWidth}</span>
                            </div>
                        </div>

                        {/* Mobile Zoom Controls in sub-toolbar */}
                        <div className="flex md:hidden items-center gap-2 bg-white rounded-lg p-1 border border-gray-200 shadow-sm ml-4">
                            <button
                                onClick={() => setScale(s => Math.max(0.3, s - 0.1))}
                                className="p-1 text-gray-600"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                            </button>
                            <span className="text-[10px] font-bold text-gray-500">{Math.round(scale * 100)}%</span>
                            <button
                                onClick={() => setScale(s => Math.min(3, s + 0.1))}
                                className="p-1 text-gray-600"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            </button>
                        </div>
                    </div>
                )}
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* PDF Container */}
                <main className="flex-1 overflow-auto bg-gray-200 p-2 md:p-8 flex justify-center">
                    <div className="shadow-2xl relative mb-20 md:mb-0">
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
                                onLoadSuccess={onPageLoadSuccess}
                            >
                                {/* Render saved paths */}
                                <svg
                                    className="absolute inset-0 pointer-events-none"
                                    style={{ width: '100%', height: '100%' }}
                                    viewBox={renderedPageSize[pageNumber] ? `0 0 ${renderedPageSize[pageNumber].width} ${renderedPageSize[pageNumber].height}` : undefined}
                                >
                                    {paths
                                        .filter(p => p.page === pageNumber)
                                        .map(p => (
                                            <path
                                                key={p.id}
                                                d={p.d}
                                                fill="none"
                                                stroke={p.color}
                                                strokeWidth={p.strokeWidth}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        ))
                                    }
                                </svg>

                                {/* Pen Tool Drawing Overlay */}
                                <SimplePenTool
                                    pageNumber={pageNumber}
                                    scale={scale}
                                    isActive={activeTool === 'pen'}
                                    color={strokeColor}
                                    strokeWidth={strokeWidth}
                                    onPathComplete={handlePathComplete}
                                />

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
                                            isSelected={selectedTextId === el.id}
                                            onSelect={() => setSelectedTextId(el.id)}
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
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur shadow-xl rounded-full px-4 py-2 flex items-center gap-4 border border-gray-200 z-50">
                    <button
                        disabled={pageNumber <= 1}
                        onClick={() => setPageNumber(p => p - 1)}
                        className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-30 disabled:hover:bg-transparent text-gray-700 transition"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <span className="text-xs md:text-sm font-medium text-gray-700 min-w-[40px] text-center">
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
