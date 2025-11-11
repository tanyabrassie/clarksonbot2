import { useNavigate } from "react-router-dom";
import styles from "./BuildABot.module.scss";
import { Button } from "../Buttons/Button";
import customizedClarksonsImg from "../../assets/customizedClarksons.png";

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
        <img
          src={customizedClarksonsImg}
          alt="Customized Clarksons"
          className={styles.image}
        />
        <span className={styles.version}>Version: 2.0.0</span>
        <h1 className={styles.header}>Build-A-Clarkson</h1>
        <h2 className={styles.headerExclamation}>Clarkson Bot Your Way!</h2>

        <div className={styles.slogan}>
          The next generation Clarkson Bot companion.
        </div>

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
