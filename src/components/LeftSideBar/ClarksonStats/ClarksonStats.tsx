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
    { id: 2, position: 70 },
    { id: 3, position: 25 },
    { id: 4, position: 25 },
    { id: 5, position: 85 },
    { id: 6, position: 85 },
    { id: 7, position: 45 },
    { id: 8, position: 60 },
    { id: 9, position: 35 },
    { id: 10, position: 50 },
    { id: 11, position: 55 },
    { id: 12, position: 30 },
    { id: 13, position: 70 },
    { id: 14, position: 65 },
    { id: 15, position: 40 },
    { id: 16, position: 75 },
    { id: 17, position: 25 },
    { id: 18, position: 55 },
    { id: 19, position: 45 },
    { id: 20, position: 80 },
    { id: 21, position: 35 },
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
      <div className={styles.lines}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((lineIndex) => (
          <div key={lineIndex} className={styles.lineContainer}>
            <div className={styles.line} />
            {[0, 1].map((nodeIndex) => {
              const slider = sliders[lineIndex * 2 + nodeIndex];
              return (
                <div
                  key={slider.id}
                  className={`${styles.node} ${
                    nodeIndex === 0 ? styles.node1 : styles.node2
                  }`}
                  style={{ top: `${slider.position}%` }}
                  onMouseDown={() => handleMouseDown(slider.id)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
