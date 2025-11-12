import { useState, useEffect, type ReactNode } from "react";
import styles from "./RightContent.module.scss";
import { PopupAd } from "./PopupAd/PopupAd";
import { TributesDisplay } from "../TributesDisplay";
import type { Tribute } from "../../types/tribute";
import { fetchTributes } from "../../services/gistService";
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

interface RightContentProps {
  children?: ReactNode;
}

export const RightContent = ({ children }: RightContentProps) => {
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch tributes on mount
  useEffect(() => {
    loadTributes();
  }, []);

  const loadTributes = async () => {
    try {
      setLoading(true);
      const data = await fetchTributes();
      setTributes(data);
    } catch (err) {
      console.error("Failed to load tributes:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.rightContainer}>
      <TributesDisplay
        tributes={tributes}
        loading={loading}
        tributeIcons={tributeIcons}
        tributeLabels={tributeLabels}
      />
      <PopupAd />
      {children}
    </div>
  );
};
