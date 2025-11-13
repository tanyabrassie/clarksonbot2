import styles from "./ClarksonGenerator.module.scss";
import ClarksonBotSvg from "../assets/clarksonbot.svg?react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../components/Buttons/Button";

// Helper function to convert RGB to hex
const rgbToHex = (rgb: string): string => {
  // Handle transparent/none cases - return black as default
  if (
    !rgb ||
    rgb === "none" ||
    rgb === "transparent" ||
    rgb === "rgba(0, 0, 0, 0)"
  ) {
    return "#000000";
  }

  // Handle rgb() format
  const rgbMatch = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  // Handle rgba() format
  const rgbaMatch = rgb.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)$/);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1]);
    const g = parseInt(rgbaMatch[2]);
    const b = parseInt(rgbaMatch[3]);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  // If it's already hex, return as is
  if (rgb.startsWith("#")) {
    return rgb;
  }

  // Fallback to black for any other cases
  return "#000000";
};

interface ToolBarProps {
  selectedElement: string | null;
  fillColor: string;
  strokeColor: string;
  onFillColorChange: (color: string) => void;
  onStrokeColorChange: (color: string) => void;
  onExport: () => void;
}

const ToolBar = ({
  selectedElement,
  fillColor,
  strokeColor,
  onFillColorChange,
  onStrokeColorChange,
  onExport,
}: ToolBarProps) => {
  const [showFillPicker, setShowFillPicker] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const strokeColorInputRef = useRef<HTMLInputElement>(null);

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

  const handleFillCircleClick = () => {
    if (selectedElement) {
      setShowFillPicker(!showFillPicker);
      // Trigger the color picker
      setTimeout(() => {
        colorInputRef.current?.click();
      }, 0);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    onFillColorChange(newColor);
  };

  const handleStrokeCircleClick = () => {
    if (selectedElement && !hasNoStroke) {
      setTimeout(() => {
        strokeColorInputRef.current?.click();
      }, 0);
    }
  };

  const handleStrokeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    onStrokeColorChange(newColor);
  };

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
            style={{
              backgroundColor: fillColor,
              cursor: selectedElement ? "pointer" : "default",
            }}
            onClick={handleFillCircleClick}
          ></div>
          <input
            ref={colorInputRef}
            type="color"
            value={rgbToHex(fillColor)}
            onChange={handleColorChange}
            style={{ display: "none" }}
          />
        </div>
        <div className={styles.colorOption}>
          <div className={styles.label}>STROKE</div>
          <div
            className={`${styles.strokeCircle} ${
              hasNoStroke ? styles.noStroke : ""
            }`}
            style={{
              borderColor: hasNoStroke ? "#ccc" : strokeColor,
              cursor: selectedElement && !hasNoStroke ? "pointer" : "default",
            }}
            onClick={handleStrokeCircleClick}
          ></div>
          <input
            ref={strokeColorInputRef}
            type="color"
            value={rgbToHex(strokeColor)}
            onChange={handleStrokeColorChange}
            style={{ display: "none" }}
          />
        </div>
      </div>
      <Button className={styles.exportButton} onClick={onExport}>
        EXPORT BOT
      </Button>
    </div>
  );
};

interface MainContainerProps {
  selectedElement: string | null;
  setSelectedElement: (element: string | null) => void;
  setFillColor: (color: string) => void;
  setStrokeColor: (color: string) => void;
  selectedElementRef: React.MutableRefObject<Element | null>;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

const MainContainer = ({
  setSelectedElement,
  setFillColor,
  setStrokeColor,
  selectedElementRef,
  svgRef,
}: MainContainerProps) => {
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
              "drop-shadow(0 0 12px rgba(18, 180, 50, 1)) drop-shadow(0 0 20px rgba(18, 180, 50, 0.6))";
            previousSelectedRef.current = element;
            selectedElementRef.current = element;

            // Get the fill and stroke colors from the clicked element
            let fill = "transparent";
            let stroke = "transparent";

            const computedStyle = window.getComputedStyle(element);
            fill = computedStyle.fill || "transparent";
            stroke = computedStyle.stroke || "transparent";

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

              for (const child of children) {
                const childStyle = window.getComputedStyle(child);

                if (isTransparent(fill)) {
                  const childFill = childStyle.fill;
                  if (!isTransparent(childFill)) {
                    fill = childFill;
                  }
                }

                if (isTransparent(stroke)) {
                  const childStroke = childStyle.stroke;
                  if (!isTransparent(childStroke)) {
                    stroke = childStroke;
                  }
                }

                // Stop if we found both
                if (!isTransparent(fill) && !isTransparent(stroke)) {
                  break;
                }
              }
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
  }, [
    setSelectedElement,
    setFillColor,
    setStrokeColor,
    selectedElementRef,
    svgRef,
  ]);

  return (
    <div className={styles.mainContainer}>
      <ClarksonBotSvg
        ref={svgRef}
        style={{ opacity: 0.8, filter: `blur(1pxT)` }}
      />
    </div>
  );
};

export const ClarksonGenerator = () => {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [fillColor, setFillColor] = useState<string>("#d946ef");
  const [strokeColor, setStrokeColor] = useState<string>("#d946ef");
  const [showReveal, setShowReveal] = useState(true);
  const selectedElementRef = useRef<Element | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Remove the reveal animation after it completes (2 seconds)
    const timer = setTimeout(() => {
      setShowReveal(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleFillColorChange = (newColor: string) => {
    setFillColor(newColor);

    // Update the SVG element's fill
    if (selectedElementRef.current) {
      // If it's a group, update all children
      if (selectedElementRef.current.tagName === "g") {
        const children = selectedElementRef.current.querySelectorAll("*");
        children.forEach((child) => {
          (child as SVGElement).style.fill = newColor;
          (child as SVGElement).setAttribute("fill", newColor);
        });
      } else {
        (selectedElementRef.current as SVGElement).style.fill = newColor;
        (selectedElementRef.current as SVGElement).setAttribute(
          "fill",
          newColor
        );
      }
    }
  };

  const handleStrokeColorChange = (newColor: string) => {
    setStrokeColor(newColor);

    // Update the SVG element's stroke
    if (selectedElementRef.current) {
      // If it's a group, update all children
      if (selectedElementRef.current.tagName === "g") {
        const children = selectedElementRef.current.querySelectorAll("*");
        children.forEach((child) => {
          (child as SVGElement).style.stroke = newColor;
          (child as SVGElement).setAttribute("stroke", newColor);
        });
      } else {
        (selectedElementRef.current as SVGElement).style.stroke = newColor;
        (selectedElementRef.current as SVGElement).setAttribute(
          "stroke",
          newColor
        );
      }
    }
  };

  const handleExportSvg = () => {
    if (!svgRef.current) return;

    // Clone the SVG to avoid modifying the original
    const svgClone = svgRef.current.cloneNode(true) as SVGElement;

    // Remove any added styles/classes that shouldn't be in the export
    svgClone.querySelectorAll("*").forEach((element) => {
      (element as SVGElement).style.cursor = "";
      (element as SVGElement).style.transition = "";
      (element as SVGElement).style.filter = "";
    });

    // Serialize the SVG to a string
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgClone);

    // Add XML declaration and ensure proper formatting
    svgString = '<?xml version="1.0" encoding="UTF-8"?>\n' + svgString;

    // Create a blob and download it
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "clarkson-bot-custom.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {showReveal && <div className={styles.circularReveal}></div>}
      <div className={styles.container}>
        <ToolBar
          selectedElement={selectedElement}
          fillColor={fillColor}
          strokeColor={strokeColor}
          onFillColorChange={handleFillColorChange}
          onStrokeColorChange={handleStrokeColorChange}
          onExport={handleExportSvg}
        />
        <MainContainer
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
          setFillColor={setFillColor}
          setStrokeColor={setStrokeColor}
          selectedElementRef={selectedElementRef}
          svgRef={svgRef}
        />
      </div>
    </>
  );
};
