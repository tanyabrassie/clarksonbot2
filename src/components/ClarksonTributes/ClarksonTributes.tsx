import { useState, useEffect } from "react";
import styles from "./ClarksonTributes.module.scss";
import type { Tribute } from "../../types/tribute";
import { fetchTributes, addTribute } from "../../services/gistService";
import { Button } from "../Buttons/Button";
import { AlertModal } from "./AlertModal";
import candleIcon from "../../assets/candle.svg";
import moneyIcon from "../../assets/moneybag.gif";
import bowingIcon from "../../assets/bowing.gif";

const tributeIcons: Record<Tribute["type"], string> = {
  candle: candleIcon,
  bow: bowingIcon,
  money: moneyIcon,
};

const tributeLabels: Record<Tribute["type"], string> = {
  candle: "Candle",
  bow: "Bow",
  money: "Money",
};

interface ClarksonTributesProps {
  onTributeAdded?: () => void;
}

export const ClarksonTributes = ({ onTributeAdded }: ClarksonTributesProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [shouldCloseDrawerAfterAlert, setShouldCloseDrawerAfterAlert] =
    useState(false);

  // Form state
  const [selectedType, setSelectedType] = useState<Tribute["type"]>("candle");
  const [authorName, setAuthorName] = useState("");

  // Fetch tributes on mount
  useEffect(() => {
    loadTributes();
  }, []);

  const loadTributes = async () => {
    try {
      console.log("datasss");

      const data = await fetchTributes();
      console.log("data", data);
    } catch (err) {
      console.error(err);
    }
  };

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setIsAlertOpen(true);
  };

  const closeAlert = () => {
    setIsAlertOpen(false);
    setAlertMessage("");

    // Close drawer if we're supposed to after alert
    if (shouldCloseDrawerAfterAlert && onTributeAdded) {
      setShouldCloseDrawerAfterAlert(false);
      onTributeAdded();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authorName.trim()) {
      showAlert("Please enter your message.");
      return;
    }

    try {
      setSubmitting(true);
      await addTribute(selectedType, authorName.trim());

      // Reload tributes to show the new one
      await loadTributes();

      // Reset form
      setAuthorName("");
      setSelectedType("candle");

      // Set flag to close drawer after alert is dismissed
      setShouldCloseDrawerAfterAlert(true);
      showAlert("Tribute added successfully!");
    } catch (err) {
      console.error(err);
      showAlert("Failed to add tribute. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.tributesContainer}>
      <h2 className={styles.title}>ClarksonBot Tributes</h2>
      <h3 className={styles.subTitle}>Tributes have been proven to make:</h3>
      <ul className={styles.benefitsList}>
        <li>On call shifts more peaceful</li>
        <li>Code to compile faster</li>
        <li>Marshmallow tests pass more frequently</li>
        <li>...plus many many more advantages!</li>
      </ul>

      {/* Add Tribute Form */}
      <div className={styles.formSection}>
        <h3 className={styles.formTitle}>Leave a Tribute</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="tribute-type" className={styles.label}>
              Your Tribute Type:
            </label>
            <div className={styles.typeSelector}>
              {(["candle", "bow", "money"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`${styles.typeButton} ${
                    selectedType === type ? styles.selected : ""
                  }`}
                  onClick={() => setSelectedType(type)}
                  disabled={submitting}
                >
                  <img src={tributeIcons[type]} alt={tributeLabels[type]} />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="author-name" className={styles.label}>
              Tribute Message:
            </label>
            <input
              id="author-name"
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Enter your message"
              className={styles.input}
              disabled={submitting}
              maxLength={50}
            />
          </div>

          <div className={styles.submitButtonWrapper}>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Giving..." : "Give Tribute"}
            </Button>
          </div>
        </form>
      </div>

      {/* Alert Modal */}
      <AlertModal
        message={alertMessage}
        isOpen={isAlertOpen}
        onClose={closeAlert}
      />
    </div>
  );
};
