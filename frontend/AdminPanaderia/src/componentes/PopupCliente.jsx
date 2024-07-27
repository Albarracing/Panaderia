import React from "react";

const PopupCliente = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    //inset-0 flex items-center justify-center z-50
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-4 rounded-lg z-10">{children} </div>
    </div>
  );
};

export default PopupCliente;

{
  /* <div
  className={`fixed inset-0 z-50 overflow-auto ${isOpen ? "block" : "hidden"}`}
>
  <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
    </div>

    <span
      className="hidden sm:inline-block sm:align-middle sm:h-screen"
      aria-hidden="true"
    >
      &#8203;
    </span>

    <div
      className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      <div className="px-4 py-5 sm:px-6">
        <h3
          className="text-lg font-medium leading-6 text-gray-900"
          id="modal-headline"
        >
          Title
        </h3>
      </div>
      <div className="bg-gray-50 px-4 py-4 sm:px-6">{children}</div>
      <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          onClick={onClose}
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</div>; */
}
