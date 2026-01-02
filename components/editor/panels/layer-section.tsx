"use client";

import {
  ArrowUpToLine,
  ArrowDownToLine,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";

export type LayerAction = "bring-front" | "send-back" | "bring-forward" | "send-backward";

interface LayerSectionProps {
  onLayerAction: (action: LayerAction) => void;
}

export function LayerSection({ onLayerAction }: LayerSectionProps) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Change the stacking order of the selected object.
      </p>

      {/* Layer controls */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Arrange</Label>
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onLayerAction("bring-front")}
              >
                <ArrowUpToLine className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bring to Front</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onLayerAction("bring-forward")}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Bring Forward</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onLayerAction("send-backward")}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send Backward</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => onLayerAction("send-back")}
              >
                <ArrowDownToLine className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send to Back</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
