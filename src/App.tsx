import "./styles.css";
import CustomDropdown from "./CustomDropdown";
import { useState } from "react";

type Country = {
  id: string;
  name: string;
};

type Student = {
  id: string;
  name: string;
};

const DROPDOWN_OPTIONS: Country[] = [
  { id: "TW", name: "Taiwan" },
  { id: "CN", name: "China" },
  { id: "US", name: "United State of America" },
  { id: "JP", name: "Japan" },
];

const DROPDOWN_OPTIONS_STUDENT: Country[] = [
  { id: "1", name: "Oscar" },
  { id: "2", name: "John" },
  { id: "3", name: "Amy" },
  { id: "4", name: "Eric" },
];

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

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
              paddingBlock: 3,
              paddingInline: 6,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: isSelected ? "blue" : isActive ? "gray" : "inherit",
              color: isSelected ? "white" : "inherit",
            }}
          >
            <b>{value.name}</b>
            <small>{value.id}</small>
          </div>
        )}
        valueTemplate={({ value }) =>
          value ? (
            <div
              style={{
                paddingBlock: 3,
                paddingInline: 6,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <b>{value.name}</b>
              <small>{value.id}</small>
            </div>
          ) : (
            <div style={{ paddingBlock: 3, paddingInline: 6, color: "gray" }}>
              Select your country
            </div>
          )
        }
      />
      <div style={{ width: 20 }}></div>
      <CustomDropdown
        width={300}
        options={DROPDOWN_OPTIONS_STUDENT}
        value={selectedStudent}
        onChange={setSelectedStudent}
      />
    </div>
  );
}
