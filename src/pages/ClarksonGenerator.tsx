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
  uploadedImages: UploadedImage[];
  onImageUpload: (imageData: string) => void;
  onImageChange: (id: string, imageData: string) => void;
  onImageDelete: (id: string) => void;
}

const ToolBar = ({
  selectedElement,
  fillColor,
  strokeColor,
  onFillColorChange,
  onStrokeColorChange,
  onExport,
  uploadedImages,
  onImageUpload,
  onImageChange,
  onImageDelete,
}: ToolBarProps) => {
  const [showFillPicker, setShowFillPicker] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const strokeColorInputRef = useRef<HTMLInputElement>(null);
  const newImageInputRef = useRef<HTMLInputElement>(null);
  const imageInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

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

  const handleNewImageUploadClick = () => {
    newImageInputRef.current?.click();
  };

  const handleChangeImageClick = (id: string) => {
    imageInputRefs.current[id]?.click();
  };

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        onImageUpload(imageData);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be uploaded again
    e.target.value = "";
  };

  const handleExistingImageChange =
    (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target?.result as string;
          onImageChange(id, imageData);
        };
        reader.readAsDataURL(file);
      }
      // Reset input so same file can be uploaded again
      e.target.value = "";
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

      {/* Image Upload Section */}
      <div className={styles.imageUploadSection}>
        <div className={styles.label}>ASSETS</div>

        {/* Render all uploaded images */}
        {uploadedImages.map((image) => (
          <div key={image.id} className={styles.imageControls}>
            <div className={styles.imagePreview}>
              <img src={image.data} alt="Uploaded" />
            </div>
            <div className={styles.imageButtons}>
              <button
                onClick={() => handleChangeImageClick(image.id)}
                className={styles.changeButton}
              >
                CHANGE
              </button>
              <button
                onClick={() => onImageDelete(image.id)}
                className={styles.deleteButton}
              >
                DELETE
              </button>
            </div>
            <input
              ref={(el) => {
                imageInputRefs.current[image.id] = el;
              }}
              type="file"
              accept="image/*"
              onChange={handleExistingImageChange(image.id)}
              style={{ display: "none" }}
            />
          </div>
        ))}

        {/* Always show upload button */}
        <button
          onClick={handleNewImageUploadClick}
          className={styles.uploadButton}
        >
          UPLOAD ASSET
        </button>
        <input
          ref={newImageInputRef}
          type="file"
          accept="image/*"
          onChange={handleNewImageChange}
          style={{ display: "none" }}
        />
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
  uploadedImages: UploadedImage[];
  onImagePositionChange: (id: string, x: number, y: number) => void;
  onImageSizeChange: (id: string, width: number, height: number) => void;
}

const MainContainer = ({
  setSelectedElement,
  setFillColor,
  setStrokeColor,
  selectedElementRef,
  svgRef,
  uploadedImages,
  onImagePositionChange,
  onImageSizeChange,
}: MainContainerProps) => {
  const previousSelectedRef = useRef<Element | null>(null);
  const [draggingImageId, setDraggingImageId] = useState<string | null>(null);
  const [resizingImageId, setResizingImageId] = useState<string | null>(null);
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });

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

  // Drag handlers for uploaded images
  const handleImageMouseDown =
    (id: string, image: UploadedImage) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDraggingImageId(id);
      dragStart.current = {
        x: e.clientX - image.position.x,
        y: e.clientY - image.position.y,
      };
    };

  // Resize handlers for uploaded images
  const handleResizeMouseDown =
    (id: string, image: UploadedImage) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setResizingImageId(id);
      resizeStart.current = {
        x: e.clientX,
        y: e.clientY,
        width: image.size.width,
        height: image.size.height,
      };
    };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingImageId) {
      const newX = e.clientX - dragStart.current.x;
      const newY = e.clientY - dragStart.current.y;
      onImagePositionChange(draggingImageId, newX, newY);
    } else if (resizingImageId) {
      const deltaX = e.clientX - resizeStart.current.x;
      const deltaY = e.clientY - resizeStart.current.y;

      // Use the larger delta to maintain aspect ratio
      const delta = Math.max(deltaX, deltaY);

      const newWidth = Math.max(50, resizeStart.current.width + delta);
      const newHeight = Math.max(50, resizeStart.current.height + delta);

      onImageSizeChange(resizingImageId, newWidth, newHeight);
    }
  };

  const handleMouseUp = () => {
    setDraggingImageId(null);
    setResizingImageId(null);
  };

  return (
    <div
      className={styles.mainContainer}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <ClarksonBotSvg
        ref={svgRef}
        style={{ opacity: 0.8, filter: `blur(1pxT)` }}
      />
      {uploadedImages.map((image) => (
        <div
          key={image.id}
          className={styles.uploadedImageContainer}
          style={{
            left: `${image.position.x}px`,
            top: `${image.position.y}px`,
            width: `${image.size.width}px`,
            height: `${image.size.height}px`,
          }}
        >
          <img
            src={image.data}
            alt="Uploaded"
            className={styles.uploadedImage}
            style={{
              cursor: draggingImageId === image.id ? "grabbing" : "grab",
            }}
            onMouseDown={handleImageMouseDown(image.id, image)}
            draggable={false}
          />
          <div
            className={styles.resizeHandle}
            onMouseDown={handleResizeMouseDown(image.id, image)}
            style={{
              cursor:
                resizingImageId === image.id ? "nwse-resize" : "nwse-resize",
            }}
          />
        </div>
      ))}
    </div>
  );
};

interface UploadedImage {
  id: string;
  data: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export const ClarksonGenerator = () => {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [fillColor, setFillColor] = useState<string>("#d946ef");
  const [strokeColor, setStrokeColor] = useState<string>("#d946ef");
  const [showReveal, setShowReveal] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
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

  const handleImageUpload = (imageData: string) => {
    const newImage: UploadedImage = {
      id: `image-${Date.now()}`,
      data: imageData,
      position: { x: 100, y: 100 },
      size: { width: 200, height: 200 },
    };
    setUploadedImages([...uploadedImages, newImage]);
  };

  const handleImageChange = (id: string, imageData: string) => {
    setUploadedImages(
      uploadedImages.map((img) =>
        img.id === id ? { ...img, data: imageData } : img
      )
    );
  };

  const handleImageDelete = (id: string) => {
    setUploadedImages(uploadedImages.filter((img) => img.id !== id));
  };

  const handleImagePositionChange = (id: string, x: number, y: number) => {
    setUploadedImages(
      uploadedImages.map((img) =>
        img.id === id ? { ...img, position: { x, y } } : img
      )
    );
  };

  const handleImageSizeChange = (id: string, width: number, height: number) => {
    setUploadedImages(
      uploadedImages.map((img) =>
        img.id === id ? { ...img, size: { width, height } } : img
      )
    );
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

    // Get the SVG's bounding box and viewBox for coordinate conversion
    const svgRect = svgRef.current.getBoundingClientRect();
    const viewBox = svgRef.current.viewBox.baseVal;

    // Calculate the scale factor between screen pixels and SVG coordinates
    const scaleX = viewBox.width / svgRect.width;
    const scaleY = viewBox.height / svgRect.height;

    // Add uploaded images to the SVG with proper coordinate conversion
    uploadedImages.forEach((image) => {
      const imageElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "image"
      );

      // Convert pixel coordinates to SVG coordinates
      const svgX = viewBox.x + image.position.x * scaleX;
      const svgY = viewBox.y + image.position.y * scaleY;
      const svgWidth = image.size.width * scaleX;
      const svgHeight = image.size.height * scaleY;

      imageElement.setAttribute("href", image.data);
      imageElement.setAttribute("x", svgX.toString());
      imageElement.setAttribute("y", svgY.toString());
      imageElement.setAttribute("width", svgWidth.toString());
      imageElement.setAttribute("height", svgHeight.toString());
      imageElement.setAttribute("preserveAspectRatio", "none");
      svgClone.appendChild(imageElement);
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
          uploadedImages={uploadedImages}
          onImageUpload={handleImageUpload}
          onImageChange={handleImageChange}
          onImageDelete={handleImageDelete}
        />
        <MainContainer
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
          setFillColor={setFillColor}
          setStrokeColor={setStrokeColor}
          selectedElementRef={selectedElementRef}
          svgRef={svgRef}
          uploadedImages={uploadedImages}
          onImagePositionChange={handleImagePositionChange}
          onImageSizeChange={handleImageSizeChange}
        />
      </div>
    </>
  );
};
