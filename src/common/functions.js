import ColorThief from "colorthief";

const MAIN_BOUNDARY_WIDTH = 400;
const MAIN_BOUNDARY_HEIGHT = 500;
const MAIN_BOUNDARY_BASE_LEFT_OFFSET = 155;
const MAIN_BOUNDARY_BASE_TOP_OFFSET = 180;

const CHEST_BOUNDARY_WIDTH = 170;
const CHEST_BOUNDARY_HEIGHT = 170;
const CHEST_BOUNDARY_BASE_RIGHT_OFFSET = 30;
const CHEST_BOUNDARY_BASE_TOP_OFFSET = 10;

const SLEEVE_BOUNDARY_WIDTH = 190;
const SLEEVE_BOUNDARY_HEIGHT = 190;
const LSLEEVE_BOUNDARY_BASE_LEFT_OFFSET = 280;
const LSLEEVE_BOUNDARY_BASE_TOP_OFFSET = 400;

const RSLEEVE_BOUNDARY_BASE_LEFT_OFFSET = 150;
const RSLEEVE_BOUNDARY_BASE_TOP_OFFSET = 400;

const NAMES_BASE_TOP_OFFSET = 40;
const NAMES_BASE_FONT_NAME = "Arial";
const MAIN_TEXT_SCALE = 1;
const DEFAULT_FONT_SIZE = 80;
const SCALED_FONT_SIZE = 400;

const WOOCOMMERCE_CONSUMER_KEY = "ck_295bda9defb0d6d549155ec75ff3b27c339e0a89";
const WOOCOMMERCE_CONSUMER_SECRET = "cs_798c4ca391290b441d366c03a3677c9224bc2c48";

const predefinedColors = [
  { name: "White", value: "#FFFFFF" },
  { name: "Pure Black", value: "#000000" },
  { name: "Crimson", value: "#DC143C" },
  { name: "Royal Blue", value: "#4169E1" },
  { name: "Emerald", value: "#50C878" },
  { name: "Sunshine", value: "#FFD700" },
  { name: "Coral", value: "#FF7F50" },
  { name: "Violet", value: "#8A2BE2" },
  { name: "Hot Pink", value: "#FF69B4" },
  { name: "Teal", value: "#008080" },
  { name: "Slate", value: "#708090" },
  { name: "Sky Blue", value: "#87CEEB" },
  { name: "Mint", value: "#98FF98" },
  { name: "Lavender", value: "#E6E6FA" },
  { name: "Deep Blue", value: "#0000CD" },
  { name: "Forest", value: "#228B22" },
  { name: "Ruby", value: "#E0115F" },
  { name: "Amber", value: "#FFBF00" },
  { name: "Platinum", value: "#E5E4E2" },
  { name: "Indigo", value: "#4B0082" },
  { name: "Turquoise", value: "#40E0D0" },
  { name: "Magenta", value: "#FF00FF" },
  { name: "Lime", value: "#32CD32" },
  { name: "Peach", value: "#FFDAB9" },
  { name: "Maroon", value: "#800000" },
  { name: "Olive", value: "#808000" },
  { name: "Navy", value: "#000080" },
  { name: "Chocolate", value: "#D2691E" },
  { name: "Tomato", value: "#FF6347" },
  { name: "Orchid", value: "#DA70D6" },
  { name: "Sea Green", value: "#2E8B57" },
  { name: "Steel Blue", value: "#4682B4" },
  { name: "Firebrick", value: "#B22222" },
  { name: "Dark Orange", value: "#FF8C00" },
  { name: "Rosy Brown", value: "#BC8F8F" },
  { name: "Cadet Blue", value: "#5F9EA0" },
  { name: "Periwinkle", value: "#CCCCFF" },
  { name: "Goldenrod", value: "#DAA520" },
  { name: "Trasparent", value: "transparent" },
];

const extractVisibleColors = (img, minPercent = 0.5, bucketSize = 16) => {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  const { data, width, height } = ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
  );
  const totalPixels = width * height;
  const buckets = {};

  const bucket = (v) => Math.floor(v / bucketSize) * bucketSize;

  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (a < 64) continue;

    const br = bucket(r);
    const bg = bucket(g);
    const bb = bucket(b);
    const key = `${br},${bg},${bb}`;

    buckets[key] = (buckets[key] || 0) + 1;
  }

  const colors = Object.entries(buckets)
    .filter(([_, count]) => (count / totalPixels) * 100 >= minPercent)
    .sort((a, b) => b[1] - a[1])
    .map(([key]) => {
      const [r, g, b] = key.split(",").map(Number);
      return `#${r.toString(16).padStart(2, "0")}${g
        .toString(16)
        .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    });

  return colors;
};

const extractColors = (img, colorCount = 15, bucketSize = 16) => {
  const colorThief = new ColorThief();
  const rawPalette = colorThief.getPalette(img, colorCount); // get more to avoid losing good ones after deduplication

  // Bucket function
  const bucket = (v) => Math.floor(v / bucketSize) * bucketSize;

  // Convert RGB to bucketed hex and deduplicate
  const bucketed = new Set();
  const colors = [];

  for (const [r, g, b] of rawPalette) {
    const br = bucket(r);
    const bg = bucket(g);
    const bb = bucket(b);
    const hex = `#${br.toString(16).padStart(2, "0")}${bg
      .toString(16)
      .padStart(2, "0")}${bb.toString(16).padStart(2, "0")}`;

    if (!bucketed.has(hex)) {
      bucketed.add(hex);
      colors.push(hex);
    }

    if (colors.length >= colorCount) break;
  }

  return colors;
};

function enforceBoundaryConstraints(canvas, selObj) {
  const mainBoundary = canvas
    .getObjects()
    .find((obj) => obj.name === "boundary");
  if (!mainBoundary || !selObj) return;

  // Both are assumed to be left-top origin
  const selW = selObj.getScaledWidth();
  const selH = selObj.getScaledHeight();

  const boundaryLeft = mainBoundary.left;
  const boundaryTop = mainBoundary.top;
  const boundaryRight = boundaryLeft + mainBoundary.width;
  const boundaryBottom = boundaryTop + mainBoundary.height;

  let newLeft = selObj.left;
  let newTop = selObj.top;

  // Prevent overflow left/top
  if (newLeft < boundaryLeft) newLeft = boundaryLeft;
  if (newTop < boundaryTop) newTop = boundaryTop;

  // Prevent overflow right/bottom
  if (newLeft + selW > boundaryRight) newLeft = boundaryRight - selW;
  if (newTop + selH > boundaryBottom) newTop = boundaryBottom - selH;

  selObj.set({ left: newLeft, top: newTop });
  selObj.setCoords();
}

const loadCliparts = () => {
  // Use Vite's import.meta.glob to load SVGs at build time. This replaces
  // Webpack's `require.context`, which is not available in the browser when
  // running under Vite.
  const modules = import.meta.glob("../assets/cliparts/**/*.svg", {
    eager: true,
    query: "?url",
    import: "default",
  });

  const categories = {};

  Object.entries(modules).forEach(([fullPath, url]) => {
    // fullPath example: '../assets/cliparts/academy/new kids/icon.svg'
    const rel = fullPath.replace(/^\.\.\/assets\/cliparts\//, "");
    const parts = rel.split("/").filter(Boolean);
    const category = parts[0];
    const group = parts[1] || "default";

    if (!category) return;

    if (!categories[category]) {
      categories[category] = { groups: {}, preview: null };
    }

    if (!categories[category].groups[group]) {
      categories[category].groups[group] = [];
    }

    categories[category].groups[group].push(url);

    if (!categories[category].preview) {
      categories[category].preview = url;
    }
  });

  return Object.entries(categories).map(([category, data]) => ({
    category,
    preview: data.preview,
    groups: Object.entries(data.groups).map(([group, items]) => ({
      group,
      items,
    })),
  }));
};

const hexToRgb = (hex) => {
  // Remove any whitespace and ensure hex starts with #
  hex = hex.trim().replace(/^#?/, "#");

  // Validate hex format
  if (!/^#[0-9A-Fa-f]{6}$/.test(hex)) {
    console.error("Invalid hex color format:", hex);
    return { r: 0, g: 0, b: 0 }; // Return default black color
  }

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    console.error("Failed to parse hex color:", hex);
    return { r: 0, g: 0, b: 0 }; // Return default black color
  }

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
};

// Export everything as named exports
export {
  extractVisibleColors,
  extractColors,
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
  predefinedColors,
  loadCliparts,
  hexToRgb,
  WOOCOMMERCE_CONSUMER_KEY,
  WOOCOMMERCE_CONSUMER_SECRET,
};
