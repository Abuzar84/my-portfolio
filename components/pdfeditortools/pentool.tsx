'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Point {
  x: number;
  y: number;
}

interface SimplePenToolProps {
  pageNumber: number;
  scale: number;
  color?: string;
  strokeWidth?: number;
  onPathComplete: (pathData: string) => void;
  isActive: boolean;
}

export default function SimplePenTool({
  pageNumber,
  scale,
  color = '#ff0000',
  strokeWidth = 3,
  onPathComplete,
  isActive
}: SimplePenToolProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): Point | null => {
    if (!svgRef.current) return null;

    const rect = svgRef.current.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // We want coordinates relative to the natural (unscaled) page size
    // rect.width / scale gives us the natural width
    return {
      x: (clientX - rect.left) / scale,
      y: (clientY - rect.top) / scale
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isActive) return;

    const coords = getCoordinates(e);
    if (!coords) return;

    setIsDrawing(true);
    setCurrentPath([coords]);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !isActive) return;

    const coords = getCoordinates(e);
    if (!coords) return;

    setCurrentPath(prev => [...prev, coords]);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;

    if (currentPath.length > 1) {
      const pathData = pointsToSvgPath(currentPath);
      onPathComplete(pathData);
    }

    setIsDrawing(false);
    setCurrentPath([]);
  };

  const pointsToSvgPath = (points: Point[]): string => {
    if (points.length === 0) return '';
    const d = points.reduce((acc, point, i) => {
      return i === 0
        ? `M ${point.x} ${point.y}`
        : `${acc} L ${point.x} ${point.y}`;
    }, '');
    return d;
  };

  // Global listeners for mouse up to ensure drawing stops even if cursor leaves the area
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDrawing) stopDrawing();
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('touchend', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('touchend', handleGlobalMouseUp);
    };
  }, [isDrawing, currentPath]);

  if (!isActive) return null;

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 z-50 touch-none cursor-crosshair"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      style={{ width: '100%', height: '100%' }}
    >
      {currentPath.length > 1 && (
        <path
          d={pointsToSvgPath(currentPath)}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}