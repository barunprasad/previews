"use client";

import { Check } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { DeviceFrame } from "@/types";

interface DeviceSectionProps {
  deviceType: "iphone" | "android";
  selectedDevice: DeviceFrame;
  devices: DeviceFrame[];
  onDeviceChange: (device: DeviceFrame) => void;
}

export function DeviceSection({
  deviceType,
  selectedDevice,
  devices,
  onDeviceChange,
}: DeviceSectionProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Target resolution for App Store export. Applies to all previews in this project.
      </p>
      <RadioGroup
        value={selectedDevice.id}
        onValueChange={(value) => {
          const device = devices.find((d) => d.id === value);
          if (device) onDeviceChange(device);
        }}
        className="space-y-2"
      >
        {devices.map((device) => (
          <div key={device.id} className="flex items-center space-x-3">
            <RadioGroupItem value={device.id} id={device.id} />
            <Label
              htmlFor={device.id}
              className="flex flex-1 cursor-pointer items-center justify-between text-sm font-normal"
            >
              <span>{device.name}</span>
              <span className="text-xs text-muted-foreground">
                {device.width}×{device.height}
              </span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
