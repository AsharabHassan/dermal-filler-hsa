"use client";

import { useEffect, useRef } from "react";
import { FaceZone } from "@/lib/types";

// Relative positions (x%, y%) for each zone marker on a portrait face photo
const ZONE_POSITIONS: Record<string, { x: number; y: number }> = {
  forehead:  { x: 50, y: 18 },
  temples:   { x: 22, y: 28 },
  undereyes: { x: 62, y: 42 },
  cheeks:    { x: 25, y: 54 },
  lips:      { x: 50, y: 66 },
  jawline:   { x: 68, y: 78 },
};

interface Props {
  imageDataUrl: string;
  zones: FaceZone[];
  activeZoneId?: number | null;
  onZoneClick?: (id: number) => void;
}

export default function FaceOverlay({ imageDataUrl, zones, activeZoneId, onZoneClick }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new window.Image();
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      zones.forEach((zone) => {
        const pos = ZONE_POSITIONS[zone.overlayRegion];
        if (!pos) return;

        const x = (pos.x / 100) * canvas.width;
        const y = (pos.y / 100) * canvas.height;
        const r = canvas.width * 0.04;
        const isActive = activeZoneId === zone.id;
        const hasConcern = zone.severity !== "none";

        // Outer ring
        ctx.beginPath();
        ctx.arc(x, y, r + 4, 0, Math.PI * 2);
        ctx.strokeStyle = isActive ? "#CEA336" : hasConcern ? "rgba(206,163,54,0.6)" : "rgba(255,255,255,0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Filled circle
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? "#CEA336" : hasConcern ? "rgba(206,163,54,0.85)" : "rgba(255,255,255,0.2)";
        ctx.fill();

        // Number label
        ctx.font = `bold ${r * 1.1}px Inter, sans-serif`;
        ctx.fillStyle = isActive || hasConcern ? "#000000" : "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(zone.id), x, y + 1);
      });
    };
    img.src = imageDataUrl;
  }, [imageDataUrl, zones, activeZoneId]);

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!onZoneClick) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    for (const zone of zones) {
      const pos = ZONE_POSITIONS[zone.overlayRegion];
      if (!pos) continue;
      const x = (pos.x / 100) * canvas.width;
      const y = (pos.y / 100) * canvas.height;
      const r = canvas.width * 0.06;
      const dist = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);
      if (dist <= r) {
        onZoneClick(zone.id);
        return;
      }
    }
  }

  return (
    <canvas
      ref={canvasRef}
      onClick={handleCanvasClick}
      className="w-full rounded-2xl cursor-pointer"
    />
  );
}
