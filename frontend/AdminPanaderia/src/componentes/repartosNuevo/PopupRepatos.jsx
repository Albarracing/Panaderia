import React from "react";

const PopupReparto = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    //inset-0 flex items-center justify-center z-50
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-4 rounded-lg z-10">{children} </div>
    </div>
  );
};

export default PopupReparto;
