// src/components/ui/label.jsx
import React from "react";

export const Label = ({ htmlFor, className = "", children }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 ${className}`}
    >
      {children}
    </label>
  );
};
