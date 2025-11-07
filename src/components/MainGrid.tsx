import styles from "./MainGrid.module.scss";

export const MainGrid = (props: React.PropsWithChildren) => {
  return <div className={styles.mainGrid}>{props.children}</div>;
};
