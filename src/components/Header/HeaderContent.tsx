import styles from "./style.module.scss";

export const HeaderContent = () => {
  return (
    <div className={styles.headerContent}>
      <span className={styles.leftText}>nextgen</span>
      <div className={styles.centerText}>
        <span className={styles.theText}>the</span>
        <span className={styles.clarksonbotTextWrapper}>
          <span className={styles.clarksonbotText}>CLARKSONBOT</span>
          <span className={styles.sparkle} data-sparkle="1">✨</span>
          <span className={styles.sparkle} data-sparkle="2">✨</span>
          <span className={styles.sparkle} data-sparkle="3">✨</span>
          <span className={styles.sparkle} data-sparkle="4">✨</span>
        </span>
      </div>
      <span className={styles.rightText}>workbench!</span>
    </div>
  );
};
