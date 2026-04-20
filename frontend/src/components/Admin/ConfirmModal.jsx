import React from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", isLoading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-card rounded-2xl shadow-xl flex flex-col border border-border/60 animate-fade-in-up">
        {/* Close Button Top Right */}
        <button 
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0 w-12 h-12 bg-red-100/10 dark:bg-red-500/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="text-red-500 h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {title}
              </h3>
            </div>
          </div>
          <p className="text-sm text-muted-foreground ml-[64px]">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="bg-muted/50 p-4 rounded-b-2xl flex justify-between border-t border-border/40">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 font-semibold text-sm rounded-lg hover:bg-muted text-foreground transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 font-bold text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-all active:scale-95 disabled:opacity-70 flex items-center"
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
