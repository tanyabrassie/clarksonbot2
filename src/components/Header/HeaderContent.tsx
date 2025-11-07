import styles from "./style.module.scss";

export const HeaderContent = () => {
  return (
    <div className={styles.headerContent}>
      <span className={styles.leftText}>nextgen</span>
      <div className={styles.centerText}>
        <span className={styles.theText}>the</span>
        <span className={styles.clarksonbotText}>CLARKSONBOT</span>
      </div>
      <span className={styles.rightText}>workbench!</span>
    </div>
  );
};
