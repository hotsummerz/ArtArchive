import { AlertTriangle, X } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  danger = true,
  onConfirm,
  onCancel
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus confirm button when opened
    confirmBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={e => {
        if (e.target === e.currentTarget) onCancel();
      }}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-desc"
        className="modal-content"
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            {danger && <AlertTriangle size={20} color="var(--color-error)" aria-hidden="true" />}
            <h2 id="confirm-dialog-title" className="modal-title">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn--icon"
            aria-label="Tutup dialog"
          >
            <X size={18} />
          </button>
        </div>

        <p id="confirm-dialog-desc" style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', fontSize: '0.95rem' }}>
          {message}
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
          <button type="button" onClick={onCancel} className="btn btn--ghost">
            {cancelText}
          </button>
          <button
            ref={confirmBtnRef}
            type="button"
            onClick={onConfirm}
            className={`btn ${danger ? 'btn--danger' : 'btn--primary'}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
