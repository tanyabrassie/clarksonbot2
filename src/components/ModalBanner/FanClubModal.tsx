import styles from "./styles.module.scss";
import clarksonBotUrl from "../../assets/clarkson-bot.gif";
import { Button } from "../Buttons/Button";

interface FanClubModalProps {
  isOpen?: boolean;
  onClose?: (showModal: boolean) => void;
}

export const FanClubModal = ({ isOpen = true, onClose }: FanClubModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContainer}>
        <img
          className={styles.clarksonBotGif}
          src={clarksonBotUrl}
          alt="Clarkson Bot"
          decoding="async"
        />
        <div className={styles.modalContent}>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>

          <div className={styles.modalBody}>
            <h1 className={styles.modalTitle}>EXCLUSIVE OFFER</h1>
            <h1 className={styles.modalTitle}>JOIN THE FAN CLUB</h1>
            <div className={styles.modalTitle}>CLARKSON'S BOTS</div>
            <div className={styles.modalTitle}>You'll get:</div>
            <ul>
              <li>Exclusive Access to ClarksonBot</li>
              <li>Clarksonbot 2026 Calendar & T-Shirt</li>
              <li>Guaranteed Access to Clarksonbot Meetups</li>
            </ul>

            <p className={styles.modalDescription}>
              Join the Clarkson Bot Fan Club and get exclusive access to premium
              features!
            </p>

            <Button variant="primary">Join Now</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
