import { useNavigate } from "react-router-dom";
import styles from "./style.module.scss";

export const HeaderContent = () => {
  const navigate = useNavigate();

  const handleClarksonBotClick = () => {
    navigate("/");
  };

  return (
    <div className={styles.headerContent}>
      <span className={styles.leftText}>nextgen</span>
      <div className={styles.centerText}>
        <span className={styles.theText}>the</span>
        <button
          className={styles.clarksonbotTextWrapper}
          onClick={handleClarksonBotClick}
          aria-label="Go to home"
        >
          <span className={styles.clarksonbotText}>CLARKSONBOT</span>
          <span className={styles.sparkle} data-sparkle="1">
            ✨
          </span>
          <span className={styles.sparkle} data-sparkle="2">
            ✨
          </span>
          <span className={styles.sparkle} data-sparkle="3">
            ✨
          </span>
          <span className={styles.sparkle} data-sparkle="4">
            ✨
          </span>
        </button>
      </div>
      <span className={styles.rightText}>workbench!</span>
    </div>
  );
};
