// components/ui/CornerShadowOverlay.tsx
'use client';

interface CornerShadowOverlayProps {
  size?: number;
  opacity?: number; // 0–100
}

export const CornerShadowOverlay = ({
  size = 40,
  opacity = 10,
}: CornerShadowOverlayProps) => {
  const baseStyle = `w-[${size}px] h-[${size}px] pointer-events-none`;

  const from = `rgba(0,0,0,${opacity / 100})`;

  return (
    <>
      <div className={`absolute top-0 left-0 ${baseStyle} bg-[linear-gradient(to_bottom_right,${from},transparent)]`} />
      <div className={`absolute top-0 right-0 ${baseStyle} bg-[linear-gradient(to_bottom_left,${from},transparent)]`} />
      <div className={`absolute bottom-0 left-0 ${baseStyle} bg-[linear-gradient(to_top_right,${from},transparent)]`} />
      <div className={`absolute bottom-0 right-0 ${baseStyle} bg-[linear-gradient(to_top_left,${from},transparent)]`} />
    </>
  );
};
