import { useState } from "react";
import styles from "./styles.module.scss";
import clarksonBotUrl from "../../assets/clarkson-bot.gif";
import { Button } from "../Buttons/Button";

interface FanClubModalProps {
  isOpen?: boolean;
  onClose?: (showModal: boolean) => void;
}

export const FanClubModal = ({ isOpen = true, onClose }: FanClubModalProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose?.(false);
    }, 600);
  };

  const handleJoinClick = () => {
    setHasJoined(true);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`${styles.modalBackdrop} ${isClosing ? styles.fadeOut : ""}`}
    >
      <div
        className={`${styles.modalContainer} ${
          isClosing ? styles.scaleOut : ""
        }`}
      >
        <img
          className={styles.clarksonBotGif}
          src={clarksonBotUrl}
          alt="Clarkson Bot"
          decoding="async"
        />
        <div className={styles.modalContent}>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close modal"
          >
            ✕
          </button>

          <div className={styles.modalBody}>
            <h1 className={styles.modalTitleTop}>LOVE CLARKSONBOT?</h1>
            <h1 className={styles.modalTitle}>JOIN THE FAN CLUB</h1>
            <div className={styles.modalTitleSub}>You'll get:</div>
            <ul>
              <li>Exclusive Access to ClarksonBot</li>
              <li>Clarksonbot 2026 Calendar & T-Shirt</li>
              <li>Guaranteed Access to Clarksonbot Meetups</li>
            </ul>

            <Button variant="primary" onClick={handleJoinClick}>
              {hasJoined ? "Welcome to the Club!" : "Join Now"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
