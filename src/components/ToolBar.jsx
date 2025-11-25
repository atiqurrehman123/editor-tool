import { PiAlignCenterHorizontal } from "react-icons/pi";
import {
  RiBringToFront,
  RiSendToBack,
  RiFlipHorizontalFill,
  RiFlipVerticalFill,
  RiFlipVerticalLine,
  RiDeleteBinLine,
  RiFlipHorizontalLine,
} from "react-icons/ri";
import { HiOutlineDuplicate } from "react-icons/hi";

// Change to accept props as an object (destructuring)
const Toolbar = ({
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
}) => {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      {/* Center */}
      <div style={toolGroupStyle}>
        <button
          style={btnStyle}
          title="Center"
          disabled={centerObject}
          onClick={() => {
            setCenterObject(true);
            onCenter();
          }}
        >
          <PiAlignCenterHorizontal size={18} />
        </button>
        <div style={labelStyle}>Center</div>
      </div>

      {/* Layering */}
      <div style={toolGroupStyle}>
        <div style={{ display: "flex", gap: 2 }}>
          <button
            style={btnStyle}
            title="Bring to Front"
            disabled={bringToFront}
            onClick={() => {
              onBringToFront();
              setBringToFront(true);
              setSendToBack(false);
            }}
          >
            <RiBringToFront size={18} />
          </button>
          <button
            style={btnStyle}
            title="Send to Back"
            disabled={sendToBack}
            onClick={() => {
              setSendToBack(true);
              setBringToFront(false);
              onSendToBack();
            }}
          >
            <RiSendToBack size={18} />
          </button>
        </div>
        <div style={labelStyle}>Layering</div>
      </div>

      {/* Flip */}
      <div style={toolGroupStyle}>
        <div style={{ display: "flex", gap: 2 }}>
          <button
            style={btnStyle}
            title="Flip Horizontal"
            onClick={() => {
              setFlipHorizontal(!flipHorizontal);
              onFlipHorizontal();
            }}
          >
            {flipHorizontal ? (
              <RiFlipHorizontalFill size={18} />
            ) : (
              <RiFlipHorizontalLine size={18} />
            )}
          </button>
          <button
            style={btnStyle}
            title="Flip Vertical"
            onClick={() => {
              setFlipVertical(!flipVertical);
              onFlipVertical();
            }}
          >
            {flipVertical ? (
              <RiFlipVerticalFill size={18} />
            ) : (
              <RiFlipVerticalLine size={18} />
            )}
          </button>
        </div>
        <div style={labelStyle}>Flip</div>
      </div>

      {/* Duplicate */}
      <div style={toolGroupStyle}>
        <button style={btnStyle} title="Duplicate" onClick={onDuplicate}>
          <HiOutlineDuplicate size={18} />
        </button>
        <div style={labelStyle}>Duplicate</div>
      </div>

      {/* Remove */}
      <div style={toolGroupStyle}>
        <button style={removeBtnStyle} title="Remove" onClick={onRemove}>
          <RiDeleteBinLine size={18} color="#d32f2f" />
        </button>
        <div style={{ ...labelStyle, color: "#d32f2f" }}>Remove</div>
      </div>
    </div>
  );
};

const btnStyle = {
  border: "1px solid #ccc",
  borderRadius: 6,
  padding: 8,
  background: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 36,
  height: 28,
  cursor: "pointer",
  transition: "background-color 0.2s, border-color 0.2s",
};

const removeBtnStyle = {
  ...btnStyle,
  border: "1px solid #d32f2f",
  color: "#d32f2f",
  background: "#fff",
};

const toolGroupStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const labelStyle = {
  marginTop: 6,
  fontSize: 10,
  color: "#333",
};

export default Toolbar;
