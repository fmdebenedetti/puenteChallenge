import React from 'react';

interface PopupProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ message, type = 'info', onClose }) => {
  let color = '';
  if (type === 'success') color = 'bg-green-100 border-green-400 text-green-700';
  else if (type === 'error') color = 'bg-red-100 border-red-400 text-red-700';
  else color = 'bg-blue-100 border-blue-400 text-blue-700';

  return (
    <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 border px-6 py-4 rounded shadow-lg ${color}`}
         role="alert">
      <span>{message}</span>
      <button className="focus:outline-none ml-4 text-sm underline text-gray-600 hover:text-gray-900"
        onClick={onClose}
      >
        Cerrar
      </button>
    </div>
  );
};

export default Popup;
