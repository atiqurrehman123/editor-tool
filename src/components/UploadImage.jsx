import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import {
  SectionContainer,
  SectionHeader,
  SectionLabel,
  ColorSwatches,
} from "./Styles";
import Switch from "react-switch";
import ToolBar from "./ToolBar";
import ChangeColor from "./ChangeColor";

const UploadImage = ({
  onUpload,
  textPage,
  setTextPage,
  extractedColors,
  setExtractedColors,
  replacedColors,
  setReplacedColors,
  colorPickerType,
  setColorPickerType,
  onColorChange,
  selectedColorIndex,
  setSelectedColorIndex,
  onRemoveBackground,
  removeBackground,
  setRemoveBackground,
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
  resetToOriginal,
  onResetToOriginal,
  setShowTermsDialog,
  isTermsAccepted,
}) => {
  return (
    <>
      {textPage === 1 ? (
        <>
          <div
            style={{
              border: "2px dashed #ccc",
              borderRadius: 8,
              padding: 20,
              textAlign: "center",
              backgroundColor: "#fafafa",
              marginBottom: 16,
              position: "relative",
              transition: "all 0.2s ease",
              cursor: isTermsAccepted ? "pointer" : "not-allowed",
              marginTop: "10px",
              opacity: isTermsAccepted ? 1 : 0.6,
            }}
            onClick={() => {
              if (!isTermsAccepted) return;
              const fileInput = document.getElementById("file-upload");
              fileInput?.click();
            }}
            onDragOver={(e) => {
              if (!isTermsAccepted) return;
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.style.borderColor = "#007bff";
              e.currentTarget.style.backgroundColor = "#f0f7ff";
            }}
            onDragLeave={(e) => {
              if (!isTermsAccepted) return;
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.style.borderColor = "#ccc";
              e.currentTarget.style.backgroundColor = "#fafafa";
            }}
            onDrop={(e) => {
              if (!isTermsAccepted) return;
              e.preventDefault();
              e.stopPropagation();
              e.currentTarget.style.borderColor = "#ccc";
              e.currentTarget.style.backgroundColor = "#fafafa";

              const file = e.dataTransfer.files[0];
              if (file && file.type.startsWith("image/")) {
                const event = { target: { files: [file] } };
                onUpload(event);
              }
            }}
            
          >

            <div>
              <FontAwesomeIcon
                icon={faUpload}
                style={{
                  fontSize: 48,
                  color: "#666",
                  marginBottom: 16,
                }}
              />
              <h3 style={{ margin: "0 0 8px 0", color: "#333" }}>
                Drag & Drop Your Image Here
              </h3>
              <p style={{ margin: 0, color: "#666" }}>
                or click to browse your computer
              </p>
              <p
                style={{
                  margin: "8px 0 0 0",
                  fontSize: 12,
                  color: "#999",
                }}
              >
                Supports JPG, PNG, GIF (max 10MB)
              </p>
            </div>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={onUpload}
              style={{
                display: "none",
              }}
            />
          </div>

          {/* Additional Info Section */}
          <div style={{ fontSize: 14, color: "green", marginBottom: 12 }}>
            <p style={{ margin: "8px 0" }}>
              Please call our Graphic Design team and send us an email(
              <a href="mailto:help@plaquita.com" style={{ color: "#007bff" }}>
                help@plaquita.com
              </a>
              ) with your file if you're having trouble uploading your art
              because it's not a supported format.
            </p>
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
                      setColorPickerType("upload");
                      setTextPage(3);
                    }}
                    style={{
                      width: "25px",
                      aspectRatio: "1",
                      backgroundColor: color,
                      border: `2px solid ${
                        selectedColorIndex === index ? "#007bff" : "#ccc"
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

          {/* Remove Background Section */}
          {/* <SectionContainer>
            <SectionHeader>
              <SectionLabel>Remove Background</SectionLabel>
              <Switch
                checked={removeBackground ?? false}
                onChange={(checked) => {
                  setRemoveBackground(checked);
                  onRemoveBackground(checked);
                }}
                handleDiameter={20}
                offColor="#ccc"
                onColor="#007bff"
                offHandleColor="#fff"
                onHandleColor="#fff"
                height={24}
                width={48}
                activeBoxShadow="0 0 2px 3px #007bff"
                uncheckedIcon={false}
                checkedIcon={false}
              />
            </SectionHeader>
          </SectionContainer> */}

          {/* Action Buttons */}
          <div
            style={{
              marginTop: "auto",
              paddingTop: 16,
              borderTop: "1px solid #eee",
              paddingBottom: 16,
              borderBottom: "1px solid #eee",
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
      ) : textPage === 3 ? (
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
      ) : null}
    </>
  );
};

export default UploadImage;
