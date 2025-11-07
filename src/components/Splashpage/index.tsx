import styles from "./index.module.scss";
import clarksonBotUrl from "../../assets/clarkson-bot.gif";

export const SplashPage = () => {
  return (
    <div className={styles.splash}>
      <h1 className={styles.splashTitle}>
        <span
          className={`${styles.splashTitleWord} ${styles.splashTitleWord1}`}
        >
          CLARK
        </span>
        <span
          className={`${styles.splashTitleWord} ${styles.splashTitleWord2}`}
        >
          SON
        </span>
        <span
          className={`${styles.splashTitleWord} ${styles.splashTitleWord3}`}
        >
          BOT
        </span>
      </h1>
      <div
        className={styles.splashBg}
        style={{
          backgroundImage: `url(${clarksonBotUrl})`,
        }}
      />
      <div className={styles.splashCenter}>
        <img
          className={styles.splashBot}
          src={clarksonBotUrl}
          alt="Clarkson Bot"
          decoding="async"
        />
      </div>
    </div>
  );
};
