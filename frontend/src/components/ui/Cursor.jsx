import { useEffect, useRef } from "react";

function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;

    let dotX = 0;
    let dotY = 0;

    let ringX = 0;
    let ringY = 0;

    const handleMouseMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const animate = () => {
      dotX += (mouseX - dotX) * 0.35;
      dotY += (mouseY - dotY) * 0.35;

      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animationFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white md:block"
      />

      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25 md:block"
      />
    </>
  );
}

export default Cursor;