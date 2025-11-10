import styles from "./styles.module.scss";

interface LeftSideBarProps extends React.PropsWithChildren {
  stats?: React.ReactNode;
  avatar?: React.ReactNode;
}

export const LeftSideBar = ({ children, stats, avatar }: LeftSideBarProps) => {
  // If using children (old way), just render them as before
  if (children && !stats && !avatar) {
    return <div className={styles.sideBarContainer}>{children}</div>;
  }

  // If using props (new way), structure with stats and avatar wrappers
  return (
    <div className={styles.sideBarContainer}>
      {stats && <div className={styles.statsWrapper}>{stats}</div>}
      {avatar && <div className={styles.avatarWrapper}>{avatar}</div>}
    </div>
  );
};
