import React from 'react';
import S from './ConfirmModal.module.scss';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  confirmButtonText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  confirmButtonText = '확인',
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={S.modalOverlay}>
      <div className={S.modalContent}>
        <p className={S.modalMessage}>{message}</p>
        <div className={S.modalButtons}>
          <button
            className={`${S.modalButton} ${S.modalButtonConfirm}`}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
