import React, { useState, useEffect, useCallback, useRef } from 'react';

/** Delay before the tour appears, giving the page time to fully render */
const TOUR_INITIAL_DELAY_MS = 600;
/** Time to wait for smooth-scroll to settle before recalculating spotlight position */
const SCROLL_SETTLE_DELAY_MS = 350;
/** Debounce delay for resize/scroll events when updating spotlight position */
const RESIZE_DEBOUNCE_MS = 100;
/**
 * Conservative maximum tooltip height used for flip detection.
 * Increase if long step content is ever clipped at the viewport edge.
 */
const TOOLTIP_MAX_HEIGHT_PX = 320;

export interface TourStep {
  /** CSS selector for the element to highlight. Omit for a centered modal step. */
  target?: string;
  title: string;
  description: string;
  /** Preferred tooltip placement relative to the highlighted element */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Optional action hint shown below the description */
  actionHint?: string;
}

interface OnboardingTourProps {
  steps: TourStep[];
  /** localStorage key used to persist completion. Defaults to 'onboardingCompleted' */
  storageKey?: string;
  onComplete?: () => void;
  /**
   * When true, shows a persistent "Take Tour" button after the tour has been
   * completed or skipped, allowing users to replay it at any time.
   */
  showRestartButton?: boolean;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
  bottom: number;
  right: number;
}

const PADDING = 8; // spotlight padding around target element

function getTargetRect(selector: string): TargetRect | null {
  const el = document.querySelector(selector);
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return {
    top: r.top - PADDING,
    left: r.left - PADDING,
    width: r.width + PADDING * 2,
    height: r.height + PADDING * 2,
    bottom: r.bottom + PADDING,
    right: r.right + PADDING,
  };
}

function TooltipCard({
  step,
  stepIndex,
  totalSteps,
  onBack,
  onNext,
  onSkip,
  onFinish,
  rect,
}: {
  step: TourStep;
  stepIndex: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSkip: () => void;
  onFinish: () => void;
  rect: TargetRect | null;
}) {
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;
  const isCentered = !rect;

  // Position the tooltip near the target element
  const tooltipStyle: React.CSSProperties = isCentered
    ? {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        maxWidth: 'calc(100vw - 32px)',
        zIndex: 10001,
      }
    : (() => {
        const placement = step.placement ?? 'bottom';
        const style: React.CSSProperties = {
          position: 'fixed',
          width: 340,
          maxWidth: 'calc(100vw - 32px)',
          zIndex: 10001,
        };
        const viewW = window.innerWidth;
        const viewH = window.innerHeight;

        const tooltipH = TOOLTIP_MAX_HEIGHT_PX;
        const centeredLeft = Math.max(
          8,
          Math.min(rect.left + rect.width / 2 - 170, viewW - 348)
        );

        if (placement === 'bottom') {
          // Flip to top if not enough space below
          if (rect.bottom + 12 + tooltipH > viewH && rect.top - 12 - tooltipH > 0) {
            style.bottom = viewH - rect.top + 12;
          } else {
            style.top = Math.min(rect.bottom + 12, viewH - tooltipH - 8);
          }
          style.left = centeredLeft;
        } else if (placement === 'top') {
          // Flip to bottom if not enough space above
          if (rect.top - 12 - tooltipH < 0) {
            style.top = Math.min(rect.bottom + 12, viewH - tooltipH - 8);
          } else {
            style.bottom = viewH - rect.top + 12;
          }
          style.left = centeredLeft;
        } else if (placement === 'right') {
          style.top = Math.max(8, rect.top + rect.height / 2 - 80);
          style.left = Math.min(rect.right + 12, viewW - 348);
        } else {
          // left
          style.top = Math.max(8, rect.top + rect.height / 2 - 80);
          style.right = viewW - rect.left + 12;
        }
        return style;
      })();

  return (
    <div
      style={{ ...tooltipStyle, maxHeight: 'calc(100vh - 32px)', overflowY: 'auto' }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-5 pointer-events-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-step-title"
    >
      {/* Progress dots */}
      <div className="flex items-center gap-1.5 mb-4">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === stepIndex
                ? 'w-6 bg-blue-500'
                : i < stepIndex
                ? 'w-1.5 bg-blue-300'
                : 'w-1.5 bg-gray-300 dark:bg-gray-600'
            }`}
          />
        ))}
        <span className="ml-auto text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
          {stepIndex + 1} / {totalSteps}
        </span>
      </div>

      {/* Content */}
      <h3
        id="tour-step-title"
        className="text-base font-semibold text-gray-900 dark:text-white mb-2"
      >
        {step.title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
        {step.description}
      </p>

      {step.actionHint && (
        <div className="mt-3 flex items-start gap-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700">
          <svg
            className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-xs text-blue-700 dark:text-blue-300">
            {step.actionHint}
          </span>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-5">
        <button
          onClick={onSkip}
          className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors px-1 py-1"
        >
          Skip tour
        </button>

        <div className="flex items-center gap-2">
          {!isFirst && (
            <button
              onClick={onBack}
              className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
          )}
          {isLast ? (
            <button
              onClick={onFinish}
              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-1.5"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Finish
            </button>
          ) : (
            <button
              onClick={onNext}
              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-1.5"
            >
              Next
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OnboardingTour({
  steps,
  storageKey = 'onboardingCompleted',
  onComplete,
  showRestartButton = false,
}: OnboardingTourProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<TargetRect | null>(null);
  const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Show tour if not previously completed; track completion state for restart button
  useEffect(() => {
    const completed = localStorage.getItem(storageKey);
    if (completed) {
      setTourCompleted(true);
    } else {
      // Small delay so the page has rendered its elements
      const t = setTimeout(() => setIsVisible(true), TOUR_INITIAL_DELAY_MS);
      return () => clearTimeout(t);
    }
  }, [storageKey]);

  // Update spotlight rect when step changes or window resizes
  const updateRect = useCallback(() => {
    const step = steps[stepIndex];
    if (step?.target) {
      setRect(getTargetRect(step.target));
    } else {
      setRect(null);
    }
    setWindowSize({ w: window.innerWidth, h: window.innerHeight });
  }, [steps, stepIndex]);

  useEffect(() => {
    if (isVisible) {
      updateRect();
    }
  }, [isVisible, stepIndex, updateRect]);

  // Scroll highlighted element into view
  useEffect(() => {
    const step = steps[stepIndex];
    if (isVisible && step?.target) {
      const el = document.querySelector(step.target);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      // Re-compute rect after scroll settles
      const t = setTimeout(updateRect, SCROLL_SETTLE_DELAY_MS);
      return () => clearTimeout(t);
    }
  }, [isVisible, stepIndex, steps, updateRect]);

  useEffect(() => {
    if (!isVisible) return;
    const handler = () => {
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = setTimeout(updateRect, RESIZE_DEBOUNCE_MS);
    };
    window.addEventListener('resize', handler);
    window.addEventListener('scroll', handler, true);
    return () => {
      window.removeEventListener('resize', handler);
      window.removeEventListener('scroll', handler, true);
    };
  }, [isVisible, updateRect]);

  const handleNext = () => {
    if (stepIndex < steps.length - 1) setStepIndex((i) => i + 1);
  };

  const handleBack = () => {
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  const completeTour = useCallback(() => {
    localStorage.setItem(storageKey, 'true');
    setIsVisible(false);
    setTourCompleted(true);
    onComplete?.();
  }, [storageKey, onComplete]);

  const handleSkip = completeTour;
  const handleFinish = completeTour;

  const handleRestart = useCallback(() => {
    localStorage.removeItem(storageKey);
    setTourCompleted(false);
    setStepIndex(0);
    setIsVisible(true);
  }, [storageKey]);

  if (!isVisible) {
    if (showRestartButton && tourCompleted) {
      return (
        <button
          onClick={handleRestart}
          className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 active:bg-blue-800 transition-colors text-sm font-medium"
          aria-label="Restart guided tour"
          title="Take the guided tour again"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Take Tour
        </button>
      );
    }
    return null;
  }

  const vw = windowSize.w || (typeof window !== 'undefined' ? window.innerWidth : 1024);
  const vh = windowSize.h || (typeof window !== 'undefined' ? window.innerHeight : 768);

  // Shared handlers to block interaction with areas outside the spotlight
  const blockInteraction = {
    onClick: (e: React.MouseEvent) => e.stopPropagation(),
    onMouseDown: (e: React.MouseEvent) => e.stopPropagation(),
  };

  return (
    <>
      {/* Overlay rendered as 4 dark rectangles around the spotlight.
          Each rectangle blocks interaction with areas outside the spotlight,
          while the spotlight area remains fully interactive. */}
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 10000, pointerEvents: 'none' }}
        aria-hidden="true"
      >
        {rect ? (
          <>
            {/* Top */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: Math.max(0, rect.top),
                background: 'rgba(0,0,0,0.55)',
                pointerEvents: 'auto',
              }}
              {...blockInteraction}
            />
            {/* Bottom */}
            <div
              style={{
                position: 'absolute',
                top: Math.max(0, rect.bottom),
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.55)',
                pointerEvents: 'auto',
              }}
              {...blockInteraction}
            />
            {/* Left */}
            <div
              style={{
                position: 'absolute',
                top: Math.max(0, rect.top),
                left: 0,
                width: Math.max(0, rect.left),
                height: Math.max(0, rect.height),
                background: 'rgba(0,0,0,0.55)',
                pointerEvents: 'auto',
              }}
              {...blockInteraction}
            />
            {/* Right */}
            <div
              style={{
                position: 'absolute',
                top: Math.max(0, rect.top),
                left: Math.min(vw, rect.right),
                right: 0,
                height: Math.max(0, rect.height),
                background: 'rgba(0,0,0,0.55)',
                pointerEvents: 'auto',
              }}
              {...blockInteraction}
            />
            {/* Spotlight border ring */}
            <div
              style={{
                position: 'absolute',
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                borderRadius: 10,
                boxShadow: '0 0 0 3px rgba(59,130,246,0.8), 0 0 20px rgba(59,130,246,0.4)',
                pointerEvents: 'none',
              }}
            />
          </>
        ) : (
          /* Full screen dim when no target */
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.55)',
              pointerEvents: 'auto',
            }}
            {...blockInteraction}
          />
        )}
      </div>

      {/* Tooltip card */}
      <TooltipCard
        step={steps[stepIndex]}
        stepIndex={stepIndex}
        totalSteps={steps.length}
        onBack={handleBack}
        onNext={handleNext}
        onSkip={handleSkip}
        onFinish={handleFinish}
        rect={rect}
      />
    </>
  );
}
