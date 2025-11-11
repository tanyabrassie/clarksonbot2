import { useState, useEffect } from "react";
import { ClarksonTributes as ClarksonTributesComponent } from "../components/ClarksonTributes/ClarksonTributes";
import styles from "./ClarksonTributes.module.scss";

export const ClarksonTributes = () => {
  const [showReveal, setShowReveal] = useState(true);

  useEffect(() => {
    // Remove the reveal animation after it completes (2 seconds)
    const timer = setTimeout(() => {
      setShowReveal(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showReveal && <div className={styles.circularReveal}></div>}
      <div className={styles.tributesPage}>
        <ClarksonTributesComponent />
      </div>
    </>
  );
};
