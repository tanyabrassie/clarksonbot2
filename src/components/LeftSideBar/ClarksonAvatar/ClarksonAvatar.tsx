import clarksonBotGif from "../../../assets/clarkson-bot.gif";
import styles from "./styles.module.scss";

export const ClarksonAvatar = () => {
  return (
    <div className={styles.avatarContainer}>
      <div className={styles.avatarCircle}>
        <img
          src={clarksonBotGif}
          alt="Clarkson Bot"
          className={styles.avatarImage}
        />
      </div>
    </div>
  );
};
