"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDevicesByType, type DeviceFrame } from "@/lib/devices";
import { cn } from "@/lib/utils";

interface DevicePickerProps {
  deviceType: "iphone" | "android";
  selectedDevice: DeviceFrame;
  onDeviceChange: (device: DeviceFrame) => void;
}

export function DevicePicker({
  deviceType,
  selectedDevice,
  onDeviceChange,
}: DevicePickerProps) {
  const devices = getDevicesByType(deviceType);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {selectedDevice.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>
          {deviceType === "iphone" ? "iPhone" : "Android"} Devices
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {devices.map((device) => (
          <DropdownMenuItem
            key={device.id}
            onClick={() => onDeviceChange(device)}
            className={cn(
              "flex items-center gap-2",
              device.id === selectedDevice.id && "bg-accent"
            )}
          >
            <Check
              className={cn(
                "h-4 w-4",
                device.id === selectedDevice.id ? "opacity-100" : "opacity-0"
              )}
            />
            <span>{device.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
