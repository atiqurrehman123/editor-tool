import {
  PrimaryButton,
  SectionContainer,
  SectionHeader,
  ColorChangerLabel,
} from "./Styles";
import { predefinedColors } from "../common/functions";

const ChangeColor = ({
  selectedColorIndex,
  setSelectedColorIndex,
  replacedColors,
  extractedColors,
  onColorChange,
  setTextPage,
  colorPickerType,
  setColorPickerType,
}) => {
  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h3 style={{ margin: 0 }}>Change Color</h3>
      </div>

      {/* Choose which color to change section */}
      <SectionContainer>
        <SectionHeader>
          <ColorChangerLabel>Choose which color to change</ColorChangerLabel>
        </SectionHeader>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(8, 1fr)",
            gap: 12,
            marginBottom: 24,
          }}
        >
          {replacedColors.map((color, index) => (
            <button
              key={index}
              onClick={() => setSelectedColorIndex(index)}
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "1",
                backgroundColor: color,
                
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
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {color === "transparent" && (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium pigment-colorswatch-noink css-10dohqv"
                  focusable="false"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M16.1951 11.5644L12.5119 5.32599C12.2554 4.89134 11.6267 4.89134 11.3702 5.32599L7.687 11.5658C7.68145 11.5804 7.67452 11.5949 7.6662 11.6095C7.23085 12.3734 7 13.2414 7 14.119C7 16.8864 9.21766 19.138 11.9414 19.1387C14.6658 19.138 16.8828 16.8871 16.8828 14.119C16.8828 13.2414 16.6526 12.3734 16.2159 11.6095C16.2076 11.5949 16.2006 11.5804 16.1951 11.5644Z"
                    fill="#C6C6C6"
                  ></path>
                  <mask
                    id="path-2-outside-1_8827_19178"
                    maskUnits="userSpaceOnUse"
                    x="3"
                    y="6.13318"
                    width="19.1865"
                    height="12.2321"
                    fill=""
                  >
                    <rect
                      fill="white"
                      x="3"
                      y="6.13318"
                      width="19.1865"
                      height="12.2321"
                    ></rect>
                    <path d="M3 7.86523L3.5 6.99921L21.3452 17.3022L20.8452 18.1682L3 7.86523Z"></path>
                  </mask>
                  <path
                    d="M3 7.86523L3.5 6.99921L21.3452 17.3022L20.8452 18.1682L3 7.86523Z"
                    fill="#C6C6C6"
                  ></path>
                  <path
                    d="M3 7.86523L20.8452 18.1682L21.8452 16.4361L4 6.13318L3 7.86523Z"
                    fill="lightgray"
                    mask="url(#path-2-outside-1_8827_19178)"
                  ></path>
                </svg>
              )}
              <>
                {color !== extractedColors[index] && (
                  <div
                    style={{
                      position: "absolute",
                      top: -5,
                      left: -5,
                      width: 15,
                      height: 15,
                      borderRadius: "0%",
                      backgroundColor: extractedColors[index],
                      border: "1px solid #aaa",
                    }}
                  />
                )}
              </>
            </button>
          ))}
        </div>
      </SectionContainer>

      {/* Divider */}
      <div
        style={{
          height: 1,
          backgroundColor: "#eee",
          margin: "24px 0",
        }}
      />

      {/* Choose a new color section */}
      <SectionContainer>
        <SectionHeader>
          <ColorChangerLabel>Choose a new color</ColorChangerLabel>
        </SectionHeader>
        {selectedColorIndex !== null && (
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 14, color: "#666" }}>
              Selected color:{" "}
              {predefinedColors.find(
                (c) => c.value === replacedColors[selectedColorIndex]
              )?.name || "Custom"}
            </span>
          </div>
        )}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(8, 1fr)",
            gap: 12,
          }}
        >
          {predefinedColors.map((color) => (
            <button
              key={color.value}
              onClick={() => {
                if (selectedColorIndex !== null) {
                  const newColors = [...replacedColors];
                  newColors[selectedColorIndex] = color.value;
                  onColorChange(extractedColors, newColors);

                  const canvas = window.fabricCanvas;
                  if (canvas) {
                    const activeObject = canvas.getActiveObject();
                    activeObject.replacedColors = newColors;
                  }
                }
              }}
              style={{
                width: "100%",
                aspectRatio: "1",
                backgroundColor:
                  color.value === "transparent" ? "#fff" : color.value,
                border: `2px solid ${
                  selectedColorIndex !== null &&
                  extractedColors[selectedColorIndex] === color.value
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
                position: "relative",
                overflow: "hidden",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {color.value === "transparent" && (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium pigment-colorswatch-noink css-10dohqv"
                  focusable="false"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M16.1951 11.5644L12.5119 5.32599C12.2554 4.89134 11.6267 4.89134 11.3702 5.32599L7.687 11.5658C7.68145 11.5804 7.67452 11.5949 7.6662 11.6095C7.23085 12.3734 7 13.2414 7 14.119C7 16.8864 9.21766 19.138 11.9414 19.1387C14.6658 19.138 16.8828 16.8871 16.8828 14.119C16.8828 13.2414 16.6526 12.3734 16.2159 11.6095C16.2076 11.5949 16.2006 11.5804 16.1951 11.5644Z"
                    fill="#C6C6C6"
                  ></path>
                  <mask
                    id="path-2-outside-1_8827_19178"
                    maskUnits="userSpaceOnUse"
                    x="3"
                    y="6.13318"
                    width="19.1865"
                    height="12.2321"
                    fill=""
                  >
                    <rect
                      fill="white"
                      x="3"
                      y="6.13318"
                      width="19.1865"
                      height="12.2321"
                    ></rect>
                    <path d="M3 7.86523L3.5 6.99921L21.3452 17.3022L20.8452 18.1682L3 7.86523Z"></path>
                  </mask>
                  <path
                    d="M3 7.86523L3.5 6.99921L21.3452 17.3022L20.8452 18.1682L3 7.86523Z"
                    fill="#C6C6C6"
                  ></path>
                  <path
                    d="M3 7.86523L20.8452 18.1682L21.8452 16.4361L4 6.13318L3 7.86523Z"
                    fill="lightgray"
                    mask="url(#path-2-outside-1_8827_19178)"
                  ></path>
                </svg>
              )}
              {selectedColorIndex !== null &&
                color.value === replacedColors[selectedColorIndex] && (
                  <>
                    <div
                      style={{
                        width: 15,
                        height: 15,
                        backgroundColor: color.value,
                        borderRadius: 4,
                        position: "absolute",
                        top: -1,
                        left: -1,
                        zIndex: 2,
                      }}
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium pigment-colorswatch-check css-1g5ncnc"
                        focusable="false"
                        aria-hidden="true"
                        data-testid={`CheckIcon-${color.value}`}
                      >
                        {color.value === "transparent" ? (
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M8.5 16.2322L3.88388 11.6161C3.39573 11.128 2.60427 11.128 2.11612 11.6161C1.62796 12.1043 1.62796 12.8957 2.11612 13.3839L7.61612 18.8839C8.10427 19.372 8.89573 19.372 9.38388 18.8839L21.8839 6.38388C22.372 5.89573 22.372 5.10427 21.8839 4.61612C21.3957 4.12796 20.6043 4.12796 20.1161 4.61612L8.5 16.2322Z"
                            fill="#000"
                          />
                        ) : (
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M8.5 16.2322L3.88388 11.6161C3.39573 11.128 2.60427 11.128 2.11612 11.6161C1.62796 12.1043 1.62796 12.8957 2.11612 13.3839L7.61612 18.8839C8.10427 19.372 8.89573 19.372 9.38388 18.8839L21.8839 6.38388C22.372 5.89573 22.372 5.10427 21.8839 4.61612C21.3957 4.12796 20.6043 4.12796 20.1161 4.61612L8.5 16.2322Z"
                            fill="#fff"
                          />
                        )}
                      </svg>
                    </div>
                  </>
                )}
            </button>
          ))}
        </div>
      </SectionContainer>

      {/* Done button */}
      <div
        style={{
          marginTop: "auto",
          paddingTop: 16,
          borderTop: "1px solid #eee",
        }}
      >
        <PrimaryButton
          onClick={() => {
            setColorPickerType(null);
            setTextPage(2)
          }}
          style={{
            width: "100%",
          }}
        >
          Done
        </PrimaryButton>
      </div>
    </>
  );
};

export default ChangeColor;
