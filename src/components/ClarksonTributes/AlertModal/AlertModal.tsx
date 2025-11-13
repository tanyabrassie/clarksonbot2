import { useEffect } from "react";
import styles from "./AlertModal.module.scss";
import { Button } from "../../Buttons/Button";

interface AlertModalProps {
  message: string;
  onClose: () => void;
  isOpen: boolean;
}

export const AlertModal = ({ message, onClose, isOpen }: AlertModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}></div>
        <div className={styles.modalBody}>
          <p className={styles.message}>{message}</p>
        </div>
        <div className={styles.modalFooter}>
          <Button variant="primary" onClick={onClose}>
            OK
          </Button>
        </div>
      </div>
    </div>
  );
};
