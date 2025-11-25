import { useState } from "react";

const EstimateOrderForm = () => {
  const [form, setForm] = useState({
    your_firstname: "",
    your_lastname: "",
    CompanyName: "",
    accountholderradio: "",
    phonenumber: "",
    usermail: "",
    printtype: [],
    writestyle: "",
    fabrictype: [],
    garmentstyle: "",
    garmentcolor: "",
    quantities: {
      xsnumber: 0,
      snumber: 0,
      mnumber: 0,
      lnumber: 0,
      xlnumber: 0,
      xl2number: 0,
      xl3number: 0,
      xl4number: 0,
      xl5number: 0,
    },
    artPositionFullFront: false,
    artPositionFullBack: false,
    artPositionFrontRightChest: false,
    artPositionFrontLeftChest: false,
    artPositionLeftSleeve: false,
    artPositionRightSleeve: false,
    UploadYourArt: null,
    onlytextareal: "",
    checkbox_773: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      // For arrays like printtype, fabrictype, checkbox_773 (multi-select)
      if (["printtype", "fabrictype", "checkbox_773"].includes(name)) {
        setForm((prev) => ({
          ...prev,
          [name]: checked
            ? [...(prev[name] || []), value]
            : prev[name].filter((v) => v !== value),
        }));
      } else {
        // For individual boolean checkboxes like art positions
        setForm((prev) => ({ ...prev, [name]: checked }));
      }
    } else if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else if (type === "radio") {
      setForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleQuantityChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      quantities: {
        ...prev.quantities,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Flatten quantities before appending
    const formCopy = { ...form, quantities: JSON.stringify(form.quantities) };

    Object.entries(formCopy).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === "object" && value !== null) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    const res = await fetch(
      "https://plaquita.com/wp-json/custom/v1/estimate-order",
      {
        method: "POST",
        body: formData,
      }
    );

    const json = await res.json();
    alert(json.message);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-lg space-y-8 text-base"
    >
      <h2 className="text-3xl font-extrabold text-center mb-4 text-indigo-700">
        ESTIMATE ORDER FORM
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <label className="flex flex-col font-medium text-gray-800">
          First Name
          <input
            name="your_firstname"
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-500"
          />
        </label>
        <label className="flex flex-col font-medium text-gray-800">
          Last Name
          <input
            name="your_lastname"
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-500"
          />
        </label>
        <label className="flex flex-col font-medium text-gray-800">
          Company Name
          <input
            name="CompanyName"
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-500"
          />
        </label>
        <label className="flex flex-col font-medium text-gray-800">
          Phone Number
          <input
            name="phonenumber"
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-500"
          />
        </label>
        <label className="flex flex-col font-medium text-gray-800">
          Email
          <input
            name="usermail"
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-500"
          />
        </label>
      </div>

      <div>
        <label className="block font-semibold text-indigo-600">
          Account Holder?
        </label>
        <div className="flex gap-6 mt-2">
          {["Yes", "No", "Request an Account"].map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 text-lg text-gray-700"
            >
              <input
                type="radio"
                name="accountholderradio"
                value={opt}
                onChange={handleChange}
                className="focus:ring-indigo-500"
              />{" "}
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-semibold text-indigo-600">
          Print Type
        </label>
        <div className="flex gap-6 flex-wrap mt-2">
          {["Screen Printed", "Full Color", "Embroidered"].map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 text-lg text-gray-700"
            >
              <input
                type="checkbox"
                name="printtype"
                value={opt}
                onChange={handleChange}
                className="focus:ring-indigo-500"
              />{" "}
              {opt}
            </label>
          ))}
        </div>
      </div>

      <label className="flex flex-col font-medium text-gray-800">
        STYLE - Enter item number or description (e.g., Adult/short sleeve/polo)
        <input
          name="writestyle"
          onChange={handleChange}
          className="border rounded-xl px-4 py-3 text-lg w-full mt-1 focus:ring-2 focus:ring-indigo-500"
        />
      </label>

      <div>
        <label className="block font-semibold text-indigo-600">
          Fabric Type
        </label>
        <div className="flex gap-6 flex-wrap mt-2">
          {["100% cotton", "Performance(100% Poly)", "Poly/ Cotton blend"].map(
            (opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 text-lg text-gray-700"
              >
                <input
                  type="checkbox"
                  name="fabrictype"
                  value={opt}
                  onChange={handleChange}
                  className="focus:ring-indigo-500"
                />{" "}
                {opt}
              </label>
            )
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <label className="flex flex-col font-medium text-gray-800">
          Garment Style
          <input
            name="garmentstyle"
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-500"
          />
        </label>
        <label className="flex flex-col font-medium text-gray-800">
          Garment Color
          <input
            name="garmentcolor"
            onChange={handleChange}
            className="border rounded-xl px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-500"
          />
        </label>
      </div>

      <div>
        <label className="block font-semibold mb-2 text-indigo-600">
          Quantity (Shirt Sizes)
        </label>
        <div className="flex flex-wrap gap-4">
          {Object.entries({
            xsnumber: "XS",
            snumber: "S",
            mnumber: "M",
            lnumber: "L",
            xlnumber: "XL",
            xl2number: "2XL",
            xl3number: "3XL",
            xl4number: "4XL",
            xl5number: "5XL",
          }).map(([name, label]) => (
            <label
              key={name}
              className="flex flex-col items-center text-sm font-medium w-12 text-gray-700"
            >
              <span className="mb-1">{label}</span>
              <input
                name={name}
                type="number"
                min="0"
                onChange={handleQuantityChange}
                className="border rounded-md px-2 py-1 text-center text-base focus:ring-2 focus:ring-indigo-500"
                style={{ width: "100%" }}
              />
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-semibold text-indigo-600">
          Select Art Location
        </label>
        <div className="grid grid-cols-2 gap-4 mt-2 text-gray-700">
          <label className="flex items-center gap-2 text-lg">
            <input
              type="checkbox"
              name="artPositionFullFront"
              checked={form.artPositionFullFront}
              onChange={handleChange}
              className="focus:ring-indigo-500"
            />{" "}
            Full Front
          </label>
          <label className="flex items-center gap-2 text-lg">
            <input
              type="checkbox"
              name="artPositionFullBack"
              checked={form.artPositionFullBack}
              onChange={handleChange}
              className="focus:ring-indigo-500"
            />{" "}
            Full Back
          </label>
          <label className="flex items-center gap-2 text-lg">
            <input
              type="checkbox"
              name="artPositionFrontRightChest"
              checked={form.artPositionFrontRightChest}
              onChange={handleChange}
              className="focus:ring-indigo-500"
            />{" "}
            Front Right Chest
          </label>
          <label className="flex items-center gap-2 text-lg">
            <input
              type="checkbox"
              name="artPositionFrontLeftChest"
              checked={form.artPositionFrontLeftChest}
              onChange={handleChange}
              className="focus:ring-indigo-500"
            />{" "}
            Front Left Chest
          </label>
          <label className="flex items-center gap-2 text-lg">
            <input
              type="checkbox"
              name="artPositionLeftSleeve"
              checked={form.artPositionLeftSleeve}
              onChange={handleChange}
              className="focus:ring-indigo-500"
            />{" "}
            Left Sleeve
          </label>
          <label className="flex items-center gap-2 text-lg">
            <input
              type="checkbox"
              name="artPositionRightSleeve"
              checked={form.artPositionRightSleeve}
              onChange={handleChange}
              className="focus:ring-indigo-500"
            />{" "}
            Right Sleeve
          </label>
        </div>
      </div>

      <div>
        <label className="block font-semibold text-indigo-600">
          Upload Your Art
        </label>
        <input
          type="file"
          name="UploadYourArt"
          onChange={handleChange}
          className="mt-2 w-full focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <label className="flex flex-col font-medium text-gray-800">
        Special Instructions & Additional Information
        <textarea
          name="onlytextareal"
          onChange={handleChange}
          className="border rounded-xl px-4 py-3 text-lg mt-1 w-full focus:ring-2 focus:ring-indigo-500"
          rows={4}
        ></textarea>
      </label>

      <div>
        <label className="block font-semibold text-indigo-600">Request</label>
        <div className="flex gap-6 flex-wrap mt-2">
          {[
            "Email",
            "Phone Call",
            "Appointment in Our Silver Spring, MD Office",
          ].map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 text-lg text-gray-700"
            >
              <input
                type="checkbox"
                name="checkbox_773"
                value={opt}
                onChange={handleChange}
                className="focus:ring-indigo-500"
              />{" "}
              {opt}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3 px-6 bg-indigo-600 text-white text-lg font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
      >
        Submit
      </button>
    </form>
  );
};

export default EstimateOrderForm;
