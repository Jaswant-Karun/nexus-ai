"use client";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: any;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-gray-950 border border-gray-800 rounded-2xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-white text-xl font-semibold"
          >
            ×
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
