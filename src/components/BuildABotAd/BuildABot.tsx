import { useNavigate } from "react-router-dom";
import styles from "./BuildABot.module.scss";
import { Button } from "../Buttons/Button";

export const BuildABot = () => {
  const navigate = useNavigate();

  const handleTryItOut = () => {
    navigate("/clarkson-generator");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.circleTopLeft}></div>
      <div className={styles.circleTopRight}></div>
      <div className={styles.topPeekLabel}>NEW</div>
      <div className={styles.insideContainer}>
        <div></div>
        <span>New!</span>
        <span>Version: 1.5</span>
        <h1>Build-A-Bot</h1>
        <h2>Clarkson Bot Your Way!</h2>

        <div>The next generation Clarkson Bot companion.</div>

        <Button
          className={styles.button}
          variant="primary"
          onClick={handleTryItOut}
        >
          Try it out
        </Button>
      </div>
      <div className={styles.bottomPeekLabel}>NEW</div>
      <div className={styles.circleBottomLeft}></div>
      <div className={styles.circleBottomRight}></div>
    </div>
  );
};
