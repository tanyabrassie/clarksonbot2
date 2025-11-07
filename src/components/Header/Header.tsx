import styles from "./style.module.scss";
import { HeaderContent } from "./HeaderContent";

export const Header = () => {
  return (
    <header className={styles.headerContainer}>
      <HeaderContent />
    </header>
  );
};
