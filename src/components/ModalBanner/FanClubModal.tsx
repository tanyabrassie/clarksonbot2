import styles from "./styles.module.scss";

interface FanClubModalProps {
  isOpen?: boolean;
  onClose?: (showModal: boolean) => void;
}

export const FanClubModal = ({ isOpen = true, onClose }: FanClubModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className={styles.modalBody}>
          <h2 className={styles.modalTitle}>EXCLUSIVE OFFER</h2>

          <div className={styles.decorativeBox} />

          <p className={styles.modalDescription}>
            Join the Clarkson Bot Fan Club and get exclusive access to premium
            features!
          </p>

          <button className={styles.ctaButton}>Join Now</button>
        </div>
      </div>
    </div>
  );
};
