import type { ReactNode } from "react";
import styles from "./RightContent.module.scss";

interface RightContentProps {
  children?: ReactNode;
}

export const RightContent = ({ children }: RightContentProps) => {
  return <div className={styles.rightContainer}>{children}</div>;
};
