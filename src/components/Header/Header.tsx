import styles from "./style.module.scss";
import { HeaderContent } from "./HeaderContent";
import { BottomBanner } from "../BottomBanner/BottomBanner";

export const Header = () => {
  return (
    <>
      <BottomBanner />
      <header className={styles.headerContainer}>
        <HeaderContent />
      </header>
      <BottomBanner />
    </>
  );
};
