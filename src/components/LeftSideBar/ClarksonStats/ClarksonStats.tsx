import { useState, useRef } from "react";
import type { MouseEvent } from "react";
import styles from "./styles.module.scss";

interface SliderState {
  id: number;
  position: number; // 0 to 100 percentage
}

export const ClarksonStats = () => {
  const [sliders, setSliders] = useState<SliderState[]>([
    { id: 0, position: 40 },
    { id: 1, position: 70 },
    { id: 2, position: 25 },
    { id: 3, position: 85 },
  ]);

  const [draggingId, setDraggingId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (id: number) => {
    setDraggingId(id);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (draggingId === null || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const headerHeight = 60; // Height reserved for title
    const availableHeight = rect.height - headerHeight;
    const mouseY = e.clientY - rect.top - headerHeight;

    // Clamp between 0 and availableHeight
    const clampedY = Math.max(0, Math.min(mouseY, availableHeight));
    const percentage = (clampedY / availableHeight) * 100;

    setSliders((prev) =>
      prev.map((slider) =>
        slider.id === draggingId ? { ...slider, position: percentage } : slider
      )
    );
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className={styles.header}>CLARKSON STATS</div>
      <div className={styles.lines}>
        {sliders.map((slider) => (
          <div key={slider.id} className={styles.lineContainer}>
            <div className={styles.line} />
            <div
              className={styles.node}
              style={{ top: `${slider.position}%` }}
              onMouseDown={() => handleMouseDown(slider.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
