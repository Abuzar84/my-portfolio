import { useState, useRef, useEffect } from 'react';
import { GripVertical, X } from 'lucide-react';

interface TextTypeProps {
    id: number;
    initialText?: string;
    fontSize: number;
    width?: number;
    height?: number;
    x: number;
    y: number;
    scale: number;
    onUpdate: (id: number, newText: string | null, newX: number | null, newY: number | null, newFontSize: number | null, newWidth: number | null, newHeight: number | null) => void;
    onDelete: (id: number) => void;
}

export default function TextType({ id, initialText = "New Text", fontSize = 16, width = 200, height = 18, x, y, scale, onUpdate, onDelete }: TextTypeProps) {
    const [text, setText] = useState(initialText);
    const [isDragging, setIsDragging] = useState(false);
    const [resizeMode, setResizeMode] = useState<'none' | 'text' | 'box'>('none');

    // Refs to store interaction state
    const dragStart = useRef({ x: 0, y: 0 });
    const resizeStart = useRef({ x: 0, y: 0, initialFontSize: fontSize, initialWidth: width, initialHeight: height });

    // Update parent when text changes
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        setText(newText);
        onUpdate(id, newText, null, null, null, null, null);
    };


    const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
        // Prevent drag if interacting with inputs or buttons (except our drag handle)
        const target = e.target as HTMLElement;
        if (target.tagName.toLowerCase() === 'textarea' ||
            (target.closest('button') && !target.closest('.drag-handle'))) {
            return;
        }

        e.stopPropagation();
        setIsDragging(true);

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        dragStart.current = {
            x: clientX,
            y: clientY
        };
    };

    // Font Size Resize (Bottom Right Handle - Round Dot)
    const handleFontSizeResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        setResizeMode('text');

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        resizeStart.current = {
            x: clientX,
            y: clientY,
            initialFontSize: fontSize,
            initialWidth: 0,
            initialHeight: 0
        };
    };

    // Box Resize (Right Handle - Bar)
    const handleBoxResizeStart = (e: React.MouseEvent | React.TouchEvent) => {
        e.stopPropagation();
        setResizeMode('box');

        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

        resizeStart.current = {
            x: clientX,
            y: clientY,
            initialFontSize: 0,
            initialWidth: width,
            initialHeight: height
        };
    };

    useEffect(() => {
        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (isDragging || resizeMode !== 'none') {
                if ('touches' in e) {
                    // Prevent scrolling while dragging/resizing
                    e.preventDefault();
                }

                const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
                const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

                if (isDragging) {
                    const deltaX = clientX - dragStart.current.x;
                    const deltaY = clientY - dragStart.current.y;

                    const newX = x + (deltaX / scale);
                    const newY = y + (deltaY / scale);

                    onUpdate(id, null, newX, newY, null, null, null);

                    dragStart.current = {
                        x: clientX,
                        y: clientY
                    };
                } else if (resizeMode === 'text') {
                    const deltaX = clientX - resizeStart.current.x;
                    const sizeChange = (deltaX / scale) * 0.5;
                    let newFontSize = Math.max(8, resizeStart.current.initialFontSize + sizeChange);
                    onUpdate(id, null, null, null, newFontSize, null, null);
                } else if (resizeMode === 'box') {
                    const deltaX = clientX - resizeStart.current.x;
                    const newWidth = Math.max(50, resizeStart.current.initialWidth + (deltaX / scale));
                    onUpdate(id, null, null, null, null, newWidth, height);
                }
            }
        };

        const handleUp = () => {
            setIsDragging(false);
            setResizeMode('none');
        };

        if (isDragging || resizeMode !== 'none') {
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('mouseup', handleUp);
            window.addEventListener('touchmove', handleMove, { passive: false });
            window.addEventListener('touchend', handleUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleUp);
        };
    }, [isDragging, resizeMode, x, y, width, height, scale, onUpdate, id]);

    return (
        <div
            style={{
                position: 'absolute',
                left: x * scale,
                top: y * scale,
                width: width * scale,
                transformOrigin: 'top left',
                cursor: isDragging ? 'grabbing' : 'grab',
                zIndex: 50,
                touchAction: 'none'
            }}
            onMouseDown={handleStart}
            onTouchStart={handleStart}
            className="group absolute"
        >
            <div className="relative group-hover:ring-1 group-hover:ring-blue-300 rounded transition-shadow duration-200 h-full">
                {/* Drag Handle (Visible on hover or touch) */}
                <div
                    className="drag-handle absolute -left-6 top-0 bottom-0 flex items-center justify-center cursor-move opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 rounded-l shadow-sm border border-r-0 border-blue-200"
                    title="Drag to move"
                >
                    <GripVertical className="w-4 h-4 text-blue-500" />
                </div>
                <textarea
                    value={text}
                    onChange={handleTextChange}
                    className="bg-transparent border-none outline-none text-black font-sans w-full h-full p-0 m-0 resize-none overflow-hidden cursor-text"
                    style={{
                        fontSize: `${fontSize * scale}px`,
                        lineHeight: '1.2',
                        minHeight: `${height * scale}px`,
                        height: '100%',
                        padding: 0,
                        margin: 0,
                        border: 'none',
                    }}
                    ref={(el) => {
                        if (el) {
                            // Auto-grow height on content change
                            el.style.height = 'auto';
                            el.style.height = el.scrollHeight + 'px';
                        }
                    }}
                />

                {/* Delete Handle */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(id);
                    }}
                    className="absolute -top-3 -right-3 hidden group-hover:flex bg-red-500 text-white rounded-full p-1 w-6 h-6 items-center justify-center shadow-md hover:bg-red-600 transition-colors z-50"
                    title="Remove text"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Box Width Resize Handle (Right Bar) */}
                <div
                    onMouseDown={handleBoxResizeStart}
                    onTouchStart={handleBoxResizeStart}
                    className="absolute top-0 right-0 w-2 h-full cursor-ew-resize opacity-0 group-hover:opacity-50 hover:!opacity-100 bg-blue-400 transition-opacity z-40 rounded-r"
                    title="Drag to resize width"
                />

                {/* Font Size Resize Handle (Bottom Right Dot) */}
                <div
                    onMouseDown={handleFontSizeResizeStart}
                    onTouchStart={handleFontSizeResizeStart}
                    className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 rounded-full cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-50 border border-white"
                    title="Drag to change font size"
                />
            </div>
        </div>
    );
}