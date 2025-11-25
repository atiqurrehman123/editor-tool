import { predefinedColors } from "../common/functions";

const options = {
  sides: [
    { key: "Front", value: "front" },
    { key: "Back", value: "back" },
  ],
  heightsForNumber: [
    { key: "2 In", value: 75 },
    { key: "4 In", value: 150 },
    { key: "6 In", value: 225 },
    { key: "8 In", value: 300 },
  ],
  heightsForName: [
    { key: "1 In", value: 37.5 },
    { key: "2 In", value: 75 },
  ],
};

const Selector = ({ label, value, onChange, options }) => (
  <div style={styles.cell}>
    <label>{label}</label>
    <select
      style={styles.select}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt.key} value={opt.value}>
          {opt.key}
        </option>
      ))}
    </select>
  </div>
);

const Numbers = ({
  textPage,
  setTextPage,
  colorPickerType,
  setColorPickerType,
  sideNames,
  sideNumbers,
  heightNames,
  heightNumbers,
  setSideNames,
  setSideNumbers,
  setHeightNames,
  setHeightNumbers,
  colorNames,
  setColorNames,
  colorNumbers,
  setColorNumbers,
  isAddNames,
  setIsAddNames,
  isAddNumbers,
  setIsAddNumbers,
  onEnterNamesNumbers,
}) => {
  return (
    <>
      {textPage === 1 ? (
        <div style={styles.container}>
          <div style={styles.row}>
            <div style={styles.cell}>Step 1:</div>
            <label style={styles.cell}>
              <input
                type="checkbox"
                checked={isAddNames}
                onChange={() => {
                  setIsAddNames(!isAddNames);
                }}
              />{" "}
              Add Names
            </label>
            <label style={styles.cell}>
              <input
                type="checkbox"
                checked={isAddNumbers}
                onChange={() => {
                  setIsAddNumbers(!isAddNumbers);
                }}
              />{" "}
              Add Numbers
            </label>
          </div>

          <div style={styles.row}>
            <div style={styles.cell}>Side:</div>
            <Selector
              value={sideNames}
              onChange={setSideNames}
              options={options.sides}
            />
            <Selector
              value={sideNumbers}
              onChange={setSideNumbers}
              options={options.sides}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.cell}>Height:</div>
            <Selector
              value={heightNames}
              onChange={setHeightNames}
              options={options.heightsForName}
            />
            <Selector
              value={heightNumbers}
              onChange={setHeightNumbers}
              options={options.heightsForNumber}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.cell}>Color:</div>

            <div
              style={{
                ...styles.cell,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 14, color: "#666" }}>
                {predefinedColors.find((c) => c.value === colorNames)?.name ||
                  "Black"}
              </span>
              <button
                onClick={() => {
                  setColorPickerType("name");
                  setTextPage(2);
                }}
                style={{
                  width: 25,
                  height: 25,
                  backgroundColor: colorNames,
                  border: "2px solid #ccc",
                  borderRadius: 4,
                  cursor: "pointer",
                  padding: 0,
                }}
              />
            </div>

            <div
              style={{
                ...styles.cell,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 14, color: "#666" }}>
                {predefinedColors.find((c) => c.value === colorNumbers)?.name ||
                  "Black"}
              </span>
              <button
                onClick={() => {
                  setColorPickerType("number");
                  setTextPage(2);
                }}
                style={{
                  width: 25,
                  height: 25,
                  backgroundColor: colorNumbers,
                  border: "2px solid #ccc",
                  borderRadius: 4,
                  cursor: "pointer",
                  padding: 0,
                }}
              />
            </div>
          </div>
          <div style={{ ...styles.row }}>
            <div style={{ gridColumn: "1 / span 3", padding: "8px 0" }}>
              <button
                onClick={() => {
                  // Handle button click
                  console.log("Enter Names & Numbers clicked");
                  onEnterNamesNumbers();
                }}
                style={{
                  width: "100%",
                  padding: "12px 0",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Enter Names & Numbers
              </button>
            </div>
          </div>
        </div>
      ) : textPage === 2 ? (
        <>
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
                  if (colorPickerType === "name") {
                    setColorNames(color.value);
                  } else if (colorPickerType === "number") {
                    setColorNumbers(color.value);
                  }
                }}
                style={{
                  width: "100%",
                  aspectRatio: "1",
                  backgroundColor: color.value,
                  border: `2px solid ${
                    (colorPickerType === "name" &&
                      colorNames === color.value) ||
                    (colorPickerType === "number" &&
                      colorNumbers === color.value)
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
              ></button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <button
              onClick={async () => {
                setTextPage(1);
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
      ) : null}
    </>
  );
};

const styles = {
  container: {
    fontFamily: "sans-serif",
    padding: 0,
    borderRadius: 12,
    margin: "0 auto",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr 2fr",
    padding: "10px 2px",
    borderBottom: "1px solid #ddd",
    alignItems: "center",
  },
  cell: {
    padding: "4px",
    textAlign: "right",
    fontSize: 14,
  },
  label: {
    display: "block",
    marginBottom: 4,
    fontSize: 14,
    fontWeight: 500,
  },
  select: {
    width: "100%",
    padding: "6px 10px",
    fontSize: 14,
    border: "1px solid #ccc",
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  colorButton: {
    width: 30,
    height: 30,
    border: "2px solid #ccc",
    borderRadius: 6,
    margin: "2px",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },
};

export default Numbers;
