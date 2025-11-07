import styles from "./styles.module.scss";
export const LeftSideBar = ({ children }: React.PropsWithChildren) => {
  return <div className={styles.sideBarContainer}>{children}</div>;
};
