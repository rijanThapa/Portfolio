import React, { useEffect, useRef } from "react";

const PerformanceOptimizer = ({ children }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Enable hardware acceleration
    if (containerRef.current) {
      containerRef.current.style.transform = "translateZ(0)";
      containerRef.current.style.backfaceVisibility = "hidden";
      containerRef.current.style.perspective = "1000px";
    }

    // Reduce animations on low-end devices
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMediaChange = (e) => {
      if (e.matches) {
        document.documentElement.style.setProperty(
          "--animation-duration",
          "0s"
        );
      } else {
        document.documentElement.style.setProperty(
          "--animation-duration",
          "1s"
        );
      }
    };

    handleMediaChange(mediaQuery);
    mediaQuery.addEventListener("change", handleMediaChange);

    // Performance monitoring
    let lastFrameTime = performance.now();
    let frameCount = 0;
    let fps = 60;

    const monitorPerformance = () => {
      const currentTime = performance.now();
      frameCount++;

      if (currentTime - lastFrameTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastFrameTime = currentTime;

        // Reduce quality if FPS is low
        if (fps < 30) {
          document.documentElement.style.setProperty("--particle-count", "500");
          document.documentElement.style.setProperty(
            "--animation-quality",
            "low"
          );
        } else {
          document.documentElement.style.setProperty(
            "--particle-count",
            "1000"
          );
          document.documentElement.style.setProperty(
            "--animation-quality",
            "high"
          );
        }
      }

      requestAnimationFrame(monitorPerformance);
    };

    monitorPerformance();

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{
        willChange: "transform",
        contain: "layout style paint",
      }}
    >
      {children}
    </div>
  );
};

export default PerformanceOptimizer;
