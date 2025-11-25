import { useState } from "react";

const EnterNumbers = ({ setShowNameNumberDialog }) => {
  const [nameNumberRows, setNameNumberRows] = useState(
    Array(5)
      .fill(null)
      .map(() => ({ name: "", number: "", size: "" }))
  );
  const [showDeleteIcons, setShowDeleteIcons] = useState(false);

  // Toggle delete icons
  const toggleDeleteIcons = () => setShowDeleteIcons(!showDeleteIcons);

  // Check duplicates helper:
  const findDuplicates = (key) => {
    const counts = {};
    nameNumberRows.forEach((row) => {
      const val = row[key].trim();
      if (val !== "") counts[val] = (counts[val] || 0) + 1;
    });
    return counts;
  };

  // Duplicates count for name and number
  const duplicateNames = findDuplicates("name");
  const duplicateNumbers = findDuplicates("number");

  // Update row content (no alerts, just update)
  const updateNamesNumbersRow = (index, key, value) => {
    const updated = [...nameNumberRows];
    updated[index][key] = value;
    setNameNumberRows(updated);
  };

  // Add new row
  const addNamesNumbersRow = () => {
    setNameNumberRows([...nameNumberRows, { name: "", number: "", size: "" }]);
  };

  // Remove specific row
  const removeNamesNumbersRow = (indexToRemove) => {
    setNameNumberRows(nameNumberRows.filter((_, idx) => idx !== indexToRemove));
  };

  // Input style with duplicate highlighting
  const getInputStyle = (key, value) => {
    const baseStyle = {
      padding: "6px 8px",
      border: "1px solid #ccc",
      borderRadius: 4,
      fontSize: 14,
      outline: "none",
    };

    if (
      (key === "name" &&
        value.trim() !== "" &&
        duplicateNames[value.trim()] > 1) ||
      (key === "number" &&
        value.trim() !== "" &&
        duplicateNumbers[value.trim()] > 1)
    ) {
      return {
        ...baseStyle,
        border: "2px solid red",
        backgroundColor: "#ffe6e6",
      };
    }
    return baseStyle;
  };

  return (
    <div style={dialogOverlayStyle}>
      <div style={dialogBoxStyle}>
        <h2 style={{ marginBottom: 16 }}>
          Enter your full list and sizes for accurate pricing
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 60px 100px",
            gap: 8,
            fontWeight: "bold",
            marginBottom: 8,
          }}
        >
          <div>Name</div>
          <div>#</div>
          <div>Size</div>
        </div>

        {nameNumberRows.map((row, idx) => (
          <div
            key={idx}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 60px 100px auto",
              gap: 8,
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <input
              type="text"
              placeholder="ENTER NAME"
              value={row.name}
              onChange={(e) =>
                updateNamesNumbersRow(idx, "name", e.target.value)
              }
              style={getInputStyle("name", row.name)}
            />
            <input
              type="text"
              placeholder="00"
              value={row.number}
              onChange={(e) =>
                updateNamesNumbersRow(idx, "number", e.target.value)
              }
              style={getInputStyle("number", row.number)}
            />
            <select
              value={row.size}
              onChange={(e) =>
                updateNamesNumbersRow(idx, "size", e.target.value)
              }
              style={inputStyle}
            >
              <option value="">Size ▾</option>
              {["XS", "S", "M", "L", "XL", "2XL"].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            {showDeleteIcons && (
              <button
                onClick={() => removeNamesNumbersRow(idx)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#d00",
                  cursor: "pointer",
                  fontSize: 18,
                }}
              >
                ✕
              </button>
            )}
          </div>
        ))}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <button onClick={addNamesNumbersRow} style={linkButtonStyle}>
            + Add More
          </button>
          <button onClick={toggleDeleteIcons} style={linkButtonStyle}>
            Manage List
          </button>
        </div>

        <button
          onClick={() => setShowNameNumberDialog(false)}
          style={{ ...closeBtnStyle, marginTop: 24 }}
        >
          Done
        </button>
      </div>
    </div>
  );
};

// Your styles unchanged

const dialogOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.3)",
  zIndex: 9999,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const dialogBoxStyle = {
  backgroundColor: "#fff",
  padding: 24,
  borderRadius: 8,
  width: "90%",
  maxWidth: 600,
  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
};

const closeBtnStyle = {
  marginTop: 16,
  backgroundColor: "#0033ee",
  color: "#fff",
  padding: "10px 20px",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const inputStyle = {
  padding: "6px 8px",
  border: "1px solid #ccc",
  borderRadius: 4,
  fontSize: 14,
};

const linkButtonStyle = {
  color: "#0055ff",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: 14,
  padding: 0,
};

export default EnterNumbers;
