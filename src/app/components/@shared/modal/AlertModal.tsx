import React from 'react';
import S from './AlertModal.module.scss';
import Button from '../button/Button';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAlert: () => Promise<void>;
  message: string;
  alertButtonText?: string;
}

const AlertModal: React.FC<AlertModalProps> = function AlertModal({
  isOpen,
  onClose,
  onAlert,
  message,
  alertButtonText = '확인',
}) {
  if (!isOpen) {
    return null;
  }

  const handleAlertClick = async () => {
    await onAlert();
    onClose();
  };

  return (
    <div className={S.modalOverlay}>
      <div className={S.modalContent}>
        <div className={S.iconContainer}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={S.modalIcon}
          >
            <circle cx="12" cy="12" r="12" fill="#112211" />
          </svg>
          <svg
            width="11"
            height="10"
            viewBox="0 0 11 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={S.modalCheckIcon}
          >
            <path
              d="M1.60742 5.34936L4.68778 8.50028L10.2503 1.35742"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className={S.modalMessage}>{message}</p>
        <div className={S.modalButtons}>
          <Button
            buttonColor="white"
            textSize="md"
            borderRadius="radius4"
            padding="padding8"
            className={S.modalButton}
            onClick={onClose}
          >
            아니오
          </Button>
          <Button
            buttonColor="nomadBlack"
            textSize="md"
            borderRadius="radius4"
            padding="padding8"
            className={S.modalButton}
            onClick={handleAlertClick}
          >
            {alertButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
