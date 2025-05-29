// src/components/ui/select.jsx
import React, { useState } from "react";

export const Select = ({ children, value, onChange }) => {
  return (
    <div className="relative">
      {React.Children.map(children, child =>
        React.cloneElement(child, { value, onChange })
      )}
    </div>
  );
};

export const SelectTrigger = ({ value, onClick, placeholder }) => (
  <button
    onClick={onClick}
    className="w-full px-4 py-2 text-left border rounded shadow-sm bg-white focus:outline-none"
  >
    {value || placeholder || "Select an option"}
  </button>
);

export const SelectContent = ({ children }) => (
  <div className="absolute mt-1 w-full border rounded bg-white shadow-lg z-10">
    {children}
  </div>
);

export const SelectItem = ({ value, children, onSelect }) => (
  <div
    onClick={() => onSelect(value)}
    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
  >
    {children}
  </div>
);

export const SelectValue = ({ value }) => (
  <span className="block truncate">{value}</span>
);

