'use client';

export default function ConfirmModal({ isOpen, onConfirm, onCancel, title, message, confirmText = "Confirm", cancelText = "Cancel", isDanger = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card rounded-xl max-w-md w-full p-6 relative animate-fade-in">
        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${isDanger ? 'bg-red-500/20 border border-red-400/40' : 'bg-purple-500/20 border border-purple-400/40'}`}>
          {isDanger ? (
            <svg className="w-6 h-6 text-red-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          ) : (
            <svg className="w-6 h-6 text-purple-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold mb-2">{title}</h2>

        {/* Message */}
        <p className="text-sm opacity-90 mb-6">{message}</p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-lg font-medium transition-all bg-white/10 hover:bg-white/20 border border-white/20"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 glass-button px-4 py-2 rounded-lg font-medium transition-all ${isDanger ? 'bg-red-600 hover:bg-red-700' : ''}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
