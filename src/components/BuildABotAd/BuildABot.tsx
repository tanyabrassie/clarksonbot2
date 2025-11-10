import styles from "./BuildABot.module.scss";

export const BuildABot = () => {
  return (
    <div className={styles.container}>
      <div className={styles.topLabel}>NEW</div>
      <div className={styles.bottomLabel}>MAIN</div>
      <div></div>
      <span>New!</span>
      <span>Version: 1.5</span>
      <h1>Build-A-Bot</h1>
      <h2>Clarkson Bot Your Way!</h2>

      <div>The next generation Clarkson Bot companion.</div>
    </div>
  );
};
