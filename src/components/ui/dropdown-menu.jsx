import React, { useState } from "react";

export const DropdownMenu = ({ children }) => {
  return <div className="relative inline-block">{children}</div>;
};

export const DropdownMenuTrigger = ({ children, onClick }) => {
  return (
    <button onClick={onClick} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
      {children}
    </button>
  );
};

export const DropdownMenuContent = ({ children, show }) => {
  if (!show) return null;
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md z-10">
      {children}
    </div>
  );
};

export const DropdownMenuItem = ({ children, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
    >
      {children}
    </div>
  );
};
