import React, { useState, useRef, useEffect } from "react";
import * as fabric from "fabric";
import SideMenu from "./SideMenu";
import {
  extractColors,
  extractVisibleColors,
  enforceBoundaryConstraints,
  MAIN_BOUNDARY_WIDTH,
  MAIN_BOUNDARY_HEIGHT,
  MAIN_BOUNDARY_BASE_LEFT_OFFSET,
  MAIN_BOUNDARY_BASE_TOP_OFFSET,
  CHEST_BOUNDARY_WIDTH,
  CHEST_BOUNDARY_HEIGHT,
  CHEST_BOUNDARY_BASE_RIGHT_OFFSET,
  CHEST_BOUNDARY_BASE_TOP_OFFSET,
  SLEEVE_BOUNDARY_WIDTH,
  SLEEVE_BOUNDARY_HEIGHT,
  LSLEEVE_BOUNDARY_BASE_LEFT_OFFSET,
  LSLEEVE_BOUNDARY_BASE_TOP_OFFSET,
  RSLEEVE_BOUNDARY_BASE_LEFT_OFFSET,
  RSLEEVE_BOUNDARY_BASE_TOP_OFFSET,
  NAMES_BASE_FONT_NAME,
  NAMES_BASE_TOP_OFFSET,
  MAIN_TEXT_SCALE,
  DEFAULT_FONT_SIZE,
  SCALED_FONT_SIZE,
  hexToRgb,
  WOOCOMMERCE_CONSUMER_KEY,
  WOOCOMMERCE_CONSUMER_SECRET,
  predefinedColors,
} from "../common/functions";
import { GoZoomIn, GoZoomOut } from "react-icons/go";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faFont,
  faImage,
  faTimes,
  faBox,
  faFileSignature,
} from "@fortawesome/free-solid-svg-icons";
import { TabBarButton } from "./Styles";
import EnterNumbers from "./EnterNumbers";
import axios from "axios";

const icons = {
  upload: <FontAwesomeIcon icon={faUpload} style={{ fontSize: 24 }} />,
  text: <FontAwesomeIcon icon={faFont} style={{ fontSize: 24 }} />,
  art: <FontAwesomeIcon icon={faImage} style={{ fontSize: 24 }} />,
  numbers: <FontAwesomeIcon icon={faFileSignature} style={{ fontSize: 24 }} />,
  product: <FontAwesomeIcon icon={faBox} style={{ fontSize: 24 }} />,
  close: <FontAwesomeIcon icon={faTimes} style={{ fontSize: 24 }} />,
};
const DesignEditor = () => {
  const DPR = window.devicePixelRatio || 1;
  const [textOptions, setTextOptions] = useState({
    fill: "#000000",
    fontFamily: "Arial",
    fontSize: 80,
    stroke: "#000000",
    strokeWidth: 0,
    textShape: "normal",
    textShapePreview: (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg viewBox="0 0 176.76 31.19" width="84" height="27">
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
    fontWeight: "normal",
    textDecoration: "",
    rotation: 0,
  });
  const [canvasScale, setCanvasScale] = useState(1);
  const [activeTab, setActiveTab] = useState("text");
  const [textInput, setTextInput] = useState("");
  const [textPage, setTextPage] = useState(1);
  const [colorPickerType, setColorPickerType] = useState(null);
  const [isAddTextEnabled, setIsAddTextEnabled] = useState(false);
  const [extractedColors, setExtractedColors] = useState([]);
  const [replacedColors, setReplacedColors] = useState([]);
  const [selectedColorIndex, setSelectedColorIndex] = useState(null);
  const [activeImageId, setActiveImageId] = useState(null);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [resetToOriginal, setResetToOriginal] = useState(false);
  const [centerObject, setCenterObject] = useState(false);
  const [bringToFront, setBringToFront] = useState(false);
  const [sendToBack, setSendToBack] = useState(false);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });
  const [isFront, setIsFront] = useState(true);
  const [currentView, setCurrentView] = useState("front");
  const [isZoomedToFit, setIsZoomedToFit] = useState(false);
  const [sideNames, setSideNames] = useState("front");
  const [sideNumbers, setSideNumbers] = useState("front");
  const [heightNames, setHeightNames] = useState(75);
  const [heightNumbers, setHeightNumbers] = useState(300);
  const [colorNames, setColorNames] = useState("#000000");
  const [colorNumbers, setColorNumbers] = useState("#000000");
  const [isAddNames, setIsAddNames] = useState(false);
  const [isAddNumbers, setIsAddNumbers] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showNameNumberDialog, setShowNameNumberDialog] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [showTermsDialog, setShowTermsDialog] = useState(false);

  const frontCanvasRef = useRef(null);
  const backCanvasRef = useRef(null);
  const leftCanvasRef = useRef(null);
  const rightCanvasRef = useRef(null);
  const initializedRef = useRef(false);
  const colorPickerTypeRef = useRef(colorPickerType);
  const isMobileRef = useRef(isMobile);
  const canvasRef = useRef(null);
  const currentViewRef = useRef(currentView);
  const colorUsage = {};

  useEffect(() => {
    currentViewRef.current = currentView;
    if (
      frontCanvasRef.current &&
      backCanvasRef.current &&
      leftCanvasRef.current &&
      rightCanvasRef.current
    ) {
      frontCanvasRef.current.discardActiveObject();
      backCanvasRef.current.discardActiveObject();
      leftCanvasRef.current.discardActiveObject();
      rightCanvasRef.current.discardActiveObject();

      switch (currentView) {
        case "front":
          canvasRef.current = frontCanvasRef.current;
          break;
        case "back":
          canvasRef.current = backCanvasRef.current;
          break;
        case "left":
          canvasRef.current = leftCanvasRef.current;
          break;
        case "right":
          canvasRef.current = rightCanvasRef.current;
          break;
        default:
          canvasRef.current = frontCanvasRef.current; // fallback
          break;
      }
      if (currentView === "front") {
        frontCanvasRef.current.wrapperEl.style.display = "block";
        frontCanvasRef.current.upperCanvasEl.style.display = "block";
      } else {
        frontCanvasRef.current.wrapperEl.style.display = "none";
        frontCanvasRef.current.upperCanvasEl.style.display = "none";
      }

      if (currentView === "back") {
        backCanvasRef.current.wrapperEl.style.display = "block";
        backCanvasRef.current.upperCanvasEl.style.display = "block";
      } else {
        backCanvasRef.current.wrapperEl.style.display = "none";
        backCanvasRef.current.upperCanvasEl.style.display = "none";
      }

      if (currentView === "left") {
        leftCanvasRef.current.wrapperEl.style.display = "block";
        leftCanvasRef.current.upperCanvasEl.style.display = "block";
      } else {
        leftCanvasRef.current.wrapperEl.style.display = "none";
        leftCanvasRef.current.upperCanvasEl.style.display = "none";
      }

      if (currentView === "right") {
        rightCanvasRef.current.wrapperEl.style.display = "block";
        rightCanvasRef.current.upperCanvasEl.style.display = "block";
      } else {
        rightCanvasRef.current.wrapperEl.style.display = "none";
        rightCanvasRef.current.upperCanvasEl.style.display = "none";
      }
      window.fabricCanvas = canvasRef.current;
    }
  }, [currentView]);

  const rotateIcon = new Image();
  rotateIcon.src = `${import.meta.env.BASE_URL}assets/icons/rotate.png`;

  const resizeIcon = new Image();
  resizeIcon.src = `${import.meta.env.BASE_URL}assets/icons/resize.png`;

  const deleteIcon = new Image();
  deleteIcon.src = `${import.meta.env.BASE_URL}assets/icons/delete.png`;

  const duplicateIcon = new Image();
  duplicateIcon.src = `${import.meta.env.BASE_URL}assets/icons/duplicate.png`;

  const circleIcon = new Image();
  circleIcon.src = `${import.meta.env.BASE_URL}assets/icons/black-circle.png`;

  const createControlRenderer = (icon) => {
    return (ctx, left, top, styleOverride, fabricObject) => {
      const size = styleOverride.cornerSize || 12;
      let iconSize = size * 2;
      if (icon === circleIcon) iconSize = 12;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle || 0));

      if (icon.complete) {
        ctx.drawImage(icon, -iconSize / 2, -iconSize / 2, iconSize, iconSize);
      } else {
        icon.onload = () => {
          fabricObject.canvas?.requestRenderAll();
        };
      }

      ctx.restore();
    };
  };

  const rotateControlRenderer = createControlRenderer(rotateIcon);
  const resizeControlRenderer = createControlRenderer(resizeIcon);
  const deleteControlRenderer = createControlRenderer(deleteIcon);
  const circleControlRenderer = createControlRenderer(circleIcon);

  const createPNGImgObjectFromText = (textObj) => {
    try {
      const canvas = canvasRef.current;
      const bg = canvas.backgroundImage;
      const scaledCanvas = canvas.height / bg.metadata.scaleBaseHeight;
      const maxWidth = MAIN_BOUNDARY_WIDTH * scaledCanvas;
      const maxHeight = MAIN_BOUNDARY_HEIGHT * scaledCanvas;

      // Step 1: Create fabric.Textbox offscreen just to measure size
      const measuringText = new fabric.Textbox(textObj.text, {
        fontSize: textObj.fontSize,
        fontFamily: textObj.fontFamily,
        fill: textObj.fill,
        stroke: textObj.stroke,
        strokeWidth: textObj.strokeWidth || 0,
        fontWeight: textObj.fontWeight,
        textDecoration: textObj.textDecoration,
        textAlign: "center",
        width: maxWidth * 4, // some large width for wrapping to avoid line breaks
        originX: "left",
        originY: "top",
        scaleX: scaledCanvas,
        scaleY: scaledCanvas,
      });

      // Calculate bounding box dimensions of the text
      const bounds = measuringText.getBoundingRect();
      const canvasWidth = Math.ceil(bounds.width * DPR);
      const canvasHeight = Math.ceil(bounds.height * DPR);

      // Step 2: Create a high-DPI temp canvas
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvasWidth;
      tempCanvas.height = canvasHeight;
      tempCanvas.style.width = `${canvasWidth / DPR}px`;
      tempCanvas.style.height = `${canvasHeight / DPR}px`;

      // Create Fabric canvas and apply DPR scaling
      const tempFabric = new fabric.StaticCanvas(tempCanvas, {
        enableRetinaScaling: false,
      });
      tempFabric.setDimensions(
        { width: canvasWidth, height: canvasHeight },
        { backstoreOnly: true }
      );
      tempFabric.setZoom(DPR);

      // Set text on the temp canvas
      measuringText.set({
        left: canvasWidth / 2 / DPR,
        top: canvasHeight / 2 / DPR,
        originX: "center",
        originY: "center",
        width: canvasWidth / DPR,
      });
      tempFabric.add(measuringText);
      tempFabric.renderAll();

      // Step 3: Crop the text canvas tightly
      const tempCtx = tempCanvas.getContext("2d");
      const tempImageData = tempCtx.getImageData(
        0,
        0,
        canvasWidth,
        canvasHeight
      );
      const tempData = tempImageData.data;

      let cropMinX = canvasWidth,
        cropMinY = canvasHeight,
        cropMaxX = 0,
        cropMaxY = 0;

      for (let y = 0; y < canvasHeight; y++) {
        for (let x = 0; x < canvasWidth; x++) {
          const i = (y * canvasWidth + x) * 4;
          if (tempData[i + 3] > 0) {
            cropMinX = Math.min(cropMinX, x);
            cropMinY = Math.min(cropMinY, y);
            cropMaxX = Math.max(cropMaxX, x);
            cropMaxY = Math.max(cropMaxY, y);
          }
        }
      }

      const padding = 0;
      cropMinX = Math.max(0, cropMinX - padding);
      cropMinY = Math.max(0, cropMinY - padding);
      cropMaxX = Math.min(canvasWidth, cropMaxX + padding);
      cropMaxY = Math.min(canvasHeight, cropMaxY + padding);

      let croppedWidth = cropMaxX - cropMinX;
      let croppedHeight = cropMaxY - cropMinY;

      // Create cropped canvas
      const croppedCanvas = document.createElement("canvas");
      croppedCanvas.width = croppedWidth;
      croppedCanvas.height = croppedHeight;
      croppedCanvas
        .getContext("2d")
        .drawImage(
          tempCanvas,
          cropMinX,
          cropMinY,
          croppedWidth,
          croppedHeight,
          0,
          0,
          croppedWidth,
          croppedHeight
        );

      // Step 4: Scale down if cropped exceeds max boundary
      let scale = 1;
      if (croppedWidth > maxWidth || croppedHeight > maxHeight) {
        scale = Math.min(maxWidth / croppedWidth, maxHeight / croppedHeight);
      }

      // Update textObj fontSize based on scale (only if scale < 1)
      if (scale < 1) {
        textObj.fontSize = Math.floor(textObj.fontSize * scale); // rounded to 2 decimals
      }

      if (scale < 1) {
        const scaledCanvas = document.createElement("canvas");
        scaledCanvas.width = croppedWidth * scale;
        scaledCanvas.height = croppedHeight * scale;
        scaledCanvas
          .getContext("2d")
          .drawImage(
            croppedCanvas,
            0,
            0,
            croppedWidth,
            croppedHeight,
            0,
            0,
            scaledCanvas.width,
            scaledCanvas.height
          );

        croppedCanvas.width = scaledCanvas.width;
        croppedCanvas.height = scaledCanvas.height;
        croppedCanvas
          .getContext("2d")
          .clearRect(0, 0, croppedCanvas.width, croppedCanvas.height);
        croppedCanvas.getContext("2d").drawImage(scaledCanvas, 0, 0);
        croppedWidth = scaledCanvas.width;
        croppedHeight = scaledCanvas.height;
      }

      // Step 5: Add as fabric.Image on your main canvas
      const finalImg = new fabric.Image(croppedCanvas, {
        left: textObj.left,
        top: textObj.top,
        originX: "left",
        originY: "top",
        scaleX: 1 / DPR,
        scaleY: 1 / DPR,
        angle: 0,
        originType: "text",
        originText: textObj,
      });

      enforceBoundaryConstraints(canvas, finalImg);
      addCanvasObjectWithMetadata(canvas, finalImg);
      canvas.requestRenderAll();
      canvas.discardActiveObject();
      canvas.setActiveObject(finalImg);
      applyTransformControls(finalImg);
    } catch (error) {
      console.error("Error during PNG conversion:", error);
    }
  };

  const handleTermsCheck = () => {
    setIsTermsAccepted(!isTermsAccepted);
  };

  const handleAcceptTerms = () => {
    if (isTermsAccepted) {
      setShowTermsDialog(false);
    }
  };

  const handleCloseTerms = () => {
    setIsTermsAccepted(false);
    setShowTermsDialog(false);
  };

  const handleClick = (e) => {
    if (contextMenu.show) {
      e.preventDefault();
      e.stopPropagation();
    }
    setContextMenu({ show: false, x: 0, y: 0 });
  };

  // Add context menu handler
  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  // Prevent default context menu on the entire container
  const preventDefaultContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // When selection changes, update text options with active object props if it's a text
  const updateOptionsFromActiveObject = () => {
    const canvas = canvasRef.current;
    const active = canvas.getActiveObject();
    console.log(active);
    if (active && active.originType === "text") {
      const activeOriginText = active.originText;
      setActiveTab("text");
      setTextInput(activeOriginText.text);
      setTextOptions((prevOptions) => ({
        text: activeOriginText.text || "",
        fill: activeOriginText.fill || "#000000",
        fontFamily: activeOriginText.fontFamily || "Arial",
        fontSize: activeOriginText.fontSize || 80,
        stroke: activeOriginText.stroke || "#000000",
        strokeWidth: activeOriginText.strokeWidth || 0,
        textShape:
          activeOriginText.textShape || prevOptions.textShape || "normal",
        textShapePreview: activeOriginText.textShapePreview ||
          prevOptions.textShapePreview || (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg viewBox="0 0 176.76 31.19" width="84" height="27">
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
        fontWeight: activeOriginText.fontWeight || "normal",
        textDecoration: activeOriginText.textDecoration || "",
        rotation: activeOriginText.angle || 0,
      }));
      applyTransformControls(active);
      if (
        colorPickerTypeRef.current === "fill" ||
        colorPickerTypeRef.current === "outline"
      ) {
        setTextPage(3);
      } else {
        setTextPage(2);
      }

      canvas.requestRenderAll();
    } else if (active.originType === "clipart") {
      setActiveTab("art");
      setTextPage(2);
      setExtractedColors(active.extractedColors || []);
      setReplacedColors(active.replacedColors || []);
      setRemoveBackground(active.removeBackground || false);
      if (colorPickerTypeRef.current === "clipart") {
        setTextPage(3);
      } else {
        setTextPage(2);
      }
    } else if (
      active.originType === "names" ||
      active.originType === "numbers"
    ) {
      setActiveTab("numbers");
      setTextPage(1);
    } else if (active.type === "image") {
      setActiveTab("upload");
      setTextPage(2);
      setActiveImageId(active.imageId);
      setExtractedColors(active.extractedColors || []);
      setReplacedColors(active.replacedColors || []);
      setRemoveBackground(active.removeBackground || false);
      if (colorPickerTypeRef.current === "upload") {
        setTextPage(3);
      } else {
        setTextPage(2);
      }
    }
    if (isMobileRef.current) setSidebarVisible(true);
    setCenterObject(active.centerObject || false);
    setBringToFront(active.bringToFront || false);
    setSendToBack(active.sendToBack || false);
    setFlipHorizontal(active.flipX || false);
    setFlipVertical(active.flipY || false);
  };

  const clearedSelection = () => {
    const canvas = canvasRef.current;
    if (!canvas.getActiveObject()) {
      setTextOptions({
        fill: "#000000",
        fontFamily: "Arial",
        fontSize: 80,
        stroke: "#000000",
        strokeWidth: 0,
        textShape: "normal",
        textShapePreview: (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 176.76 31.19" width="84" height="27">
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
        fontWeight: "none",
        textDecoration: "none",
        rotation: 0,
      });
      setTextInput("");
      setTextPage(1);
      canvas.requestRenderAll();
    }
    if (isMobileRef.current) setSidebarVisible(false);
  };

  let isScaling = false;
  const handleObjectScaling = (e) => {
    const canvas = canvasRef.current;
    const selObj = e.target;

    const defaultScale = DEFAULT_FONT_SIZE / SCALED_FONT_SIZE;
    if (!canvas || !selObj) return;

    const mainBoundary = canvas
      .getObjects()
      .find((obj) => obj.name === "boundary");
    const chestBoundary = canvas
      .getObjects()
      .find((obj) => obj.name === "chestRect");

    if (selObj && mainBoundary) {
      mainBoundary.visible = true;
      if (currentViewRef.current === "front" && chestBoundary) {
        chestBoundary.visible = true;
      }
    }
    isScaling = true;

    // Store original top-left position once
    if (!selObj._originalLeft) selObj._originalLeft = selObj.left;
    if (!selObj._originalTop) selObj._originalTop = selObj.top;

    const bounds = mainBoundary.getBoundingRect(true);

    // Prevent flipping
    selObj.scaleX = Math.max(0.01, Math.abs(selObj.scaleX));
    selObj.scaleY = Math.max(0.01, Math.abs(selObj.scaleY));

    // Available space from top-left to bottom-right of boundary
    const availableWidth = bounds.left + bounds.width - selObj._originalLeft;
    const availableHeight = bounds.top + bounds.height - selObj._originalTop;

    // Max scale that keeps the object within bounds
    const maxScaleX = availableWidth / selObj.width;
    const maxScaleY = availableHeight / selObj.height;
    const maxScale = Math.min(maxScaleX, maxScaleY);

    // Minimum scale (e.g., 20px min font size)
    const MIN_PIXEL_SIZE = 20;
    const minScaleX = MIN_PIXEL_SIZE / selObj.width;
    const minScaleY = MIN_PIXEL_SIZE / selObj.height;
    const minScale = Math.max(minScaleX, minScaleY);

    // Apply clamped scale
    selObj.scaleX = Math.max(minScale, Math.min(selObj.scaleX, maxScale));
    selObj.scaleY = Math.max(minScale, Math.min(selObj.scaleY, maxScale));

    // Lock position to original top-left
    selObj.left = selObj._originalLeft;
    selObj.top = selObj._originalTop;

    if (selObj.originType === "text") {
      // Update font size
      const newFontSize = Math.floor(
        (Math.max(selObj.scaleX, selObj.scaleY) / defaultScale) *
          DEFAULT_FONT_SIZE
      );

      setTextOptions((prev) => ({
        ...prev,
        fontSize: newFontSize * DPR,
      }));
    }
    selObj.setCoords();
    canvas.requestRenderAll();
    setResetToOriginal(true);
  };

  const handleObjectScaling1 = (e) => {
    const canvas = canvasRef.current;
    const selObj = e.target;

    const defaultScale = DEFAULT_FONT_SIZE / SCALED_FONT_SIZE;
    if (!canvas || !selObj) return;

    const mainBoundary = canvas
      .getObjects()
      .find((obj) => obj.name === "boundary");
    const chestBoundary = canvas
      .getObjects()
      .find((obj) => obj.name === "chestRect");

    if (selObj && mainBoundary) {
      mainBoundary.visible = true;
      if (currentViewRef.current === "front" && chestBoundary) {
        chestBoundary.visible = true;
      }
    }
    isScaling = true;

    const bounds = mainBoundary.getBoundingRect(true);
    // Store original top-left position once
    if (!selObj._originalLeft) selObj._originalLeft = selObj.left;
    // Available space from top-left to bottom-right of boundary
    const availableWidth = bounds.left + bounds.width - selObj._originalLeft;
    const availableHeight = bounds.top + bounds.height - selObj._originalTop;

    // Max scale that keeps the object within bounds
    const maxScaleX = availableWidth / selObj.width;
    const maxScaleY = availableHeight / selObj.height;
    const maxScale = Math.min(maxScaleX, maxScaleY);

    // Minimum scale (e.g., 20px min font size)
    const MIN_PIXEL_SIZE = 40;
    const minScaleX = MIN_PIXEL_SIZE / selObj.width;
    const minScaleY = MIN_PIXEL_SIZE / selObj.height;
    const minScale = Math.max(minScaleX, minScaleY);

    // Apply clamped scale
    selObj.scaleX = Math.max(minScale, Math.min(selObj.scaleX, maxScale));
    selObj.scaleY = Math.max(minScale, Math.min(selObj.scaleY, maxScale));

    // Lock position to original top-left
    selObj.left = selObj._originalLeft;
    selObj.top = selObj._originalTop;

    if (selObj.originType === "text") {
      // Update font size
      const newFontSize = Math.floor(
        (Math.max(selObj.scaleX, selObj.scaleY) / defaultScale) *
          DEFAULT_FONT_SIZE
      );

      setTextOptions((prev) => ({
        ...prev,
        fontSize: newFontSize * DPR,
      }));
    }
    selObj.setCoords();
    canvas.requestRenderAll();
    setResetToOriginal(true);
  };

  const handleMouseUp1 = (e) => {
    const selObj = e.target;

    if (selObj && selObj.originType === "text" && isScaling) {
      const textObj = selObj.originText;
      const newFontSize = Math.round(
        textObj.fontSize * Math.max(selObj.scaleX, selObj.scaleY) * DPR
      );
      textObj.set({
        fontSize: newFontSize,
        scaleX: 1,
        scaleY: 1,
      });

      textObj.set({
        originX: selObj.originX,
        originY: selObj.originY,
        left: selObj.left,
        top: selObj.top,
      });

      handleUpdateCanvas();
    }
    if (isScaling) {
      isScaling = false;
      delete selObj._originalLeft;
      delete selObj._originalTop;
    }
  };

  const handleMouseUp = (e) => {
    const selObj = e.target;
    const defaultScale = DEFAULT_FONT_SIZE / SCALED_FONT_SIZE;

    if (selObj && selObj.originType === "text" && isScaling) {
      const textObj = selObj.originText;
      const newFontSize = Math.floor(
        (Math.max(selObj.scaleX, selObj.scaleY) / defaultScale) *
          DEFAULT_FONT_SIZE
      );

      textObj.set({
        fontSize: newFontSize,
        scaleX: 1,
        scaleY: 1,
      });

      handleUpdateCanvas();
    }
    if (isScaling) {
      isScaling = false;
      delete selObj._originalLeft;
      delete selObj._originalTop;
    }
  };

  const handleObjectMoving = (e) => {
    const canvas = canvasRef.current;
    const selObj = e.target;

    if (selObj && selObj.originType === "text") {
      const textObj = selObj.originText;
      textObj.set({
        originX: selObj.originX,
        originY: selObj.originY,
        left: selObj.left,
        top: selObj.top,
      });
    }

    const mainBoundary = canvas
      .getObjects()
      .find((obj) => obj.name === "boundary");
    const chestBoundary = canvas
      .getObjects()
      .find((obj) => obj.name === "chestRect");

    if (selObj && mainBoundary) {
      mainBoundary.visible = true;
      if (currentViewRef.current === "front" && chestBoundary) {
        chestBoundary.visible = true;
      }
    }

    const selWidth = selObj.getScaledWidth?.() || selObj.width;
    const selHeight = selObj.getScaledHeight?.() || selObj.height;

    // Compute object bounding box based on origin
    let selLeft = selObj.left;

    let selTop = selObj.top;

    // Boundary coordinates
    const boundaryLeft = mainBoundary.left;
    const boundaryTop = mainBoundary.top;
    const boundaryRight = boundaryLeft + mainBoundary.width;
    const boundaryBottom = boundaryTop + mainBoundary.height;

    // Get rotation in radians
    const angle = ((selObj.angle || 0) * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    // Object width and height with scaling
    const w = selObj.width * selObj.scaleX;
    const h = selObj.height * selObj.scaleY;

    // Calculate rotated corners relative to top-left origin
    const corners = [
      { x: 0, y: 0 }, // top-left (origin)
      { x: w * cos, y: w * sin }, // top-right
      { x: w * cos - h * sin, y: w * sin + h * cos }, // bottom-right
      { x: -h * sin, y: h * cos }, // bottom-left
    ];

    // Find bounding box min/max of rotated corners
    const xs = corners.map((c) => c.x);
    const ys = corners.map((c) => c.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const rotatedWidth = maxX - minX;
    const rotatedHeight = maxY - minY;

    // Calculate absolute bounding box top-left
    const boundingLeft = selObj.left + minX;
    const boundingTop = selObj.top + minY;

    let newLeft = selObj.left;
    let newTop = selObj.top;

    // Clamp bounding box inside main boundary by adjusting top-left origin
    if (boundingLeft < boundaryLeft) {
      newLeft += boundaryLeft - boundingLeft;
    }
    if (boundingLeft + rotatedWidth > boundaryRight) {
      newLeft -= boundingLeft + rotatedWidth - boundaryRight;
    }
    if (boundingTop < boundaryTop) {
      newTop += boundaryTop - boundingTop;
    }
    if (boundingTop + rotatedHeight > boundaryBottom) {
      newTop -= boundingTop + rotatedHeight - boundaryBottom;
    }

    selObj.set({ left: newLeft, top: newTop });
    selObj.setCoords();
    if (mainBoundary) {
      const scale =
        canvas.height / canvas.backgroundImage.metadata.scaleBaseHeight;
      const boundaryLeft = mainBoundary.left;
      const boundaryTop = mainBoundary.top;

      selObj.metadata = {
        baseWidth: selObj.width,
        baseHeight: selObj.height,
        baseLeftOffset: (selObj.left - boundaryLeft) / scale,
        baseTopOffset: (selObj.top - boundaryTop) / scale,
        baseScaleX: selObj.scaleX / scale,
        baseScaleY: selObj.scaleY / scale,
      };
    }
    canvas.requestRenderAll();
  };

  const handleObjectRotating = (e) => {
    setResetToOriginal(true);
  };

  const handleObjectModified = (e) => {
    const canvas = canvasRef.current;
    const mainBoundary = canvas
      .getObjects()
      .find((obj) => obj.name === "boundary");
    const chestBoundary = canvas
      .getObjects()
      .find((obj) => obj.name === "chestRect");

    if (canvas && mainBoundary) {
      mainBoundary.visible = false;
      if (currentViewRef.current === "front" && chestBoundary) {
        chestBoundary.visible = false;
      }
    }
    // console.log("object modififed");
    // const obj = e.target;
    // const canvas = canvasRef.current;
    // if (obj && obj !== canvas.backgroundImage && obj.name !== "boundary") {
    //   const boundary = canvas
    //     .getObjects()
    //     .find((obj) => obj.name === "boundary");
    //   if (!boundary) return;
    //   // const scale = canvas.height / bg.metadata.scaleBaseHeight;
    //   // setCanvasScale(scale);
    //   const prev = obj.metadata || [];
    //   obj.metadata = {
    //     ...prev,
    //     baseLeftOffset: obj.left - boundary.left,
    //     baseTopOffset: obj.top - boundary.top,
    //   };
    // }
  };

  const addCanvasObjectWithMetadata = (canvas, object, metadata = {}) => {
    const boundary = canvas.getObjects().find((obj) => obj.name === "boundary");
    const bg = canvas.backgroundImage;
    if (!boundary || !bg || !bg.metadata) return;

    // Current canvas scale
    const scale = canvas.height / bg.metadata.scaleBaseHeight;

    // Store position relative to top-left of boundary
    const baseLeftOffset = (object.left - boundary.left) / scale;
    const baseTopOffset = (object.top - boundary.top) / scale;

    object.metadata = {
      baseWidth: object.width,
      baseHeight: object.height,
      baseLeftOffset,
      baseTopOffset,
      baseScaleX: object.scaleX / scale,
      baseScaleY: object.scaleY / scale,
      ...metadata,
    };

    canvas.add(object);
    applyTransformControls(object);
  };

  const loadCanvasBkImage = (canvas, src) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const fabricImage = new fabric.Image(img);

      // Scale image to fit canvas height
      const scale = canvas.height / img.height;
      setCanvasScale(scale); // your external state or ref update
      fabricImage.scale(scale);

      // Calculate scaled width and height
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      // Center image horizontally
      const imgLeft = (canvas.width - scaledWidth) / 2;
      const imgTop = 0;

      fabricImage.left = imgLeft;
      fabricImage.top = imgTop;

      // Set background image and color
      canvas.backgroundImage = fabricImage;
      canvas.backgroundColor = "#D9D9D9";

      // Render after setting background image and color
      canvas.renderAll();
      if (
        canvas === frontCanvasRef.current ||
        canvas === backCanvasRef.current
      ) {
        // Calculate scaled rectangle size (boundary box)
        const rectWidth = MAIN_BOUNDARY_WIDTH * scale;
        const rectHeight = MAIN_BOUNDARY_HEIGHT * scale;

        // Calculate top-left corner of boundary box relative to background image
        const rectLeft = imgLeft + MAIN_BOUNDARY_BASE_LEFT_OFFSET * scale;
        const rectTop = imgTop + MAIN_BOUNDARY_BASE_TOP_OFFSET * scale;

        // Create boundary rectangle with top-left origin
        const boundaryRect = new fabric.Rect({
          left: rectLeft,
          top: rectTop,
          width: rectWidth,
          height: rectHeight,
          fill: "transparent",
          stroke: "#000",
          strokeDashArray: [2, 2],
          originX: "left",
          originY: "top",
          strokeWidth: 1,
          selectable: false,
          evented: false,
          hasControls: false,
          hasBorders: false,
          lockMovementX: true,
          lockMovementY: true,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true,
          name: "boundary",
          excludeFromExport: true,
          absolutePositioned: true,
          hoverCursor: "default",
          moveCursor: "default",
        });

        // Set background image metadata
        fabricImage.metadata = {
          scaleBaseHeight: img.height,
          baseLeft: imgLeft,
          baseTop: imgTop,
        };

        // Set boundary metadata
        boundaryRect.metadata = {
          baseWidth: MAIN_BOUNDARY_WIDTH,
          baseHeight: MAIN_BOUNDARY_HEIGHT,
          baseLeftOffset: MAIN_BOUNDARY_BASE_LEFT_OFFSET,
          baseTopOffset: MAIN_BOUNDARY_BASE_TOP_OFFSET,
        };

        boundaryRect.visible = false;
        canvas.add(boundaryRect);
        canvas.sendObjectToBack(boundaryRect);
        if (canvas === frontCanvasRef.current) {
          const boundary = canvas
            .getObjects()
            .find((obj) => obj.name === "boundary");
          if (!boundary) return;

          // Get top-right point of the boundary
          const topRight = boundary.getPointByOrigin("right", "top");

          const chestRect = new fabric.Rect({
            left:
              topRight.x -
              CHEST_BOUNDARY_WIDTH -
              CHEST_BOUNDARY_BASE_RIGHT_OFFSET,
            top: topRight.y + CHEST_BOUNDARY_BASE_TOP_OFFSET,
            width: CHEST_BOUNDARY_WIDTH,
            height: CHEST_BOUNDARY_HEIGHT,
            fill: "transparent",
            stroke: "#000",
            strokeDashArray: [2, 2],
            originX: "left",
            originY: "top",
            strokeWidth: 1,
            selectable: false,
            evented: false,
            hasControls: false,
            hasBorders: false,
            lockMovementX: true,
            lockMovementY: true,
            lockRotation: true,
            lockScalingX: true,
            lockScalingY: true,
            name: "chestRect",
            hoverCursor: "default",
            moveCursor: "default",
          });

          // Add chestRect metadata
          chestRect.metadata = {
            baseWidth: CHEST_BOUNDARY_WIDTH,
            baseHeight: CHEST_BOUNDARY_HEIGHT,
            baseRightOffset: CHEST_BOUNDARY_BASE_RIGHT_OFFSET,
            baseTopOffset: CHEST_BOUNDARY_BASE_TOP_OFFSET,
          };

          chestRect.visible = false;
          canvas.add(chestRect);
          canvas.sendObjectToBack(chestRect);
        }
      } else if (
        canvas === leftCanvasRef.current ||
        canvas === rightCanvasRef.current
      ) {
        // Calculate scaled rectangle size (boundary box)
        const rectWidth = SLEEVE_BOUNDARY_WIDTH * scale;
        const rectHeight = SLEEVE_BOUNDARY_HEIGHT * scale;

        // Calculate top-left corner of boundary box relative to background image
        const rectLeft =
          imgLeft +
          (canvas === leftCanvasRef.current
            ? LSLEEVE_BOUNDARY_BASE_LEFT_OFFSET
            : RSLEEVE_BOUNDARY_BASE_LEFT_OFFSET) *
            scale;
        const rectTop =
          imgTop +
          (canvas === leftCanvasRef.current
            ? LSLEEVE_BOUNDARY_BASE_TOP_OFFSET
            : RSLEEVE_BOUNDARY_BASE_TOP_OFFSET) *
            scale;

        // Create boundary rectangle with top-left origin
        const boundaryRect = new fabric.Rect({
          left: rectLeft,
          top: rectTop,
          width: rectWidth,
          height: rectHeight,
          fill: "transparent",
          stroke: "#000",
          strokeDashArray: [2, 2],
          originX: "left",
          originY: "top",
          strokeWidth: 1,
          selectable: false,
          evented: false,
          hasControls: false,
          hasBorders: false,
          lockMovementX: true,
          lockMovementY: true,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true,
          name: "boundary",
          excludeFromExport: true,
          absolutePositioned: true,
          hoverCursor: "default",
          moveCursor: "default",
        });

        // Set background image metadata
        fabricImage.metadata = {
          scaleBaseHeight: img.height,
          baseLeft: imgLeft,
          baseTop: imgTop,
        };

        // Set boundary metadata
        boundaryRect.metadata = {
          baseWidth: SLEEVE_BOUNDARY_WIDTH,
          baseHeight: SLEEVE_BOUNDARY_HEIGHT,
          baseLeftOffset:
            canvas === leftCanvasRef.current
              ? LSLEEVE_BOUNDARY_BASE_LEFT_OFFSET
              : RSLEEVE_BOUNDARY_BASE_LEFT_OFFSET,
          baseTopOffset:
            canvas === leftCanvasRef.current
              ? LSLEEVE_BOUNDARY_BASE_TOP_OFFSET
              : RSLEEVE_BOUNDARY_BASE_TOP_OFFSET,
        };

        boundaryRect.visible = false;
        canvas.add(boundaryRect);
        canvas.sendObjectToBack(boundaryRect);
      }
      canvas.requestRenderAll();
    };

    img.src = src;
  };

  const resizeCanvas = () => {
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    setIsMobile(mobile);
    const container = document.getElementById("canvas-container");
    if (!container) return;

    // Enforce height in case mobile layout collapses
    if (mobile && container.clientHeight < 100) {
      container.style.height = "100vh";
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    [frontCanvasRef.current, backCanvasRef.current].forEach((canvas) => {
      if (!canvas) return;

      const canvasEl = canvas.getElement();
      canvasEl.style.width = "100%";
      canvasEl.style.height = "100%";

      canvas.setWidth(width);
      canvas.setHeight(height);

      canvas.backgroundColor = "#D9D9D9";

      const bg = canvas.backgroundImage;
      if (bg && bg.metadata) {
        const scale = canvas.height / bg.metadata.scaleBaseHeight;
        setCanvasScale(scale);

        bg.scaleX = scale;
        bg.scaleY = scale;
        const scaledWidth = bg.width * scale;
        bg.left = (canvas.width - scaledWidth) / 2;
        bg.top = 0;
        bg.setCoords();

        let boundary;

        // First pass: locate and scale the boundary
        canvas.getObjects().forEach((obj) => {
          if (obj.name === "boundary" && obj.metadata) {
            const { baseWidth, baseHeight, baseLeftOffset, baseTopOffset } =
              obj.metadata;

            obj.set({
              width: baseWidth * scale,
              height: baseHeight * scale,
              left: bg.left + Math.floor(baseLeftOffset * scale),
              top: bg.top + Math.floor(baseTopOffset * scale),
              scaleX: 1,
              scaleY: 1,
            });

            obj.setCoords();
            boundary = obj;
            if (boundary) {
              const canvasW = canvas.getWidth();
              const canvasH = canvas.getHeight();
              const boundaryRect = boundary.getBoundingRect(true);

              // const fitsVertically = boundaryRect.height <= canvasH;

              const screenIsSmall = window.innerWidth < 900;

              if (screenIsSmall) {
                // Compute zoom to fit boundary with 10px side padding and full height
                const padding = 10;
                const zoomW = (canvasW - 2 * padding) / boundaryRect.width;
                const zoomH = canvasH / boundaryRect.height;
                const zoom = Math.min(zoomW, zoomH);

                canvas.setZoom(zoom);

                // Center the view on the boundary rect
                const centerX = boundaryRect.left + boundaryRect.width / 2;
                const centerY = boundaryRect.top + boundaryRect.height / 2;

                canvas.viewportTransform[4] = canvasW / 2 - centerX * zoom;
                canvas.viewportTransform[5] = canvasH / 2 - centerY * zoom;
              } else {
                // Reset zoom and pan to default if everything fits
                canvas.setZoom(1);
                canvas.viewportTransform[4] = 0;
                canvas.viewportTransform[5] = 0;
              }

              canvas.requestRenderAll();
            }
          }
        });

        // Second pass: scale and position other objects using boundary
        if (boundary) {
          canvas.getObjects().forEach((obj) => {
            if (
              obj.name !== "boundary" &&
              obj !== canvas.backgroundImage &&
              obj.metadata
            ) {
              const {
                baseLeftOffset,
                baseRightOffset,
                baseTopOffset,
                baseScaleX,
                baseScaleY,
                baseWidth,
                baseHeight,
              } = obj.metadata;

              if (obj.name === "chestRect") {
                const newLeft =
                  boundary.left +
                  boundary.width -
                  baseRightOffset * scale -
                  baseWidth * scale;
                const newTop = boundary.top + baseTopOffset * scale;

                obj.set({
                  width: baseWidth * scale,
                  height: baseHeight * scale,
                  left: newLeft,
                  top: newTop,
                  scaleX: 1,
                  scaleY: 1,
                });
              } else {
                const newLeft = boundary.left + baseLeftOffset * scale;
                const newTop = boundary.top + baseTopOffset * scale;

                // Reset scale first to avoid compounding
                obj.set({
                  scaleX: 1,
                  scaleY: 1,
                });

                obj.set({
                  left: newLeft,
                  top: newTop,
                  scaleX: baseScaleX * scale,
                  scaleY: baseScaleY * scale,
                });

                if (obj.originType === "text" && obj.originText) {
                  obj.originText.set({
                    scaleX: 1,
                    scaleY: 1,
                  });

                  obj.originText.set({
                    left: newLeft,
                    top: newTop,
                    scaleX: baseScaleX * scale,
                    scaleY: baseScaleY * scale,
                  });
                }
                obj.setCoords();
              }
            }
          });
        }
      }
    });

    [leftCanvasRef.current, rightCanvasRef.current].forEach((canvas) => {
      if (!canvas) return;

      const canvasEl = canvas.getElement();
      canvasEl.style.width = "100%";
      canvasEl.style.height = "100%";

      canvas.setWidth(width);
      canvas.setHeight(height);

      canvas.backgroundColor = "#D9D9D9";

      const bg = canvas.backgroundImage;
      if (bg && bg.metadata) {
        const scale = canvas.height / bg.metadata.scaleBaseHeight;
        setCanvasScale(scale);

        bg.scaleX = scale;
        bg.scaleY = scale;
        const scaledWidth = bg.width * scale;
        bg.left = (canvas.width - scaledWidth) / 2;
        bg.top = 0;
        bg.setCoords();

        let boundary;

        // First pass: locate and scale the boundary
        canvas.getObjects().forEach((obj) => {
          if (obj.name === "boundary" && obj.metadata) {
            const { baseWidth, baseHeight, baseLeftOffset, baseTopOffset } =
              obj.metadata;

            obj.set({
              width: baseWidth * scale,
              height: baseHeight * scale,
              left: bg.left + Math.floor(baseLeftOffset * scale),
              top: bg.top + Math.floor(baseTopOffset * scale),
              scaleX: 1,
              scaleY: 1,
            });

            obj.setCoords();
            boundary = obj;
            if (boundary) {
              const canvasW = canvas.getWidth();
              const canvasH = canvas.getHeight();
              const boundaryRect = boundary.getBoundingRect(true);

              // const fitsVertically = boundaryRect.height <= canvasH;

              const screenIsSmall = window.innerWidth < 900;

              if (screenIsSmall) {
                // Compute zoom to fit boundary with 10px side padding and full height
                const padding = 10;
                const zoomW = (canvasW - 2 * padding) / boundaryRect.width;
                const zoomH = canvasH / boundaryRect.height;
                const zoom = Math.min(zoomW, zoomH);

                canvas.setZoom(zoom);

                // Center the view on the boundary rect
                const centerX = boundaryRect.left + boundaryRect.width / 2;
                const centerY = boundaryRect.top + boundaryRect.height / 2;

                canvas.viewportTransform[4] = canvasW / 2 - centerX * zoom;
                canvas.viewportTransform[5] = canvasH / 2 - centerY * zoom;
              } else {
                // Reset zoom and pan to default if everything fits
                canvas.setZoom(1);
                canvas.viewportTransform[4] = 0;
                canvas.viewportTransform[5] = 0;
              }

              canvas.requestRenderAll();
            }
          }
        });

        // Second pass: scale and position other objects using boundary
        if (boundary) {
          canvas.getObjects().forEach((obj) => {
            if (
              obj.name !== "boundary" &&
              obj !== canvas.backgroundImage &&
              obj.metadata
            ) {
              const { baseLeftOffset, baseTopOffset, baseScaleX, baseScaleY } =
                obj.metadata;

              const newLeft = boundary.left + baseLeftOffset * scale;
              const newTop = boundary.top + baseTopOffset * scale;

              // Reset scale first to avoid compounding
              obj.set({
                scaleX: 1,
                scaleY: 1,
              });

              obj.set({
                left: newLeft,
                top: newTop,
                scaleX: baseScaleX * scale,
                scaleY: baseScaleY * scale,
              });

              if (obj.originType === "text" && obj.originText) {
                obj.originText.set({
                  scaleX: 1,
                  scaleY: 1,
                });

                obj.originText.set({
                  left: newLeft,
                  top: newTop,
                  scaleX: baseScaleX * scale,
                  scaleY: baseScaleY * scale,
                });
              }
              obj.setCoords();
              applyTransformControls(obj);
            }
          });
        }
      }
    });
  };

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const container = document.getElementById("canvas-container");
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const frontCanvas = new fabric.Canvas("front-canvas", {
      width,
      height,
      backgroundColor: "#D9D9D9",
      preserveObjectStacking: true,
    });

    const backCanvas = new fabric.Canvas("back-canvas", {
      width,
      height,
      backgroundColor: "#D9D9D9",
      preserveObjectStacking: true,
    });

    const leftCanvas = new fabric.Canvas("left-canvas", {
      width,
      height,
      backgroundColor: "#D9D9D9",
      preserveObjectStacking: true,
    });

    const rightCanvas = new fabric.Canvas("right-canvas", {
      width,
      height,
      backgroundColor: "#D9D9D9",
      preserveObjectStacking: true,
    });

    frontCanvasRef.current = frontCanvas;
    backCanvasRef.current = backCanvas;
    leftCanvasRef.current = leftCanvas;
    rightCanvasRef.current = rightCanvas;
    switch (currentView) {
      case "front":
        canvasRef.current = frontCanvas;
        break;
      case "back":
        canvasRef.current = backCanvas;
        break;
      case "left":
        canvasRef.current = leftCanvas;
        break;
      case "right":
        canvasRef.current = rightCanvas;
        break;
      default:
        canvasRef.current = frontCanvas; // fallback
        break;
    }

    // Toggle visibility once
    if (currentView === "front") {
      frontCanvas.wrapperEl.style.display = "block";
      frontCanvas.upperCanvasEl.style.display = "block";
    } else {
      frontCanvas.wrapperEl.style.display = "none";
      frontCanvas.upperCanvasEl.style.display = "none";
    }

    if (currentView === "back") {
      backCanvas.wrapperEl.style.display = "block";
      backCanvas.upperCanvasEl.style.display = "block";
    } else {
      backCanvas.wrapperEl.style.display = "none";
      backCanvas.upperCanvasEl.style.display = "none";
    }

    if (currentView === "left") {
      leftCanvas.wrapperEl.style.display = "block";
      leftCanvas.upperCanvasEl.style.display = "block";
    } else {
      leftCanvas.wrapperEl.style.display = "none";
      leftCanvas.upperCanvasEl.style.display = "none";
    }

    if (currentView === "right") {
      rightCanvas.wrapperEl.style.display = "block";
      rightCanvas.upperCanvasEl.style.display = "block";
    } else {
      rightCanvas.wrapperEl.style.display = "none";
      rightCanvas.upperCanvasEl.style.display = "none";
    }

    window.fabricCanvas = canvasRef.current;

    const designerContainer = document.getElementById("design-editor");
    const productId =
      designerContainer.getAttribute("data-product-id") || 18583;

    const getSafeImageSrc = (url) => {
      const isLocalhost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";

      if (!url) return "";

      // Use CORS proxy in dev only
      if (isLocalhost) {
        return `https://corsproxy.io/?${encodeURIComponent(url)}`;
      }

      return url; // use original URL in production (same-origin)
    };

    const fetchProducts = async (productId) => {
      const auth = {
        username: WOOCOMMERCE_CONSUMER_KEY,
        password: WOOCOMMERCE_CONSUMER_SECRET,
      };

      try {
        const response = await axios.get(
          `https://plaquita.com/wp-json/wc/v3/products/${productId}`,
          { auth }
        );
        const frontImageUrl = response.data.images[0]?.src;
        const backImageUrl = response.data.images[1]?.src;

        if (frontImageUrl) {
          loadCanvasBkImage(frontCanvas, getSafeImageSrc(frontImageUrl));
        }
        if (backImageUrl) {
          loadCanvasBkImage(backCanvas, getSafeImageSrc(backImageUrl));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    // fetchProducts(productId);
    // Use Vite's BASE_URL to build correct paths to public assets
    loadCanvasBkImage(frontCanvas, `${import.meta.env.BASE_URL}assets/front.png`);
    loadCanvasBkImage(backCanvas, `${import.meta.env.BASE_URL}assets/back.png`);
    loadCanvasBkImage(leftCanvas, `${import.meta.env.BASE_URL}assets/left.png`);
    loadCanvasBkImage(rightCanvas, `${import.meta.env.BASE_URL}assets/right.png`);

    container.addEventListener("contextmenu", preventDefaultContextMenu);
    container.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("click", handleClick);

    [frontCanvas, backCanvas, leftCanvas, rightCanvas].forEach((canvas) => {
      canvas.on("selection:created", updateOptionsFromActiveObject);
      canvas.on("selection:updated", updateOptionsFromActiveObject);
      canvas.on("selection:cleared", clearedSelection);
      canvas.on("object:scaling", handleObjectScaling);
      canvas.on("mouse:up", handleMouseUp);
      canvas.on("object:moving", handleObjectMoving);
      canvas.on("object:modified", handleObjectModified);
      canvas.on("object:modified", handleObjectRotating);
    });

    // Resize logic only updates dimensions and scales objects
    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("orientationchange", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("orientationchange", resizeCanvas);
      if (frontCanvasRef.current) {
        frontCanvasRef.current.dispose();
        frontCanvasRef.current = null;
      }
      if (backCanvasRef.current) {
        backCanvasRef.current.dispose();
        backCanvasRef.current = null;
      }
      if (leftCanvasRef.current) {
        leftCanvasRef.current.dispose();
        leftCanvasRef.current = null;
      }
      if (rightCanvasRef.current) {
        rightCanvasRef.current.dispose();
        rightCanvasRef.current = null;
      }

      initializedRef.current = false;
    };
  }, []);

  // Add effect to handle text input changes
  useEffect(() => {
    setIsAddTextEnabled(!!textInput.trim());
  }, [textInput]);

  const applyTransformControls = (obj) => {
    // First set the basic properties
    obj.set({
      borderColor: "#aaa",
      cornerColor: "#333",
      cornerStrokeColor: "#333",
      cornerStyle: "circle",
      cornerSize: 18,
      borderScaleFactor: 2,
      padding: 0,
      hasControls: true,
      hasBorders: true,
      selectable: true,
      evented: true,
    });

    // Set custom control renderer for br control
    obj.setControlsVisibility({
      mt: false, // middle top
      mb: false, // middle bottom
      ml: false, // middle left
      mr: false, // middle right
      tl: false, // top left
      tr: false, // top right
      bl: false, // bottom left
      br: false, // bottom right
      mtr: false, // rotation
    });

    // Override the br control renderer
    if (
      obj.originType === "text" ||
      obj.originType === "clipart" ||
      obj.originType === "image"
    ) {
      if (obj.originType === "text") {
        obj.setControlVisible("br", true);
        obj.setControlVisible("tl", true);
      } else if (obj.originType === "clipart" || obj.originType === "image") {
        obj.setControlVisible("mb", true);
        obj.setControlVisible("mr", true);
        obj.setControlVisible("br", true);
        obj.setControlVisible("tl", true);
        obj.setControlVisible("mtr", true);
      }

      obj.controls.mb = new fabric.Control({
        x: 0,
        y: 0.5,
        cursorStyle: "s-resize",
        actionHandler: fabric.controlsUtils.scalingY,
        render: circleControlRenderer,
        cornerSize: 24,
      });

      obj.controls.mr = new fabric.Control({
        x: 0.5,
        y: 0,
        cursorStyle: "e-resize",
        actionHandler: fabric.controlsUtils.scalingX,
        render: circleControlRenderer,
        cornerSize: 24,
      });

      obj.controls.br = new fabric.Control({
        x: 0.5,
        y: 0.5,
        cursorStyle: "se-resize",
        actionHandler: fabric.controlsUtils.scalingEqually,
        render: resizeControlRenderer,
        cornerSize: 32,
      });

      obj.controls.tl = new fabric.Control({
        x: -0.5,
        y: -0.5,
        cursorStyle: "pointer",
        mouseUpHandler: (eventData, transform) => {
          const target = transform.target;
          const canvas = target.canvas;
          if (canvas && target) {
            canvas.remove(target);
            canvas.requestRenderAll();
          }
          return true; // Important for Fabric's internal control handling
        },
        render: deleteControlRenderer,
        cornerSize: 32,
      });
    } else if (obj.originType === "names" || obj.originType === "numbers") {
      obj.setControlVisible("tl", true);
      obj.controls.tl = new fabric.Control({
        x: -0.5,
        y: -0.5,
        cursorStyle: "pointer",
        mouseUpHandler: () => {
          const canvas = obj.canvas;
          if (obj.originType === "names") {
            setIsAddNames(false);
          } else if (obj.originType === "numbers") {
            setIsAddNumbers(false);
          }
          canvas.remove(obj);
          canvas.requestRenderAll();
        },
        render: deleteControlRenderer,
        cornerSize: 32,
      });
    }
    obj.setCoords();
    canvasRef.current.requestRenderAll();
  };

  const handleAddTextToCanvas = () => {
    if (!textInput.trim()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const mainBoundary = canvas
      .getObjects()
      .find((obj) => obj.name === "boundary");

    // Guard: ensure boundary and background exist and have metadata
    const bg = canvas.backgroundImage;
    let scale = 1;
    if (!mainBoundary) {
      console.warn("Cannot add text: main boundary not found on canvas");
      return;
    }

    if (!bg || !bg.metadata) {
      // Background not loaded yet; fallback to 1 and position text in boundary
      console.warn("Canvas background image or metadata missing, using fallback scale=1");
      scale = 1;
    } else {
      scale = canvas.height / bg.metadata.scaleBaseHeight;
    }
    const textObj = new fabric.Textbox(textInput, {
      left: mainBoundary.left + mainBoundary.width / 2,
      top: mainBoundary.top + mainBoundary.height / 2,
      fill: textOptions.fill,
      fontFamily: textOptions.fontFamily,
      fontSize: textOptions.fontSize,
      stroke: textOptions.stroke,
      strokeWidth: textOptions.strokeWidth,
      fontWeight: textOptions.fontWeight === "bold" ? "bold" : "normal",
      textDecoration:
        textOptions.textDecoration === "underline" ? "underline" : "",
      angle: textOptions.rotation,
      textShape: textOptions.textShape,
      textShapePreview: textOptions.textShapePreview,
      editable: true,
      originX: "center",
      originY: "center",
      textAlign: "center",
      padding: 0,
  scaleX: scale,
  scaleY: scale,
      hasControls: true,
      hasBorders: false,
      selectable: true,
      editingBorderColor: "#007bff",
      cursorColor: "#007bff",
      cursorWidth: 2,
      cursorDuration: 500,
      charSpacing: 0,
      lineHeight: 1,
      lockUniScaling: false,
      lockScalingX: false,
      lockScalingY: false,
      lockMovementX: false,
      lockMovementY: false,
      lockRotation: false,
    });

  // createPNGImgObjectFromText(textObj);
    const emptyCanvas = document.createElement("canvas");
    emptyCanvas.width = 1;
    emptyCanvas.height = 1;
    const fabricImg = new fabric.Image(emptyCanvas, {
      left: textObj.left,
      top: textObj.top,
      originX: "left",
      originY: "top",
      scaleX: 1 / DPR,
      scaleY: 1 / DPR,
      angle: 0,
      originType: "text",
      originText: textObj,
    });
    canvas.add(fabricImg);
    canvas.setActiveObject(fabricImg);
    handleUpdateCanvas();
    // canvas.add(textObj);
    // canvas.setActiveObject(textObj);
    canvas.requestRenderAll();
  };

  const handleApplyTextShape = (textShape, slices = 200) => {
    const applyTransform = (ctx, img, x, y, width, height) => {
      const upscale = 1;

      // Create a high-res canvas
      const hiResCanvas = document.createElement("canvas");
      hiResCanvas.width = width * upscale;
      hiResCanvas.height = height * upscale;
      const hiResCtx = hiResCanvas.getContext("2d");

      hiResCtx.imageSmoothingEnabled = false; // critical for crisp results

      const sliceWidth = hiResCanvas.width / slices;

      for (let i = 0; i < slices; i++) {
        const sx = (img.width / slices) * i;
        const sw = img.width / slices;
        const sh = img.height;

        const t = i / (slices - 1);
        let sliceHeight = hiResCanvas.height;
        let offsetY = 0;

        switch (textShape.toLowerCase()) {
          case "upward":
            sliceHeight *= 0.5 + 0.5 * t;
            offsetY = hiResCanvas.height - sliceHeight;
            break;
          case "downward":
            sliceHeight *= 1 - 0.7 * t;
            offsetY = hiResCanvas.height - sliceHeight;
            break;
          case "bridge":
            sliceHeight *= 1 - 0.5 * Math.sin(Math.PI * t);
            offsetY = 0;
            break;
          case "valley":
            sliceHeight *= 1 - 0.7 * Math.sin(Math.PI * t);
            offsetY = hiResCanvas.height - sliceHeight;
            break;
          case "arch":
            const archHeight = 30 * upscale;
            sliceHeight = hiResCanvas.height * 0.6;
            offsetY = -archHeight * Math.sin(Math.PI * t) + archHeight;
            break;
          case "pinch": {
            const scale = 0.5 + 0.5 * Math.sin(t * Math.PI);
            const invScale = 1.5 - scale;
            sliceHeight *= invScale;
            offsetY = (hiResCanvas.height - sliceHeight) / 2;
            break;
          }
          case "bulge": {
            const scale = 0.5 + 0.5 * Math.sin(t * Math.PI);
            sliceHeight *= scale;
            offsetY = (hiResCanvas.height - sliceHeight) / 2;
            break;
          }
          case "perspective": {
            const scale =
              t === 0.5
                ? 1
                : t < 0.5
                ? 0.5 + 0.5 * t * 2
                : 1 - 0.5 * (t - 0.5) * 2;
            sliceHeight *= scale;
            offsetY = (hiResCanvas.height - sliceHeight) / 2;
            break;
          }
          case "pointed":
            sliceHeight *= 0.3 + 0.7 * (1 - Math.abs(t - 0.5) * 2);
            offsetY = hiResCanvas.height - sliceHeight;
            break;
          case "cone":
            sliceHeight *= 0.3 + 0.7 * t;
            offsetY = (hiResCanvas.height - sliceHeight) / 2;
            break;
          default:
            break;
        }

        hiResCtx.drawImage(
          img,
          sx,
          0,
          sw,
          sh,
          Math.floor(i * sliceWidth),
          Math.floor(offsetY),
          Math.ceil(sliceWidth),
          Math.ceil(sliceHeight)
        );
      }

      // Downscale the final image to the target canvas
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(
        hiResCanvas,
        0,
        0,
        hiResCanvas.width,
        hiResCanvas.height,
        x,
        y,
        width,
        height
      );
    };

    return applyTransform;
  };

  const isUpdatingRef = useRef(false);

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const curvedMultilineText = (textObj) => {
    const {
      text,
      left = 0,
      top = 0,
      fontSize = 24,
      fill = "black",
      fontFamily = "Arial",
      fontWeight,
      stroke,
      strokeWidth,
    } = textObj;

    const lines = text.split("\n");
    const totalLines = lines.length;

    const fullCircleChars = 50;
    const angleStep = (2 * Math.PI) / fullCircleChars;

    const charWidth = fontSize * 0.6;
    const baseRadius = charWidth / angleStep;
    const radiusIncrement = fontSize * 1.5;

    const allChars = [];

    // To find bounding box
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    lines.forEach((line, i) => {
      const chars = line.split("");
      const radius = baseRadius + (totalLines - 1 - i) * radiusIncrement;
      const startAngle = -((chars.length - 1) * angleStep) / 2;

      chars.forEach((char, j) => {
        const angle = startAngle + j * angleStep;
        const x = radius * Math.sin(angle);
        const y = -radius * Math.cos(angle);

        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);

        allChars.push(
          new fabric.Text(char, {
            left: x,
            top: y,
            angle: (angle * 180) / Math.PI,
            originX: "center",
            originY: "center",
            fontSize,
            fill,
            fontFamily,
            fontWeight,
            stroke,
            strokeWidth,
          })
        );
      });
    });

    // Offset characters to align top-left corner
    const offsetX = minX;
    const offsetY = minY;

    allChars.forEach((char) => {
      char.left -= offsetX;
      char.top -= offsetY;
    });

    const group = new fabric.Group(allChars, {
      left: left,
      top: top,
      originX: "left",
      originY: "top",
    });
    group.setCoords();
    return group;
  };

  function drawCurvedText(textObj) {
    if (!textObj || !textObj.text) {
      console.error("Invalid Fabric text object");
      return null;
    }

    const lines = textObj.text.split("\n");
    const fontSize = textObj.fontSize || 24;
    const fontFamily = textObj.fontFamily || "Arial";
    const fontWeight = textObj.fontWeight || "normal";
    const fill = textObj.fill || "black";

    // Create a Fabric Group to hold all curved text chars
    const group = new fabric.Group([], {
      originX: "center",
      originY: "center",
    });

    // Estimate maximum line width by measuring each line's text length (approximate)
    // Fabric does not provide direct measureText, so create temporary Text objects
    let maxLineWidth = 0;
    for (const line of lines) {
      const tempText = new fabric.Text(line, {
        fontSize,
        fontFamily,
        fontWeight,
        originX: "left",
        originY: "top",
      });
      if (tempText.width > maxLineWidth) maxLineWidth = tempText.width;
    }

    // Calculate radius and spacing
    const lineCount = lines.length;
    const lineSpacing = fontSize * 1.8;
    const startRadius = maxLineWidth / Math.PI;

    // For each line, create chars positioned on an arc
    for (let i = 0; i < lineCount; i++) {
      const line = lines[i];
      const radius = startRadius + i * lineSpacing;

      // Create Fabric.Text objects for each char
      const chars = [];
      for (const ch of line) {
        const charText = new fabric.Text(ch, {
          fontSize,
          fontFamily,
          fontWeight,
          fill,
          originX: "center",
          originY: "center",
          selectable: false,
          evented: false,
        });
        chars.push(charText);
      }

      // Calculate total width in pixels of line (sum char widths)
      const lineWidth = chars.reduce((sum, ch) => sum + ch.width, 0);

      // Calculate angular span for the line
      const angleSpan = lineWidth / radius;

      // Start angle (center top)
      let angle = -angleSpan / 2;

      // Position each char on the arc
      for (const ch of chars) {
        const charAngle = ch.width / radius;

        // Compute char center on circle
        const x = radius * Math.sin(angle + charAngle / 2);
        const y = -radius * Math.cos(angle + charAngle / 2);

        // Position char and rotate it tangentially
        ch.left = x;
        ch.top = y;
        ch.angle = (angle + charAngle / 2) * (180 / Math.PI); // convert rad to deg
        ch.rotate(ch.angle);

        angle += charAngle;
      }

      // Add all chars of this line to the group
      chars.forEach((ch) => group._objects.push(ch));
      group.setCoords();
    }

    // Optionally center the whole group (Fabric does this by default)
    group.originX = "center";
    group.originY = "center";

    return group;
  }

  const handleUpdateCanvas1 = async () => {
    if (!resetToOriginal) setResetToOriginal(true);
    if (isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    try {
      const canvas = canvasRef.current;
      const activeObject = canvas.getActiveObject();
      if (!activeObject || activeObject.originType !== "text") return;

      const textObj = activeObject.originText;
      const textShape = textObj.textShape;
      const bg = canvas.backgroundImage;
      const scaledCanvas = canvas.height / bg.metadata.scaleBaseHeight;
      const width = MAIN_BOUNDARY_WIDTH * scaledCanvas * DPR;
      const height = MAIN_BOUNDARY_HEIGHT * scaledCanvas * DPR;
      const diag = Math.sqrt(width * width + height * height);
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = diag;
      tempCanvas.height = diag;
      const tempFabric = new fabric.StaticCanvas(tempCanvas);
      const text = new fabric.Textbox(textObj.text.trim(), {
        left: 0,
        top: 0,
        originX: "left",
        originY: "top",
        textAlign: "center",
        width: diag,
        scaleX: scaledCanvas,
        scaleY: scaledCanvas,
        fontSize: textObj.fontSize,
        fontFamily: textObj.fontFamily,
        fill: textObj.fill,
        stroke: textObj.stroke,
        strokeWidth: textObj.strokeWidth,
        fontWeight: textObj.fontWeight,
        textDecoration: textObj.textDecoration,
      });

      if (activeObject.originText.textShape === "curve") {
        const curvedGroup = curvedMultilineText(text);
        tempFabric.add(curvedGroup);
      } else {
        tempFabric.add(text);
      }
      tempFabric.renderAll();

      // Step 2.5: Crop the text canvas before applying the shape
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx.imageSmoothingEnabled = false;
      tempCtx.imageSmoothingQuality = "high";

      const tempImageData = tempCtx.getImageData(
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
      );
      const tempData = tempImageData.data;

      let cropMinX = tempCanvas.width,
        cropMinY = tempCanvas.height,
        cropMaxX = 0,
        cropMaxY = 0;
      for (let y = 0; y < tempCanvas.height; y++) {
        for (let x = 0; x < tempCanvas.width; x++) {
          const i = (y * tempCanvas.width + x) * 4;
          if (tempData[i + 3] > 0) {
            cropMinX = Math.min(cropMinX, x);
            cropMinY = Math.min(cropMinY, y);
            cropMaxX = Math.max(cropMaxX, x);
            cropMaxY = Math.max(cropMaxY, y);
          }
        }
      }

      const padding = 4;
      cropMinX = Math.max(0, cropMinX - padding);
      cropMinY = Math.max(0, cropMinY - padding);
      cropMaxX = Math.min(tempCanvas.width, cropMaxX + padding);
      cropMaxY = Math.min(tempCanvas.height, cropMaxY + padding);

      const croppedWidth = cropMaxX - cropMinX;
      const croppedHeight = cropMaxY - cropMinY;
      const croppedCanvas = document.createElement("canvas");
      croppedCanvas.width = croppedWidth;
      croppedCanvas.height = croppedHeight;
      const croppedCtx = croppedCanvas.getContext("2d");
      croppedCtx.imageSmoothingEnabled = false;
      croppedCtx.imageSmoothingQuality = "high";
      croppedCtx.drawImage(
        tempCanvas,
        cropMinX,
        cropMinY,
        croppedWidth,
        croppedHeight,
        0,
        0,
        croppedWidth,
        croppedHeight
      );
      const img = await loadImage(
        croppedCanvas.toDataURL({ format: "image/png" })
      );
      console.log(croppedCanvas.toDataURL({ format: "image/png" }));
      let shapeCanvas;
      if (textShape !== "normal") {
        shapeCanvas = document.createElement("canvas");
        shapeCanvas.width = diag;
        shapeCanvas.height = diag;
        const shapedCtx = shapeCanvas.getContext("2d");
        shapedCtx.imageSmoothingQuality = "high";

        const apply = handleApplyTextShape(textShape, 200);
        apply(
          shapedCtx,
          img,
          (diag - img.width) / 2, // Center horizontally
          (diag - img.height) / 2, // Center vertically
          textShape === "arch" ? img.width * 1.7 : img.width * 1.4,
          textShape === "arch" ? img.height * 1.7 : img.height * 1.4
        );
      } else shapeCanvas = croppedCanvas;

      let rotatedCanvas; // = shapeCanvas;
      rotatedCanvas = document.createElement("canvas");
      const shapedDiag = Math.ceil(
        Math.sqrt(shapeCanvas.width ** 2 + shapeCanvas.height ** 2)
      );
      rotatedCanvas.width = shapedDiag;
      rotatedCanvas.height = shapedDiag;

      const rotatedFabric = new fabric.StaticCanvas(rotatedCanvas);
      const imgInstance = new fabric.Image(shapeCanvas, {
        angle: textObj.angle || 0,
        originX: "center",
        originY: "center",
        left: rotatedFabric.width / 2,
        top: rotatedFabric.height / 2,
        selectable: false,
      });
      rotatedFabric.add(imgInstance);
      rotatedFabric.renderAll();
      const rotatedCtx = rotatedCanvas.getContext("2d");

      const imageData = rotatedCtx.getImageData(
        0,
        0,
        rotatedCanvas.width,
        rotatedCanvas.height
      );
      const data = imageData.data;

      let minX = rotatedCanvas.width,
        minY = rotatedCanvas.height,
        maxX = 0,
        maxY = 0;
      for (let y = 0; y < rotatedCanvas.height; y++) {
        for (let x = 0; x < rotatedCanvas.width; x++) {
          const i = (y * rotatedCanvas.width + x) * 4;
          if (data[i + 3] > 0) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }

      const rotatedPadding = 2;

      minX = Math.max(0, minX - rotatedPadding);
      minY = Math.max(0, minY - rotatedPadding);
      maxX = Math.min(rotatedCanvas.width, maxX + rotatedPadding);
      maxY = Math.min(rotatedCanvas.height, maxY + rotatedPadding);

      const croppedRotatedWidth = maxX - minX;
      const croppedRotatedHeight = maxY - minY;

      const croppedRotatedCanvas = document.createElement("canvas");
      croppedRotatedCanvas.width = croppedRotatedWidth;
      croppedRotatedCanvas.height = croppedRotatedHeight;

      const croppedRotatedCtx = croppedRotatedCanvas.getContext("2d");
      croppedRotatedCtx.imageSmoothingEnabled = false;
      croppedRotatedCtx.imageSmoothingQuality = "high";
      croppedRotatedCtx.drawImage(
        rotatedCanvas,
        minX,
        minY,
        croppedRotatedWidth,
        croppedRotatedHeight,
        0,
        0,
        croppedRotatedWidth,
        croppedRotatedHeight
      );

      let scale = 1;
      if (croppedRotatedWidth > width || croppedRotatedHeight > height) {
        scale = Math.min(
          width / croppedRotatedWidth,
          height / croppedRotatedHeight
        );
        if (scale < 1) {
          textObj.fontSize = Math.floor(textObj.fontSize * scale);
        }
      }
      let finalCanvas = croppedRotatedCanvas;
      if (scale < 1) {
        const scaledCanvas = document.createElement("canvas");
        scaledCanvas.width = croppedRotatedWidth * scale;
        scaledCanvas.height = croppedRotatedHeight * scale;
        scaledCanvas
          .getContext("2d")
          .drawImage(
            croppedRotatedCanvas,
            0,
            0,
            croppedRotatedWidth,
            croppedRotatedHeight,
            0,
            0,
            scaledCanvas.width,
            scaledCanvas.height
          );

        finalCanvas = scaledCanvas;
      }

      const finalImg = new fabric.Image(finalCanvas, {
        left: textObj.left,
        top: textObj.top,
        originX: "left",
        originY: "top",
        angle: 0,
        scaleX: 1 / DPR,
        scaleY: 1 / DPR,
        width: finalCanvas.width,
        height: finalCanvas.height,
        originType: "text",
        originText: textObj,
        evented: true,
        flipX: flipVertical,
        flipY: flipHorizontal,
      });

      finalImg.set({
        objectCaching: false,
        selectable: true,
        imageSmoothing: true, // Ensures internal flag in Fabric
      });

      // finalImg.metadata = activeObject.metadata;
      finalImg.originText.set({
        left: finalImg.left,
        top: finalImg.top,
      });
      canvas.remove(activeObject);

      canvas.requestRenderAll();
      canvas.discardActiveObject();
      canvas.setActiveObject(finalImg);
      applyTransformControls(finalImg);
      addCanvasObjectWithMetadata(canvas, finalImg);
      enforceBoundaryConstraints(canvas, finalImg);
      canvas.requestRenderAll();
    } catch (error) {
      console.error("Error updating text to canvas:", error);
    } finally {
      isUpdatingRef.current = false;
    }
  };

  const handleUpdateCanvas = async () => {
    if (!resetToOriginal) setResetToOriginal(true);
    if (isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    try {
      const canvas = canvasRef.current;
      const activeObject = canvas.getActiveObject();
      if (!activeObject || activeObject.originType !== "text") return;

      const textObj = activeObject.originText;
      const textShape = textObj.textShape;
      const bg = canvas.backgroundImage;
      const scaledCanvas = canvas.height / bg.metadata.scaleBaseHeight;
      const tempCanvas = document.createElement("canvas");
      const tempFabric = new fabric.StaticCanvas(tempCanvas);
      const text = new fabric.Textbox(textObj.text.trim(), {
        left: 0,
        top: 0,
        originX: "left",
        originY: "top",
        textAlign: "center",
        scaleX: scaledCanvas,
        scaleY: scaledCanvas,
        fontSize: SCALED_FONT_SIZE,
        fontFamily: textObj.fontFamily,
        fill: textObj.fill,
        stroke: textObj.stroke,
        strokeWidth:
          (textObj.strokeWidth / DEFAULT_FONT_SIZE) * SCALED_FONT_SIZE,
        fontWeight: textObj.fontWeight,
        textDecoration: textObj.textDecoration,
        width: SCALED_FONT_SIZE * textObj.text.length * 0.6,
      });
      tempCanvas.width = text.getScaledWidth();
      tempCanvas.height = text.getScaledHeight();
      tempFabric.setWidth(text.getScaledWidth());
      tempFabric.setHeight(text.getScaledHeight());

      if (activeObject.originText.textShape === "curve") {
        const curvedGroup = curvedMultilineText(text);
        tempFabric.add(curvedGroup);
      } else {
        tempFabric.add(text);
      }
      tempFabric.renderAll();

      const tempCtx = tempCanvas.getContext("2d");
      const tempImageData = tempCtx.getImageData(
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
      );
      const tempData = tempImageData.data;

      let cropMinX = tempCanvas.width;
      let cropMinY = tempCanvas.height;
      let cropMaxX = 0;
      let cropMaxY = 0;

      const tempWidth = tempCanvas.width;
      const tempHeight = tempCanvas.height;
      const len = tempData.length;

      // Use one loop instead of two (flattened loop)
      for (let i = 0; i < len; i += 4) {
        const alpha = tempData[i + 3];
        if (alpha > 0) {
          const pixelIndex = i / 4;
          const x = pixelIndex % tempWidth;
          const y = (pixelIndex / tempWidth) | 0; // faster than Math.floor

          if (x < cropMinX) cropMinX = x;
          if (y < cropMinY) cropMinY = y;
          if (x > cropMaxX) cropMaxX = x;
          if (y > cropMaxY) cropMaxY = y;
        }
      }

      const padding = 4;
      cropMinX = Math.max(0, cropMinX - padding);
      cropMinY = Math.max(0, cropMinY - padding);
      cropMaxX = Math.min(tempCanvas.width, cropMaxX + padding);
      cropMaxY = Math.min(tempCanvas.height, cropMaxY + padding);

      const croppedWidth = cropMaxX - cropMinX;
      const croppedHeight = cropMaxY - cropMinY;
      const croppedCanvas = document.createElement("canvas");
      croppedCanvas.width = croppedWidth;
      croppedCanvas.height = croppedHeight;
      const croppedCtx = croppedCanvas.getContext("2d");
      croppedCtx.imageSmoothingEnabled = false;
      croppedCtx.imageSmoothingQuality = "high";
      croppedCtx.drawImage(
        tempCanvas,
        cropMinX,
        cropMinY,
        croppedWidth,
        croppedHeight,
        0,
        0,
        croppedWidth,
        croppedHeight
      );

      let shapeCanvas;
      if (textShape !== "normal") {
        shapeCanvas = document.createElement("canvas");
        shapeCanvas.width = croppedCanvas.width * 1.7;
        shapeCanvas.height = croppedCanvas.height * 1.7;
        const shapedCtx = shapeCanvas.getContext("2d");
        shapedCtx.imageSmoothingQuality = "high";

        const apply = handleApplyTextShape(textShape, 200);
        apply(
          shapedCtx,
          croppedCanvas,
          (shapeCanvas.width - croppedCanvas.width) / 2, // Center horizontally
          (shapeCanvas.height - croppedCanvas.height) / 2, // Center vertically
          // textShape === "arch" ? img.width * 1.7 : img.width * 1.5,
          // textShape === "arch" ? img.height * 1.7 : img.height * 1.5
          croppedCanvas.width,
          croppedCanvas.height
        );
      } else shapeCanvas = croppedCanvas;

      let rotatedCanvas; // = shapeCanvas;
      rotatedCanvas = document.createElement("canvas");
      const shapedDiag = Math.ceil(
        Math.sqrt(shapeCanvas.width ** 2 + shapeCanvas.height ** 2)
      );
      rotatedCanvas.width = shapedDiag;
      rotatedCanvas.height = shapedDiag;

      const rotatedFabric = new fabric.StaticCanvas(rotatedCanvas);
      const imgInstance = new fabric.Image(shapeCanvas, {
        angle: textObj.angle || 0,
        originX: "center",
        originY: "center",
        left: rotatedFabric.width / 2,
        top: rotatedFabric.height / 2,
        selectable: false,
      });
      rotatedFabric.add(imgInstance);
      rotatedFabric.renderAll();
      const rotatedCtx = rotatedCanvas.getContext("2d");

      const imageData = rotatedCtx.getImageData(
        0,
        0,
        rotatedCanvas.width,
        rotatedCanvas.height
      );
      const data = imageData.data;

      let minX = rotatedCanvas.width,
        minY = rotatedCanvas.height,
        maxX = 0,
        maxY = 0;
      const rotatedWidth = rotatedCanvas.width;
      const rotatedHeight = rotatedCanvas.height;
      const dataLength = data.length;

      for (let i = 0; i < dataLength; i += 4) {
        if (data[i + 3] > 0) {
          const pixelIndex = i >> 2; // same as i / 4
          const x = pixelIndex % rotatedWidth;
          const y = (pixelIndex / rotatedWidth) | 0;

          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }

      const rotatedPadding = 2;
      minX = Math.max(0, minX - rotatedPadding);
      minY = Math.max(0, minY - rotatedPadding);
      maxX = Math.min(rotatedCanvas.width, maxX + rotatedPadding);
      maxY = Math.min(rotatedCanvas.height, maxY + rotatedPadding);

      const croppedRotatedWidth = maxX - minX;
      const croppedRotatedHeight = maxY - minY;

      const croppedRotatedCanvas = document.createElement("canvas");
      croppedRotatedCanvas.width = croppedRotatedWidth;
      croppedRotatedCanvas.height = croppedRotatedHeight;

      const croppedRotatedCtx = croppedRotatedCanvas.getContext("2d");
      croppedRotatedCtx.imageSmoothingEnabled = false;
      croppedRotatedCtx.imageSmoothingQuality = "high";
      croppedRotatedCtx.drawImage(
        rotatedCanvas,
        minX,
        minY,
        croppedRotatedWidth,
        croppedRotatedHeight,
        0,
        0,
        croppedRotatedWidth,
        croppedRotatedHeight
      );

      let scale = 1;
      const width = MAIN_BOUNDARY_WIDTH * scaledCanvas * DPR;
      const height = MAIN_BOUNDARY_HEIGHT * scaledCanvas * DPR;

      const curTextScale = textObj.fontSize / SCALED_FONT_SIZE;
      const scaleDownedWidth = croppedRotatedWidth * curTextScale;
      const scaleDownedHeight = croppedRotatedHeight * curTextScale;

      console.log(scaleDownedWidth, width, scaleDownedHeight, height);
      if (scaleDownedWidth > width || scaleDownedHeight > height) {
        scale = Math.min(width / scaleDownedWidth, height / scaleDownedHeight);
        if (scale < 1) textObj.fontSize = Math.floor(textObj.fontSize * scale);
      }

      const finalImg = new fabric.Image(croppedRotatedCanvas, {
        left: textObj.left,
        top: textObj.top,
        originX: "left",
        originY: "top",
        angle: 0,
        scaleX: curTextScale * scale,
        scaleY: curTextScale * scale,
        // width: croppedRotatedCanvas.scaledWidth,
        // height: croppedRotatedCanvas.scaledHeight,
        originType: "text",
        originText: textObj,
        evented: true,
        flipX: flipVertical,
        flipY: flipHorizontal,
      });
      canvas.remove(activeObject);

      canvas.setActiveObject(finalImg);
      enforceBoundaryConstraints(canvas, finalImg);
      canvas.add(finalImg);
      canvas.requestRenderAll();
      calculateTotalColorCount(canvas);
    } catch (error) {
      console.error("Error updating text to canvas:", error);
    } finally {
      isUpdatingRef.current = false;
    }
  };

  const normalizeHex = (color) => {
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.fillStyle = color;
    return ctx.fillStyle.toUpperCase();
  };

  const calculateTotalColorCount = (canvas) => {
    const objects = canvas
      .getObjects()
      .filter((obj) => obj.name !== "boundary" && obj.name !== "chestRect");

    objects.forEach((obj) => {
      switch (obj.originType) {
        case "text": {
          const { fill, stroke, strokeWidth } = obj.originText || {};

          // Check fill color
          if (fill) {
            const normalizedFill = normalizeHex(fill);
            const matchedFill = predefinedColors.find(
              (c) => normalizeHex(c.value) === normalizedFill
            );
            if (matchedFill) {
              const colorKey = matchedFill.value.toUpperCase();
              colorUsage[colorKey] = (colorUsage[colorKey] || 0) + 1;
            }
          }

          // Check stroke color only if strokeWidth > 0
          if (strokeWidth > 0 && stroke) {
            const normalizedStroke = normalizeHex(stroke);
            const matchedStroke = predefinedColors.find(
              (c) => normalizeHex(c.value) === normalizedStroke
            );
            if (matchedStroke) {
              const colorKey = matchedStroke.value.toUpperCase();
              colorUsage[colorKey] = (colorUsage[colorKey] || 0) + 1;
            }
          }

          break;
        }

        case "clipart": {
          const replacedColors = obj.replacedColors || [];

          replacedColors.forEach((color) => {
            const normalized = normalizeHex(color);
            const matched = predefinedColors.find(
              (c) => normalizeHex(c.value) === normalized
            );

            const colorKey = (
              matched ? matched.value : normalized
            ).toUpperCase();
            colorUsage[colorKey] = (colorUsage[colorKey] || 0) + 1;
          });

          break;
        }

        case "image": {
          const replacedColors = obj.replacedColors || [];

          replacedColors.forEach((color) => {
            const normalized = normalizeHex(color);
            const matched = predefinedColors.find(
              (c) => normalizeHex(c.value) === normalized
            );

            const colorKey = (
              matched ? matched.value : normalized
            ).toUpperCase();
            colorUsage[colorKey] = (colorUsage[colorKey] || 0) + 1;
          });

          break;
        }

        default:
          break;
      }
    });

    const totalColors = Object.keys(colorUsage).length;

    // Sort colorUsage by count descending
    const sortedColorUsage = Object.fromEntries(
      Object.entries(colorUsage).sort((a, b) => b[1] - a[1])
    );
    console.log({ totalColors, colorUsage: sortedColorUsage });
    return { totalColors, colorUsage: sortedColorUsage };
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file (JPG, PNG, or GIF)");
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new Image();
      img.onload = async () => {
        try {
          // Extract colors using ColorThief
          // const colors = extractColors(img, 8, 32); // Get 5 colors
          const colors = extractVisibleColors(img);

          // Get canvas reference
          const canvas = canvasRef.current;
          if (!canvas) {
            console.error("Canvas not initialized");
            return;
          }

          // Create fabric image
          const fabricImg = new fabric.Image(img);

          // Generate unique ID for the image
          const imageId = Date.now().toString();

          // Calculate scaling to fit within canvas bounds
          const mainBoundary = canvas
            .getObjects()
            .find((obj) => obj.name === "boundary");
          const maxWidth = mainBoundary.width * 0.7;
          const maxHeight = mainBoundary.height * 0.7;
          let scale = 1;

          if (fabricImg.width > maxWidth) {
            scale = maxWidth / fabricImg.width;
          }
          if (fabricImg.height * scale > maxHeight) {
            scale = maxHeight / fabricImg.height;
          }

          // Apply initial scaling
          fabricImg.scale(scale);

          // Set image properties
          fabricImg.set({
            left: mainBoundary.left,
            top: mainBoundary.top,
            selectable: true,
            hasControls: true,
            hasBorders: false,
            lockRotation: false,
            lockScalingX: false,
            lockScalingY: false,
            lockMovementX: false,
            lockMovementY: false,
            lockUniScaling: false,
            cornerColor: "#007bff",
            cornerSize: 12,
            transparentCorners: false,
            borderColor: "#007bff",
            evented: true,
            borderScaleFactor: 2,
            padding: 10,
            imageData: event.target.result,
            originData: event.target.result,
            extractedColors: colors,
            replacedColors: colors,
            imageId: imageId,
            originType: "image",
            originX: "left",
            originY: "top",
          });

          canvas.requestRenderAll();
          canvas.discardActiveObject();
          canvas.setActiveObject(fabricImg);
          fabricImg.set({
            originWidth: fabricImg.width,
            originHeight: fabricImg.height,
            originScale: scale,
          });
          // Add transform controls
          applyTransformControls(fabricImg);

          // Update active image and its colors
          setActiveImageId(imageId);
          setExtractedColors(colors);
          setReplacedColors(colors);
          setSelectedColorIndex(null);
          handleObjectModified(fabricImg);
          addCanvasObjectWithMetadata(canvas, fabricImg);
          calculateTotalColorCount(canvas);
        } catch (error) {
          alert("Error processing image. Please try again.");
        }
      };

      img.onerror = (error) => {
        console.error("Error loading image:", error);
        alert("Error loading image. Please try again.");
      };

      img.src = event.target.result;
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      alert("Error reading file. Please try again.");
    };

    reader.readAsDataURL(file);
  };

  const handleColorChange = (extracted, replaced, bucketSize = 16) => {
    setReplacedColors(replaced);
    const canvas = canvasRef.current;
    if (!canvas) return console.error("Canvas not initialized");

    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type !== "image") {
      console.warn("No matching image selected for color change");
      return;
    }

    const originalSrc = activeObject.originData;
    if (!originalSrc) {
      alert("Original image data missing. Cannot apply color changes.");
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = activeObject.width;
      tempCanvas.height = activeObject.height;
      const ctx = tempCanvas.getContext("2d");
      ctx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

      const imageData = ctx.getImageData(
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
      );
      const data = imageData.data;
      const tolerance = 60;

      const colorDistance = (r1, g1, b1, r2, g2, b2) =>
        Math.sqrt((r2 - r1) ** 2 + (g2 - g1) ** 2 + (b2 - b1) ** 2);

      const bucket = (v) => Math.floor(v / bucketSize) * bucketSize;

      for (let c = 0; c < extracted.length; c++) {
        const oldRgb = hexToRgb(extracted[c]);
        const newRgb = hexToRgb(replaced[c]);

        const [brOld, bgOld, bbOld] = [
          bucket(oldRgb.r),
          bucket(oldRgb.g),
          bucket(oldRgb.b),
        ];

        for (let i = 0; i < data.length; i += 4) {
          const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
          if (a < 64) continue;

          const [br, bg, bb] = [bucket(r), bucket(g), bucket(b)];
          const dist = colorDistance(br, bg, bb, brOld, bgOld, bbOld);
          if (dist <= tolerance) {
            const blend = 1 - dist / tolerance;
            data[i] = Math.round(r * (1 - blend) + newRgb.r * blend);
            data[i + 1] = Math.round(g * (1 - blend) + newRgb.g * blend);
            data[i + 2] = Math.round(b * (1 - blend) + newRgb.b * blend);
            if (replaced[c] === "transparent") {
              data[i + 3] = 0;
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      const dataUrl = tempCanvas.toDataURL("image/png");

      const newImg = new fabric.Image(tempCanvas, {
        ...activeObject.toObject(),
        imageId: activeObject.imageId,
        imageData: dataUrl,
        extractedColors: extracted,
        replacedColors: replaced,
        originData: originalSrc,
        removeBackground: activeObject.removeBackground,
        originType: activeObject.originType,
        originWidth: activeObject.originWidth,
        originHeight: activeObject.originHeight,
        originScale: activeObject.originScale,
      });

      canvas.remove(activeObject);
      addCanvasObjectWithMetadata(canvas, newImg);
      canvas.requestRenderAll();
      canvas.discardActiveObject();
      canvas.setActiveObject(newImg);
      applyTransformControls(newImg);
      setResetToOriginal(true);
      calculateTotalColorCount(canvas);
    };

    img.onerror = () => {
      console.error("Failed to load original image for color change");
      alert("Could not load original image.");
    };

    img.src = originalSrc;
  };

  // Add context menu handlers
  const handleBringToFront = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      // Optional: set 'bringToFront' true on active, false on others
      canvas.getObjects().forEach((obj) => {
        obj.set("bringToFront", obj === activeObject);
      });

      canvas.bringObjectToFront(activeObject); // <- correct method name

      canvas.requestRenderAll();
      canvas.discardActiveObject();
      canvas.setActiveObject(activeObject);
      // Add transform controls
      applyTransformControls(activeObject);
    }

    setContextMenu({ show: false, x: 0, y: 0 });
  };

  const handleSendToBack = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      // Set sendToBack: false for all other objects
      canvas.getObjects().forEach((obj) => {
        if (obj !== activeObject) {
          obj.set("sendToBack", false);
        }
      });

      // Set sendToBack: true for the active object
      activeObject.set("sendToBack", true);

      canvas.sendObjectToBack(activeObject);

      canvas.requestRenderAll();
      canvas.discardActiveObject();
      canvas.setActiveObject(activeObject);
      applyTransformControls(activeObject);
    }

    setContextMenu({ show: false, x: 0, y: 0 });
  };

  const handleDuplicate = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    let newObject;
    if (activeObject) {
      // Create a new object of the same type
      if (activeObject.originType === "text") {
        const textObject = activeObject.originText;
        const textObj = new fabric.Textbox(textObject.text, {
          left: textObject.left + 10,
          top: textObject.top + 10,
          fill: textObject.fill,
          fontFamily: textObject.fontFamily,
          fontSize: textObject.fontSize,
          stroke: textObject.stroke,
          strokeWidth: textObject.strokeWidth,
          textShape: textObject.textShape,
          textShapePreview: textObject.textShapePreview,
          fontWeight: textObject.fontWeight,
          textDecoration: textObject.textDecoration,
          angle: textObject.angle,
          editable: true,
          originX: textObject.left,
          originY: textObject.top,
          textAlign: "center",
          padding: 0,
          hasControls: true,
          hasBorders: true,
          selectable: true,
          editingBorderColor: "#007bff",
          cursorColor: "#007bff",
          cursorWidth: 2,
          cursorDuration: 500,
          charSpacing: 0,
          lineHeight: 1,
          lockUniScaling: false,
          lockScalingX: false,
          lockScalingY: false,
          lockMovementX: false,
          lockMovementY: false,
          lockRotation: false,
        });

        const emptyCanvas = document.createElement("canvas");
        emptyCanvas.width = 1;
        emptyCanvas.height = 1;
        const fabricImg = new fabric.Image(emptyCanvas, {
          left: textObj.left,
          top: textObj.top,
          originX: "left",
          originY: "top",
          scaleX: 1 / DPR,
          scaleY: 1 / DPR,
          angle: 0,
          originType: "text",
          originText: textObj,
        });
        canvas.add(fabricImg);
        canvas.setActiveObject(fabricImg);
        handleUpdateCanvas();
      } else if (activeObject.type === "image") {
        newObject = new fabric.Image(activeObject._element, {
          ...activeObject.toObject(),
          left: activeObject.left + 10,
          top: activeObject.top + 10,
          replacedColors: activeObject.replacedColors,
          extractedColors: activeObject.extractedColors,
          removeBackground: activeObject.removeBackground,
          originData: activeObject.originData,
          imageId: Date.now().toString(),
          scaleX: activeObject.scaleX,
          scaleY: activeObject.scaleY,
          originType: activeObject.originType,
          flipHorizontal: activeObject.flipHorizontal,
          flipVertical: activeObject.flipVertical,
          originWidth: activeObject.originWidth,
          originHeight: activeObject.originHeight,
          originScale: activeObject.originScale,
        });
        setExtractedColors(newObject.extractedColors);
        setReplacedColors(newObject.replacedColors);
        setRemoveBackground(newObject.removeBackground);
        setActiveImageId(newObject.imageId);
        enforceBoundaryConstraints(canvas, newObject);
      }

      if (newObject) {
        addCanvasObjectWithMetadata(canvas, newObject);

        // applyTextShape(newObject, textOptions, canvas);
        canvas.requestRenderAll();
        canvas.discardActiveObject();
        canvas.setActiveObject(newObject);
        applyTransformControls(newObject);
      }
    }
    setContextMenu({ show: false, x: 0, y: 0 });
  };

  const handleDelete = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      // Remove the active object
      canvas.remove(activeObject);
      canvas.requestRenderAll();
    }
    setContextMenu({ show: false, x: 0, y: 0 });
  };

  const handleCenterObject = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    const canvasCenterX = canvas.getWidth() / 2;

    const objectWidth = activeObject.getScaledWidth();

    activeObject.set({
      left: canvasCenterX - objectWidth / 2,
    });

    activeObject.setCoords();
    canvas.renderAll();
  };

  const handleFlipHorizontal = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    // Toggle flipX property
    activeObject.set("flipX", !activeObject.flipX);
    setFlipHorizontal(activeObject.flipX);

    activeObject.setCoords(); // update object's coordinates
    canvas.renderAll(); // re-render canvas
  };

  const handleFlipVertical = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;

    // Toggle flipY property
    console.log(activeObject.flipY);
    activeObject.set("flipY", !activeObject.flipY);
    console.log(activeObject.flipY);
    setFlipVertical(activeObject.flipY);

    activeObject.setCoords(); // update object's coordinates
    canvas.renderAll(); // re-render canvas
  };

  const handleSelectAll = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a selection group with all objects except boundary rectangles
    const objects = canvas
      .getObjects()
      .filter((obj) => obj.name !== "boundary" && obj.name !== "chestRect");
    if (objects.length > 0) {
      const selection = new fabric.ActiveSelection(objects, { canvas: canvas });

      // Apply the same transform controls style as individual objects
      selection.set({
        borderColor: "#007bff",
        cornerColor: "#007bff",
        cornerStrokeColor: "#007bff",
        cornerStyle: "circle",
        cornerSize: 6,
        transparentCorners: false,
        borderScaleFactor: 2,
        padding: 0,
        hasControls: true,
        hasBorders: true,
        selectable: true,
      });

      // Set the same control visibility as individual objects
      selection.setControlsVisibility({
        mt: false, // middle top
        mb: false, // middle bottom
        ml: false, // middle left
        mr: false, // middle right
        tl: false, // top left
        tr: false, // top right
        bl: false, // bottom left
        br: true, // bottom right
        mtr: false, // rotation
      });

      canvas.requestRenderAll();
      canvas.discardActiveObject();
      canvas.setActiveObject(selection);
      applyTransformControls(selection);
    }
    setContextMenu({ show: false, x: 0, y: 0 });
  };

  const handleRemoveBackground = async (remove) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    try {
      if (remove) {
        // Create temporary canvas
        const tempCanvas = document.createElement("canvas");
        const tempCtx = tempCanvas.getContext("2d");
        tempCanvas.width = activeObject.width;
        tempCanvas.height = activeObject.height;

        // Draw image
        tempCtx.drawImage(
          activeObject._element,
          0,
          0,
          tempCanvas.width,
          tempCanvas.height
        );

        // Get image data
        const imageData = tempCtx.getImageData(
          0,
          0,
          tempCanvas.width,
          tempCanvas.height
        );
        const data = imageData.data;

        // Get average corner color
        const corners = [
          { x: 0, y: 0 },
          { x: tempCanvas.width - 1, y: 0 },
          { x: 0, y: tempCanvas.height - 1 },
          { x: tempCanvas.width - 1, y: tempCanvas.height - 1 },
        ];
        const cornerColors = corners.map(({ x, y }) => {
          const idx = (y * tempCanvas.width + x) * 4;
          return { r: data[idx], g: data[idx + 1], b: data[idx + 2] };
        });
        const avgColor = {
          r: Math.round(cornerColors.reduce((sum, c) => sum + c.r, 0) / 4),
          g: Math.round(cornerColors.reduce((sum, c) => sum + c.g, 0) / 4),
          b: Math.round(cornerColors.reduce((sum, c) => sum + c.b, 0) / 4),
        };

        // Remove background
        const threshold = 80;
        for (let i = 0; i < data.length; i += 4) {
          const diff = Math.sqrt(
            Math.pow(data[i] - avgColor.r, 2) +
              Math.pow(data[i + 1] - avgColor.g, 2) +
              Math.pow(data[i + 2] - avgColor.b, 2)
          );
          if (diff < threshold) data[i + 3] = 0;
        }
        tempCtx.putImageData(imageData, 0, 0);

        // Create fabric image from processed data
        const dataUrl = tempCanvas.toDataURL("image/png");
        const img = new Image();
        img.onload = () => {
          const newImg = new fabric.Image(img, {
            left: activeObject.left,
            top: activeObject.top,
            scaleX: activeObject.scaleX,
            scaleY: activeObject.scaleY,
            angle: activeObject.angle,
            selectable: true,
            hasControls: true,
            hasBorders: true,
            lockRotation: false,
            lockScalingX: false,
            lockScalingY: false,
            lockMovementX: false,
            lockMovementY: false,
            lockUniScaling: false,
            cornerColor: "#007bff",
            cornerSize: 12,
            transparentCorners: false,
            borderColor: "#007bff",
            borderScaleFactor: 2,
            padding: 10,
          });

          const updatedReplacedColors = [...replacedColors];
          updatedReplacedColors[replacedColors.length - 1] = "transparent";
          newImg.set({
            imageData: dataUrl,
            extractedColors: activeObject.extractedColors,
            replacedColors: updatedReplacedColors,
            removeBackground: true,
            imageId: activeObject.imageId,
            originData: activeObject.originData,
          });

          canvas.remove(activeObject);
          addCanvasObjectWithMetadata(canvas, newImg);
          canvas.requestRenderAll();
          canvas.discardActiveObject();
          canvas.setActiveObject(newImg);
          applyTransformControls(newImg);
          setRemoveBackground(true);
          setReplacedColors(updatedReplacedColors);
        };
        img.src = dataUrl;
      } else {
        // Restore original
        setReplacedColors(activeObject.extractedColors);
        const originalSrc = activeObject.originData;
        if (!originalSrc) {
          console.warn("No originData found");
          return;
        }

        const img = new Image();
        img.onload = () => {
          const restoredImg = new fabric.Image(img, {
            left: activeObject.left,
            top: activeObject.top,
            scaleX: activeObject.scaleX,
            scaleY: activeObject.scaleY,
            angle: activeObject.angle,
            selectable: true,
            hasControls: true,
            hasBorders: true,
            lockRotation: false,
            lockScalingX: false,
            lockScalingY: false,
            lockMovementX: false,
            lockMovementY: false,
            lockUniScaling: false,
            cornerColor: "#007bff",
            cornerSize: 12,
            transparentCorners: false,
            borderColor: "#007bff",
            borderScaleFactor: 2,
            padding: 10,
          });

          restoredImg.set({
            imageData: originalSrc,
            extractedColors: activeObject.extractedColors,
            replacedColors: activeObject.extractedColors,
            removeBackground: false,
            imageId: activeObject.imageId,
            originData: originalSrc,
          });

          canvas.remove(activeObject);
          addCanvasObjectWithMetadata(canvas, restoredImg);

          canvas.requestRenderAll();
          canvas.discardActiveObject();
          canvas.setActiveObject(restoredImg);
          applyTransformControls(restoredImg);
          setRemoveBackground(false);
        };
        img.src = originalSrc;
      }
    } catch (error) {
      console.error("Error processing background removal:", error);
      alert("Error processing image. Please try again.");
    }
  };

  useEffect(() => {
    colorPickerTypeRef.current = colorPickerType;
  }, [colorPickerType]);

  useEffect(() => {
    isMobileRef.current = isMobile;
    resizeCanvas();
  }, [isMobile]);

  const handleClipArtSelect = async (clipart) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const clipartImg = new Image();

    clipartImg.crossOrigin = "anonymous";
    clipartImg.onload = () => {
      const fabricImage = new fabric.Image(clipartImg);
      // const colors = extractColors(clipartImg); // Get 5 colors
      const colors = extractVisibleColors(clipartImg);

      // Calculate scaling to fit within canvas bounds
      const mainBoundary = canvas
        .getObjects()
        .find((obj) => obj.name === "boundary");
      fabricImage.set({
        left: mainBoundary.left,
        top: mainBoundary.top,
        originX: "left",
        originY: "top",
        scaleX: 1,
        scaleY: 1,
        selectable: true,
        extractedColors: colors,
        replacedColors: colors,
        originData: clipartImg.src,
        originType: "clipart",
        evented: true,
      });
      const maxWidth = mainBoundary.width * 0.5;
      const maxHeight = mainBoundary.height * 0.5;
      let scale = 1;

      if (fabricImage.width > maxWidth) {
        scale = maxWidth / fabricImage.width;
      }
      if (fabricImage.height * scale > maxHeight) {
        scale = maxHeight / fabricImage.height;
      }

      // Apply initial scaling
      fabricImage.scale(scale);
      fabricImage.set({
        originScale: scale,
        originWidth: fabricImage.width,
        originHeight: fabricImage.height,
      });

      handleObjectModified({ target: fabricImage });
      addCanvasObjectWithMetadata(canvas, fabricImage);
      enforceBoundaryConstraints(canvas, fabricImage);

      setExtractedColors(colors);
      setReplacedColors(colors);
      canvas.renderAll();
      canvas.discardActiveObject();
      canvas.setActiveObject(fabricImage);
      applyTransformControls(fabricImage);
      calculateTotalColorCount(canvas);
    };
    clipartImg.onerror = () => console.warn("Failed to load Base64 image.");
    clipartImg.src = clipart;
  };

  const handleSetFrontView = () => {
    setCurrentView("front");
  };

  const handleSetBackView = () => {
    setCurrentView("back");
  };

  const handleSetRightView = () => {
    setCurrentView("right");
  };

  const handleSetLeftView = () => {
    setCurrentView("left");
  };

  const handleZoom = () => {
    if (frontCanvasRef.current) zoomToCenter(frontCanvasRef.current);
    if (backCanvasRef.current) zoomToCenter(backCanvasRef.current);
    if (leftCanvasRef.current) zoomToCenter(leftCanvasRef.current);
    if (rightCanvasRef.current) zoomToCenter(rightCanvasRef.current);

    setIsZoomedToFit((prev) => !prev);
  };

  const handleEnterNamesNumbers = () => {
    setShowNameNumberDialog(true);
  };

  const zoomToCenter = (canvas) => {
    if (!canvas) return;

    const mainBoundary = canvas
      .getObjects()
      .find((obj) => obj.name === "boundary");

    if (!mainBoundary) {
      console.warn("Main boundary not found on canvas");
      return;
    }

    if (!isZoomedToFit) {
      const smallPadding = 10;

      // Step 1: Reset zoom & pan
      canvas.setZoom(1);
      canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
      canvas.renderAll();

      // Step 2: Get accurate bounding box
      const bounds = mainBoundary.getBoundingRect();

      const paddedWidth = bounds.width + smallPadding * 2;
      const paddedHeight = bounds.height + smallPadding * 2;

      const zoomFactor = Math.min(
        canvas.getWidth() / paddedWidth,
        canvas.getHeight() / paddedHeight
      );

      // Step 3: Zoom first (we'll center after)
      canvas.setZoom(zoomFactor);

      // Step 4: Compute point on canvas AFTER zoom
      const centerBeforeZoom = new fabric.Point(
        bounds.left + bounds.width / 2,
        bounds.top + bounds.height / 2
      );

      // Step 5: Where that point appears now (after zoom)
      const centerAfterZoom = fabric.util.transformPoint(
        centerBeforeZoom,
        canvas.viewportTransform
      );

      // Step 6: Calculate shift to center it in the canvas
      const canvasCenter = new fabric.Point(
        canvas.getWidth() / 2,
        canvas.getHeight() / 2
      );
      const delta = canvasCenter.subtract(centerAfterZoom);

      canvas.relativePan(delta);
    } else {
      canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
      canvas.setZoom(1);
    }

    canvas.requestRenderAll();
  };

  function convertTextToImageAndCropVisible(canvas, textObj) {
    const clonedObj = new fabric.Textbox(textObj.text, {
      left: textObj.left,
      top: textObj.top,
      fill: textObj.fill,
      fontFamily: textObj.fontFamily,
      fontSize: textObj.fontSize,
      originX: "center",
      originY: "center",
      textAlign: "center",
      padding: 0,
      lineHeight: 1.0,
      hasControls: true,
      hasBorders: false,
      selectable: true,
      originType: "names",
    });

    processClone(canvas, textObj, clonedObj);

    function processClone(canvas, originalObj, clonedObj) {
      // Prepare offscreen canvas size based on scaled width/height
      const tempCanvas = new fabric.StaticCanvas(null, {
        width: clonedObj.width * clonedObj.scaleX,
        height: clonedObj.height * clonedObj.scaleY,
      });

      // Position clone at top-left (0,0)
      clonedObj.set({
        left: 0,
        top: 0,
        originX: "left",
        originY: "top",
      });

      tempCanvas.add(clonedObj);
      tempCanvas.renderAll();

      const rawCanvas = tempCanvas.getElement();
      const ctx = rawCanvas.getContext("2d");
      const imageData = ctx.getImageData(
        0,
        0,
        rawCanvas.width,
        rawCanvas.height
      );
      const pixels = imageData.data;

      // Find bounding box of visible pixels (alpha > 10)
      let minX = rawCanvas.width;
      let minY = rawCanvas.height;
      let maxX = 0;
      let maxY = 0;

      for (let y = 0; y < rawCanvas.height; y++) {
        for (let x = 0; x < rawCanvas.width; x++) {
          const idx = (y * rawCanvas.width + x) * 4;
          const alpha = pixels[idx + 3];
          if (alpha > 10) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      const cropWidth = maxX - minX + 2;
      const cropHeight = maxY - minY + 2;

      // Crop the visible area to a new canvas
      const croppedCanvas = document.createElement("canvas");
      croppedCanvas.width = cropWidth;
      croppedCanvas.height = cropHeight;
      const croppedCtx = croppedCanvas.getContext("2d");
      croppedCtx.putImageData(
        ctx.getImageData(minX, minY, cropWidth, cropHeight),
        0,
        0
      );

      const dataURL = croppedCanvas.toDataURL("image/png");

      // Load cropped image using native Image element and add to fabric canvas
      const imgElement = new Image();
      imgElement.onload = function () {
        const fabricImage = new fabric.Image(imgElement);
        // Position fabric image at original text position adjusted by crop offset
        fabricImage.set({
          left:
            originalObj.left - (clonedObj.width * clonedObj.scaleX) / 2 + minX,
          top:
            originalObj.top - (clonedObj.height * clonedObj.scaleY) / 2 + minY,
          originX: "left",
          originY: "top",
          angle: originalObj.angle || 0,
          originType: originalObj.originType,
        });

        addCanvasObjectWithMetadata(canvas, fabricImage);
        applyTransformControls(fabricImage);
        canvas.renderAll();
      };
      imgElement.onerror = function (err) {
        console.error("Image load error:", err);
      };
      imgElement.crossOrigin = "anonymous";
      imgElement.src = dataURL;
    }
  }

  useEffect(() => {
    if (!frontCanvasRef.current || !backCanvasRef.current) return;
    frontCanvasRef.current.getObjects().forEach((obj) => {
      if (obj.originType === "names" || obj.originType === "numbers") {
        frontCanvasRef.current.remove(obj);
      }
    });
    backCanvasRef.current.getObjects().forEach((obj) => {
      if (obj.originType === "names" || obj.originType === "numbers") {
        backCanvasRef.current.remove(obj);
      }
    });
    const frontBoundary = frontCanvasRef.current
      .getObjects()
      .find((obj) => obj.name === "boundary");
    const backBoundary = backCanvasRef.current
      .getObjects()
      .find((obj) => obj.name === "boundary");

    const frontBg = frontCanvasRef.current.backgroundImage;
    const backBg = backCanvasRef.current.backgroundImage;

    if (!frontBg || !backBg || !frontBg.metadata || !backBg.metadata) return;
    const frontScale =
      frontCanvasRef.current.height / frontBg.metadata.scaleBaseHeight;
    const backScale =
      backCanvasRef.current.height / backBg.metadata.scaleBaseHeight;

    // sideNames front or back
    if (sideNames === "front") {
      if (isAddNames) {
        const textObj = new fabric.Textbox("EXAMPLE", {
          left: 0,
          top: frontBoundary.top + NAMES_BASE_TOP_OFFSET * frontScale,
          fill: colorNames || "#000000",
          fontFamily: NAMES_BASE_FONT_NAME,
          fontSize: heightNames || 75,
          originX: "left",
          originY: "top",
          textAlign: "center",
          padding: 0,
          lineHeight: 1.0,
          hasControls: true,
          hasBorders: false,
          selectable: true,
          editable: false,
          scaleX: frontScale,
          scaleY: frontScale,
          originType: "names",
        });
        // convertTextToImageAndCropVisible(frontCanvasRef.current, textObj);
        const scaledWidth = textObj.width * textObj.scaleX;
        textObj.left =
          frontBoundary.left + (frontBoundary.width - scaledWidth) / 2;
        // frontCanvasRef.current.add(textObj);
        addCanvasObjectWithMetadata(frontCanvasRef.current, textObj);
      }
      frontCanvasRef.current.requestRenderAll();
    } else {
      if (isAddNames) {
        const textObj = new fabric.Textbox("EXAMPLE", {
          left: 0,
          top: backBoundary.top + NAMES_BASE_TOP_OFFSET * backScale,
          fill: colorNames || "#000000",
          fontFamily: NAMES_BASE_FONT_NAME,
          fontSize: heightNames || 75,
          originX: "left",
          originY: "top",
          textAlign: "center",
          padding: 0,
          lineHeight: 1.0,
          hasControls: true,
          hasBorders: false,
          selectable: true,
          editable: false,
          scaleX: backScale,
          scaleY: backScale,
          originType: "names",
        });
        // convertTextToImageAndCropVisible(backCanvasRef.current, textObj);
        const scaledWidth = textObj.width * textObj.scaleX;
        textObj.left =
          backBoundary.left + (backBoundary.width - scaledWidth) / 2;
        // backCanvasRef.current.add(textObj);
        addCanvasObjectWithMetadata(backCanvasRef.current, textObj);
      }
      backCanvasRef.current.requestRenderAll();
    }

    // sideNumbers front or back
    if (sideNumbers === "front") {
      if (isAddNumbers) {
        const textObj = new fabric.Textbox("00", {
          left: 0,
          top: 0,
          fill: colorNumbers || "#000000",
          fontFamily: NAMES_BASE_FONT_NAME,
          fontSize: heightNumbers || 150,
          originX: "left",
          originY: "top",
          textAlign: "center",
          padding: 0,
          lineHeight: 1.0,
          hasControls: true,
          hasBorders: false,
          selectable: true,
          editable: false,
          scaleX: frontScale,
          scaleY: frontScale,
          originType: "numbers",
        });
        // convertTextToImageAndCropVisible(frontCanvasRef.current, textObj);
        const scaledWidth = textObj.width * textObj.scaleX;
        const scaledHeight = textObj.height * textObj.scaleX;

        textObj.left =
          frontBoundary.left + (frontBoundary.width - scaledWidth) / 2;
        textObj.top =
          frontBoundary.top + (frontBoundary.height - scaledHeight) / 2;
        // frontCanvasRef.current.add(textObj);
        addCanvasObjectWithMetadata(frontCanvasRef.current, textObj);
      }
      frontCanvasRef.current.requestRenderAll();
    } else {
      if (isAddNumbers) {
        const textObj = new fabric.Textbox("00", {
          left: 0,
          top: 0,
          fill: colorNumbers || "#000000",
          fontFamily: NAMES_BASE_FONT_NAME,
          fontSize: heightNumbers || 150,
          originX: "left",
          originY: "top",
          textAlign: "center",
          padding: 0,
          lineHeight: 1.0,
          hasControls: true,
          hasBorders: false,
          selectable: true,
          editable: false,
          scaleX: backScale,
          scaleY: backScale,
          originType: "numbers",
        });
        // convertTextToImageAndCropVisible(frontCanvasRef.current, textObj);
        const scaledWidth = textObj.width * textObj.scaleX;
        const scaledHeight = textObj.height * textObj.scaleX;

        textObj.left =
          backBoundary.left + (backBoundary.width - scaledWidth) / 2;
        textObj.top =
          backBoundary.top + (backBoundary.height - scaledHeight) / 2;
        // backCanvasRef.current.add(textObj);
        addCanvasObjectWithMetadata(backCanvasRef.current, textObj);
      }
      backCanvasRef.current.requestRenderAll();
    }
  }, [
    isAddNames,
    isAddNumbers,
    sideNames,
    sideNumbers,
    heightNames,
    heightNumbers,
    colorNames,
    colorNumbers,
  ]);

  useEffect(() => {
    sideNames === "front" ? handleSetFrontView() : handleSetBackView();
  }, [isAddNames, sideNames]);

  useEffect(() => {
    sideNumbers === "front" ? handleSetFrontView() : handleSetBackView();
  }, [isAddNumbers, sideNumbers]);

  const handleResetToOriginal = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const selObj = canvas.getActiveObject();
    if (!selObj) return;

    if (selObj.originType === "image") {
      const originalSrc = selObj.originData;
      if (!originalSrc) {
        console.warn("No originData found");
        return;
      }

      const img = new Image();
      img.onload = () => {
        const restoredImg = new fabric.Image(img, {
          ...selObj.toObject(),
          left: 0,
          top: 0,
          angle: 0,
          originX: selObj.originX,
          originY: selObj.originY,
          replacedColors: selObj.extractedColors,
          extractedColors: selObj.extractedColors,
          removeBackground: false,
          originData: selObj.originData,
          imageId: selObj.imageId,
          scaleX: 1,
          scaleY: 1,
          originType: selObj.originType,
          flipX: false,
          flipY: false,
          originScale: selObj.originScale,
          width: selObj.originWidth,
          height: selObj.originHeight,
          originWidth: selObj.originWidth,
          originHeight: selObj.originHeight,
        });

        restoredImg.scale(selObj.originScale);
        setExtractedColors(restoredImg.extractedColors);
        setReplacedColors(restoredImg.replacedColors);
        setRemoveBackground(restoredImg.removeBackground);
        setFlipHorizontal(false);
        setFlipVertical(false);
        setActiveImageId(restoredImg.imageId);
        enforceBoundaryConstraints(canvas, restoredImg);

        canvas.remove(selObj);
        addCanvasObjectWithMetadata(canvas, restoredImg);
        enforceBoundaryConstraints(canvas, restoredImg);
        canvas.requestRenderAll();
        canvas.discardActiveObject();
        canvas.setActiveObject(restoredImg);
        applyTransformControls(restoredImg);
      };
      img.src = originalSrc;
    } else if (selObj.originType === "clipart") {
      const originalSrc = selObj.originData;
      if (!originalSrc) {
        console.warn("No originData found");
        return;
      }

      const img = new Image();
      img.onload = () => {
        const restoredImg = new fabric.Image(img, {
          ...selObj.toObject(),
          left: 0,
          top: 0,
          angle: 0,
          originX: selObj.originX,
          originY: selObj.originY,
          replacedColors: selObj.extractedColors,
          extractedColors: selObj.extractedColors,
          removeBackground: false,
          originData: selObj.originData,
          imageId: selObj.imageId,
          scaleX: selObj.scaleX,
          scaleY: selObj.scaleY,
          originType: selObj.originType,
          flipX: false,
          flipY: false,
          originScale: selObj.originScale,
          width: selObj.originWidth,
          height: selObj.originHeight,
          originWidth: selObj.originWidth,
          originHeight: selObj.originHeight,
        });

        restoredImg.scale(selObj.originScale);
        setExtractedColors(restoredImg.extractedColors);
        setReplacedColors(restoredImg.replacedColors);
        setFlipHorizontal(false);
        setFlipVertical(false);
        enforceBoundaryConstraints(canvas, restoredImg);

        canvas.remove(selObj);
        addCanvasObjectWithMetadata(canvas, restoredImg);
        // enforceBoundaryConstraints(canvas, restoredImg);
        canvas.requestRenderAll();
        canvas.discardActiveObject();
        canvas.setActiveObject(restoredImg);
        applyTransformControls(restoredImg);
      };
      img.src = originalSrc;
    } else if (selObj.originType === "text") {
      const textObj = selObj.originText;
      textObj.set({
        fill: "#000000",
        fontFamily: "Arial",
        fontSize: 80,
        stroke: "#000000",
        strokeWidth: 0,
        fontWeight: "normal",
        textDecoration: "",
        angle: 0,

        textShape: "normal",
        textShapePreview: (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg viewBox="0 0 176.76 31.19" width="84" height="27">
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
      });
      setCenterObject(false);
      setFlipHorizontal(false);
      setFlipVertical(false);
      handleUpdateCanvas();
    }
    setResetToOriginal(false);
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          height: "100vh",
          position: "relative",
        }}
      >
        {!isMobile && (
          <SideMenu
            onUpload={handleImageUpload}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            textPage={textPage}
            setTextPage={setTextPage}
            textInput={textInput}
            setTextInput={setTextInput}
            textOptions={textOptions}
            setTextOptions={setTextOptions}
            colorPickerType={colorPickerType}
            setColorPickerType={setColorPickerType}
            addTextToCanvas={handleAddTextToCanvas}
            updateTextToCanvas={handleUpdateCanvas}
            isAddTextEnabled={isAddTextEnabled}
            extractedColors={extractedColors}
            setExtractedColors={setExtractedColors}
            replacedColors={replacedColors}
            setReplacedColors={setReplacedColors}
            onColorChange={handleColorChange}
            selectedColorIndex={selectedColorIndex}
            setSelectedColorIndex={setSelectedColorIndex}
            applyTransformControls={applyTransformControls}
            // applyTextShape={handleApplyTextShape}
            onRemoveBackground={handleRemoveBackground}
            duplicateObject={handleDuplicate}
            deleteText={handleDelete}
            onClipArtSelect={handleClipArtSelect}
            onCenter={handleCenterObject}
            onBringToFront={handleBringToFront}
            onSendToBack={handleSendToBack}
            onFlipHorizontal={handleFlipHorizontal}
            onFlipVertical={handleFlipVertical}
            onDuplicate={handleDuplicate}
            onRemove={handleDelete}
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
            isMobile={false}
            sidebarVisible={sidebarVisible}
            setSidebarVisible={setSidebarVisible}
            onEnterNamesNumbers={handleEnterNamesNumbers}
            setShowTermsDialog={setShowTermsDialog}
            isTermsAccepted={isTermsAccepted}
            resetToOriginal={resetToOriginal}
            setResetToOriginal={setResetToOriginal}
            onResetToOriginal={handleResetToOriginal}
          />
        )}
        <div
          id="canvas-container"
          style={{
            flex: 1,
            margin: 0,
            position: "relative",
            minWidth: "200px",
            minHeight: "200px",
            overflow: "hidden",
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Action Buttons */}
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid #ccc",
                borderRadius: "8px",
                overflow: "hidden",
                backgroundColor: "#f4f4f4",
              }}
            >
              {["Front", "Back", "R.Sleeve", "L.Sleeve"].map(
                (label, idx, arr) => (
                  <button
                    key={label}
                    onClick={
                      label === "Front"
                        ? handleSetFrontView
                        : label === "Back"
                        ? handleSetBackView
                        : label === "R.Sleeve"
                        ? handleSetRightView
                        : handleSetLeftView
                    }
                    style={{
                      padding: "10px 10px",
                      backgroundColor:
                        (label === "Front" && currentView === "front") ||
                        (label === "Back" && currentView === "back") ||
                        (label === "R.Sleeve" && currentView === "right") ||
                        (label === "L.Sleeve" && currentView === "left")
                          ? "#0066cc"
                          : "#f4f4f4",
                      color:
                        (label === "Front" && currentView === "front") ||
                        (label === "Back" && currentView === "back") ||
                        (label === "R.Sleeve" && currentView === "right") ||
                        (label === "L.Sleeve" && currentView === "left")
                          ? "#f4f4f4"
                          : "#333",
                      border: "none",
                      borderBottom:
                        idx < arr.length - 1 ? "1px solid #ccc" : "none",
                      fontSize: "14px",
                      fontWeight: 500,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center", // Center horizontally
                      textAlign: "center", // Ensure text is centered
                      gap: "4px",
                      transition: "all 0.2s ease-in-out",
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = "#0088cc";
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor =
                        (label === "Front" && currentView === "front") ||
                        (label === "Back" && currentView === "back") ||
                        (label === "R.Sleeve" && currentView === "right") ||
                        (label === "L.Sleeve" && currentView === "left")
                          ? "#0066cc"
                          : "#f4f4f4";
                    }}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
            <button
              key={"zoom"}
              onClick={handleZoom}
              style={{
                marginTop: 10,
                padding: "10px 11px",
                backgroundColor: "#f4f4f4",
                color: "#333",
                border: "none",
                fontSize: "14px",
                borderRadius: "8px",
                fontWeight: 500,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center", // Center horizontally
                textAlign: "center", // Ensure text is centered
                gap: "4px",
                transition: "all 0.2s ease-in-out",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#e6e6e6";
                e.target.style.borderColor = "#bbb";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#f4f4f4";
                e.target.style.borderColor = "#ccc";
              }}
            >
              {isZoomedToFit ? <GoZoomOut size={16} /> : <GoZoomIn size={16} />}
              Zoom
            </button>
          </div>

          <canvas
            id="front-canvas"
            style={{
              width: "100%",
              height: "100%",
              display: currentView === "front" ? "block" : "none",
              position: "relative",
              top: 0,
              left: 0,
            }}
            onContextMenu={(e) => e.preventDefault()}
          />

          <canvas
            id="back-canvas"
            style={{
              width: "100%",
              height: "100%",
              display: currentView === "back" ? "block" : "none",
              position: "relative",
              top: 0,
              left: 0,
            }}
            onContextMenu={(e) => e.preventDefault()}
          />

          <canvas
            id="left-canvas"
            style={{
              width: "100%",
              height: "100%",
              display: currentView === "left" ? "block" : "none",
              position: "relative",
              top: 0,
              left: 0,
            }}
            onContextMenu={(e) => e.preventDefault()}
          />

          <canvas
            id="right-canvas"
            style={{
              width: "100%",
              height: "100%",
              display: currentView === "right" ? "block" : "none",
              position: "relative",
              top: 0,
              left: 0,
            }}
            onContextMenu={(e) => e.preventDefault()}
          />

          {isMobile && (
            <>
              {/* Bottom Drawer Content */}
              {sidebarVisible && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 60,
                    left: 0,
                    right: 0,
                    height: "30vh",
                    background: "#fff",
                    zIndex: 1000,
                    borderTop: "1px solid #ddd",
                    boxShadow: "0 -2px 10px rgba(0,0,0,0.15)",
                  }}
                >
                  <SideMenu
                    onUpload={handleImageUpload}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    textPage={textPage}
                    setTextPage={setTextPage}
                    textInput={textInput}
                    setTextInput={setTextInput}
                    textOptions={textOptions}
                    setTextOptions={setTextOptions}
                    colorPickerType={colorPickerType}
                    setColorPickerType={setColorPickerType}
                    addTextToCanvas={handleAddTextToCanvas}
                    updateTextToCanvas={handleUpdateCanvas}
                    isAddTextEnabled={isAddTextEnabled}
                    extractedColors={extractedColors}
                    setExtractedColors={setExtractedColors}
                    replacedColors={replacedColors}
                    setReplacedColors={setReplacedColors}
                    onColorChange={handleColorChange}
                    selectedColorIndex={selectedColorIndex}
                    setSelectedColorIndex={setSelectedColorIndex}
                    applyTransformControls={applyTransformControls}
                    // applyTextShape={handleApplyTextShape}
                    onRemoveBackground={handleRemoveBackground}
                    duplicateObject={handleDuplicate}
                    deleteText={handleDelete}
                    onClipArtSelect={handleClipArtSelect}
                    onCenter={handleCenterObject}
                    onBringToFront={handleBringToFront}
                    onSendToBack={handleSendToBack}
                    onFlipHorizontal={handleFlipHorizontal}
                    onFlipVertical={handleFlipVertical}
                    onDuplicate={handleDuplicate}
                    onRemove={handleDelete}
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
                    isMobile={isMobile}
                    sidebarVisible={sidebarVisible}
                    setSidebarVisible={setSidebarVisible}
                    onEnterNamesNumbers={handleEnterNamesNumbers}
                    setShowTermsDialog={setShowTermsDialog}
                    isTermsAccepted={isTermsAccepted}
                    resetToOriginal={resetToOriginal}
                    setResetToOriginal={setResetToOriginal}
                    onResetToOriginal={handleResetToOriginal}
                  />
                </div>
              )}

              {/* Bottom Tab Buttons */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 60,
                  display: "flex",
                  background: "#fff",
                  borderTop: "1px solid #ccc",
                  zIndex: 1001,
                }}
              >
                {["text", "upload", "art", "numbers"].map((tab) => (
                  <TabBarButton
                    key={tab}
                    $active={activeTab === tab}
                    onClick={() => {
                      const sameTab = activeTab === tab;
                      setSidebarVisible(!sameTab || !sidebarVisible);
                      setActiveTab(sameTab && sidebarVisible ? null : tab);
                      if (tab === "upload" && !isTermsAccepted)
                        setShowTermsDialog(true);

                      const canvas = window.fabricCanvas;
                      canvas?.discardActiveObject();
                      canvas?.requestRenderAll();
                    }}
                  >
                    <FontAwesomeIcon
                      icon={icons[tab].props.icon}
                      className="icon"
                    />
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
            </>
          )}
          {/* Context Menu */}
          {contextMenu.show && (
            <div
              style={{
                position: "fixed",
                left: contextMenu.x,
                top: contextMenu.y,
                backgroundColor: "white",
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                borderRadius: "4px",
                padding: "4px 0",
                zIndex: 1000,
                minWidth: "150px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleSelectAll}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 16px",
                  border: "none",
                  backgroundColor: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#333",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f0f0f0")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                Select All
              </button>
              <div
                style={{
                  borderTop: "1px solid #eee",
                  margin: "4px 0",
                }}
              />
              <button
                onClick={handleDuplicate}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 16px",
                  border: "none",
                  backgroundColor: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#333",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f0f0f0")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                Duplicate
              </button>
              <button
                onClick={handleBringToFront}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 16px",
                  border: "none",
                  backgroundColor: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#333",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f0f0f0")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                Bring to Front
              </button>
              <button
                onClick={handleSendToBack}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 16px",
                  border: "none",
                  backgroundColor: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#333",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f0f0f0")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                Send to Back
              </button>
              <div
                style={{
                  borderTop: "1px solid #eee",
                  margin: "4px 0",
                }}
              />
              <button
                onClick={handleDelete}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "8px 16px",
                  border: "none",
                  backgroundColor: "transparent",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "14px",
                  color: "#ff4444",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#fff0f0")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                Delete
              </button>
            </div>
          )}
          {showNameNumberDialog && (
            <EnterNumbers setShowNameNumberDialog={setShowNameNumberDialog} />
          )}
        </div>
      </div>
      {showTermsDialog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            zIndex: 1999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              border: "1px solid #ffcccc",
              borderRadius: "10px",
              padding: "35px 30px",
              boxShadow: "0 4px 25px rgba(0, 0, 0, 0.3)",
              width: isMobile ? "90%" : "600px",
              maxHeight: "90%",
              overflowY: "auto",
              position: "relative",
            }}
          >
            <button
              onClick={handleCloseTerms}
              style={{
                position: "absolute",
                top: "15px",
                right: "20px",
                background: "transparent",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#b30000",
              }}
              aria-label="Close notice"
            >
              &times;
            </button>
            <h2
              style={{
                fontSize: "22px",
                color: "#b30000",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              Important Notice
            </h2>
            <div
              style={{
                backgroundColor: "#fff4f5",
                border: "1px solid #ffcccc",
                borderRadius: "6px",
                padding: "20px",
                fontSize: "15px",
                color: "#800000",
                lineHeight: "1.6",
                marginBottom: "25px",
              }}
            >
              <p>
                At <strong>Plaquita</strong>, we deeply value and respect the
                intellectual property of others. By uploading content, you
                certify that it is free from any copyrights or trademarks.
              </p>
              <p>
                You are fully responsible for any legal consequences that may
                arise from the content you post, including designs, photographs,
                and videos. This includes copyright infringement, complaints
                from individuals featured in your media, or property owners
                whose properties are shown without permission.
              </p>
              <p>
                You agree to indemnify and hold <strong>Plaquita</strong> and
                its affiliates harmless from any claims, legal costs, and
                attorney’s fees resulting from your use of the platform or
                violation of these terms.
              </p>
              <p>
                We reserve the right to remove or block any content deemed
                unacceptable and to determine what qualifies as such. Content
                found to be copyright-protected will be promptly deleted.
              </p>
              <p>
                Repeated violations may result in account termination. If you
                believe your copyrighted work or trademark has been infringed,
                please contact us at{" "}
                <a href="mailto:help@plaquita.com">help@plaquita.com</a> to file
                a formal complaint.
              </p>
            </div>
            <div
              style={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                type="checkbox"
                id="terms-checkbox"
                checked={isTermsAccepted}
                onChange={handleTermsCheck}
                style={{ marginRight: "10px", transform: "scale(1.2)" }}
              />
              <label
                htmlFor="terms-checkbox"
                style={{ fontSize: "15px", color: "#333" }}
              >
                I agree to the copyright terms
              </label>
            </div>
            <button
              onClick={handleAcceptTerms}
              disabled={!isTermsAccepted}
              style={{
                backgroundColor: isTermsAccepted ? "#0066cc" : "#ccc",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "12px 0",
                fontSize: "16px",
                cursor: isTermsAccepted ? "pointer" : "not-allowed",
                width: "100%",
                fontWeight: "bold",
                transition: "background-color 0.3s ease",
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DesignEditor;
