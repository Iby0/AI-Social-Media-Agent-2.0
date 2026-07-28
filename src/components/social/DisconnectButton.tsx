import React, { useState } from 'react';
import { Unlink, AlertCircle } from 'lucide-react';

interface DisconnectButtonProps {
  onConfirm: () => Promise<void> | void;
  accountName?: string;
  className?: string;
}

export const DisconnectButton: React.FC<DisconnectButtonProps> = ({
  onConfirm,
  accountName,
  className = '',
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDisconnect = async () => {
    try {
      setIsProcessing(true);
      await onConfirm();
      setShowConfirm(false);
    } catch (err) {
      console.error('Failed to disconnect account:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 p-1.5 rounded-xl text-xs">
        <span className="text-rose-400 font-medium hidden sm:inline">Confirm Disconnect?</span>
        <button
          type="button"
          disabled={isProcessing}
          onClick={handleDisconnect}
          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold transition-all text-xs"
        >
          {isProcessing ? 'Revoking...' : 'Yes, Unlink'}
        </button>
        <button
          type="button"
          onClick={() => setShowConfirm(false)}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShowConfirm(true)}
      className={`px-3 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all flex items-center gap-1.5 ${className}`}
      title={`Disconnect ${accountName || 'Account'}`}
    >
      <Unlink size={14} />
      <span>Disconnect</span>
    </button>
  );
};
