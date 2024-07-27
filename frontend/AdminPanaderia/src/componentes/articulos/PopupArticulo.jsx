import React from "react";

const PopupArticulo = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg mx-4">
        <button
          className="absolute top-0 right-0 mt-4 mr-4 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        ></button>
        {children}
      </div>
    </div>
  );
};

export default PopupArticulo;
