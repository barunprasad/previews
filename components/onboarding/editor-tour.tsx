"use client";

import { useEffect, useRef } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

interface EditorTourProps {
  isActive: boolean;
  onComplete: () => void;
}

export function EditorTour({ isActive, onComplete }: EditorTourProps) {
  const driverRef = useRef<ReturnType<typeof driver> | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // Wait for elements to render
    const timeout = setTimeout(() => {
      const driverInstance = driver({
        showProgress: true,
        showButtons: ["next", "previous", "close"],
        steps: [
          {
            element: "[data-tour='canvas']",
            popover: {
              title: "Canvas",
              description: "This is your design canvas. Add screenshots, text, and device frames here.",
              side: "left",
              align: "center",
            },
          },
          {
            element: "[data-tour='preview-strip']",
            popover: {
              title: "Preview Strip",
              description: "Manage multiple previews for your app. Click to switch between them, or use the + button to add more.",
              side: "top",
              align: "center",
            },
          },
          {
            element: "[data-tour='right-panel']",
            popover: {
              title: "Design Tools",
              description: "Access device frames, backgrounds, text styling, and more from this panel.",
              side: "left",
              align: "start",
            },
          },
          {
            element: "[data-tour='export']",
            popover: {
              title: "Export",
              description: "When you're ready, export your previews as images. Use batch export to download all sizes at once.",
              side: "bottom",
              align: "end",
            },
          },
          {
            element: "[data-tour='save']",
            popover: {
              title: "Auto-Save",
              description: "Your work is automatically saved. You can also click here to manually save.",
              side: "bottom",
              align: "end",
            },
          },
        ],
        onDestroyStarted: () => {
          driverInstance.destroy();
          onComplete();
        },
      });

      driverRef.current = driverInstance;
      driverInstance.drive();
    }, 500);

    return () => {
      clearTimeout(timeout);
      if (driverRef.current) {
        driverRef.current.destroy();
      }
    };
  }, [isActive, onComplete]);

  return null;
}
