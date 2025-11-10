import styles from "./Button.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

export const Button = ({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className || ""}`}
      {...props}
    >
      {children}
      <div className={styles.buttonGhost}></div>
    </button>
  );
};
