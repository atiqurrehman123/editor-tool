import React, { useState, useEffect } from "react";
import ToolBar from "./ToolBar";
import { loadCliparts } from "../common/functions";
import {
  SectionContainer,
  SectionHeader,
  SectionLabel,
  ColorSwatches,
} from "./Styles";
import ChangeColor from "./ChangeColor";

// Categorized cliparts: emojis, SVGs, and image URLs
const CLIPARTS = [];

const ClipArt = ({
  onSelect,
  textPage,
  setTextPage,
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
  selectedColorIndex,
  setSelectedColorIndex,
  replacedColors,
  setReplacedColors,
  extractedColors,
  setExtractedColors,
  colorPickerType,
  setColorPickerType,
  onColorChange,
  resetToOriginal,
  onResetToOriginal,
}) => {
  const [selected, setSelected] = useState(null);
  const [clipartGroups, setClipartGroups] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    const svgGroups = loadCliparts();
    setClipartGroups(svgGroups);
  }, []);

  const handleSelect = (clipart) => {
    setSelected(clipart);

    if (onSelect) {
      onSelect(clipart); // pass the SVG file path, no fetch
    }
  };

  return (
    <>
      {textPage === 1 ? (
        <>
          {!selectedCategory ? (
            // Show list of categories
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: 20,
              }}
            >
              {clipartGroups.map((cat, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    cursor: "pointer",
                    padding: "16px",
                    borderRadius: "16px",
                    backgroundColor: "#f4f4f4",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                    transition: "all 0.2s ease-in-out",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#0066cc")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f4f4f4")
                  }
                >
                  <div style={{ marginBottom: 10 }}>
                    <img
                      src={cat.preview}
                      alt={`${cat.category} preview`}
                      style={{ width: 48, height: 48 }}
                    />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>
                    {cat.category}
                  </div>
                </div>
              ))}
            </div>
          ) : !selectedGroup ? (
            // Show list of groups in selected category
            <div>
              <div style={{ marginBottom: 24 }}>
                <button
                  onClick={() => setSelectedCategory(null)}
                  style={backButtonStyle}
                >
                  ←
                </button>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>
                {selectedCategory.category}
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
                {selectedCategory.groups.map((grp, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedGroup(grp)}
                    style={{
                      cursor: "pointer",
                      padding: "16px 20px",
                      borderRadius: "12px",
                      backgroundColor: "#f4f4f4",
                      boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
                      fontSize: 16,
                      fontWeight: 500,
                      minWidth: 100,
                      textAlign: "center",
                      transition: "all 0.2s ease-in-out",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#0066cc")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f4f4f4")
                    }
                  >
                    {grp.group}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Show SVGs in selected group
            <div>
              <div style={{ marginBottom: 16 }}>
                <button
                  onClick={() => setSelectedGroup(null)}
                  style={backButtonStyle}
                >
                  ←
                </button>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
                {selectedCategory.category} / {selectedGroup.group}
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {selectedGroup.items.map((clipart, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(clipart)}
                    style={{
                      width: 60,
                      height: 60,
                      border:
                        selected === clipart
                          ? "2px solid #0066cc"
                          : "1px solid #f4f4f4",
                      borderRadius: 12,
                      background: selected === clipart ? "#eff6ff" : "#f4f4f4",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 10,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow:
                        selected === clipart
                          ? "0 0 0 2px #0066cc"
                          : "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                  >
                    <img
                      src={clipart}
                      alt="clipart"
                      style={{ width: 28, height: 28 }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
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
            <h3 style={{ margin: 0 }}>Image</h3>
          </div>

          {/* Edit Colors Section */}
          <SectionContainer>
            <SectionHeader>
              <SectionLabel>Edit Colors</SectionLabel>
              <ColorSwatches>
                {replacedColors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedColorIndex(index);
                      setColorPickerType("clipart");
                      setTextPage(3);
                    }}
                    style={{
                      width: "25px",
                      aspectRatio: "1",
                      backgroundColor: color,
                      border: `2px solid ${
                        selectedColorIndex === index ? "#0066cc" : "#f4f4f4"
                      }`,
                      borderRadius: 3,
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
                  />
                ))}
              </ColorSwatches>
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
        <ChangeColor
          setTextPage={setTextPage}
          extractedColors={extractedColors}
          setExtractedColors={setExtractedColors}
          replacedColors={replacedColors}
          setReplacedColors={setReplacedColors}
          colorPickerType={colorPickerType}
          setColorPickerType={setColorPickerType}
          onColorChange={onColorChange}
          selectedColorIndex={selectedColorIndex}
          setSelectedColorIndex={setSelectedColorIndex}
        />
      )}
    </>
  );
};

const backButtonStyle = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "none",
  backgroundColor: "#f4f4f4",
  cursor: "pointer",
  fontWeight: 500,
  fontSize: 14,
  transition: "background-color 0.2s",
};

export default ClipArt;
