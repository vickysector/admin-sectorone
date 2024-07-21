"use client";
import { useState } from "react";
import "./CustomSelect.css";

const CustomSelect = ({ options, onSelect }) => {
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onSelect(option);
    closeSelect();
  };

  const closeSelect = () => {
    setIsSelectOpen(false);
  };

  const toggleSelect = () => {
    setIsSelectOpen(!isSelectOpen);
  };

  return (
    <div className="custom-select" style={{ width: "200px" }}>
      <div
        className={`select-selected ${
          isSelectOpen ? "select-arrow-active" : ""
        }`}
        onClick={toggleSelect}
      >
        {selectedOption}
      </div>
      <div className={`select-items ${isSelectOpen ? "" : "select-hide"}`}>
        {options.map((option, index) => (
          <div
            key={index}
            className={`same-as-selected`}
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSelect;
