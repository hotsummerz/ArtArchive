import { AlertCircle, RotateCcw } from 'lucide-react';
import React from 'react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Gagal Memuat Data',
  message = 'Terjadi kendala saat menghubungi server arsip seni.',
  onRetry
}) => {
  return (
    <div className="state-box" role="alert">
      <div className="state-box__icon state-box__icon--error">
        <AlertCircle size={28} strokeWidth={1.5} />
      </div>
      <h3 className="state-box__title">{title}</h3>
      <p className="state-box__message">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn btn--primary">
          <RotateCcw size={16} />
          <span>Coba Lagi</span>
        </button>
      )}
    </div>
  );
};
