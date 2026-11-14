// ponytail: editorial empty state presentation with CTA

import { Compass } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionText?: string;
  actionLink?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Tidak Ada Karya Seni Ditemukan',
  message = 'Tidak ada hasil yang sesuai dengan kriteria penelusuran atau filter Anda saat ini.',
  actionText,
  actionLink,
  onAction,
  icon
}) => {
  return (
    <div className="state-box" role="region" aria-label={title}>
      <div className="state-box__icon">
        {icon || <Compass size={28} strokeWidth={1.5} />}
      </div>
      <h3 className="state-box__title">{title}</h3>
      <p className="state-box__message">{message}</p>
      {actionLink && actionText && (
        <Link to={actionLink} className="btn btn--primary">
          {actionText}
        </Link>
      )}
      {!actionLink && actionText && onAction && (
        <button type="button" onClick={onAction} className="btn btn--secondary">
          {actionText}
        </button>
      )}
    </div>
  );
};
