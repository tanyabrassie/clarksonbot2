import { useState, useEffect } from "react";
import styles from "./style.module.scss";
import { HeaderContent } from "./HeaderContent";
import { BottomBanner } from "../BottomBanner/BottomBanner";
import { ClarksonTributes } from "../ClarksonTributes/ClarksonTributes";
import retroCoinUrl from "../../assets/retro_coin.png";

interface HeaderProps {
  onTributeAdded?: () => void;
}

export const Header = ({ onTributeAdded }: HeaderProps) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const handleCoinClick = () => {
    if (drawerOpen) {
      handleCloseDrawer();
    } else {
      setDrawerOpen(true);
      setIsClosing(false);
    }
  };

  const handleCloseDrawer = () => {
    setIsClosing(true);
    setTimeout(() => {
      setDrawerOpen(false);
      setIsClosing(false);
    }, 400); // Match animation duration
  };

  const handleTributeAdded = () => {
    // Notify parent component to refresh tributes
    if (onTributeAdded) {
      onTributeAdded();
    }
    // Close the drawer
    handleCloseDrawer();
  };

  return (
    <>
      <BottomBanner />
      <header className={styles.headerContainer}>
        <HeaderContent />
        <div
          className={styles.coinContainer}
          onClick={handleCoinClick}
          style={{ cursor: "pointer" }}
        >
          <img
            src={retroCoinUrl}
            alt="Retro Coin"
            className={styles.retroCoin}
          />
          <span className={styles.coinSparkle} data-sparkle="1">
            ✨
          </span>
          <span className={styles.coinSparkle} data-sparkle="2">
            ✨
          </span>
          <span className={styles.coinSparkle} data-sparkle="3">
            ✨
          </span>
          <span className={styles.coinSparkle} data-sparkle="4">
            ✨
          </span>
        </div>
      </header>
      <BottomBanner />

      {/* Drawer Overlay */}
      {drawerOpen && (
        <div
          className={`${styles.drawerOverlay} ${
            isClosing ? styles.drawerClosing : ""
          }`}
          onClick={handleCloseDrawer}
        >
          <div
            className={`${styles.drawer} ${
              isClosing ? styles.drawerClosing : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <ClarksonTributes onTributeAdded={handleTributeAdded} />
          </div>
        </div>
      )}
    </>
  );
};
