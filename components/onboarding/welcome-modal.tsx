"use client";

import { Sparkles, ArrowRight, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
  onStartTour: () => void;
}

export function WelcomeModal({ open, onClose, onStartTour }: WelcomeModalProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl">Welcome to Previews!</DialogTitle>
          <DialogDescription className="text-base">
            Create stunning App Store screenshots in minutes. Would you like a quick tour of the editor?
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3">
          <Button onClick={onStartTour} className="w-full" size="lg">
            Start Tour
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button onClick={onClose} variant="outline" className="w-full" size="lg">
            Skip for now
          </Button>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          You can always restart the tour from the help menu.
        </p>
      </DialogContent>
    </Dialog>
  );
}
