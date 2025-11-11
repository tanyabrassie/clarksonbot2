import styles from "./ClarksonGenerator.module.scss";
import ClarksonBotSvg from "../assets/clarksonbot.svg?react";
import { useEffect, useRef, useState } from "react";

interface ToolBarProps {
  selectedElement: string | null;
  fillColor: string;
  strokeColor: string;
}

const ToolBar = ({ selectedElement, fillColor, strokeColor }: ToolBarProps) => {
  // Extract the name after "clarkson-" prefix
  const elementName = selectedElement
    ? selectedElement.replace("clarkson-", "")
    : "None";

  // Check if stroke is none/transparent
  const hasNoStroke =
    !strokeColor ||
    strokeColor === "none" ||
    strokeColor === "transparent" ||
    strokeColor === "rgba(0, 0, 0, 0)";

  return (
    <div className={styles.toolBar}>
      <h1 className={styles.selectedElement}>
        Selected Element<span>{elementName}</span>
      </h1>
      <div className={styles.colorOptions}>
        <div className={styles.colorOption}>
          <div className={styles.label}>FILL</div>
          <div
            className={styles.fillCircle}
            style={{ backgroundColor: fillColor }}
          ></div>
        </div>
        <div className={styles.colorOption}>
          <div className={styles.label}>STROKE</div>
          <div
            className={`${styles.strokeCircle} ${
              hasNoStroke ? styles.noStroke : ""
            }`}
            style={{ borderColor: hasNoStroke ? "#ccc" : strokeColor }}
          ></div>
        </div>
      </div>
    </div>
  );
};

interface MainContainerProps {
  selectedElement: string | null;
  setSelectedElement: (element: string | null) => void;
  setFillColor: (color: string) => void;
  setStrokeColor: (color: string) => void;
}

const MainContainer = ({
  setSelectedElement,
  setFillColor,
  setStrokeColor,
}: MainContainerProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const previousSelectedRef = useRef<Element | null>(null);

  useEffect(() => {
    if (svgRef.current) {
      // Find all elements with IDs starting with "clarkson-"
      const allElements = svgRef.current.querySelectorAll('[id^="clarkson-"]');
      console.log(`Found ${allElements.length} clarkson elements`);

      const clickHandlers: Array<{
        element: Element;
        handler: () => void;
      }> = [];

      allElements.forEach((element) => {
        const elementId = element.getAttribute("id");
        if (elementId) {
          const handleClick = () => {
            console.log("Clicked:", elementId);

            // Remove drop shadow from previously selected element
            if (previousSelectedRef.current) {
              (previousSelectedRef.current as SVGElement).style.filter = "";
            }

            // Add drop shadow to newly selected element
            (element as SVGElement).style.filter =
              "drop-shadow(0 0 6px rgba(20, 223, 64, 0.942))";
            previousSelectedRef.current = element;

            // Get the fill and stroke colors from the clicked element
            let fill = "transparent";
            let stroke = "transparent";

            const computedStyle = window.getComputedStyle(element);
            fill = computedStyle.fill || "transparent";
            stroke = computedStyle.stroke || "transparent";

            console.log("Element fill:", fill, "stroke:", stroke);

            // If fill or stroke is none/transparent/black (default), search children
            const isTransparent = (color: string) => {
              return (
                !color ||
                color === "none" ||
                color === "transparent" ||
                color === "rgba(0, 0, 0, 0)" ||
                color === "rgb(0, 0, 0)"
              );
            };

            if (isTransparent(fill) || isTransparent(stroke)) {
              const children = element.querySelectorAll("*");
              console.log("Searching", children.length, "children for colors");

              for (const child of children) {
                const childStyle = window.getComputedStyle(child);

                if (isTransparent(fill)) {
                  const childFill = childStyle.fill;
                  console.log("Child fill:", childFill);
                  if (!isTransparent(childFill)) {
                    fill = childFill;
                  }
                }

                if (isTransparent(stroke)) {
                  const childStroke = childStyle.stroke;
                  console.log("Child stroke:", childStroke);
                  if (!isTransparent(childStroke)) {
                    stroke = childStroke;
                  }
                }

                // Stop if we found both
                if (!isTransparent(fill) && !isTransparent(stroke)) {
                  break;
                }
              }

              console.log("Final fill:", fill, "stroke:", stroke);
            }

            setFillColor(fill);
            setStrokeColor(stroke);
            setSelectedElement(elementId);
          };

          const handleMouseEnter = () => {
            // Only add hover effect if this isn't the selected element
            if (previousSelectedRef.current !== element) {
              (element as SVGElement).style.filter =
                "drop-shadow(0 0 6px rgba(20, 223, 64, 0.751))";
            }
          };

          const handleMouseLeave = () => {
            // Only remove hover effect if this isn't the selected element
            if (previousSelectedRef.current !== element) {
              (element as SVGElement).style.filter = "";
            }
          };

          element.addEventListener("click", handleClick);
          element.addEventListener("mouseenter", handleMouseEnter);
          element.addEventListener("mouseleave", handleMouseLeave);

          // Add cursor pointer to indicate it's clickable
          (element as SVGElement).style.cursor = "pointer";
          // Add smooth transition for the filter effect
          (element as SVGElement).style.transition = "filter 0.3s ease";

          clickHandlers.push({
            element,
            handler: handleClick,
          });
        }
      });

      // Cleanup
      return () => {
        clickHandlers.forEach(({ element, handler }) => {
          element.removeEventListener("click", handler);
        });
        // Also cleanup hover listeners
        allElements.forEach((element) => {
          element.removeEventListener("mouseenter", () => {});
          element.removeEventListener("mouseleave", () => {});
        });
      };
    }
  }, []);

  return (
    <div className={styles.mainContainer}>
      <ClarksonBotSvg ref={svgRef} />
    </div>
  );
};

export const ClarksonGenerator = () => {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [fillColor, setFillColor] = useState<string>("#d946ef");
  const [strokeColor, setStrokeColor] = useState<string>("#d946ef");
  const [showReveal, setShowReveal] = useState(true);

  useEffect(() => {
    // Remove the reveal animation after it completes (2 seconds)
    const timer = setTimeout(() => {
      setShowReveal(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showReveal && <div className={styles.circularReveal}></div>}
      <div className={styles.container}>
        <ToolBar
          selectedElement={selectedElement}
          fillColor={fillColor}
          strokeColor={strokeColor}
        />
        <MainContainer
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
          setFillColor={setFillColor}
          setStrokeColor={setStrokeColor}
        />
      </div>
    </>
  );
};
