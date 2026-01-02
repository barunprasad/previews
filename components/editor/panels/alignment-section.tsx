"use client";

import {
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyCenter,
  AlignHorizontalJustifyStart,
  AlignHorizontalJustifyEnd,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyEnd,
  AlignHorizontalDistributeCenter,
  AlignVerticalDistributeCenter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";

export type AlignmentType =
  | "left"
  | "center-h"
  | "right"
  | "top"
  | "center-v"
  | "bottom"
  | "distribute-h"
  | "distribute-v";

interface AlignmentSectionProps {
  onAlign: (type: AlignmentType) => void;
  hasMultipleSelection: boolean;
}

export function AlignmentSection({ onAlign, hasMultipleSelection }: AlignmentSectionProps) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Align selected objects on the canvas.
      </p>

      {/* Horizontal alignment */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Horizontal</Label>
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onAlign("left")}
              >
                <AlignHorizontalJustifyStart className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Left</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onAlign("center-h")}
              >
                <AlignHorizontalJustifyCenter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Center</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onAlign("right")}
              >
                <AlignHorizontalJustifyEnd className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Right</TooltipContent>
          </Tooltip>

          {hasMultipleSelection && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onAlign("distribute-h")}
                >
                  <AlignHorizontalDistributeCenter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Distribute Horizontally</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Vertical alignment */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Vertical</Label>
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onAlign("top")}
              >
                <AlignVerticalJustifyStart className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Top</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onAlign("center-v")}
              >
                <AlignVerticalJustifyCenter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Middle</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onAlign("bottom")}
              >
                <AlignVerticalJustifyEnd className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Bottom</TooltipContent>
          </Tooltip>

          {hasMultipleSelection && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onAlign("distribute-v")}
                >
                  <AlignVerticalDistributeCenter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Distribute Vertically</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}
