import React from "react";

const FONT_FAMILIES = [
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Helvetica", value: "Helvetica, sans-serif" },
  { name: "Verdana", value: "Verdana, sans-serif" },
  { name: "Tahoma", value: "Tahoma, sans-serif" },
  { name: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
  { name: "Gill Sans", value: "'Gill Sans', sans-serif" },
  { name: "Segoe UI", value: "'Segoe UI', sans-serif" },
  { name: "Lucida Grande", value: "'Lucida Grande', sans-serif" },
  { name: "Times New Roman", value: "'Times New Roman', serif" },
  { name: "Georgia", value: "Georgia, serif" },
  {
    name: "Palatino",
    value: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
  },
  { name: "Courier New", value: "'Courier New', monospace" },
  { name: "Lucida Console", value: "'Lucida Console', monospace" },
  { name: "Monaco", value: "Monaco, monospace" },
  { name: "Impact", value: "Impact, Charcoal, sans-serif" },
  { name: "Comic Sans MS", value: "'Comic Sans MS', cursive, sans-serif" },
];

const FontFamilyPicker = ({ value, onChange }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: 8,
        maxHeight: 220,
        overflowY: "auto",
        paddingRight: 4,
      }}
    >
      {FONT_FAMILIES.map((font) => (
        <button
          key={font.name}
          onClick={() => onChange(font.name)}
          style={{
            fontFamily: font.value,
            padding: "10px 8px",
            border:
              value === font.name ? "2px solid #007bff" : "1px solid #ccc",
            borderRadius: 6,
            background: value === font.name ? "#f0f7ff" : "#fff",
            cursor: "pointer",
            fontSize: 16,
            fontWeight: 500,
            transition: "all 0.2s",
            textAlign: "center",
            width: "100%",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {font.name}
        </button>
      ))}
    </div>
  );
};

export default FontFamilyPicker;
