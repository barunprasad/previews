"use client";

import {
  Smartphone,
  Palette,
  Type,
  ImagePlus,
  LayoutTemplate,
  Pencil,
  Frame,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DeviceSection } from "./panels/device-section";
import { BackgroundSection } from "./panels/background-section";
import { TextSection } from "./panels/text-section";
import { TextStyleSection, type SelectedTextStyle } from "./panels/text-style-section";
import { ScreenshotSection } from "./panels/screenshot-section";
import { TemplatesSection } from "./panels/templates-section";
import { DeviceFrameSection } from "./panels/device-frame-section";
import type { DeviceFrame, PreviewTemplate } from "@/types";
import type { DeviceMockup } from "@/lib/devices/frames";
import type { BackgroundRemovalProgress } from "@/lib/image-processing/background-removal";

interface RightPanelProps {
  // Device props
  deviceType: "iphone" | "android";
  selectedDevice: DeviceFrame;
  devices: DeviceFrame[];
  onDeviceChange: (device: DeviceFrame) => void;

  // Background props
  background: string;
  onBackgroundChange: (value: string) => void;

  // Text props
  onAddText: (options: {
    text: string;
    fontSize: number;
    fontWeight: string;
    fill: string;
  }) => void;

  // Selected text styling props
  selectedTextStyle: SelectedTextStyle | null;
  onTextStyleChange: (style: Partial<SelectedTextStyle>) => void;

  // Screenshot props
  onUploadScreenshot: () => void;

  // Background removal props
  hasSelectedImage?: boolean;
  onRemoveBackground?: () => void;
  isRemovingBackground?: boolean;
  backgroundRemovalProgress?: BackgroundRemovalProgress | null;

  // Templates props
  onApplyTemplate: (template: PreviewTemplate) => void;

  // Device frame props
  currentDeviceMockup: DeviceMockup | null;
  onApplyDeviceFrame: (mockup: DeviceMockup) => void;
  onRemoveDeviceFrame: () => void;
  hasScreenshot: boolean;
}

export function RightPanel({
  deviceType,
  selectedDevice,
  devices,
  onDeviceChange,
  background,
  onBackgroundChange,
  onAddText,
  selectedTextStyle,
  onTextStyleChange,
  onUploadScreenshot,
  hasSelectedImage,
  onRemoveBackground,
  isRemovingBackground,
  backgroundRemovalProgress,
  onApplyTemplate,
  currentDeviceMockup,
  onApplyDeviceFrame,
  onRemoveDeviceFrame,
  hasScreenshot,
}: RightPanelProps) {
  return (
    <aside className="hidden w-80 shrink-0 border-l bg-muted/30 lg:block overflow-y-auto">
      <Accordion
        type="multiple"
        defaultValue={["device", "background", "text-style"]}
        className="w-full"
      >
        {/* Device Section */}
        <AccordionItem value="device" className="border-b">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span className="text-sm font-medium">Device</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <DeviceSection
              deviceType={deviceType}
              selectedDevice={selectedDevice}
              devices={devices}
              onDeviceChange={onDeviceChange}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Device Frame Section */}
        <AccordionItem value="device-frame" className="border-b">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <Frame className="h-4 w-4" />
              <span className="text-sm font-medium">Device Frame</span>
              {currentDeviceMockup && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {currentDeviceMockup.name}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <DeviceFrameSection
              currentMockup={currentDeviceMockup}
              onApplyFrame={onApplyDeviceFrame}
              onRemoveFrame={onRemoveDeviceFrame}
              hasScreenshot={hasScreenshot}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Background Section */}
        <AccordionItem value="background" className="border-b">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span className="text-sm font-medium">Background</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <BackgroundSection
              value={background}
              onChange={onBackgroundChange}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Text Style Section - only shown when text is selected */}
        {selectedTextStyle && (
          <AccordionItem value="text-style" className="border-b">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                <span className="text-sm font-medium">Text Style</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <TextStyleSection
                style={selectedTextStyle}
                onStyleChange={onTextStyleChange}
              />
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Add Text Section */}
        <AccordionItem value="text" className="border-b">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <span className="text-sm font-medium">Add Text</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <TextSection onAddText={onAddText} />
          </AccordionContent>
        </AccordionItem>

        {/* Screenshot Section */}
        <AccordionItem value="screenshot" className="border-b">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <ImagePlus className="h-4 w-4" />
              <span className="text-sm font-medium">Screenshot</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <ScreenshotSection
              onUpload={onUploadScreenshot}
              hasSelectedImage={hasSelectedImage}
              onRemoveBackground={onRemoveBackground}
              isRemovingBackground={isRemovingBackground}
              backgroundRemovalProgress={backgroundRemovalProgress}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Templates Section */}
        <AccordionItem value="templates" className="border-b">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <LayoutTemplate className="h-4 w-4" />
              <span className="text-sm font-medium">Templates</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <TemplatesSection
              deviceType={deviceType}
              onApplyTemplate={onApplyTemplate}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}
