import { useState } from "react";
import styles from "./style.module.scss";
import { HeaderContent } from "./HeaderContent";
import { BottomBanner } from "../BottomBanner/BottomBanner";
import { ClarksonTributes } from "../ClarksonTributes/ClarksonTributes";
import retroCoinUrl from "../../assets/retro_coin.png";

export const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

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
            <ClarksonTributes />
          </div>
        </div>
      )}
    </>
  );
};
