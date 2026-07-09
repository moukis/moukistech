import {
  Stethoscope, Cpu, Monitor, BatteryCharging, Keyboard, HardDrive,
  MemoryStick, Wrench, Apple, DatabaseBackup, ShieldCheck, Gauge,
  Laptop, Plug, SquareStack,
} from "lucide-react";

export const CONTACT = {
  phone: "+33 7 58 96 46 20",
  phoneRaw: "+33758964620",
  whatsapp: "33758964620",
  email: "rewllasy@gmail.com",
  owner: "SYLLA Mactar",
  brand: "Moukis tech",
  country: "France",
};

// Icons in the same order as the translated `services` array
export const SERVICE_ICONS = [
  Stethoscope, Cpu, Monitor, BatteryCharging, Keyboard, HardDrive,
  MemoryStick, Wrench, Apple, DatabaseBackup, ShieldCheck, Gauge,
];

// Icons in the same order as the translated `store.items` array
export const STORE_ICONS = [Laptop, HardDrive, MemoryStick, Plug, Keyboard, Monitor, SquareStack];

// Real workshop / repair photography (verified). Order matches gallery labels.
export const GALLERY_IMAGES = [
  "https://images.pexels.com/photos/7639374/pexels-photo-7639374.jpeg",
  "https://images.pexels.com/photos/9242899/pexels-photo-9242899.jpeg",
  "https://images.pexels.com/photos/9242178/pexels-photo-9242178.jpeg",
  "https://images.pexels.com/photos/6636474/pexels-photo-6636474.jpeg",
  "https://images.pexels.com/photos/6372919/pexels-photo-6372919.jpeg",
  "https://images.unsplash.com/photo-1518770660439-4636190af475",
];

// Before/After comparison pairs (sample, replaceable). Order matches gallery.baLabels.
export const BEFORE_AFTER = [
  { before: "https://images.pexels.com/photos/9242178/pexels-photo-9242178.jpeg", after: "https://images.pexels.com/photos/6372919/pexels-photo-6372919.jpeg" },
  { before: "https://images.pexels.com/photos/7639374/pexels-photo-7639374.jpeg", after: "https://images.pexels.com/photos/9242899/pexels-photo-9242899.jpeg" },
  { before: "https://images.pexels.com/photos/6636474/pexels-photo-6636474.jpeg", after: "https://images.unsplash.com/photo-1518770660439-4636190af475" },
];
