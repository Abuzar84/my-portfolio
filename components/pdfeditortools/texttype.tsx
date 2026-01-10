import { useState, useRef, useEffect } from 'react';

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

    const handleMouseDown = (e: React.MouseEvent) => {
        // Prevent drag if interacting with controls or inputs
        if ((e.target as HTMLElement).tagName.toLowerCase() === 'textarea' ||
            (e.target as HTMLElement).tagName.toLowerCase() === 'button') {
            return;
        }

        e.stopPropagation();
        setIsDragging(true);
        dragStart.current = {
            x: e.clientX,
            y: e.clientY
        };
    };

    // Font Size Resize (Bottom Right Handle - Round Dot)
    const handleFontSizeResizeMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setResizeMode('text');
        resizeStart.current = {
            x: e.clientX,
            y: e.clientY,
            initialFontSize: fontSize,
            initialWidth: 0,
            initialHeight: 0
        };
    };

    // Box Resize (Right Handle - Bar)
    const handleBoxResizeMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        setResizeMode('box');
        resizeStart.current = {
            x: e.clientX,
            y: e.clientY,
            initialFontSize: 0,
            initialWidth: width,
            initialHeight: height
        };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                const deltaX = e.clientX - dragStart.current.x;
                const deltaY = e.clientY - dragStart.current.y;

                const newX = x + (deltaX / scale);
                const newY = y + (deltaY / scale);

                onUpdate(id, null, newX, newY, null, null, null);

                dragStart.current = {
                    x: e.clientX,
                    y: e.clientY
                };
            } else if (resizeMode === 'text') {
                // Resize Font
                const deltaX = e.clientX - resizeStart.current.x;
                const sizeChange = (deltaX / scale) * 0.5;
                let newFontSize = Math.max(8, resizeStart.current.initialFontSize + sizeChange);

                onUpdate(id, null, null, null, newFontSize, null, null);
            } else if (resizeMode === 'box') {
                // Resize Box Width
                const deltaX = e.clientX - resizeStart.current.x;
                // Since this handles dragging the RIGHT edge, we just add deltaX
                const newWidth = Math.max(50, resizeStart.current.initialWidth + (deltaX / scale));

                onUpdate(id, null, null, null, null, newWidth, height);
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setResizeMode('none');
        };

        if (isDragging || resizeMode !== 'none') {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
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
            }}
            onMouseDown={handleMouseDown}
            className="group absolute"
        >
            <div className="relative group-hover:ring-1 group-hover:ring-blue-300 rounded transition-shadow duration-200 h-full">
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
                    className="absolute -top-3 -right-3 hidden group-hover:flex bg-red-500 text-white rounded-full p-0.5 w-5 h-5 items-center justify-center text-xs shadow-md hover:bg-red-600 transition-colors z-50"
                    title="Remove text"
                >
                    ✕
                </button>

                {/* Box Width Resize Handle (Right Bar) */}
                <div
                    onMouseDown={handleBoxResizeMouseDown}
                    className="absolute top-0 right-0 w-1 h-full cursor-ew-resize opacity-0 group-hover:opacity-50 hover:!opacity-100 bg-blue-400 transition-opacity z-40 rounded-r"
                    title="Drag to resize width"
                />

                {/* Font Size Resize Handle (Bottom Right Dot) */}
                <div
                    onMouseDown={handleFontSizeResizeMouseDown}
                    className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-50 border border-white"
                    title="Drag to change font size"
                />
            </div>
        </div>
    );
}