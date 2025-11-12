import { useState } from "react";
import styles from "./PopupAd.module.scss";
import { Button } from "../../Buttons/Button";
import clarksonTeeDouble from "../../../assets/clarksonTeeDouble.png";
import clarksonMugs from "../../../assets/clarksonMugs.png";

export const PopupAd = () => {
  const [teeShirtSold, setTeeShirtSold] = useState(false);
  const [mugSold, setMugSold] = useState(false);

  return (
    <div className={styles.adsContainer}>
      <div className={styles.promotedLabel}>promoted</div>
      <div className={styles.container}>
        {/* T-Shirt Product */}
        <div className={styles.productCard}>
          <div className={styles.productIcon}>
            <img
              src={clarksonTeeDouble}
              alt="Clarkson T-Shirt"
              className={styles.productImage}
            />
          </div>
          <div className={styles.productTitle}>
            clarkson
            <br />
            bot tee-shirt
          </div>
          <Button
            variant="primary"
            className={teeShirtSold ? styles.soldOut : ""}
            onClick={() => setTeeShirtSold(true)}
          >
            {teeShirtSold ? "SOLD OUT" : "BUY NOW"}
          </Button>
        </div>

        {/* Mug Product */}
        <div className={styles.productCard}>
          <div className={styles.productIcon}>
            <img
              src={clarksonMugs}
              alt="Clarkson Mug"
              className={styles.productImage}
            />
          </div>
          <div className={styles.productTitle}>
            clarkson bot
            <br />
            mug!
          </div>
          <Button
            variant="primary"
            className={mugSold ? styles.soldOut : ""}
            onClick={() => setMugSold(true)}
          >
            {mugSold ? "SOLD OUT" : "GET THIS"}
          </Button>
        </div>
      </div>
    </div>
  );
};
