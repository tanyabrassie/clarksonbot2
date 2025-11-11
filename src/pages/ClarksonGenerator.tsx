import styles from "./ClarksonGenerator.module.scss";
import ClarksonBotSvg from "../assets/clarksonbot.svg?react";

const ToolBar = () => {
  return <div className={styles.toolBar}>Toolbar</div>;
};

const MainContainer = () => {
  return (
    <div className={styles.mainContainer}>
      <ClarksonBotSvg />
    </div>
  );
};

export const ClarksonGenerator = () => {
  return (
    <div className={styles.container}>
      <ToolBar />
      <MainContainer />
    </div>
  );
};
