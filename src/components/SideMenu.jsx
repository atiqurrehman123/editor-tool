import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faFont,
  faImage,
  faTimes,
  faBox,
  faFileSignature,
} from "@fortawesome/free-solid-svg-icons";
import {
  PrimaryButton,
  SectionContainer,
  SectionHeader,
  SectionLabel,
  TabBarButton,
  TabContent,
  PageContent,
} from "./Styles";
import ClipArt from "./ClipArt";
import UploadImage from "./UploadImage";
import Numbers from "./Numbers";
import Text from "./Text";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";

const icons = {
  upload: <FontAwesomeIcon icon={faUpload} style={{ fontSize: 24 }} />,
  text: <FontAwesomeIcon icon={faFont} style={{ fontSize: 24 }} />,
  art: <FontAwesomeIcon icon={faImage} style={{ fontSize: 24 }} />,
  numbers: <FontAwesomeIcon icon={faFileSignature} style={{ fontSize: 24 }} />,
  product: <FontAwesomeIcon icon={faBox} style={{ fontSize: 24 }} />,
  close: <FontAwesomeIcon icon={faTimes} style={{ fontSize: 24 }} />,
};

const SideMenu = ({
  onUpload,
  activeTab,
  setActiveTab,
  textPage,
  setTextPage,
  textInput,
  setTextInput,
  textOptions,
  setTextOptions,
  addTextToCanvas,
  updateTextToCanvas,
  isAddTextEnabled,
  extractedColors,
  setExtractedColors,
  replacedColors,
  setReplacedColors,
  colorPickerType,
  setColorPickerType,
  onColorChange,
  selectedColorIndex,
  setSelectedColorIndex,
  applyTransformControls,
  applyTextShape,
  onRemoveBackground,
  duplicateObject,
  deleteText,
  onClipArtSelect,
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
  sideNames,
  setSideNames,
  sideNumbers,
  setSideNumbers,
  heightNames,
  setHeightNames,
  heightNumbers,
  setHeightNumbers,
  colorNames,
  setColorNames,
  colorNumbers,
  setColorNumbers,
  isAddNames,
  setIsAddNames,
  isAddNumbers,
  setIsAddNumbers,
  isMobile,
  sidebarVisible,
  setSidebarVisible,
  onEnterNamesNumbers,
  setShowTermsDialog,
  isTermsAccepted,
  resetToOriginal,
  setResetToOriginal,
  onResetToOriginal,
}) => {
  const [removeBackground, setRemoveBackground] = useState(false);

  const [shapePage, setShapePage] = useState(false); // New state for shape selection page

  // Update text input when switching pages
  useEffect(() => {
    if (textPage === 1) {
      setTextInput(""); // Clear text input when on page 1
    } else {
      // On page 2, update text input with selected object's text
      const canvas = window.fabricCanvas;
      if (canvas) {
        const activeObject = canvas.getActiveObject();
        if (activeObject && activeObject.originType === "text") {
          setTextInput(activeObject.originText.text || "");
        }
      }
    }
  }, [textPage]);

  return (
    <div id="layout" style={{ display: "flex", height: "100vh" }}>
      {!isMobile && (
        <div
          style={{
            width: 60,
            background: "#fff",
            borderRight: "1px solid #ddd",
            zIndex: 1001,
          }}
        >
          {['text', 'upload', 'art', 'numbers'].map((tab) => (
            <TabBarButton
              key={tab}
              $active={activeTab === tab}
              onClick={() => {
                setActiveTab(tab);
                if(tab === "upload" && !isTermsAccepted)
                  setShowTermsDialog(true);
                const canvas = window.fabricCanvas;
                canvas?.discardActiveObject();
                canvas?.requestRenderAll();
              }}
            >
              <FontAwesomeIcon icon={icons[tab].props.icon} className="icon" />
              <span className="label">
                {tab === "product"
                  ? "Product"
                  : tab === "text"
                  ? "Text"
                  : tab === "upload"
                  ? "Upload"
                  : tab === "art"
                  ? "ClipArt"
                  : "Names & Numbers"}
              </span>
            </TabBarButton>
          ))}
        </div>
      )}
      {/* Tab contents */}
      {!isMobile || (isMobile && sidebarVisible) ? (
        <div
          style={{
            position: isMobile ? "absolute" : "relative",
            width: isMobile ? "100%" : 350,
            top: 0,
            bottom: 0,
            backgroundColor: "#fff",
            zIndex: 1000,
            boxShadow: isMobile ? "2px 0 10px rgba(0,0,0,0.2)" : "none",
            overflowY: "auto",
            transition: "transform 0.3s ease, opacity 0.3s ease",
            transform:
              sidebarVisible || !isMobile
                ? "translateX(0)"
                : "translateX(-100%)",
            opacity: sidebarVisible || !isMobile ? 1 : 0,
            pointerEvents: sidebarVisible || !isMobile ? "auto" : "none",
            ...(isMobile ? {} : { minWidth: 200, maxWidth: 350 }),
          }}
        >
          {isMobile && (
            <button
              onClick={() => setSidebarVisible(false)}
              style={{
                position: "absolute",
                top: -1,
                right: 4,
                zIndex: 1001,
                backgroundColor: "#fff", // matches parent
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "20px",
                width: "25px",
                height: "25px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 1px 1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <MdKeyboardDoubleArrowDown />
            </button>
          )}

          <TabContent>
            {activeTab === "upload" && (
              <PageContent>
                <UploadImage
                  onUpload={onUpload}
                  textPage={textPage}
                  setTextPage={setTextPage}
                  colorPickerType={colorPickerType}
                  setColorPickerType={setColorPickerType}
                  extractedColors={extractedColors}
                  setExtractedColors={setExtractedColors}
                  replacedColors={replacedColors}
                  setReplacedColors={setReplacedColors}
                  onColorChange={onColorChange}
                  selectedColorIndex={selectedColorIndex}
                  setSelectedColorIndex={setSelectedColorIndex}
                  onRemoveBackground={onRemoveBackground}
                  removeBackground={removeBackground}
                  setRemoveBackground={setRemoveBackground}
                  onCenter={onCenter}
                  onBringToFront={onBringToFront}
                  onSendToBack={onSendToBack}
                  onFlipHorizontal={onFlipHorizontal}
                  onFlipVertical={onFlipVertical}
                  onDuplicate={onDuplicate}
                  onRemove={onRemove}
                  centerObject={centerObject}
                  flipHorizontal={flipHorizontal}
                  flipVertical={flipVertical}
                  bringToFront={bringToFront}
                  sendToBack={sendToBack}
                  setCenterObject={setCenterObject}
                  setFlipHorizontal={setFlipHorizontal}
                  setFlipVertical={setFlipVertical}
                  setBringToFront={setBringToFront}
                  setSendToBack={setSendToBack}
                  resetToOriginal={resetToOriginal}
                  setResetToOriginal={setResetToOriginal}
                  onResetToOriginal={onResetToOriginal}
                  isTermsAccepted={isTermsAccepted}
                />
              </PageContent>
            )}

            {activeTab === "text" && (
              <PageContent>
                <Text
                  isAddTextEnabled={isAddTextEnabled}
                  textPage={textPage}
                  setTextPage={setTextPage}
                  addTextToCanvas={addTextToCanvas}
                  textInput={textInput}
                  setTextInput={setTextInput}
                  onCenter={onCenter}
                  onBringToFront={onBringToFront}
                  onSendToBack={onSendToBack}
                  onFlipHorizontal={onFlipHorizontal}
                  onFlipVertical={onFlipVertical}
                  onDuplicate={onDuplicate}
                  onRemove={onRemove}
                  centerObject={centerObject}
                  setCenterObject={setCenterObject}
                  flipHorizontal={flipHorizontal}
                  setFlipHorizontal={setFlipHorizontal}
                  flipVertical={flipVertical}
                  setFlipVertical={setFlipVertical}
                  bringToFront={bringToFront}
                  setBringToFront={setBringToFront}
                  sendToBack={sendToBack}
                  setSendToBack={setSendToBack}
                  updateTextToCanvas={updateTextToCanvas}
                  textOptions={textOptions}
                  setTextOptions={setTextOptions}
                  colorPickerType={colorPickerType}
                  setColorPickerType={setColorPickerType}
                  setShapePage={setShapePage}
                  resetToOriginal={resetToOriginal}
                  setResetToOriginal={setResetToOriginal}
                  onResetToOriginal={onResetToOriginal}
                />
              </PageContent>
            )}

            {activeTab === "art" && (
              <PageContent>
                <ClipArt
                  onSelect={onClipArtSelect}
                  textPage={textPage}
                  setTextPage={setTextPage}
                  onCenter={onCenter}
                  onBringToFront={onBringToFront}
                  onSendToBack={onSendToBack}
                  onFlipHorizontal={onFlipHorizontal}
                  onFlipVertical={onFlipVertical}
                  onDuplicate={onDuplicate}
                  onRemove={onRemove}
                  centerObject={centerObject}
                  flipHorizontal={flipHorizontal}
                  flipVertical={flipVertical}
                  bringToFront={bringToFront}
                  sendToBack={sendToBack}
                  setCenterObject={setCenterObject}
                  setFlipHorizontal={setFlipHorizontal}
                  setFlipVertical={setFlipVertical}
                  setBringToFront={setBringToFront}
                  setSendToBack={setSendToBack}
                  selectedColorIndex={selectedColorIndex}
                  setSelectedColorIndex={setSelectedColorIndex}
                  replacedColors={replacedColors}
                  setReplacedColors={setReplacedColors}
                  extractedColors={extractedColors}
                  setExtractedColors={setExtractedColors}
                  colorPickerType={colorPickerType}
                  setColorPickerType={setColorPickerType}
                  onColorChange={onColorChange}
                  resetToOriginal={resetToOriginal}
                  setResetToOriginal={setResetToOriginal}
                  onResetToOriginal={onResetToOriginal}
                />
              </PageContent>
            )}

            {activeTab === "numbers" && (
              <PageContent>
                <Numbers
                  textPage={textPage}
                  setTextPage={setTextPage}
                  colorPickerType={colorPickerType}
                  setColorPickerType={setColorPickerType}
                  sideNames={sideNames}
                  setSideNames={setSideNames}
                  sideNumbers={sideNumbers}
                  setSideNumbers={setSideNumbers}
                  heightNames={heightNames}
                  setHeightNames={setHeightNames}
                  heightNumbers={heightNumbers}
                  setHeightNumbers={setHeightNumbers}
                  colorNames={colorNames}
                  setColorNames={setColorNames}
                  colorNumbers={colorNumbers}
                  setColorNumbers={setColorNumbers}
                  isAddNames={isAddNames}
                  setIsAddNames={setIsAddNames}
                  isAddNumbers={isAddNumbers}
                  setIsAddNumbers={setIsAddNumbers}
                  onEnterNamesNumbers={onEnterNamesNumbers}
                />
              </PageContent>
            )}

            {activeTab === "product" && (
              <PageContent>
                <SectionContainer>
                  <SectionHeader>
                    <SectionLabel>Product Selection</SectionLabel>
                  </SectionHeader>
                  <div style={{ padding: "16px 0" }}>
                    <div
                      style={{
                        border: "2px dashed #ccc",
                        borderRadius: 8,
                        padding: 32,
                        textAlign: "center",
                        backgroundColor: "#fafafa",
                        marginBottom: 16,
                        position: "relative",
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        // Add product selection functionality here
                      }}
                    >
                      <div style={{ marginBottom: 16 }}>
                        <FontAwesomeIcon
                          icon={faBox}
                          style={{
                            fontSize: 48,
                            color: "#666",
                            marginBottom: 16,
                          }}
                        />
                        <h3 style={{ margin: "0 0 8px 0", color: "#333" }}>
                          Select Your Product
                        </h3>
                        <p style={{ margin: 0, color: "#666" }}>
                          Choose from our product catalog
                        </p>
                      </div>
                    </div>

                    <SectionContainer>
                      <SectionHeader>
                        <SectionLabel>Product Categories</SectionLabel>
                      </SectionHeader>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(2, 1fr)",
                          gap: "12px",
                          padding: "16px 0",
                        }}
                      >
                        {["T-Shirts"].map((category) => (
                          <PrimaryButton
                            key={category}
                            onClick={() => {
                              // Add category selection functionality here
                            }}
                            style={{ width: "100%" }}
                          >
                            {category}
                          </PrimaryButton>
                        ))}
                      </div>
                    </SectionContainer>

                    <SectionContainer>
                      <SectionHeader>
                        <SectionLabel>Recent Products</SectionLabel>
                      </SectionHeader>
                      <div
                        style={{
                          border: "1px solid #ddd",
                          borderRadius: 8,
                          padding: 16,
                          backgroundColor: "#fff",
                          marginTop: 8,
                        }}
                      >
                        <p style={{ color: "#666", textAlign: "center" }}>
                          No recent products
                        </p>
                      </div>
                    </SectionContainer>
                  </div>
                </SectionContainer>
              </PageContent>
            )}

            {shapePage && (
              <div
                id="shape-picker-overlay"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "white",
                  zIndex: 1000,
                  padding: 16,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 16,
                  }}
                >
                  <h3 style={{ margin: 0 }}>Select Text Shape</h3>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 4,
                    padding: "0 0",
                  }}
                >
                  {[
                    {
                      name: "Normal",
                      value: "normal",
                      preview: (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg
                            viewBox="0 0 176.76 31.19"
                            width="84"
                            height="27"
                          >
                            <g fill="#4A4A4A">
                              <path d="M17.92,14.6c0,1.9.34,5.15.34,5.15h-.09a54.72,54.72,0,0,0-2.51-5.15L7.4.51H0V30.68H7.31V16.63c0-1.9-.34-5.15-.34-5.15h.09a53.41,53.41,0,0,0,2.51,5.15l8.32,14.05h7.35V.51H17.92Z"></path>
                              <path d="M44.78,0A15.18,15.18,0,0,0,29.15,15.41,15.37,15.37,0,0,0,44.78,31.19,15.37,15.37,0,0,0,60.41,15.41,15.19,15.19,0,0,0,44.78,0Zm0,24.44c-4.47,0-8.07-3.88-8.07-9,0-4.94,3.59-8.65,8.07-8.65s8.06,3.71,8.06,8.65C52.84,20.55,49.25,24.44,44.78,24.44Z"></path>
                              <path d="M81.57,18.32v-.09c3-1.52,4.47-5,4.47-8.23,0-4.39-2.13-7.47-5.52-8.78C79.23.72,77.77.51,74.72.51H64.32V30.68h7.31V20.51h3.43l5.31,10.17h8.15L82.7,20.13A17.16,17.16,0,0,0,81.57,18.32Zm-6.77-4.14H71.63V6.84h2.46c3.68,0,4.51,1.35,4.51,3.63S77.15,14.18,74.81,14.18Z"></path>
                              <path d="M113.15.51l-4.35,12.75c-.67,1.94-1.51,5-1.59,5s-.84-3-1.51-5L101.37.51H93.43L91,30.68h7.35l.92-13.59c.17-2.28,0-5.06.08-5.06s1,3.17,1.67,5.06l3.13,8.74h6.27l3.13-8.74c.67-1.9,1.67-5.06,1.75-5.06a45.57,45.57,0,0,0,0,5.06l.92,13.59h7.31L121.09.51Z"></path>
                              <path d="M136.07.51,125.92,30.68h7.52l1.8-6.33h9.32l1.84,6.33h7.52L143.76.51ZM137,18.44l1.71-5.87c.54-1.9,1.21-5.19,1.21-5.19H140s.67,3.29,1.21,5.19l1.67,5.87Z"></path>
                              <polygon points="164.56 24.36 164.56 0.51 157.25 0.51 157.25 30.68 176.76 30.68 176.76 24.36 164.56 24.36"></polygon>
                            </g>
                          </svg>
                        </div>
                      ),
                    },
                    {
                      name: "Arch",
                      value: "arch",
                      preview: (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg viewBox="0 0 86 27" width="84" height="27">
                            <g fill="#4A4A4A">
                              <path d="M9.63114698,11.8440667 C9.63114698,11.8424363 9.15321085,14.1822264 8.76825206,15.5926226 C8.36208791,17.0519343 7.95755495,18.514507 7.55628435,19.9819712 C8.9395261,19.2091066 10.342342,18.4867881 11.7631009,17.8133851 C11.3601992,16.7617024 10.9589286,15.7132808 10.5592891,14.6713812 C10.1694368,13.6588309 9.69150068,11.813087 9.69150068,11.813087 C9.67192651,11.8228701 9.65072115,11.8326531 9.63114698,11.8440667 M13.0060611,20.9896299 C10.7452438,22.0103328 8.52357486,23.1533244 6.35247253,24.4202351 C5.93489011,26.003466 5.51730769,27.593219 5.10298764,29.1878634 C3.36741072,30.2476986 1.66445742,31.3890597 0.000652472527,32.610316 C2.24678915,24.5735036 4.56306662,16.6818072 6.9396978,8.93685712 C8.73725961,7.91126267 10.5690762,6.96719402 12.4286229,6.10954271 C14.8851821,11.3630646 17.3906765,16.7649635 19.9304259,22.3119783 C18.0480426,22.9348352 16.1868647,23.6375876 14.3485233,24.4218657 C13.8999485,23.2723521 13.4530048,22.1293605 13.0060611,20.9896299"></path>
                              <path d="M30.487105,9.20719663 C32.2960852,8.90392069 33.4330186,7.94354688 33.4330186,6.41412306 C33.4346497,4.97926915 32.7789149,4.15585867 29.937397,4.63849135 C29.3028675,4.75099694 28.6699691,4.87165512 28.0387019,5.00046586 L28.0387019,9.66537157 C28.8526614,9.49742844 29.6682521,9.34579048 30.487105,9.20719663 L30.487105,9.20719663 L30.487105,9.20719663 Z M22.4551683,2.36229129 C25.0813702,1.5992099 27.7418269,0.989396988 30.4218578,0.53448308 C32.780546,0.143159287 33.9207418,0.162725477 34.9255494,0.369800984 C37.5615385,0.929067903 39.2269746,2.84329345 39.2269746,5.62495342 C39.2269746,7.66798971 38.0508929,9.916471 35.7395089,11.0920729 L35.7395089,11.1475104 C35.7395089,11.1475104 36.064114,11.4638305 36.6187157,12.2220203 C38.1275584,14.3319078 39.6396634,16.4923413 41.1517685,18.7000597 C39.0296016,18.7359309 36.909066,18.8680028 34.7966861,19.0946444 C33.4216003,17.08911 32.0481457,15.1227079 30.6812156,13.1954383 C29.7971154,13.3421847 28.9162775,13.5052363 28.0387019,13.6862235 L28.0387019,20.1463271 C26.1644746,20.5311288 24.3016655,20.9909343 22.4551683,21.5273741 L22.4551683,2.36229129 L22.4551683,2.36229129 Z"></path>
                              <path d="M54.2374314,0.184737441 C59.9530907,1.17935208 62.8027644,4.9164943 62.807658,4.87573141 C61.9545502,5.80186438 61.09818,6.74430251 60.2385474,7.7030458 C60.2385474,7.70630684 57.6939045,5.06161021 54.4967892,4.51864844 C50.0681318,3.78654685 47.9378091,6.43613502 47.9410714,9.17214055 C47.9394403,12.0369569 50.2296189,15.0371059 54.4967892,15.7480108 C57.9842548,16.3447795 60.5876202,14.7175248 60.5892514,14.7093722 C61.5434925,16.1034633 62.49284,17.5187509 63.4389251,18.9536049 C63.4340316,18.9943678 60.2776958,21.0455566 54.2374314,19.993874 C46.9900927,18.8003364 42.0280392,14.7925285 42.0378262,9.06615701 C42.0296703,3.52240329 47.2837053,-0.979450842 54.2374314,0.184737441"></path>
                              <path d="M66.7653932,3.79584079 C68.5825292,4.45456917 70.3784599,5.18667077 72.1499227,5.99703712 L72.1499227,13.6620919 C74.7810182,14.8654126 77.3566535,16.2366764 79.862148,17.7758833 L79.862148,10.1108285 C81.5487895,11.146206 83.2028074,12.2565873 84.8209392,13.4452333 L84.8209392,32.610316 C83.2028074,31.42167 81.5487895,30.3112887 79.862148,29.2759113 L79.862148,21.770647 C77.3566535,20.2314401 74.7810182,18.8601763 72.1499227,17.6584862 L72.1499227,25.1621199 C70.3784599,24.3533841 68.5825292,23.6196519 66.7653932,22.9609235 L66.7653932,3.79584079 L66.7653932,3.79584079 Z"></path>
                            </g>
                          </svg>
                        </div>
                      ),
                    },
                    {
                      name: "Curve",
                      value: "curve",
                      preview: (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg width="84" height="27" viewBox="0 0 84 27">
                            <g fill="#4A4A4A">
                              <path
                                d="M5.691,9.73047281 C10.2788,7.07256053 13.6402,8.17555175 13.6066,8.15436754 C13.2958,9.36469211 13.0144,10.5750167 12.761,11.7839289 C12.7764,11.7796921 10.0716,11.2712711 7.6272,12.6962623 C4.2532,14.6833412 4.0026,17.6731395 5.264,19.5345254 C6.58,21.4834728 9.3072,22.4381746 12.0904,20.8140518 C14.3724,19.4907447 15.4042,16.8624904 15.4168,16.8511921 C16.4906,17.3850342 17.5392,17.9457096 18.5598,18.5346307 C18.5458,18.5671132 17.3362,21.87185 13.608,24.0227535 C9.1868,26.5973412 4.3386,26.1891921 1.4084,22.5412711 C-1.456,19.0119816 0.0868,13.0394465 5.691,9.73047281"
                                id="Fill-1"
                              ></path>
                              <path
                                d="M15.2495,5.30170175 C16.8231,4.6619386 18.4149,4.07866667 20.0221,3.55329825 C21.0539,6.74505263 22.0661,9.94245614 23.0573,13.1469211 C23.5627,14.741386 24.9459,15.2116754 26.6903,14.7399737 C28.4347,14.2725088 29.4161,13.1652807 29.0801,11.5227982 C28.3871,8.23359649 27.6731,4.94863158 26.9381,1.66931579 C28.5831,1.30777193 30.2379,1.00554386 31.9011,0.761219298 C32.4233,4.08572807 32.9245,7.4130614 33.4033,10.7432193 C33.8597,14.329 31.5077,17.1436754 27.5891,18.1901754 C23.6271,19.2578596 20.2433,17.9924561 18.9035,14.6566491 C17.7051,11.5298596 16.4871,8.41154386 15.2495,5.30170175"
                                id="Fill-3"
                              ></path>
                              <path
                                d="M42.5992,7.24528246 C44.0636,7.26222982 45.0002,6.62387895 45.0394,5.34717719 C45.073,4.15097544 44.5382,3.37280877 42.098,3.35444912 C41.5534,3.35303684 41.0102,3.35727368 40.4684,3.36998421 C40.5174,4.66504561 40.5636,5.9615193 40.607,7.2565807 C41.2706,7.24245789 41.9342,7.23822105 42.5992,7.24528246 M35.2968,0.306747368 C37.6782,0.0864315789 40.0722,-0.0152526316 42.469,0.00169473684 C44.5788,0.0242912281 45.5896,0.205063158 46.4716,0.525650877 C48.7886,1.37019474 50.0794,3.19203684 49.8582,5.49687895 C49.6986,7.19161579 48.5744,8.90612456 46.7306,9.56989649 C46.7292,9.58543158 46.7278,9.59955439 46.7278,9.61508947 C46.7264,9.61508947 46.9686,9.92155439 47.3508,10.629107 C48.3854,12.5879404 49.3178,14.5721947 50.148,16.5719842 C48.6556,16.3559053 47.1604,16.1991421 45.6638,16.1016947 C44.786,14.2459579 43.8186,12.4085807 42.7616,10.5994491 C42.0784,10.5895632 41.3952,10.5923877 40.7134,10.6065105 C40.7652,12.400107 40.8128,14.1965281 40.8534,15.9901246 C39.5122,16.0155456 38.1738,16.0875719 36.841,16.2062035 C36.379,10.9016772 35.8638,5.6028 35.2968,0.306747368"
                                id="Fill-5"
                              ></path>
                              <path
                                d="M51.18316,0.546411404 C53.00876,0.772376316 54.83156,1.06895526 56.64596,1.43756053 C57.36416,4.67168333 57.92416,7.9086307 58.32456,11.1371044 C58.46316,12.2090254 58.41976,13.8147886 58.41976,13.8133763 C58.43516,13.8176132 58.45056,13.8232623 58.46596,13.8274991 C58.46596,13.8274991 59.14216,12.3926219 59.73156,11.5184202 C61.51936,8.88310439 63.42476,6.30992895 65.44496,3.80454298 C67.19496,4.3962886 68.93236,5.05582368 70.65016,5.78597281 C66.53836,9.7897886 62.81436,14.0831219 59.49776,18.606657 C58.13136,18.178736 56.75516,17.8044816 55.37336,17.4810693 C54.52916,11.8277096 53.13336,6.15175351 51.18316,0.546411404"
                                id="Fill-8"
                              ></path>
                              <path
                                d="M72.0986,6.41952193 C76.1908,8.26254825 80.1766,10.5066623 84,13.1575132 C83.4344,14.1079781 82.866,15.0556184 82.2962,16.0018465 C80.0646,14.4511623 77.7756,13.0445307 75.4418,11.7819518 C75.0358,12.6533289 74.6284,13.5218816 74.2196,14.3918465 C76.0116,15.3620833 77.7756,16.4227061 79.5074,17.5708904 C78.9544,18.5270044 78.3986,19.4817061 77.8414,20.4364079 C76.1894,19.3376535 74.5066,18.323636 72.7958,17.3957675 C72.3674,18.2968026 71.9362,19.1964254 71.505,20.094636 C73.6596,21.2668289 75.7708,22.5788377 77.826,24.0320746 C77.2408,24.9670044 76.6528,25.9005219 76.0634,26.8326272 C72.9204,24.6068728 69.6402,22.7299518 66.269,21.1962149 C68.2612,16.2941886 70.2044,11.3681535 72.0986,6.41952193"
                                id="Fill-10"
                              ></path>
                            </g>
                          </svg>
                        </div>
                      ),
                    },
                    {
                      name: "Bridge",
                      value: "bridge",
                      preview: (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg viewBox="0 0 87 27" width="84" height="27">
                            <g fill="#4A4A4A">
                              <path d="M7.68405,18.8922451 C8.91275833,18.4865882 9.538675,17.1954314 9.557175,15.9311078 C9.57875833,14.6683627 9.00834167,13.7528725 7.77038333,14.0401471 C6.91321667,14.2469216 6.05759167,14.4600098 5.20350833,14.6809902 C5.18963333,16.3699118 5.17575833,18.0572549 5.16188333,19.7461765 C5.99900833,19.4510098 6.84075833,19.1668922 7.68405,18.8922451 L7.68405,18.8922451 L7.68405,18.8922451 Z M7.438925,9.52109804 C8.511925,9.34273529 8.992925,8.24730392 9.00834167,7.15818627 C9.02375833,6.10221569 8.57050833,5.24670588 7.4158,5.34456863 C6.70355,5.40928431 5.99284167,5.47557843 5.28213333,5.54502941 C5.2698,6.99245098 5.25746667,8.44145098 5.24513333,9.89045098 C5.97434167,9.76417647 6.70663333,9.64105882 7.438925,9.52109804 L7.438925,9.52109804 L7.438925,9.52109804 Z M0.999383333,0.445117647 C3.16696667,0.427754902 5.33300833,0.411970588 7.50059167,0.397764706 C11.0387167,0.418284314 13.4714667,2.32029412 13.395925,5.95068627 C13.3604667,7.74220588 12.609675,9.64421569 11.2699667,10.8422451 L11.2699667,10.9038039 C13.2648833,11.3315588 13.9586333,13.3424804 13.91855,15.1987157 C13.821425,19.744598 10.6055083,22.4973824 7.21384167,23.9716373 C5.11871667,24.8492451 3.045175,25.8026176 0.999383333,26.8333333 L0.999383333,0.445117647 L0.999383333,0.445117647 Z"></path>
                              <path d="M22.3126167,8.79770294 C23.7032,8.6398598 24.5927417,7.76856569 24.6266583,6.32114412 C24.6590333,4.94948725 24.1826583,4.15553627 22.0027417,4.26444804 C21.515575,4.29128137 21.0284083,4.31811471 20.5412417,4.34652647 C20.5042417,5.90128137 20.4657,7.45761471 20.4287,9.01236961 C21.0561583,8.93818333 21.6836167,8.86715392 22.3126167,8.79770294 M16.3109083,0.34362451 C18.3644083,0.33257549 20.4179083,0.323104902 22.4714083,0.315212745 C24.2767,0.30889902 25.1400333,0.436751961 25.8985333,0.730340196 C27.8842,1.50219314 29.1113667,3.24320294 29.0574083,5.76869314 C29.0188667,7.61861471 28.0769083,9.6910951 26.28395,10.7975755 C26.28395,10.8149382 26.28395,10.8307225 26.2824083,10.8480853 C26.2824083,10.8480853 26.52445,11.1448304 26.9329917,11.8393402 C28.0429917,13.7666049 29.1607,15.6354676 30.2892,17.466448 C28.6488667,17.7063696 27.0147,17.9873304 25.3851583,18.3124873 C24.3722833,16.500448 23.3671167,14.6363206 22.366575,12.7011637 C21.6867,12.8084971 21.0083667,12.9189873 20.3300333,13.0357912 C20.2776167,15.19035 20.2252,17.3449088 20.1727833,19.4994676 C18.7251583,19.8719775 17.2837,20.2776343 15.8514917,20.7180167 C16.0041167,13.9260265 16.1582833,7.13561471 16.3109083,0.34362451"></path>
                              <path d="M32.3585792,0.285064706 C33.8015792,0.281907843 35.2445792,0.27875098 36.6891208,0.277172549 C36.6212875,5.76695686 36.5534542,11.2551627 36.4856208,16.7449471 C35.0056208,16.861751 33.5287042,17.0132804 32.0533292,17.1979569 C32.1550792,11.5598 32.2568292,5.92322157 32.3585792,0.285064706"></path>
                              <path d="M45.1673625,13.0686225 C48.2306542,13.1364951 50.0791125,11.6196225 50.0405708,8.45644608 C50.0004875,5.3232598 48.0672375,3.68011275 45.1319042,3.67064216 C44.5352792,3.66748529 43.9371125,3.66432843 43.3404875,3.66432843 C43.3420292,6.79277941 43.3451125,9.92123039 43.3466542,13.0496814 C43.9540708,13.0512598 44.5599458,13.0575735 45.1673625,13.0686225 M39.0084042,0.273857843 C41.1019875,0.272279412 43.1971125,0.272279412 45.2922375,0.272279412 C50.8514875,0.240710784 54.4697792,3.32654412 54.5715292,8.6837402 C54.6748208,14.0661912 51.0919875,16.6595539 45.3585292,16.4701422 C43.2048208,16.4164755 41.0511125,16.4354167 38.8989458,16.5253873 C38.9344042,11.1082108 38.9714042,5.69103431 39.0084042,0.273857843"></path>
                              <path d="M65.3604208,0.000789215686 C69.8867542,-0.052877451 72.2239208,2.70937745 72.2239208,2.73621078 C71.5594625,3.96580882 70.8950042,5.15752451 70.2320875,6.31609314 C70.2320875,6.30346569 68.3867125,4.33042647 65.8845875,4.21835784 C62.1707125,4.05420098 60.7076708,6.37607353 60.7677958,8.98522059 C60.8417958,12.3330735 63.2437125,14.6754657 66.0048375,15.2358088 C68.0937958,15.6509363 69.5645458,14.5586618 69.5645458,14.5460343 C69.5522125,14.0409363 69.5414208,13.5342598 69.5290875,13.0291618 C68.6965875,12.8760539 67.8625458,12.7324167 67.0285042,12.5950931 C66.9961292,11.2707892 66.9637542,9.94490686 66.9313792,8.61902451 C69.0450042,8.85736765 71.1540042,9.12727941 73.2537542,9.4287598 C73.3385458,13.3606324 73.4233375,17.2909265 73.5065875,21.2212206 C72.3164208,20.8329265 71.1200875,20.4683088 69.9191292,20.1289461 C69.9145042,19.9442696 69.8775042,18.7430833 69.8605458,18.738348 C69.7665042,18.8330539 68.2017125,19.9600539 65.2355458,19.2371324 C60.6660458,18.0848775 56.3462958,14.277701 56.2522542,8.76581863 C56.1674625,3.87268137 59.9769208,0.0812892157 65.3604208,0.000789215686"></path>
                              <path d="M75.7059292,0.366353922 C79.3982208,0.388451961 83.0905125,0.412128431 86.7812625,0.442118627 C86.7812625,2.27625588 86.7828042,4.10881471 86.7843458,5.94453039 C84.5612625,5.70776569 82.3320125,5.48994216 80.0965958,5.28948137 C80.1150958,6.70375588 80.1335958,8.11803039 80.1520958,9.53388333 C81.9265542,9.82115784 83.6948458,10.128952 85.4569708,10.4588441 C85.4631375,12.2503637 85.4693042,14.0403049 85.4754708,15.8302461 C83.7333875,15.3314618 81.9789708,14.8642461 80.2153042,14.4301775 C80.2353458,15.8996971 80.2538458,17.3676382 80.2738875,18.8371578 C82.5802208,19.5853343 84.8665125,20.4045402 87.1265958,21.2979324 L87.1265958,26.8334912 C83.5329708,25.0230304 79.8560958,23.4493343 76.1144708,22.1124029 C75.9788042,14.8626676 75.8431375,7.61451078 75.7059292,0.366353922"></path>
                            </g>
                          </svg>
                        </div>
                      ),
                    },
                    {
                      name: "Valley",
                      value: "valley",
                      preview: (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg
                            viewBox="0 0 163.79 51.07"
                            width="84"
                            height="27"
                          >
                            <g fill="#4A4A4A">
                              <path d="M16.51,32.4c-.58,2.61-1.1,6.83-1.1,6.83h-.09s-.65-4.36-1.31-7.28Q11,18.79,8.17,4.17,4,2.2,0,0C3.59,19,7.45,35.86,11.43,51.07h8.23c3.54-14.07,7-26.65,10.48-38.15q-4.2-1.35-8.36-2.93C20,17.07,18.29,24.52,16.51,32.4Z"></path>
                              <path d="M36.72,43.59q5,.28,10.1.5,1.08,3.53,2.16,7h8.13c-3.87-10.5-7.82-21.52-11.8-33.45q-4.22-.88-8.4-2c-3.38,10.84-6.72,22.53-10.08,35.42H35Q35.85,47.27,36.72,43.59Zm3.37-13.34c.54-2.1,1.17-5.73,1.17-5.73l.09,0s.82,3.88,1.47,6.1,1.32,4.55,2,6.79q-3.2-.28-6.4-.61Q39.24,33.48,40.09,30.24Z"></path>
                              <path d="M82.2,51.07V44.81q-6.64,0-13.28-.09l-.26-23.91q-4.06-.29-8.11-.77l.54,31Z"></path>
                              <path d="M86.69,21.13q-.08,15-.16,29.93h21.11q.07-3.36.14-6.72-6.62.23-13.26.35.15-12,.3-24Q90.76,21,86.69,21.13Z"></path>
                              <path d="M132.94,21.05q.1-4,.19-8a173.45,173.45,0,0,1-20.39,5.15L112,51.07h20.88l.19-8q-6.48.44-13,.76.08-3.26.16-6.52,4.94-.47,9.87-1.07l.19-7.81q-4.92.91-9.88,1.63.08-3.14.16-6.28Q126.79,22.6,132.94,21.05Z"></path>
                              <path d="M151.62,16.81c-1.06,3.44-2,7-2,7l-.09,0s-.84-3.11-1.81-5.76q-1.71-4.66-3.41-9-4.4,1.73-8.87,3.23c3.35,6.44,6.69,13.47,10.07,21.27q-.15,8.73-.3,17.47h7.91q.11-9.42.21-18.83c3.6-9.69,7.11-20.37,10.46-32.23q-4.23,2.3-8.56,4.35Q153.45,10.79,151.62,16.81Z"></path>
                            </g>
                          </svg>
                        </div>
                      ),
                    },
                    {
                      name: "Pinch",
                      value: "pinch",
                      preview: (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg viewBox="0 0 78 26" width="84" height="27">
                            <g fill="#4A4A4A">
                              <path d="M6.51133137,12.4015294 C8.03925294,12.4030392 8.79113529,11.1483922 8.79113529,9.40154902 C8.79113529,7.65470588 8.03925294,6.38043137 6.58682157,6.20680392 C5.84399804,6.12376471 5.10268431,6.03619608 4.36137059,5.94711765 L4.36137059,12.3849216 C5.07701765,12.3909608 5.79417451,12.397 6.51133137,12.4015294 L6.51133137,12.4015294 L6.51133137,12.4015294 Z M-0.000452941176,0 C2.46203725,0.58127451 4.93358627,1.10668627 7.41419412,1.57472549 C10.8942922,2.29490196 13.2646843,5.55456863 13.2631745,9.63405882 C13.2646843,13.7105294 10.8942922,16.8177059 7.41419412,17.1317451 C6.39507647,17.2057255 5.37746863,17.2827255 4.36137059,17.3627451 L4.36137059,24.6973725 C2.9044098,25.0008431 1.45046863,25.3239412 -0.000452941176,25.6666667 L-0.000452941176,0 L-0.000452941176,0 Z"></path>
                              <path d="M15.8855529,2.95589412 C17.356102,3.15669804 18.8281608,3.33938431 20.3032392,3.50093333 L20.3032392,22.1651294 C18.8281608,22.3281882 17.356102,22.5093647 15.8855529,22.7101686 L15.8855529,2.95589412"></path>
                              <path d="M23.900649,3.91582745 C25.3953549,4.04265098 26.8900608,4.14833725 28.3862765,4.23590588 C30.060649,7.01092549 31.7350216,9.6696902 33.4109039,12.2831608 C34.1220216,13.3853176 34.9342961,15.1321608 34.9342961,15.1321608 L34.9841196,15.1321608 C34.9841196,15.1321608 34.7818059,13.3354941 34.7818059,12.2846706 L34.7818059,4.48502353 C36.2629235,4.51521961 37.7440412,4.52578824 39.2251588,4.51521961 L39.2251588,21.1502392 C37.7349824,21.1411804 36.2463157,21.151749 34.7561392,21.1819451 C33.0727078,18.6243373 31.3877667,16.0591804 29.7058451,13.4170235 C28.9962373,12.3012784 28.1839627,10.4849843 28.1839627,10.4849843 C28.1673549,10.4849843 28.1507471,10.4849843 28.1326294,10.4834745 C28.1326294,10.4834745 28.3349431,12.3405333 28.3349431,13.4230627 L28.3349431,21.4340824 C26.8568451,21.5201412 25.3772373,21.6258275 23.900649,21.7511412 L23.900649,3.91582745 L23.900649,3.91582745 Z"></path>
                              <path d="M51.7622686,3.6744098 C56.2448765,3.24562549 58.5397784,5.63111569 58.5412882,5.66433137 C57.8588569,6.90086078 57.1764255,8.10568431 56.4939941,9.27880196 C56.4939941,9.26521373 54.4723667,7.49119412 51.9660922,7.63160588 C48.4950529,7.81278235 46.8433275,10.2496059 46.8433275,12.7015275 C46.8433275,15.2244098 48.6203667,17.8590176 51.9660922,18.0356647 C54.7003471,18.1926843 56.771798,16.0261157 56.771798,16.007998 C57.5297196,17.1509196 58.2876412,18.3255471 59.0455627,19.5379196 C59.0440529,19.5801941 56.4985235,22.4548608 51.7622686,21.9928608 C46.0869157,21.4825471 42.2489941,17.7503118 42.2505039,12.7981549 C42.2489941,7.94413529 46.3148961,4.17113529 51.7622686,3.6744098"></path>
                              <path d="M61.7215392,2.8713451 C63.1920882,2.66450196 64.6596176,2.43803137 66.1241275,2.19344314 L66.1241275,10.7042078 C68.3012647,10.6317373 70.4738725,10.5502078 72.6389314,10.4596196 L72.6389314,0.968992157 C74.0958922,0.665521569 75.5498333,0.342423529 76.9992451,-0.000301960784 L76.9992451,25.6663647 C75.5498333,25.3236392 74.0958922,25.0005412 72.6389314,24.6970706 L72.6389314,15.4057373 C70.4738725,15.3076 68.3027745,15.2200314 66.1241275,15.1400118 L66.1241275,23.4741294 C64.6596176,23.2280314 63.1920882,23.0015608 61.7215392,22.7947176 L61.7215392,2.8713451 L61.7215392,2.8713451 Z"></path>
                            </g>
                          </svg>
                        </div>
                      ),
                    },
                    {
                      name: "Bulge",
                      value: "bulge",
                      preview: (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg viewBox="0 0 73 27" width="84" height="27">
                            <g fill="#4A4A4A">
                              <path d="M6.2193902,18.951536 C7.35828562,19.1351325 7.91993268,18.2340974 7.91993268,17.1113342 C7.91993268,15.9913956 7.38097843,15.0451675 6.24208301,15.0042114 C5.45208954,14.9703167 4.66493268,14.9335974 3.87919412,14.8968781 L3.87919412,18.5786939 C4.65642288,18.7072114 5.43790654,18.8314921 6.2193902,18.951536 L6.2193902,18.951536 L6.2193902,18.951536 Z M5.88467124,11.2899132 C6.86755359,11.2376588 7.29304379,10.3337991 7.29304379,9.39463246 C7.29304379,8.48653596 6.86613529,7.77474649 5.81659281,7.94280789 C5.16984771,8.04449211 4.52310261,8.1475886 3.87919412,8.25492193 L3.87919412,11.4141939 C4.54579542,11.3718254 5.21381503,11.329457 5.88467124,11.2899132 L5.88467124,11.2899132 L5.88467124,11.2899132 Z M0.000141830065,5.70434298 C1.93470392,5.07870263 3.88203072,4.50390439 5.83928562,3.98136053 C9.03471699,3.07467632 11.2912333,4.53638684 11.289815,8.28740439 C11.289815,10.0979482 10.6373967,11.9776939 9.42333137,12.8815535 L9.42333137,12.9408693 C11.2657039,13.6300623 11.9464882,15.8939482 11.9450699,17.8188868 C11.9450699,22.6531237 9.00918758,23.7603518 5.83928562,22.8522553 C3.88203072,22.3297114 1.93470392,21.7535009 0.000141830065,21.1278605 L0.000141830065,5.70434298 L0.000141830065,5.70434298 Z"></path>
                              <path d="M14.5187183,2.01024035 C15.8391562,1.76309123 17.1610124,1.5385386 18.4871235,1.33658246 L18.4871235,16.6075737 C18.4871235,19.1284947 19.6004895,20.5873807 21.3081235,20.7271965 C23.0171758,20.8613632 24.136215,19.4914509 24.136215,16.7982316 L24.136215,0.616319298 C25.4679993,0.47932807 26.8026203,0.364933333 28.1372412,0.273135088 L28.1372412,16.8886175 C28.1386595,22.8300825 25.4339601,26.8903895 21.3308163,26.3113544 C17.1851235,25.6772404 14.5187183,21.4686439 14.5187183,16.4296263 L14.5187183,2.01024035 L14.5187183,2.01024035 Z"></path>
                              <path d="M31.3040229,0.0819122807 C32.6400621,0.0324824561 33.9775196,0.00423684211 35.3149771,0 L35.3149771,21.2025702 C37.5459641,21.206807 39.776951,21.1743246 42.0065196,21.1065351 L42.0065196,26.6652719 C38.4423301,26.8559298 34.871049,26.8841754 31.3040229,26.7500088 L31.3040229,0.0819122807 L31.3040229,0.0819122807 Z"></path>
                              <path d="M51.5550869,0.657840351 C55.7206359,1.31878772 57.7941915,4.76475263 57.7956098,4.72097193 C57.1616294,6.01179649 56.527649,7.3506386 55.8936686,8.73184912 C55.8922503,8.74879649 54.2399301,6.42700702 51.942283,6.21234035 C48.527015,5.91152456 47.1299889,9.32359474 47.1314072,13.1466386 C47.1314072,18.0670246 49.2801327,20.8647526 51.8061261,20.630314 C53.7165771,20.4580158 55.1008386,18.6079281 55.1008386,18.617814 L55.1008386,16.8002088 C54.3363745,16.8369281 53.5719105,16.8722351 52.8074464,16.9047175 L52.8074464,11.8346298 C54.7476817,11.8713491 56.6822438,11.9151298 58.6097144,11.9645596 L58.6097144,24.5818754 C57.5105314,24.8007789 56.4085118,25.0027351 55.3050739,25.1891561 L55.3050739,24.5310333 C55.3050739,24.0353228 55.3277667,23.5396123 55.3277667,23.5396123 C55.3121654,23.5424368 55.2965641,23.5438491 55.2809627,23.5466737 C55.2809627,23.5269018 53.7179954,25.8543404 51.0090412,26.2497789 C46.8406556,26.8909544 42.9913876,22.0482439 42.9913876,13.3613053 C42.9899693,5.64742807 46.5924529,-0.116089474 51.5550869,0.657840351"></path>
                              <path d="M61.5833235,2.88161754 C64.9418595,3.64001228 68.2762843,4.54810877 71.5738333,5.60449474 L71.5738333,8.88239825 C69.5641013,8.50814386 67.5416046,8.16637193 65.5077614,7.85708246 L65.5077614,11.3411789 C67.1317157,11.4329772 68.7485784,11.5332491 70.3583497,11.6405825 L70.3583497,15.0780737 C68.7485784,15.1797579 67.1317157,15.2729684 65.5077614,15.3591175 L65.5077614,18.9745561 C67.6451405,18.6497316 69.7711732,18.2896 71.8830229,17.8927491 L71.8830229,21.1282842 C68.4847745,22.2284509 65.0468137,23.1690298 61.5833235,23.9514333 L61.5833235,2.88161754 L61.5833235,2.88161754 Z"></path>
                            </g>
                          </svg>
                        </div>
                      ),
                    },
                    {
                      name: "Perspective",
                      value: "perspective",
                      preview: (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg viewBox="0 0 81 40" width="84" height="27">
                            <g fill="#4A4A4A">
                              <path d="M2.68700382,22.424114 C2.92013939,22.3866525 3.03617,22.3681148 3.26823121,22.3318119 C3.72411689,22.2607509 4.04642413,22.0201476 4.23837599,21.5991883 C4.43032786,21.1782291 4.53346618,20.6576299 4.54671659,20.0632663 C4.55960888,19.4858956 4.49013376,19.0301782 4.33721688,18.6980452 C4.18394188,18.365526 3.88419615,18.2790169 3.43439849,18.4168907 C3.16007922,18.5006964 3.02256147,18.5431785 2.74609348,18.6293014 C2.72389009,20.0346874 2.71171404,20.8310342 2.68700382,22.424114 M0.275071322,16.902596 C1.97183987,16.1452555 2.79085838,15.8003779 4.39272535,15.1480841 C5.26510361,14.7931652 5.89825827,14.8514816 6.30185856,15.5207682 C6.70510072,16.190441 6.88057911,17.4475258 6.82936807,19.3986141 C6.77672456,21.4037705 6.50419588,23.1382 6.02145126,24.3219065 C5.53870664,25.5052269 4.8367931,26.0362535 3.90317647,26.0381845 C3.39572163,26.0393431 3.14145703,26.0412741 2.63113723,26.0474533 C2.59066977,28.6550836 2.57025698,29.9550367 2.54196556,31.6805835 C1.63413351,31.4681729 1.18075466,31.3631261 0.275071322,31.1565085 C0.274713203,26.4054618 0.274713203,21.6540289 0.275071322,16.902596"></path>
                              <path d="M8.06957051,13.7026876 C10.5477551,12.758812 11.74065,12.3343769 14.1282304,11.4569279 C14.1185611,12.8858722 14.103162,13.7946035 14.0648433,15.757664 C12.5568035,16.1338239 11.8026046,16.3188143 10.2755845,16.7081051 C10.2422794,18.0204166 10.2232991,18.7337302 10.1842641,20.1850742 C11.6009835,19.9722773 12.302897,19.8722512 13.7074403,19.670268 C13.6594524,21.730265 13.6322353,22.8205109 13.5824568,24.9117902 C12.173616,24.9137212 11.4699119,24.9137212 10.0553412,24.9241486 C10.0055627,26.7516525 9.98085243,27.6627011 9.93895249,29.309849 C11.5071563,29.505653 12.2900047,29.6079963 13.859641,29.8119106 C13.817741,31.9248171 13.8009094,32.9057681 13.7915983,34.4258559 C11.2876292,33.802141 10.0438814,33.4908628 7.56426439,32.8849132 C7.72040434,26.4905805 7.91701175,20.0974065 8.06957051,13.7026876"></path>
                              <path d="M17.4832696,20.0335288 C17.8650247,19.9848675 18.0559022,19.9601506 18.4383734,19.9095582 C18.5418699,19.8960412 18.7445653,19.7392435 19.0464597,19.4306688 C19.1986604,19.2897054 19.326867,18.964524 19.4292891,18.4589867 C19.5320693,17.9534493 19.5879359,17.384575 19.5961726,16.7658808 C19.6083487,15.8501978 19.5406642,15.1924972 19.395984,14.7699932 C19.2509458,14.3471029 18.9716128,14.2049809 18.5604921,14.3162068 C18.1640542,14.4235707 17.9663724,14.4764803 17.571367,14.5819132 C17.5455824,16.6063797 17.5251696,17.7425835 17.4832696,20.0335288 M14.9545903,34.7153522 C14.9982808,26.8094282 15.3091283,18.9077524 15.3632043,11.0014422 C16.8451013,10.4530366 17.5828268,10.1780613 19.0740349,9.59682857 C19.765563,9.32726016 20.2991605,9.26778518 20.6716045,9.46397537 C21.0440484,9.66016556 21.349524,10.1923508 21.578004,11.2119218 C21.8064841,12.2318791 21.9153523,13.6596648 21.8967301,15.5362163 C21.8806147,17.1710058 21.7724627,18.6864592 21.5790784,19.9682608 C21.3853359,21.2500625 21.1285645,22.2997572 20.8094803,23.0934006 C20.6060687,23.5981656 20.3313913,24.0144904 19.9861644,24.3404442 C20.2529632,24.7054043 20.4463475,25.0769298 20.5659593,25.4500001 C20.6468942,25.6990999 20.7614924,26.2339885 20.9115443,27.0484867 C21.0615962,27.8625988 21.1622277,28.4836103 21.2116482,28.914997 C21.6216946,32.3502563 21.8329849,34.035252 22.329338,36.5343597 C21.2736028,36.2783084 20.7471676,36.1497034 19.6978785,35.8913348 C19.1721596,33.3999511 18.9469026,31.6952591 18.5082067,28.2634756 C18.3699727,27.1531473 18.2464216,26.4081652 18.1296747,26.0713978 C17.977116,25.6295837 17.790894,25.4059732 17.583543,25.4048146 C17.5033243,25.4044284 17.463215,25.4040422 17.3826382,25.403656 C17.2988383,29.9782088 17.2533571,32.3212912 17.2691144,35.2911782 C16.3412277,35.0610023 15.8781796,34.9455281 14.9545903,34.7153522"></path>
                              <path d="M22.577443,27.7502529 C23.4619973,27.5552213 23.906065,27.4486298 24.7999304,27.2153643 C24.8314449,28.7883616 24.9206166,29.9400135 25.0645805,30.7267053 C25.2984323,32.0011691 25.6440173,32.6314494 26.0948893,32.6874486 C26.4311632,32.7295445 26.6958132,32.4688587 26.8856164,31.8459162 C27.0754195,31.2237461 27.1739023,30.4544334 27.1814228,29.5379781 C27.1882271,28.6674806 27.1062178,27.8583892 26.9361112,27.1427585 C26.7663627,26.4282863 26.3581069,25.7547515 25.7417838,25.1569121 C24.7215024,24.1670785 24.0113521,22.8431809 23.5973663,21.2304048 C23.1833806,19.6172426 22.9925031,17.5587904 23.0136321,15.1960117 C23.0275988,13.6442554 23.1457781,12.2338487 23.3674538,10.9497299 C23.5887715,9.6652248 23.9143018,8.68774965 24.3544302,7.90260269 C24.7945587,7.11822813 25.4051518,6.56750527 26.2041156,6.18748332 C27.1846459,5.72095232 27.9649875,5.82136462 28.5000175,6.80810859 C29.0346894,7.79485256 29.3559223,9.83708432 29.4368572,13.4689201 C28.5182816,14.0053535 28.0613216,14.2668117 27.157787,14.7808454 C27.1112315,13.2796815 26.9905453,12.2886893 26.8018165,11.7317872 C26.6130877,11.1744989 26.3491539,10.9744467 26.0143125,11.0949415 C25.7389189,11.1945814 25.5322841,11.4877081 25.3922595,11.9870662 C25.2522349,12.4864243 25.1806111,13.065726 25.1763137,13.7442815 C25.1727325,14.2390052 25.2311059,14.6800469 25.3371092,15.0562068 C25.4470518,15.4454976 25.7038232,15.7845822 26.118167,16.0611023 C27.1445365,16.7771192 27.8897825,17.6248308 28.3381477,18.6285676 C28.786871,19.633463 29.1120432,20.9874843 29.3100831,22.6520113 C29.5077648,24.3176969 29.6005177,26.2178067 29.5883416,28.2167839 C29.5740169,30.5656594 29.4232487,32.5754502 29.1374696,34.1777988 C28.8516905,35.7809199 28.4602663,36.7475814 27.9628388,37.3029387 C27.4654113,37.8586821 26.8437165,37.9915353 26.1038423,37.8111794 C24.804586,37.4941082 23.8885172,36.6444657 23.382853,34.9308911 C22.8764725,33.2173166 22.6071669,30.8846615 22.577443,27.7502529"></path>
                              <path d="M33.2812664,18.0893149 C33.526578,18.0406536 33.6490547,18.0159367 33.8943664,17.9661167 C34.3767529,17.8680217 34.7158917,17.3524431 34.9096342,16.4213121 C35.1033766,15.4897949 35.1982782,14.3296466 35.1950551,13.001887 C35.191832,11.7119751 35.104451,10.6908592 34.93327,9.92231891 C34.7620891,9.1541648 34.4447955,8.889617 33.9821055,9.06920054 C33.7002658,9.17849547 33.5591668,9.23294984 33.2776852,9.34147236 C33.2866381,12.5121839 33.2848476,14.3713563 33.2812664,18.0893149 M30.7747904,4.39230445 C32.3927727,3.62646755 33.2085682,3.24335599 34.8591394,2.47945009 C35.7580184,2.06351144 36.4459653,2.30025275 36.9075809,3.69598375 C37.3688384,5.09171476 37.5783381,7.67887635 37.6191637,11.8374905 C37.6535431,15.3341558 37.5414518,19.1482785 36.9158176,22.6109581 C36.4402354,25.2421467 35.6806647,26.4976867 34.6600251,26.5254931 C34.1056567,26.540555 33.8281143,26.5451894 33.2730296,26.5494376 C33.2744621,30.7401064 33.2655091,34.9311615 33.3228082,39.1214441 C32.2928575,38.9175299 31.7746591,38.8008971 30.7511545,38.562611 C30.608265,27.1727663 30.9173218,15.781763 30.7747904,4.39230445"></path>
                              <path d="M38.7724148,0.691995245 C41.4923297,-0.532648645 42.8932919,0.871578786 45.628606,2.0367477 C45.5938684,4.04460755 45.5766787,5.48436548 45.5433736,8.69253855 C43.852335,8.08774753 42.6024991,7.38447521 41.2108481,7.04539059 C41.213713,9.57732541 41.2147874,11.0089731 41.2172942,13.9448744 C42.5423351,14.1885673 43.6177669,14.6917874 45.1780921,15.0818506 C45.1487263,18.6167498 45.1340434,20.5226526 45.1068264,24.1313163 C43.5604679,24.0135249 42.5913974,23.7346877 41.2244566,23.6026069 C41.2273216,27.3236551 41.2287541,29.1758759 41.2323352,32.3720767 C42.7951672,32.4153312 43.7602983,32.4991369 45.4645874,32.3543114 C45.4370122,35.811198 45.4244781,37.371837 45.4026328,39.51255 C42.7206784,39.9512745 41.490181,39.8898685 38.8748369,39.8195799 C38.8340113,26.7767942 38.8143147,13.7343947 38.7724148,0.691995245"></path>
                              <path d="M51.9763038,24.8574903 C52.800336,26.099127 53.2100243,26.6830632 54.0179411,27.7926192 C53.8718285,30.4361661 53.6519433,32.5042733 53.3511232,34.0718639 C53.049945,35.6398406 52.6753524,36.7181142 52.2226898,37.4600067 C51.7700271,38.2015129 51.1891579,38.6186102 50.4786495,38.7931731 C49.6162986,39.0051975 48.9075808,38.8534205 48.3639559,38.1682996 C47.8199729,37.4835649 47.3479718,36.0596413 46.9841228,33.2712689 C46.4476603,29.1636333 46.4548227,24.8864554 46.4909927,20.7965851 C46.5336089,16.006532 46.4240244,10.749948 47.712179,6.1344579 C48.4012003,3.66547386 49.4709022,3.26112124 50.7128594,3.79562366 C51.6847948,4.21349331 52.4189391,5.06120487 52.9353469,6.6307264 C53.4521128,8.20102033 53.8127388,10.6294532 54.0362052,14.2964333 C53.2150379,14.8606732 52.7996197,15.1804478 51.9580397,15.8856511 C51.8964432,14.7409508 51.8287587,13.9179562 51.7542699,13.3907916 C51.6317932,12.5083219 51.47816,11.8255182 51.29158,11.3238429 C51.1057161,10.82294 50.8929933,10.5332892 50.654486,10.4529593 C50.1137261,10.2706724 49.6839831,11.0712674 49.365257,13.1293334 C49.1285403,14.6559866 48.9867251,17.2701823 48.9530619,20.9572448 C48.9115201,25.5256183 49.0214626,28.5403046 49.2757272,30.0476477 C49.5299918,31.5538323 49.8995708,32.1864298 50.3783761,32.108031 C50.8428567,32.0319493 51.1948878,31.4178895 51.4362601,30.213328 C51.6776324,29.0099252 51.8563339,27.2457583 51.9763038,24.8574903"></path>
                              <path d="M54.7386917,6.00071644 C57.8493147,7.47214287 59.3104408,8.09354054 62.15713,9.26334387 C62.0740463,11.1731086 62.0360857,12.441007 61.9662524,15.1637252 C61.0143717,14.9018809 60.5344921,14.7663242 59.5625567,14.481694 C59.4185928,21.8446192 59.3183194,29.2079306 59.2194785,36.5716281 C58.2976798,36.7651149 57.8346318,36.859348 56.9010151,37.0420212 C56.9522262,29.277833 57.029938,21.5144172 57.1499079,13.7510014 C56.1529042,13.4385646 55.6479562,13.2752016 54.6208705,12.9291653 C54.6591892,9.73180588 54.682467,8.24300039 54.7386917,6.00071644"></path>
                              <path d="M63.1987911,9.68789481 C64.1284685,10.0640547 64.5879353,10.2467279 65.5007811,10.6066674 C65.151973,18.8335246 65.0635176,27.0719678 64.8615384,35.3038456 C63.949767,35.5212768 63.4942394,35.6274822 62.5803194,35.8356446 C62.7629601,27.1202429 62.84676,18.3982758 63.1987911,9.68789481"></path>
                              <path d="M66.3054032,10.9226958 C67.2526283,11.2938351 67.7221225,11.4757359 68.6586041,11.8387649 C69.1055368,17.3996755 69.4414526,22.9706273 69.8489922,28.5350136 C70.4552879,23.3823177 70.9530735,18.1940913 71.8863321,13.0943049 C72.7895086,13.4484514 73.2407387,13.6264901 74.1460639,13.9902916 C72.6695386,20.4950778 72.1148121,27.2215435 70.9366001,33.7908253 C69.9378057,34.0484215 69.4414526,34.1750954 68.4512531,34.423809 C67.4137819,26.6306557 67.0818055,18.7475176 66.3054032,10.9226958"></path>
                              <path d="M74.7691912,14.2417086 C77.163934,15.2122321 78.3639913,15.7127488 80.8471895,16.8508836 C80.8464733,17.7453255 80.8461152,18.3134275 80.8450408,19.5403885 C79.2635866,19.0441201 78.4886168,18.815489 76.9530018,18.3756058 C76.9343796,19.4635345 76.9254267,20.0544223 76.9082369,21.2574389 C78.3475178,21.5003595 79.0741416,21.6270334 80.5546062,21.9054845 C80.5524575,23.2204994 80.551025,23.9160477 80.5488763,25.2511452 C79.0472827,25.2140698 78.3109897,25.2032562 76.8545191,25.1862634 C76.8344644,26.7021029 76.8247952,27.4578986 76.8058149,28.8258231 C78.4388382,28.6114815 79.2664516,28.5041176 80.9599971,28.2967275 L80.9599971,31.1565471 C78.2468863,31.8694745 76.9433326,32.2189865 74.3791995,32.8932938 C74.5109873,26.6766136 74.5718676,20.4568439 74.7691912,14.2417086"></path>
                            </g>
                          </svg>
                        </div>
                      ),
                    },
                    {
                      name: "Pointed",
                      value: "pointed",
                      preview: (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg width="96" height="34" viewBox="0 0 96 34">
                            <g fill="#4A4A4A">
                              <path
                                d="M4.44976389,25.2965129 C4.87555263,25.1833743 5.08782022,25.1270304 5.51026616,25.0152442 C6.34011545,24.7952776 6.92092639,24.4928236 7.26189166,24.0912044 C7.60285692,23.6895852 7.780443,23.237031 7.79381419,22.7470646 C7.80676752,22.2710714 7.6734735,21.913175 7.39226073,21.686898 C7.1106301,21.4606209 6.56951488,21.498484 5.75846882,21.791923 C5.2637349,21.9708712 5.01511439,22.0605707 4.51494843,22.2417726 C4.49154885,23.4633081 4.47775981,24.0745266 4.44976389,25.2965129 M8.35699187e-05,21.500287 C3.1051239,20.1128751 4.56885103,19.4565815 7.4215102,18.1696871 C8.97465714,17.4687691 10.1049403,17.3668993 10.8445341,17.9294367 C11.58371,18.4919741 11.9321966,19.6490522 11.8853974,21.3186343 C11.8373447,23.0346438 11.3856493,24.4928236 10.5382503,25.6012206 C9.69043349,26.7091668 8.42894557,27.3623052 6.72161213,27.6611532 C5.79398603,27.8234236 5.32724804,27.9054603 4.38625075,28.0713367 C4.34070515,30.1042242 4.31814127,31.120668 4.29474169,33.152654 C2.5928403,33.1657257 1.73583078,33.1729378 8.35699187e-05,33.186911 L8.35699187e-05,21.500287"
                                id="Fill-1"
                              ></path>
                              <path
                                d="M17.3525833,23.353415 C17.2982628,25.3213943 17.511784,26.6871702 17.9931467,27.4944654 C18.4745094,28.3026622 19.1493365,28.6839976 20.0126138,28.5947489 C20.8997085,28.5027957 21.5929209,27.9776706 22.095594,26.9765524 C22.5982671,25.9754342 22.876137,24.2224631 22.9312932,21.7613621 C22.9780924,19.68971 22.7520357,18.2468557 22.2598089,17.4756205 C21.7679999,16.7043854 21.0873229,16.4979414 20.2248814,16.8098611 C19.397957,17.1087091 18.7306512,17.7997106 18.2120999,18.8386919 C17.6939664,19.8781239 17.4077394,21.3678563 17.3525833,23.353415 M13.241779,24.2756518 C13.3311988,21.3944507 14.0022652,18.98158 15.2290716,16.8179746 C16.455878,14.6543693 18.103459,12.9676587 20.2403418,11.9615822 C22.4307094,10.9302637 24.1643673,11.0731518 25.3869953,12.6304968 C26.6087875,14.1882927 27.1929412,16.9982751 27.1139676,20.8485911 C27.0563044,23.6436987 26.7454243,25.9930135 26.1955342,27.8113435 C25.646062,29.6296734 24.8805615,31.0220436 23.8827367,31.9843972 C22.8849119,32.9476523 21.6388844,33.3862332 20.1450721,33.3862332 C18.625771,33.3862332 17.3684616,33.0193218 16.3802473,32.3562669 C15.392033,31.6936628 14.6010437,30.6785713 14.0173078,29.3362345 C13.4335719,27.9938977 13.1774301,26.3387396 13.241779,24.2756518"
                                id="Fill-3"
                              ></path>
                              <path
                                d="M29.4586471,8.00854004 C31.1835302,7.19493428 32.0739677,6.75995946 33.8460678,5.91389963 C33.9772726,14.9266681 33.5794797,23.9376335 33.7319948,32.9499512 C31.8972173,32.9508527 31.025583,32.9472467 29.3065498,32.96122 C29.2509758,24.641256 29.514221,16.328504 29.4586471,8.00854004"
                                id="Fill-5"
                              ></path>
                              <path
                                d="M36.864279,4.4808717 C38.5344238,3.69295876 39.3759729,3.2990023 41.0770386,2.51514612 C43.4892843,7.59871713 45.0879768,13.0063782 46.6921014,18.4293648 C46.6895943,12.3081647 46.6858337,6.1865139 46.6875051,0.0653138358 C48.3229684,-0.271847994 49.3007364,0.769387069 51.1008325,1.5527925 C50.9792382,12.0169795 50.8822971,22.4816173 50.7924595,32.9467058 C49.1264931,32.946255 48.321297,32.9467058 46.6950264,32.9440013 C44.7699933,27.3709145 43.0739418,21.7112836 41.1923651,16.1215191 C41.2057362,21.7297644 41.2161825,27.3389112 41.2863812,32.9471565 C39.5435306,32.9476073 38.647661,32.948058 36.8839179,32.9485088 C36.7380884,23.4597472 36.9942302,13.9700841 36.864279,4.4808717"
                                id="Fill-7"
                              ></path>
                              <path
                                d="M52.9500258,2.3480076 C57.4979008,4.26820733 61.9755771,6.23348217 66.4490748,8.34795562 C66.3684298,10.7346827 66.3333305,11.9399912 66.2719066,14.3623277 C64.4446503,13.6920608 63.4927889,13.3314599 61.7570417,12.6693065 C61.6546686,19.4269671 61.5970053,26.1832755 61.5773664,32.9422884 C59.8215624,32.9427392 58.9210965,32.9431899 57.1210005,32.9445422 C57.1907814,25.657249 57.2818726,18.3699558 57.4239414,11.0840149 C55.6230097,10.4434975 54.7058298,10.1266195 52.8321923,9.45139434 C52.8781557,6.37952553 52.902391,4.90241414 52.9500258,2.3480076"
                                id="Fill-9"
                              ></path>
                              <path
                                d="M68.2643806,9.21344283 C72.0509336,11.0218563 75.8341438,12.8383833 79.6190254,14.6504027 C79.5584372,16.2032403 79.5300235,16.9839412 79.4769566,18.5512028 C76.7028531,17.5054602 75.3101604,16.9776307 72.4437122,15.8872638 C72.394406,17.2611531 72.3710064,17.9508023 72.32755,19.3323545 C74.9867448,20.1455095 76.2870928,20.5403675 78.8781781,21.3219699 C78.831379,22.8450579 78.8096508,23.609081 78.7687015,25.1371273 C76.16132,24.6025365 74.8551222,24.3320858 72.1984345,23.7758589 C72.152471,25.4968267 72.1315786,26.3586628 72.0931364,28.0800813 C75.0352154,28.4203984 76.4872427,28.5849225 79.3921331,28.9112663 C79.3541088,30.5781439 79.3365591,31.4115827 79.3043847,33.0730513 C74.6884002,33.037442 72.3906453,33.0189612 67.7224297,32.9801966 C67.8273099,25.0541891 67.9973747,17.1349428 68.2643806,9.21344283"
                                id="Fill-11"
                              ></path>
                              <path
                                d="M85.8780781,21.150414 C85.8066258,24.5197786 85.778212,26.2191102 85.7301593,29.6060541 C86.1434126,29.6515799 86.3502481,29.6745682 86.7639192,29.7200941 C87.6459997,29.8174563 88.2765347,29.781847 88.6521815,29.6236334 C89.0278283,29.4654197 89.3236658,29.1548522 89.5392762,28.6955368 C89.7544687,28.2366722 89.8664524,27.4694938 89.8756451,26.3791269 C89.8877628,24.9358218 89.6629597,23.883318 89.2029073,23.1824 C88.742437,22.4819328 87.9769366,21.9175924 86.9072416,21.5267912 C86.4952419,21.3762403 86.2892421,21.3009649 85.8780781,21.150414 M81.8871966,15.7341887 C84.308635,16.8894638 85.5078633,17.4596639 87.9414194,18.6063747 C89.1402298,19.1711659 90.1146551,19.8022174 90.8596809,20.4616663 C91.6063781,21.1211152 92.2277205,21.8373587 92.7220366,22.6009311 C93.2163526,23.3649542 93.5782104,24.1352879 93.8034313,24.9299621 C94.0282344,25.7246363 94.1423073,26.5066894 94.1423073,27.3036174 C94.1423073,28.5526487 93.9739139,29.4870558 93.6350379,30.1474062 C93.2961619,30.8077565 92.8252454,31.3671387 92.2256312,31.8327646 C91.6247635,32.299292 90.9800216,32.6278895 90.2943304,32.7915122 C89.3562581,33.0155355 88.5067699,33.1439995 87.7492085,33.1381398 C85.2187114,33.1187575 83.961402,33.1092917 81.4467831,33.0899094 C81.5479027,27.3036174 81.6866288,21.5177762 81.8871966,15.7341887"
                                id="Fill-13"
                              ></path>
                            </g>
                          </svg>
                        </div>
                      ),
                    },
                    {
                      name: "Downward",
                      value: "downward",
                      preview: (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg viewBox="0 0 89 34" width="84" height="27">
                            <g fill="#4A4A4A">
                              <path d="M3.22079691,3.38536233 C3.2515996,7.43045263 3.26850351,10.97007 3.2993062,15.0195179 C3.60057154,15.0818305 3.75082856,15.1132046 4.05096697,15.175953 C4.69068626,15.3088575 5.14258426,15.2705113 5.40816356,15.0426127 C5.67411849,14.8147142 5.87846805,14.3532523 6.02158786,13.6041938 C6.16508332,12.855571 6.22631306,11.5409058 6.206404,9.64799701 C6.18048467,7.14285599 5.99491724,5.50050488 5.65082865,4.66603888 C5.30636442,3.83244438 4.74740829,3.45333972 3.96982818,3.41891527 C3.67044106,3.40540695 3.52055967,3.39887066 3.22079691,3.38536233 M0.207016617,0.187374864 C1.98192773,0.189989379 2.86694161,0.191732389 4.63584244,0.194346904 C5.50733319,0.196089913 6.21354121,0.294134222 6.75596907,0.572580058 C7.29802129,0.85015439 7.75067058,1.3002867 8.11429259,2.07113285 C8.47753894,2.84154323 8.74800159,3.89083521 8.9245536,5.25256172 C9.10148124,6.61472398 9.20027524,8.20260603 9.22131122,9.88199609 C9.25474341,12.5139411 9.16271098,14.4539111 8.94333572,15.6339289 C8.72396047,16.8139466 8.40842071,17.6009156 7.99634082,18.0950589 C7.58350964,18.5892022 7.13386549,18.7639389 6.64815966,18.7839836 C5.98477489,18.811436 5.37698522,18.733872 4.82929836,18.5974815 C3.00179729,18.1421202 2.07884351,17.9124786 0.207016617,17.4545027 L0.207016617,0.187374864" />
                              <path d="M13.2623988,10.4563005 C13.2977092,13.0545773 13.5035613,14.859705 13.8792039,15.9326619 C14.2548464,17.0060512 14.7525728,17.5462056 15.3716318,17.6724867 C16.0083459,17.80266 16.4929248,17.4683611 16.8268711,16.5156308 C17.1608173,15.5637654 17.3088205,13.5951642 17.2708806,10.5756621 C17.238951,8.03447129 17.0342258,6.2544268 16.6555781,5.20871554 C16.2769304,4.16300427 15.7750719,3.705884 15.1503783,3.68209818 C14.5519797,3.65874483 14.0786701,4.08213247 13.7312007,5.07032529 C13.3833557,6.05808565 13.2267128,7.83467038 13.2623988,10.4563005 M10.2824263,10.0515091 C10.2290851,6.00532437 10.6272662,3.20724666 11.4735889,1.75933875 C12.3199116,0.310998377 13.5234704,0.0614634723 15.0850165,0.0614634723 C16.6856295,0.0614634723 17.9320115,0.286347616 18.8219087,1.84756253 C19.7125573,3.40834498 20.1806079,6.53120729 20.2301927,11.0237005 C20.2662544,14.2853855 20.1073576,16.8321985 19.7542536,18.4223888 C19.4007739,20.0134441 18.87525,20.831244 18.1780574,21.2100873 C17.4808648,21.5884981 16.6029881,21.5175731 15.5410466,21.2606862 C14.4610742,20.9990422 13.5584051,20.6509042 12.8349176,20.0536638 C12.11143,19.455991 11.5137827,18.5352634 11.0442295,16.9122053 C10.5746763,15.2900122 10.3207419,12.9481898 10.2824263,10.0515091" />
                              <path d="M20.3390915,0.214557528 C21.4705269,0.215828991 22.0369959,0.216252812 23.1710608,0.217524274 C23.7983839,4.47607655 23.9997283,8.85245103 24.3107603,13.1457566 C24.6792657,8.8638942 24.908032,4.44640909 25.6882416,0.219643379 C26.8208039,0.220491021 27.3880242,0.220914841 28.524343,0.221338662 C29.3879452,4.65069076 29.6640425,9.30085353 30.0945289,13.7912358 C30.3556005,9.28220541 30.5122434,4.7083304 31.0505392,0.223457767 C32.1774669,0.224729229 32.7401795,0.22515305 33.8648533,0.226424513 C32.8848018,8.16543737 32.9757073,16.2231201 31.9487006,24.1578947 C30.7214763,23.9214027 30.0738685,23.8035805 28.9213971,23.582346 C27.9744022,18.4638611 27.6629946,13.1800861 27.1573797,7.99167081 C26.7295228,12.9529181 26.5120257,18.0307162 25.598463,22.9194901 C24.4493724,22.6821504 23.8753906,22.56009 22.7263,22.3104595 C21.552417,15.0025159 21.510345,7.52546783 20.3390915,0.214557528" />
                              <path d="M34.722558,0.226858289 C35.8337087,0.228136721 36.389284,0.228562864 37.4993078,0.23026744 C39.6246934,4.71884174 40.3327796,10.1108412 41.3500197,15.0080876 C41.2846579,10.0839942 41.2392052,5.15734387 41.1201265,0.23452888 C42.2402926,0.235807312 42.8003756,0.2366596 43.9209174,0.237938032 C44.1162515,9.10471534 44.1098656,17.9757541 44.3138395,26.8421053 C43.2071965,26.6021862 42.6516212,26.4824398 41.5333333,26.2446514 C39.5371687,21.5971254 38.7565834,16.2596724 37.6938906,11.2763449 C37.7562473,16.0116566 37.8013244,20.749099 37.9098851,25.4839845 C36.7750689,25.2491792 36.2037166,25.1324157 35.0501183,24.9010195 C34.9088767,16.6768673 34.8720637,8.45058437 34.722558,0.226858289" />
                              <path d="M44.7708087,0.238352442 C45.9003659,0.239633537 46.4649567,0.2404876 47.5956408,0.241768695 C48.2954629,5.51005774 48.4663803,10.8804073 48.7841739,16.1892644 C49.135024,10.8833966 49.3198402,5.49938194 50.1034306,0.245184948 C51.2314852,0.246466043 51.7960759,0.247320106 52.9260088,0.248601201 C53.8651152,5.71204369 54.0867443,11.3548395 54.5037075,16.8887422 C54.7542611,11.348007 54.8823552,5.76713077 55.4488242,0.252017454 C56.5795084,0.253298548 57.1456017,0.254152612 58.2796666,0.255433707 C57.1595005,9.96570561 57.3833834,19.8224494 56.2305364,29.5263158 C55.0912125,29.2747942 54.523241,29.1488198 53.3869222,28.8968712 C52.3933476,22.5930305 52.1063567,16.1273448 51.5988636,9.75859528 C51.1849055,15.8826557 50.9831854,22.0993819 50.1038062,28.1687823 C48.9659849,27.9168336 48.3968864,27.7908593 47.2541817,27.5397647 C45.9886419,18.5016406 46.1888594,9.24914656 44.7708087,0.238352442" />
                              <path d="M64.4808492,19.8738868 C64.1281208,15.3958826 63.7945502,10.9149812 63.3896075,6.44235785 C63.0105842,10.8139892 62.6905367,15.1922429 62.3513315,19.5675994 C63.2047914,19.6897004 63.6303944,19.7509579 64.4808492,19.8738868 M65.116812,27.1320696 C63.7581129,26.8667585 63.0766973,26.7343099 61.7078558,26.4702405 C61.5204101,28.1912444 61.4264995,28.8940498 61.2379269,29.6912247 C60.0024385,29.4267414 59.3709834,29.2938789 58.1805721,29.0409849 C60.2214381,19.607334 59.8251352,9.71507977 61.7844868,0.262389338 C63.085337,0.267770062 63.7355743,0.271495179 65.0356732,0.279359314 C67.1516678,10.464656 66.7328263,21.1048309 68.7342499,31.3157895 C67.4893705,31.043856 66.8654282,30.9076823 65.6130359,30.6357487 C65.4143209,29.7346844 65.3151513,28.9697938 65.116812,27.1320696" />
                              <path d="M72.5262865,12.0719261 C73.0273937,12.113063 73.2779472,12.1336315 73.7786788,12.1743652 C73.9139101,12.1852544 74.1761086,12.0283693 74.5648987,11.70129 C74.7609841,11.5561007 74.9213835,11.1560235 75.0453455,10.5159807 C75.1689319,9.87755104 75.2309129,9.14676488 75.2301616,8.35225674 C75.2290347,7.17702998 75.1298651,6.33896504 74.9319014,5.76909702 C74.7346891,5.20043891 74.3643055,4.92941888 73.821502,4.91207682 C73.2989832,4.89554137 73.037536,4.887072 72.5150172,4.86972994 C72.5195249,7.34319107 72.5217788,8.90316949 72.5262865,12.0719261 M69.5835026,30.7017304 C69.5425576,20.5699367 69.5523243,10.4381431 69.5113793,0.306752737 C71.4977771,0.318448542 72.4906004,0.324498096 74.4766227,0.328934436 C75.3969469,0.330950954 76.1012768,0.429760342 76.5881095,0.69432752 C77.0745666,0.958894697 77.4674888,1.47391343 77.7661246,2.58219178 C78.0643848,3.69168006 78.2138905,5.31618705 78.2146418,7.60695164 C78.2153931,9.60411119 78.101949,11.5290794 77.8754366,13.14915 C77.6485485,14.7712372 77.3367651,16.0985094 76.939711,17.0833769 C76.6865279,17.7101107 76.3398098,18.2081907 75.8991811,18.57923 C76.2526607,19.1192536 76.5103515,19.6483879 76.6718778,20.1617935 C76.7808141,20.5050048 76.9393353,21.2309514 77.1470656,22.303739 C77.3544203,23.3753167 77.4934081,24.1653885 77.5632776,24.7070253 C78.1391377,29.019551 78.4261286,30.9937222 78.9997348,32.6940503 C77.6628229,32.4153675 76.9956817,32.2746145 75.6598967,31.9927053 C75.0243095,30.2222024 74.7057646,28.1068749 74.0667966,23.5733388 C73.8643253,22.1073301 73.6862707,21.0704365 73.5266226,20.5945383 C73.3173897,19.9698209 73.06909,19.629836 72.7986273,19.5935387 C72.6938231,19.579423 72.6416087,19.5725669 72.5368045,19.5584512 C72.5428147,23.4842087 72.5461955,27.4095629 72.559343,31.3349171 C71.3708099,31.082449 70.7757921,30.9554084 69.5835026,30.7017304" />
                              <path d="M82.8277203,5.9644573 C82.8247152,13.2388448 82.822837,20.5136355 82.8198318,27.788023 C83.1113305,27.8368228 83.2570798,27.8614243 83.5485784,27.9098207 C84.1698912,28.0134697 84.6131494,27.8428723 84.8768505,27.3693939 C85.1398003,26.8955121 85.3467794,26.0098573 85.4966607,24.6051508 C85.6465421,23.2020575 85.7216706,20.76933 85.7231732,17.2751074 C85.7250514,12.6500215 85.559393,9.65226564 85.2269494,8.15157285 C84.8941301,6.65249328 84.3419355,5.9975282 83.5703657,5.98099275 C83.2732324,5.97453989 83.1248536,5.97131346 82.8277203,5.9644573 M79.8522556,0.320626381 C81.6222833,0.309737183 82.5076729,0.300864504 84.2780763,0.271423339 C85.1506939,0.256904409 85.8550237,0.390801212 86.391817,0.832821984 C86.9282345,1.27524606 87.3722441,2.0145016 87.7230942,3.34258044 C88.0739444,4.66944936 88.3290057,6.51174032 88.4871512,8.93922483 C88.6452967,11.3687259 88.7241816,14.2265353 88.7241816,17.2617984 C88.7241816,22.019168 88.6062299,25.5327491 88.3703263,27.6871971 C88.1340472,29.8416451 87.8057356,31.2931348 87.3868941,32.2384785 C86.967677,33.1842255 86.5172816,33.566154 86.0383373,33.7016641 C85.383968,33.8867804 84.7908284,33.8823441 84.2607967,33.7754686 C82.4915202,33.4181416 81.6110141,33.2370583 79.8522556,32.8716652 L79.8522556,0.320626381" />
                            </g>
                          </svg>
                        </div>
                      ),
                    },
                    {
                      name: "Upward",
                      value: "upward",
                      preview: (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg viewBox="0 0 89 34" width="84" height="27">
                            <g fill="#4A4A4A">
                              <path d="M8.10132837,14.0289865 C9.58566349,13.6059552 10.3276577,13.3915077 11.8067919,12.9642879 C11.75721,17.3437089 11.6871713,21.7231299 11.623027,26.1025508 C11.600143,27.6677666 11.4718543,29.0905758 11.2402412,30.2872099 C11.0086281,31.4842628 10.6608616,32.3810053 10.195555,33.0344002 C9.73024834,33.6882139 9.2465652,34.0241259 8.74277195,34.2084167 C8.04203818,34.4651674 7.20157373,34.5552186 6.21791134,34.5552186 C5.64893355,34.5552186 5.02725337,34.5254808 4.35217734,34.4622355 C3.67710132,34.3985714 3.11159079,34.2729185 2.65633921,34.0438115 C2.20108763,33.8147044 1.78432267,33.4607822 1.40535087,32.8953444 C1.0267258,32.3303253 0.767374555,31.664784 0.62695042,30.9083538 C0.401578353,29.6911965 0.287505413,28.4589608 0.287505413,27.3553098 L0.287505413,16.1810011 C1.76386582,15.7935715 2.50481984,15.5925269 3.98811477,15.1837363 C3.98256715,19.2238945 3.96245703,23.2636339 3.94650762,27.3033733 C3.94130672,28.5892209 4.11675021,29.5148636 4.470411,30.1431279 C4.82476523,30.771811 5.31676979,31.046572 5.94746486,31.0151588 C6.57295903,30.9837455 7.06461686,30.6616554 7.42521217,29.9701458 C7.78650093,29.2786362 7.97373311,28.2600104 7.98690871,26.8736405 C8.02782241,22.5922288 8.07463045,18.3108171 8.10132837,14.0289865"></path>
                              <path d="M17.5825926,20.8287587 C17.937987,20.7680931 18.1155108,20.7381702 18.4705585,20.6779145 C19.1685185,20.5598625 19.664337,20.1794728 19.9594011,19.5400246 C20.2548119,18.9009863 20.412919,18.1225811 20.4326824,17.2564567 C20.4517524,16.4153364 20.344614,15.7705595 20.1109205,15.3028605 C19.877227,14.8355714 19.4205885,14.7072719 18.7406583,14.8695933 C18.3263204,14.9687898 18.1189781,15.018388 17.7032533,15.1184043 C17.6633798,17.0748698 17.6366819,18.3226136 17.5825926,20.8287587 M14.0737228,12.798355 C16.5288915,12.10357 17.7507548,11.7563824 20.1622359,11.0927499 C21.4752883,10.7312158 22.447162,10.6783383 23.0785505,11.3866502 C23.7095923,12.094962 24.0011891,13.598895 23.9394718,16.3136805 C23.8763676,19.1034782 23.4634167,21.7043108 22.7186486,23.5128015 C21.9735339,25.3212922 20.8796126,26.2284068 19.4296034,26.3690035 C18.6425348,26.4456553 18.248307,26.4841861 17.4588113,26.5624775 C17.3710896,30.6496173 17.3270553,32.6999506 17.3010509,34.3867001 C15.8635238,34.3895695 15.145107,34.3912091 13.7058463,34.3944883 C13.8161052,27.1953673 13.9693582,19.997476 14.0737228,12.798355"></path>
                              <path d="M25.1384708,10.6529018 C26.4691139,10.3111109 27.0992386,10.1573051 28.3711065,9.84055238 C29.0224177,14.3764349 29.1119474,19.0931486 29.3528573,23.6659922 C29.9037039,18.8221005 30.3011199,13.8935559 31.2452819,9.12438132 C32.5591809,8.79650057 33.2286031,8.62957945 34.5780405,8.29136549 C35.6670902,13.0045023 35.8321392,18.0471096 36.2456159,22.8782835 C36.6375644,17.764536 36.915038,12.6058788 37.608722,7.53068214 C38.973195,7.18730156 39.659703,7.01362412 41.026568,6.66666667 C39.5855505,15.7992386 39.5558212,25.1599361 38.1869059,34.3056233 C36.7978293,34.3147642 36.1031202,34.3199308 34.7116516,34.3298666 C33.616451,28.7372145 33.3584552,22.9053088 32.8547655,17.2148886 C32.226691,22.924783 31.7848519,28.7336376 30.6862341,34.3564945 C29.2903232,34.3644431 28.5911718,34.3676226 27.1897934,34.3711995 C25.9972037,26.5422019 26.5104615,18.4433485 25.1384708,10.6529018"></path>
                              <path d="M47.914275,24.1702436 C47.5626946,20.1258075 47.2339981,16.0771811 46.8144593,12.0403638 C46.2964503,16.1507024 45.8432791,20.2713265 45.3693043,24.3877602 C46.3911066,24.2990012 46.9004474,24.2551932 47.914275,24.1702436 M48.5671606,30.8926854 C46.9413611,30.9307793 46.1262077,30.9532548 44.4927803,31.0016341 C44.2427907,32.6876729 44.1200496,33.3950778 43.8860093,34.2853338 C42.4203974,34.2864766 41.6874181,34.2891432 40.2214595,34.2960001 C42.6208052,25.3210623 42.5674094,15.755668 44.9750765,6.78415866 C46.5516408,6.40131433 47.3324684,6.21008263 48.8573704,5.83333333 C51.2497816,15.0966425 50.6925925,25.0159296 52.8873697,34.3417128 C51.3718293,34.3264753 50.6166595,34.3127614 49.1108273,34.3013332 C48.885802,33.3665074 48.7779701,32.6278654 48.5671606,30.8926854"></path>
                              <path d="M57.5753861,15.3975452 C58.1738357,15.3032631 58.4730604,15.2559342 59.0725501,15.1605253 C59.234818,15.1346071 59.5492987,14.9126121 60.0177259,14.4915355 C60.2538465,14.2980881 60.4480132,13.8676208 60.600226,13.214783 C60.7520921,12.563072 60.8294121,11.8396165 60.8311457,11.0707102 C60.8339195,9.93406614 60.7160326,9.15051046 60.4795653,8.65581112 C60.2434447,8.16186303 59.8003285,8.00748077 59.1529906,8.14834049 C58.5299235,8.28431708 58.2189101,8.35155412 57.5975766,8.4860282 C57.5968832,10.8659941 57.5902954,12.3576046 57.5753861,15.3975452 M53.9205446,34.3505025 C53.8959271,24.5489196 54.0925209,14.7477124 54.0536875,4.94612949 C56.3826478,4.36278243 57.5427939,4.06791608 59.9012259,3.4669146 C60.994107,3.18820016 61.8411593,3.07325863 62.4340612,3.19045392 C63.0262696,3.30727358 63.5151537,3.70431018 63.8871909,4.7072314 C64.2588815,5.71052824 64.4457669,7.2588583 64.4409128,9.49608631 C64.4367521,11.4452092 64.2883532,13.3541402 64.0040377,14.9967524 C63.7197222,16.6397401 63.3338158,18.0201654 62.8480523,19.0843137 C62.5391192,19.7623185 62.1171534,20.338153 61.5842351,20.8106904 C62.0072412,21.2490459 62.3151341,21.7016751 62.5079139,22.1640706 C62.6375895,22.4724595 62.8255151,23.1448299 63.0709973,24.1503805 C63.3168262,25.1559311 63.4822147,25.907183 63.5643888,26.4285517 C64.2463993,30.578467 64.5903518,32.5133161 65.3417076,34.3347262 C63.7231894,34.3478731 62.9153172,34.3535075 61.2967991,34.3602688 C60.4781784,32.4911542 60.1012869,30.4469979 59.3533984,26.1464567 C59.1165844,24.754387 58.9078551,23.789404 58.7195828,23.3668248 C58.4720202,22.8105228 58.1762627,22.541199 57.8524204,22.5727516 C57.7265588,22.5847717 57.6638013,22.5907817 57.5379397,22.6028017 C57.5216436,26.5232095 57.4845439,30.4462466 57.5368995,34.3666544 C56.0938248,34.3647763 55.3712473,34.3617713 53.9205446,34.3505025"></path>
                              <path d="M70.1625548,6.53344952 C70.1039581,13.7770198 70.0089551,21.0198389 69.9461976,28.2634093 C70.3022855,28.2435011 70.4808495,28.2333592 70.8379776,28.213451 C71.5997352,28.1706297 72.1472159,27.8907883 72.4779928,27.343877 C72.8087696,26.7969656 73.0764423,25.8425002 73.2851715,24.3835691 C73.4939007,22.9250136 73.6312043,20.4518925 73.6946552,16.9578202 C73.7782162,12.333865 73.613868,9.4006022 73.204731,8.00402501 C72.795594,6.60782345 72.0865388,6.11913412 71.1046101,6.33061152 C70.7263317,6.41212235 70.5380594,6.45268995 70.1625548,6.53344952 M66.3978011,1.80657288 C68.5846036,1.24801713 69.6979416,0.963668309 71.9977769,0.382199378 C73.131225,0.0952211719 74.0718934,0.0163397277 74.7906569,0.304820438 C75.5097672,0.593301148 76.1057896,1.21195705 76.5572272,2.44663946 C77.0090115,3.6816975 77.3113568,5.45840812 77.4614893,7.85152089 C77.6116218,10.2457605 77.6532289,13.1125376 77.5519848,16.1539807 C77.4344446,19.6901232 77.3463762,23.327309 76.8214326,26.836782 C76.4816409,29.1066895 76.0367911,30.7181247 75.5101139,31.8296018 C74.98309,32.9418301 74.4369961,33.4819802 73.8579633,33.7505528 C73.0650003,34.1182905 72.3517844,34.264409 71.7099941,34.2715459 C69.5679193,34.2948347 68.5024295,34.3068548 66.3735303,34.3256361 C66.1689618,23.4877013 66.6464038,12.6437564 66.3978011,1.80657288"></path>
                            </g>
                          </svg>
                        </div>
                      ),
                    },
                    {
                      name: "Cone",
                      value: "cone",
                      preview: (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <svg
                            width="89"
                            height="33"
                            viewBox="0 0 89 33"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g
                              stroke="none"
                              strokeWidth="1"
                              fill="none"
                              fillRule="evenodd"
                            >
                              <g fill="#4A4A4A">
                                <g>
                                  <path d="M14.6217579,16.86452 C16.5218277,17.36132 18.4160845,17.90332 20.2931025,18.48112 C19.9132489,19.64032 19.3145034,20.45412 18.4958637,20.96652 C17.6768232,21.47932 16.6593367,21.70492 15.4432038,21.75512 C14.2274718,21.80552 12.6699718,21.64812 10.8029764,21.38212 C8.96484572,21.12032 7.03190203,20.77672 5.24288176,20.23132 C3.81206644,19.79532 2.58049887,19.19272 1.54777815,18.34812 C0.514856982,17.50352 0.000100225225,16.45812 0.000100225225,15.17672 C0.000100225225,13.46792 0.917561937,12.18412 2.73524662,11.30512 C5.14466104,10.13992 7.92450788,9.77792 10.5181363,9.51992 C12.4987872,9.32292 14.7279966,9.10672 16.7272894,9.57692 C18.2228502,9.92892 19.3547939,10.77812 20.0884426,12.35512 C18.1921813,12.73772 16.2871002,13.09152 14.3796137,13.41332 C14.1801655,12.98612 13.9704944,12.69112 13.7518029,12.51132 C13.3901903,12.20992 12.9481971,12.00072 12.4254223,11.87172 C11.9024471,11.74272 11.3177331,11.70332 10.6714809,11.74092 C9.20799212,11.82632 8.08727365,12.20992 7.30932545,12.88912 C6.72521284,13.39912 6.42573986,14.18312 6.42393581,15.27932 C6.42173086,16.63752 6.77051464,17.55412 7.47189077,18.08992 C8.17286599,18.62552 9.16028491,18.95712 10.4353502,19.09212 C11.6719291,19.22312 12.6082331,19.13292 13.2420574,18.76292 C13.8756813,18.39332 14.3359155,17.77012 14.6217579,16.86452"></path>
                                  <path d="M28.7516104,15.92212 C28.7520113,17.87232 29.1392815,19.24392 29.9186329,20.09992 C30.6979842,20.95612 31.7493468,21.43672 33.0911622,21.57932 C34.4708626,21.72572 35.5496869,21.47172 36.328036,20.68812 C37.1057838,19.90472 37.5199144,18.27032 37.5668198,15.79112 C37.6063086,13.70472 37.2382815,12.24492 36.4555225,11.42672 C35.6725631,10.60832 34.5889279,10.30932 33.1935923,10.40192 C31.8565878,10.49052 30.763732,10.93332 29.9426869,11.76392 C29.1214414,12.59492 28.7512095,13.95452 28.7516104,15.92212 M22.3223626,15.73592 C22.2945,13.36092 23.1494212,10.90252 25.160741,9.52372 C27.4699302,7.94112 30.5255968,7.40152 33.2783829,7.12072 C35.9209212,6.85112 39.1834527,6.53572 41.3615473,8.07112 C43.6172162,9.66132 44.1674527,13.30652 44.0159122,15.99812 C43.8950405,18.14712 43.826286,20.54992 42.6779054,22.47312 C41.836214,23.88232 40.5922185,24.64452 39.0216892,24.96992 C37.2152297,25.34412 34.9954414,25.12492 33.231277,24.84612 C31.3847275,24.55412 29.2826036,24.13212 27.5044077,23.40392 C25.9731667,22.77692 24.7235586,21.91872 23.7644032,20.65772 C22.8054482,19.39692 22.3456149,17.72812 22.3223626,15.73592"></path>
                                  <path d="M47.3579824,5.79644 C49.3149802,5.58804 51.2719779,5.37824 53.2287752,5.16604 C56.9146581,8.45024 59.0103676,13.80544 61.1183045,18.11524 C61.0810207,13.50964 61.0301063,8.90364 61.0268991,4.29764 C63.0867279,4.05224 65.1451536,3.78144 67.1991694,3.49044 C67.2182122,12.23244 67.3332707,20.97424 67.3495072,29.71624 C65.2946896,29.39704 63.2396716,29.07964 61.1840523,28.76684 C57.8164847,24.76844 55.6504171,19.64404 53.2684644,15.04524 C53.2800905,19.22744 53.3135658,23.41084 53.274077,27.59304 C51.2152505,27.29324 49.1562234,26.99584 47.0971964,26.69944 C47.2723901,19.73324 47.1709622,12.76224 47.3579824,5.79644"></path>
                                  <path d="M71.2175595,2.90568 C76.9203748,2.03668 82.6125662,1.10168 88.3101698,0.20008 C88.3117734,1.67688 88.3127757,2.89408 88.3145797,5.68908 C84.7924649,6.09808 81.2699491,6.50148 77.7458297,6.89168 C77.7642712,8.77028 77.7742937,9.84828 77.7943387,12.06508 C81.0568703,11.88788 84.3186,11.69488 87.5787261,11.48128 C87.5839378,14.17488 87.5887486,16.86868 87.5937599,19.56228 C84.348868,19.52728 81.1041766,19.45988 77.8600865,19.37708 C77.8799311,21.57508 77.8997757,23.77308 77.9212239,25.97108 C81.4832284,26.31048 85.0460347,26.63068 88.6126495,26.91828 L88.6126495,32.84988 C82.8713477,32.09408 77.1468838,31.23008 71.423823,30.34788 C71.362886,21.20048 71.2790977,12.05308 71.2175595,2.90568"></path>
                                </g>
                              </g>
                            </g>
                          </svg>
                        </div>
                      ),
                    },
                  ].map((shape) => (
                    <button
                      key={shape.value}
                      onClick={async () => {
                        const canvas = window.fabricCanvas;
                        if (canvas) {
                          console.log("text shaped");
                          const activeObject = canvas.getActiveObject();
                          if (
                            activeObject &&
                            activeObject.originType === "text"
                          ) {
                            activeObject.originText.set(
                              "textShape",
                              shape.value
                            );
                            activeObject.originText.set(
                              "textShapePreview",
                              shape.preview
                            );
                            await updateTextToCanvas();
                          }
                        }
                      }}
                      style={{
                        padding: 4,
                        border: `2px solid ${
                          textOptions.textShape === shape.value
                            ? "#007bff"
                            : "#ccc"
                        }`,
                        borderRadius: 8,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 8,
                        backgroundColor:
                          textOptions.textShape === shape.value
                            ? "#f0f7ff"
                            : "white",
                        transition: "all 0.2s ease",
                      }}
                      onMouseOver={(e) => {
                        if (textOptions.textShape !== shape.value) {
                          e.currentTarget.style.transform = "scale(1.02)";
                          e.currentTarget.style.borderColor = "#007bff";
                        }
                      }}
                      onMouseOut={(e) => {
                        if (textOptions.textShape !== shape.value) {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.borderColor = "#ccc";
                        }
                      }}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: 70,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "#f5f5f5",
                          borderRadius: 4,
                          padding: 4,
                          boxSizing: "border-box",
                        }}
                      >
                        {shape.preview}
                      </div>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: "600",
                          color: "#333",
                        }}
                      >
                        {shape.name}
                      </span>
                    </button>
                  ))}
                </div>
                {/* Done button */}
                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: 16,
                    borderTop: "1px solid #eee",
                  }}
                >
                  <PrimaryButton
                    onClick={() => setShapePage(false)}
                    style={{
                      width: "100%",
                    }}
                  >
                    Done
                  </PrimaryButton>
                </div>
              </div>
            )}
          </TabContent>
        </div>
      ) : null}
    </div>
  );
};

export default SideMenu;
