import styles from "./TributesDisplay.module.scss";
import type { Tribute } from "../../types/tribute";

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
  tributeLabels,
}: TributesDisplayProps) => {
  return (
    <div className={styles.tributesSection}>
      <h3 className={styles.sectionTitle}>
        All Tributes ({tributes.length})
      </h3>

      {loading ? (
        <div className={styles.loading}>Loading tributes...</div>
      ) : tributes.length === 0 ? (
        <div className={styles.empty}>
          No tributes yet. Be the first to leave one!
        </div>
      ) : (
        <div className={styles.tributesGrid}>
          {tributes.map((tribute, index) => (
            <div key={index} className={styles.tributeCard}>
              <img
                src={tributeIcons[tribute.type]}
                alt={tributeLabels[tribute.type]}
                className={styles.tributeIcon}
              />
              <div className={styles.tributeInfo}>
                <div className={styles.tributeType}>
                  {tributeLabels[tribute.type]}
                </div>
                <div className={styles.tributeAuthor}>
                  from {tribute.author}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

