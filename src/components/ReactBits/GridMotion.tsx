import { useEffect, useRef, FC } from "react";
import { gsap } from "gsap";

interface GridMotionProps {
  items?: string[];
  gradientColor?: string;
}

const GridMotion: FC<GridMotionProps> = ({
  items = [],
  gradientColor = "black",
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouseXRef = useRef<number>(window.innerWidth / 2);

  // Ensure the grid has 28 items (4 rows x 7 columns) by default
  const totalItems = 28;
  const defaultItems = Array.from(
    { length: totalItems },
    (_, index) => `Item ${index + 1}`
  );
  const combinedItems =
    items && items.length > 0
      ? items.slice(0, totalItems)
      : defaultItems; // Ensure fallback to defaultItems if items is undefined or empty

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);

    const handleMouseMove = (e: MouseEvent): void => {
      mouseXRef.current = e.clientX;
    };

    const updateMotion = (): void => {
      const maxMoveAmount = 300;
      const baseDuration = 0.8; // Base duration for inertia
      const inertiaFactors = [0.6, 0.4, 0.3, 0.2]; // Different inertia for each row, outer rows slower

      rowRefs.current.forEach((row, index) => {
        if (row) {
          const direction = index % 2 === 0 ? 1 : -1;
          const moveAmount =
            ((mouseXRef.current / window.innerWidth) * maxMoveAmount -
              maxMoveAmount / 2) *
            direction;

          gsap.to(row, {
            x: moveAmount || 0, // Ensure moveAmount is valid
            duration:
              baseDuration + inertiaFactors[index % inertiaFactors.length],
            ease: "power3.out",
            overwrite: "auto",
          });
        }
      });
    };

    const removeAnimationLoop = gsap.ticker.add(updateMotion);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      removeAnimationLoop();
    };
  }, []);

  return (
    <div ref={gridRef} className="h-full w-full overflow-hidden">
      <section
        className="w-full h-[75vh] overflow-hidden relative flex items-center justify-center" // Reduced height
        style={{
          background: `radial-gradient(circle, ${gradientColor} 0%, rgba(0, 0, 0, 0.8) 100%)`, // Darker gradient
        }}
      >
        {/* Noise overlay */}
        <div className="absolute inset-0 pointer-events-none z-[4] bg-[url('../../../assets/noise.png')] bg-[length:250px]"></div>
        <div className="gap-4 flex-none relative w-[150vw] h-[150vh] grid grid-rows-4 grid-cols-1 rotate-[-15deg] origin-center z-[2]">
          {Array.from({ length: 4 }, (_, rowIndex) => (
            <div
              key={rowIndex}
              className="grid gap-4 grid-cols-7"
              style={{ willChange: "transform, filter" }}
              ref={(el) => (rowRefs.current[rowIndex] = el)}
            >
              {Array.from({ length: 7 }, (_, itemIndex) => {
                const content = combinedItems[rowIndex * 7 + itemIndex];
                return (
                  <div key={itemIndex} className="relative">
                    <div className="relative w-full h-full overflow-hidden rounded-[10px] bg-transparent flex items-center justify-center text-white text-[1.5rem]">
                      {content && (content.endsWith(".png") || content.endsWith(".jpg")) ? (
                        // Render image if the content is a valid image URL
                        <img
                          src={content}
                          alt="Clothing item"
                          className="w-full h-full object-contain"
                          style={{ backgroundColor: "transparent" }} // Ensure transparent background
                        />
                      ) : (
                        // Render text if the content is not an image URL
                        <div className="p-4 text-center z-[1]">{content || "N/A"}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="relative w-full h-full top-0 left-0 pointer-events-none"></div>
      </section>
    </div>
  );
};

export default GridMotion;
