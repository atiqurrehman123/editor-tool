import { useRef } from "react";
import FontFamilyPicker from "./FontFamilyPicker";
import {
  PrimaryButton,
  SectionContainer,
  SectionHeader,
  SectionLabel,
} from "./Styles";
import { predefinedColors } from "../common/functions";
import ToolBar from "./ToolBar";

const Text = ({
  isAddTextEnabled,
  textPage,
  setTextPage,
  addTextToCanvas,
  textInput,
  setTextInput,
  onCenter,
  onBringToFront,
  onSendToBack,
  onFlipHorizontal,
  onFlipVertical,
  onDuplicate,
  onRemove,
  centerObject,
  flipHorizontal,
  flipVertical,
  bringToFront,
  sendToBack,
  setCenterObject,
  setFlipHorizontal,
  setFlipVertical,
  setBringToFront,
  setSendToBack,
  updateTextToCanvas,
  textOptions,
  setTextOptions,
  colorPickerType,
  setColorPickerType,
  setShapePage,
  resetToOriginal,
  onResetToOriginal,
}) => {
  const handleAddText = () => {
    addTextToCanvas();
    setTextPage(2);
  };
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    setTextInput(e.target.value);
    const textarea = textareaRef.current;
    textarea.style.height = "auto"; // Reset height
    textarea.style.height = textarea.scrollHeight + "px"; // Set to new content height
  };
  return (
    <>
      {textPage === 1 ? (
        <>
          <h3 style={{ marginBottom: 16 }}>Add Text to Design</h3>
          <textarea
            ref={textareaRef}
            placeholder="Enter text here"
            value={textInput}
            onChange={handleChange}
            rows={1}
            style={{
              padding: 12,
              fontSize: 16,
              borderRadius: 4,
              border: "1px solid #ccc",
              width: "100%",
              boxSizing: "border-box",
              marginBottom: 16,
              resize: "none",
              overflow: "hidden",
            }}
          />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PrimaryButton
              onClick={handleAddText}
              disabled={!isAddTextEnabled}
              style={{
                minWidth: "200px",
              }}
            >
              Add to Design
            </PrimaryButton>
          </div>
        </>
      ) : textPage === 2 ? (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h3 style={{ margin: 0 }}>Text</h3>
          </div>

          {/* Text Input Section */}
          <SectionContainer>
            <textarea
              value={textInput}
              onChange={async (e) => {
                const canvas = window.fabricCanvas;
                if (canvas) {
                  const activeObject = canvas.getActiveObject();
                  if (activeObject && activeObject.originType === "text") {
                    activeObject.originText.set("text", e.target.value);
                    const start = performance.now();
                    await updateTextToCanvas();
                    console.log("Total updateText:", performance.now() - start);
                  }
                }
              }}
              style={{
                padding: 8,
                fontSize: 14,
                borderRadius: 4,
                border: "1px solid #ccc",
                width: "100%",
                boxSizing: "border-box",
                minHeight: "80px",
                resize: "vertical",
              }}
              placeholder="Edit text here..."
            />
          </SectionContainer>

          {/* Font Family Section */}
          <SectionContainer>
            <SectionHeader>
              <SectionLabel>Font Family</SectionLabel>
            </SectionHeader>
            <FontFamilyPicker
              value={textOptions.fontFamily}
              onChange={async (fontName) => {
                const canvas = window.fabricCanvas;
                if (canvas) {
                  const activeObject = canvas.getActiveObject();
                  if (activeObject && activeObject.originType === "text") {
                    activeObject.originText.set("fontFamily", fontName);
                    await updateTextToCanvas();
                  }
                }
              }}
            />
          </SectionContainer>

          {/* Font Size and Style Section */}
          <SectionContainer>
            <SectionHeader>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <SectionLabel>Font Size</SectionLabel>
                <SectionLabel>Font Style</SectionLabel>
              </div>
            </SectionHeader>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
              }}
            >
              {/* Font Size Controls */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  type="number"
                  value={textOptions.fontSize}
                  onChange={async (e) => {
                    const newSize = Math.min(
                      200,
                      Math.max(1, e.target.value || 1)
                    );
                    setTextOptions({
                      ...textOptions,
                      fontSize: newSize,
                    });
                  }}
                  onKeyUp={async (e) => {
                    if (e.key === "Enter") {
                      const canvas = window.fabricCanvas;
                      if (canvas) {
                        const activeObject = canvas.getActiveObject();
                        if (
                          activeObject &&
                          activeObject.originType === "text"
                        ) {
                          activeObject.originText.set(
                            "fontSize",
                            e.target.value
                          );
                          await updateTextToCanvas();
                        }
                      }
                    }
                  }}
                  style={{
                    width: 60,
                    height: 32,
                    padding: "0 8px",
                    border: "1px solid #ddd",
                    borderRadius: 4,
                    backgroundColor: "#fff",
                    fontSize: 14,
                  }}
                />
                <span style={{ fontSize: 14 }}>px</span>
              </div>

              {/* Font Style Controls */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={async () => {
                    const canvas = window.fabricCanvas;
                    if (canvas) {
                      const activeObject = canvas.getActiveObject();
                      if (activeObject && activeObject.originType === "text") {
                        const newValue =
                          activeObject.originText.fontWeight === "bold"
                            ? "normal"
                            : "bold";
                        activeObject.originText.set("fontWeight", newValue);
                        await updateTextToCanvas();
                      }
                    }
                  }}
                  style={{
                    padding: "8px 12px",
                    border: `1px solid ${
                      textOptions.fontWeight === "bold" ? "#333" : "#ddd"
                    }`,
                    borderRadius: 6,
                    backgroundColor: "#ddd",
                    color: "#666",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: 14,
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 36,
                  }}
                >
                  B
                </button>
              </div>
            </div>
          </SectionContainer>

          {/* Text Color Section */}
          <SectionContainer>
            <SectionHeader>
              <SectionLabel>Edit Color</SectionLabel>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 14, color: "#666" }}>
                  {predefinedColors.find((c) => c.value === textOptions.fill)
                    ?.name || "Black"}
                </span>
                <button
                  onClick={() => {
                    setColorPickerType("fill");
                    setTextPage(3);
                  }}
                  style={{
                    width: 25,
                    height: 25,
                    backgroundColor: textOptions.fill,
                    border: "2px solid #ccc",
                    borderRadius: 4,
                    cursor: "pointer",
                    padding: 0,
                  }}
                  title="Choose Text Color"
                />
                <span style={{ fontSize: 26, color: "#666" }}>›</span>
              </div>
            </SectionHeader>
          </SectionContainer>

          {/* Outline Section */}
          <SectionContainer>
            <SectionHeader>
              <SectionLabel>Outline</SectionLabel>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {textOptions.strokeWidth > 0 ? (
                  <>
                    <span style={{ fontSize: 14, color: "#666" }}>
                      {textOptions.strokeWidth === 1
                        ? "Very Thin"
                        : textOptions.strokeWidth === 2
                        ? "Thin"
                        : textOptions.strokeWidth === 3
                        ? "Medium"
                        : textOptions.strokeWidth === 4
                        ? "Thick"
                        : "Very Thick"}{" "}
                      -{" "}
                      {predefinedColors.find(
                        (c) => c.value === textOptions.stroke
                      )?.name || "Custom"}
                    </span>
                    <button
                      onClick={() => {
                        setColorPickerType("outline");
                        setTextPage(3);
                      }}
                      style={{
                        width: 25,
                        height: 25,
                        backgroundColor: textOptions.stroke,
                        border: "2px solid #ccc",
                        borderRadius: 4,
                        cursor: "pointer",
                        padding: 0,
                        opacity: 1,
                      }}
                      title="Select Outline Color"
                    />
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setColorPickerType("outline");
                      setTextPage(3);
                    }}
                    style={{
                      background: "transparent",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ fontSize: 14, color: "#666" }}>
                      Select Outline
                    </span>
                  </button>
                )}
                <span style={{ fontSize: 26, color: "#666" }}>›</span>
              </div>
            </SectionHeader>
          </SectionContainer>

          {/* Text Shape Section */}
          <SectionContainer>
            <SectionHeader>
              <SectionLabel>Text Shape</SectionLabel>
              <button
                onClick={() => setShapePage(true)}
                style={{
                  fontSize: 14,
                  borderRadius: 4,
                  border: "none",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = "#0056b3";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = "#007bff";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {textOptions.textShapePreview ||
                  textOptions.textShape ||
                  "Select Shape"}
              </button>
              <span style={{ fontSize: 26, color: "#666" }}>›</span>
            </SectionHeader>
          </SectionContainer>

          {/* Rotation Control */}
          <SectionContainer>
            <SectionHeader>
              <SectionLabel>Rotation</SectionLabel>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flex: 1,
                  marginLeft: "auto",
                }}
              >
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={textOptions.rotation}
                  onChange={(e) => {
                    console.log("rotation", e.target.value);
                    setTextOptions({
                      ...textOptions,
                      rotation: parseInt(e.target.value),
                    });
                  }}
                  onPointerUp={async () => {
                    const canvas = window.fabricCanvas;
                    if (canvas) {
                      const activeObject = canvas.getActiveObject();
                      if (activeObject && activeObject.originType === "text") {
                        activeObject.originText.set(
                          "angle",
                          textOptions.rotation
                        );
                        await updateTextToCanvas();
                      }
                    }
                  }}
                  style={{
                    flex: 1,
                    boxSizing: "border-box",
                  }}
                />

                <input
                  type="number"
                  min="-180"
                  max="180"
                  value={textOptions.rotation}
                  onChange={(e) => {
                    setTextOptions({
                      ...textOptions,
                      rotation: parseInt(e.target.value) || 0,
                    });
                  }}
                  onKeyUp={async (e) => {
                    if (e.key === "Enter") {
                      const canvas = window.fabricCanvas;
                      if (canvas) {
                        const activeObject = canvas.getActiveObject();
                        if (
                          activeObject &&
                          activeObject.originType === "text"
                        ) {
                          activeObject.originText.set(
                            "angle",
                            textOptions.rotation
                          );
                          await updateTextToCanvas();
                        }
                      }
                    }
                  }}
                  style={{
                    width: 60,
                    padding: 8,
                    fontSize: 14,
                    borderRadius: 4,
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </SectionHeader>
          </SectionContainer>

          {/* Action Buttons */}
          <div
            style={{
              marginTop: "auto",
              paddingTop: 16,
              borderTop: "1px solid #eee",
            }}
          >
            <ToolBar
              onCenter={onCenter}
              onBringToFront={onBringToFront}
              onSendToBack={onSendToBack}
              onFlipHorizontal={onFlipHorizontal}
              onFlipVertical={onFlipVertical}
              onDuplicate={onDuplicate}
              onRemove={onRemove}
              setCenterObject={setCenterObject}
              setFlipHorizontal={setFlipHorizontal}
              setFlipVertical={setFlipVertical}
              setBringToFront={setBringToFront}
              setSendToBack={setSendToBack}
              centerObject={centerObject}
              flipHorizontal={flipHorizontal}
              flipVertical={flipVertical}
              bringToFront={bringToFront}
              sendToBack={sendToBack}
            />
          </div>
          {/* Reset to Original Section */}
          <SectionContainer>
            <SectionHeader>
              <button
                onClick={() => onResetToOriginal()}
                disabled={!resetToOriginal}
                style={{
                  backgroundColor: "#0066cc",
                  color: "#fff",
                  width: "100%",
                  border: "none",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  fontSize: "14px",
                  cursor: "pointer",
                  boxShadow: resetToOriginal ? "0 0 2px 3px #0066cc" : "none",
                  opacity: resetToOriginal ? 1 : 0.5,
                }}
              >
                Reset to Original
              </button>
            </SectionHeader>
          </SectionContainer>
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h3 style={{ margin: 0 }}>
              {colorPickerType === "fill"
                ? "Select Text Color"
                : "Select Outline"}
            </h3>
          </div>

          {colorPickerType === "outline" && (
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <label style={{ fontWeight: "600", width: 100 }}>
                  Thickness:
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={textOptions.strokeWidth || 0}
                  onChange={async (e) => {
                    setTextOptions({
                      ...textOptions,
                      strokeWidth: parseInt(e.target.value),
                    });
                    const canvas = window.fabricCanvas;
                    if (canvas) {
                      const activeObject = canvas.getActiveObject();
                      if (activeObject && activeObject.originType === "text") {
                        if (colorPickerType === "outline") {
                          setTextOptions({
                            ...textOptions,
                            strokeWidth: parseInt(e.target.value),
                          });
                        }
                        activeObject.originText.set(
                          "strokeWidth",
                          parseInt(e.target.value)
                        );
                        await updateTextToCanvas();
                      }
                    }
                  }}
                  style={{
                    flex: 1,
                    boxSizing: "border-box",
                  }}
                />
                <span
                  style={{
                    width: 40,
                    textAlign: "center",
                    fontSize: 14,
                    color: "#666",
                  }}
                >
                  {textOptions.strokeWidth || 0}px
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <span style={{ fontSize: 14, color: "#666" }}>
                  {textOptions.strokeWidth === 0
                    ? "No outline"
                    : textOptions.strokeWidth === 1
                    ? "Very Thin outline"
                    : textOptions.strokeWidth === 2
                    ? "Thin outline"
                    : textOptions.strokeWidth === 3
                    ? "Medium outline"
                    : textOptions.strokeWidth === 4
                    ? "Thick outline"
                    : "Very Thick outline"}
                </span>
              </div>
            </div>
          )}

          {colorPickerType === "fill" || textOptions.strokeWidth > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gap: 16,
                padding: "16px 0",
              }}
            >
              {predefinedColors.map((color, index) => (
                <button
                  key={index}
                  onClick={async () => {
                    const canvas = window.fabricCanvas;
                    if (canvas) {
                      const activeObject = canvas.getActiveObject();
                      if (activeObject && activeObject.originType === "text") {
                        if (colorPickerType === "fill") {
                          setTextOptions({
                            ...textOptions,
                            fill: color.value,
                          });
                          activeObject.originText.set("fill", color.value);
                        } else {
                          setTextOptions({
                            ...textOptions,
                            stroke: color.value,
                          });
                          activeObject.originText.set("stroke", color.value);
                        }
                        await updateTextToCanvas();
                      }
                    }
                  }}
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    backgroundColor: color.value,
                    border: `2px solid ${
                      (colorPickerType === "fill" &&
                        textOptions.fill === color.value) ||
                      (colorPickerType === "outline" &&
                        textOptions.stroke === color.value)
                        ? "#007bff"
                        : "#ccc"
                    }`,
                    borderRadius: 8,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 8,
                    transition: "transform 0.2s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  {/* <span style={{
                          color: color.value === "#FFFFFF" ? "#000" : "#fff",
                          fontSize: 12,
                          fontWeight: "600",
                          textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                        }}>
                          {color.name}
                        </span> */}
                </button>
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: "32px 0",
                textAlign: "center",
                color: "#666",
                fontSize: 16,
              }}
            >
              Select an outline thickness to choose a color
            </div>
          )}
          <div style={{ display: "flex", gap: 16 }}>
            {colorPickerType === "outline" && (
              <button
                onClick={async () => {
                  const canvas = window.fabricCanvas;
                  if (canvas) {
                    const activeObject = canvas.getActiveObject();
                    if (activeObject && activeObject.originType === "text") {
                      setTextOptions({ ...textOptions, stroke: null });
                      setTextOptions({ ...textOptions, strokeWidth: 0 });
                      activeObject.originText.set("strokeWidth", 0);
                      activeObject.originText.set("stroke", null);
                      await updateTextToCanvas();
                    }
                  }
                  setTextPage(2);
                  setColorPickerType(null);
                }}
                style={{
                  padding: "10px 16px",
                  backgroundColor: "#f5f5f5",
                  color: "#333",
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  cursor: "pointer",
                  flex: 1,
                  fontWeight: 600,
                }}
              >
                Remove Outline
              </button>
            )}

            <button
              onClick={async () => {
                setTextPage(2);
                setColorPickerType(null);
              }}
              style={{
                padding: "10px 16px",
                backgroundColor: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                flex: 1,
                fontWeight: 600,
              }}
            >
              Done
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Text;
