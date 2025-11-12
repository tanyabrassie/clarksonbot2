import styles from "./TributesDisplay.module.scss";
import type { Tribute } from "../../types/tribute";
import clarksonBotGif from "../../assets/clarkson-bot.gif";
import coinIcon from "../../assets/retro_coin.png";

interface TributesDisplayProps {
  tributes: Tribute[];
  loading: boolean;
  tributeIcons: Record<Tribute["type"], string>;
  tributeLabels: Record<Tribute["type"], string>;
}

export const TributesDisplay = ({
  tributes,
  loading,
  tributeIcons,
}: TributesDisplayProps) => {
  return (
    <div className={styles.tributesSection}>
      <div className={styles.botsHeader}>
        <img src={clarksonBotGif} alt="ClarksonBot" className={styles.botGif} />
        <div className={styles.coinIconContainer}>
          <img src={coinIcon} alt="Coin" className={styles.coinIcon} />
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
        <img src={clarksonBotGif} alt="ClarksonBot" className={styles.botGif} />
      </div>

      <h2 className={styles.sectionTitle}>ClarksonBot Tributes</h2>
      <h3 className={styles.tributeTally}>
        Tributes Received Today: <span>{tributes.length}</span>
      </h3>

      {loading ? (
        <div className={styles.loading}>Loading tributes...</div>
      ) : tributes.length === 0 ? (
        <div className={styles.empty}>
          No tributes yet. Be the first to leave one!
        </div>
      ) : (
        <div className={styles.tributesList}>
          {[...tributes].reverse().map((tribute, index) => (
            <div key={index} className={styles.tributeItem}>
              <img
                src={tributeIcons[tribute.type]}
                alt={tribute.type}
                className={styles.tributeIcon}
              />
              <span className={styles.tributeText}>
                FROM {tribute.author.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
