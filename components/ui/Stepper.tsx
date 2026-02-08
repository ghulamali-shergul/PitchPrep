"use client";

import React from "react";

interface Step {
  id: number;
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export default function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <li key={step.id} className={`relative flex items-center ${isLast ? "" : "flex-1"}`}>
              <button
                onClick={() => onStepClick?.(step.id)}
                className="group flex flex-col items-center"
                aria-current={isCurrent ? "step" : undefined}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    isCompleted
                      ? "bg-primary text-white"
                      : isCurrent
                        ? "border-2 border-primary bg-primary-light text-primary"
                        : "border-2 border-border bg-white text-muted"
                  }`}
                >
                  {isCompleted ? (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </span>
                <span className={`mt-1.5 text-xs font-medium whitespace-nowrap ${isCurrent ? "text-primary" : "text-muted"}`}>
                  {step.label}
                </span>
              </button>
              {!isLast && (
                <div className={`mx-2 h-0.5 flex-1 ${isCompleted ? "bg-primary" : "bg-border"}`} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
