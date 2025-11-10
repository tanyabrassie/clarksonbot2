import styles from "./PopupAd.module.scss";

export const PopupAd = () => {
  return (
    <div className={styles.adsContainer}>
      <div className={styles.container}>Banner Ad</div>
      <div className={styles.container}>Banner Ad2</div>
    </div>
  );
};
