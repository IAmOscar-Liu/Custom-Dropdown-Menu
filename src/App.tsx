import "./styles.css";
import CustomDropdown from "./CustomDropdown";
import { useState } from "react";

type Country = {
  id: string;
  name: string;
};

const DROPDOWN_OPTIONS: Country[] = [
  { id: "TW", name: "Taiwan" },
  { id: "CN", name: "China" },
  { id: "US", name: "United State of America" },
  { id: "JP", name: "Japan" },
];

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  return (
    <div className="App">
      <CustomDropdown
        width={300}
        style={{ border: "1px solid black", borderRadius: 3 }}
        options={DROPDOWN_OPTIONS}
        value={selectedCountry}
        onChange={setSelectedCountry}
        optionTemplate={({ value, isActive, isSelected }) => (
          <div
            style={{
              paddingInline: 6,
              display: "flex",
              justifyContent: "space-between",
              background: isSelected ? "blue" : isActive ? "gray" : "inherit",
            }}
          >
            <span>{value.name}</span>
            <span>{value.id}</span>
          </div>
        )}
        valueTemplate={({ value }) =>
          value ? (
            <div
              style={{
                paddingInline: 6,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>{value.name}</span>
              <span>{value.id}</span>
            </div>
          ) : (
            <div style={{ paddingInline: 6 }}>Select your country</div>
          )
        }
      />
    </div>
  );
}
