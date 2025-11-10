import type { ReactNode } from "react";
import styles from "./CenterContent.module.scss";

interface CenterContentProps {
  children?: ReactNode;
}

export const CenterContent = ({ children }: CenterContentProps) => {
  return <div className={styles.centerContent}>{children}</div>;
};
