import type { ReactNode } from "react";
import styles from "./RightContent.module.scss";
import { PopupAd } from "./PopupAd/PopupAd";

interface RightContentProps {
  children?: ReactNode;
}

export const RightContent = ({ children }: RightContentProps) => {
  return (
    <div className={styles.rightContainer}>
      <PopupAd />
      {children}
    </div>
  );
};
