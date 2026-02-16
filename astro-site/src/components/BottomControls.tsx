import React from 'react';
import { Button, ButtonGroup } from '@heroui/react';

interface BottomControlsProps {
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onCenter?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export default function BottomControls({
  onZoomIn,
  onZoomOut,
  onCenter,
  onUndo,
  onRedo,
}: BottomControlsProps) {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
      <ButtonGroup variant="bordered" className="bg-white dark:bg-neutral-800 shadow-lg">
        <Button
          isIconOnly
          onClick={onZoomOut}
          title="Zoom out"
          className="border-neutral-300 dark:border-neutral-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
          </svg>
        </Button>
        <Button
          isIconOnly
          onClick={onZoomIn}
          title="Zoom in"
          className="border-neutral-300 dark:border-neutral-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </Button>
        <Button
          isIconOnly
          onClick={onCenter}
          title="Center view"
          className="border-neutral-300 dark:border-neutral-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </Button>
        <Button
          isIconOnly
          onClick={onUndo}
          title="Undo"
          className="border-neutral-300 dark:border-neutral-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </Button>
        <Button
          isIconOnly
          onClick={onRedo}
          title="Redo"
          className="border-neutral-300 dark:border-neutral-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
          </svg>
        </Button>
      </ButtonGroup>
    </div>
  );
}
