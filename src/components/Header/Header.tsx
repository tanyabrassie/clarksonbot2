import styles from "./style.module.scss";
import { HeaderContent } from "./HeaderContent";
import { BottomBanner } from "../BottomBanner/BottomBanner";
import retroCoinUrl from "../../assets/retro_coin.png";

export const Header = () => {
  return (
    <>
      <BottomBanner />
      <header className={styles.headerContainer}>
        <HeaderContent />
        <div className={styles.coinContainer}>
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
    </>
  );
};
