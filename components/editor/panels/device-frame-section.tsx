"use client";

import { Button } from "@/components/ui/button";
import { getAllDeviceMockups, DeviceMockup } from "@/lib/devices/frames";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface DeviceFrameSectionProps {
  currentMockup: DeviceMockup | null;
  onApplyFrame: (mockup: DeviceMockup) => void;
  onRemoveFrame: () => void;
  hasScreenshot: boolean;
}

export function DeviceFrameSection({
  currentMockup,
  onApplyFrame,
  onRemoveFrame,
  hasScreenshot,
}: DeviceFrameSectionProps) {
  const mockups = getAllDeviceMockups();

  if (!hasScreenshot) {
    return (
      <p className="text-sm text-muted-foreground">
        Add a screenshot first to apply a device frame.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {/* Current frame indicator */}
      {currentMockup && (
        <div className="flex items-center justify-between rounded-lg bg-primary/10 px-3 py-2">
          <span className="text-sm font-medium">{currentMockup.name}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemoveFrame}
            className="h-7 px-2 text-muted-foreground hover:text-destructive"
          >
            <X className="mr-1 h-3 w-3" />
            Remove
          </Button>
        </div>
      )}

      {/* Frame options grid */}
      <div className="grid grid-cols-3 gap-2">
        {mockups.map((mockup) => (
          <button
            key={mockup.id}
            onClick={() => onApplyFrame(mockup)}
            className={cn(
              "relative flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-all hover:border-primary/50",
              currentMockup?.id === mockup.id
                ? "border-primary bg-primary/5"
                : "border-border"
            )}
          >
            {currentMockup?.id === mockup.id && (
              <div className="absolute right-1 top-1">
                <Check className="h-3 w-3 text-primary" />
              </div>
            )}
            {/* Mini device preview */}
            <div
              className="relative flex h-16 w-10 items-center justify-center overflow-hidden"
              style={{
                backgroundColor: mockup.frameColor,
                borderRadius: `${mockup.cornerRadius / 5}px`,
              }}
            >
              {/* Screen area */}
              <div
                className="bg-gradient-to-br from-blue-500 to-purple-600"
                style={{
                  width: `calc(100% - ${(mockup.bezel.left + mockup.bezel.right) / 3}px)`,
                  height: `calc(100% - ${(mockup.bezel.top + mockup.bezel.bottom) / 3}px)`,
                  borderRadius: `${mockup.screenCornerRadius / 5}px`,
                }}
              >
                {/* Dynamic Island */}
                {mockup.hasDynamicIsland && (
                  <div className="mx-auto mt-0.5 h-1 w-4 rounded-full bg-black" />
                )}
                {/* Notch */}
                {mockup.hasNotch && (
                  <div className="mx-auto h-1.5 w-5 rounded-b-sm bg-black" />
                )}
              </div>
              {/* Home button */}
              {mockup.hasHomeButton && (
                <div className="absolute bottom-0.5 h-2 w-2 rounded-full border border-gray-600" />
              )}
            </div>
            <span className="text-[10px] leading-tight text-center">{mockup.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
