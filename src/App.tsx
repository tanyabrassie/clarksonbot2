import { useState, useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header/Header";
import { SplashPage } from "./components/Splashpage";
import { LeftSideBar } from "./components/LeftSideBar/LeftSideBar";
import { MainGrid } from "./components/MainGrid";
import { ClarksonStats } from "./components/LeftSideBar/ClarksonStats/ClarksonStats";
import { ClarksonAvatar } from "./components/LeftSideBar/ClarksonAvatar/ClarksonAvatar";
import { FanClubModal } from "./components/ModalBanner/FanClubModal";
import { BottomBanner } from "./components/BottomBanner/BottomBanner";
import { BuildABot } from "./components/BuildABotAd/BuildABot";
import { CenterContent } from "./components/CenterContent/CenterContent";
import { RightContent } from "./components/RightContent/RightContent";
import { Marquee } from "./components/Marquee/Marquee";
import { ClarksonGenerator } from "./pages/ClarksonGenerator";
import styles from "./pages/ClarksonGenerator.module.scss";
import lacrimosaAudio from "./assets/Lacrimosa.mp3";
import { Button } from "./components/Buttons/Button";

interface HomeProps {
  tributesRefreshTrigger: number;
}

function Home({ tributesRefreshTrigger }: HomeProps) {
  const [showReveal, setShowReveal] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowReveal(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showReveal && <div className={styles.circularReveal}></div>}
      <MainGrid>
        <LeftSideBar stats={<ClarksonStats />} avatar={<ClarksonAvatar />} />
        <CenterContent>
          <BuildABot />
        </CenterContent>
        <RightContent
          tributesRefreshTrigger={tributesRefreshTrigger}
        ></RightContent>
      </MainGrid>
    </>
  );
}

function App() {
  const [showStartButton, setShowStartButton] = useState(true);
  const [showSplash, setShowSplash] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tributesRefreshTrigger, setTributesRefreshTrigger] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleTributeAdded = () => {
    // Increment trigger to signal RightContent to refresh
    setTributesRefreshTrigger((prev) => prev + 1);
  };

  const handleStartExperience = () => {
    setShowStartButton(false);
    setShowSplash(true);
  };

  // Play audio when splash page shows
  useEffect(() => {
    if (showSplash) {
      // Create audio element
      const audio = new Audio(lacrimosaAudio);
      audioRef.current = audio;

      // Set starting point to 2:45 (165 seconds)
      audio.currentTime = 165;

      // Play audio
      audio.play().catch((error) => {
        console.log("Audio autoplay prevented:", error);
      });

      // Cleanup function to stop audio when splash is hidden
      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [showSplash]);

  useEffect(() => {
    // Unmount splash after slide-down completes
    // Title translate completes at 13640ms, slide-down takes 1500ms
    // Add 2000ms buffer to ensure slide animation fully completes
    // Total: 13640ms + 1500ms + 2000ms = 17140ms
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 17140);

    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    // Show modal 3 seconds after splash page slides away
    // Splash completes at 17140ms, add 3000ms = 20140ms
    const modalTimer = setTimeout(() => {
      setShowModal(true);
    }, 23140);

    return () => clearTimeout(modalTimer);
  }, []);

  return (
    <>
      {showStartButton && (
        <div className={styles.startScreen}>
          <div className={styles.startContent}>
            <h1 className={styles.startTitle}>ClarksonBot</h1>
            <p className={styles.startSubtitle}>Experience Awaits</p>
            <Button variant="primary" onClick={handleStartExperience}>
              Enter
            </Button>
          </div>
        </div>
      )}

      {!showStartButton && (
        <>
          <Header onTributeAdded={handleTributeAdded} />
          {showSplash && <SplashPage />}
          {showModal && <FanClubModal onClose={() => setShowModal(false)} />}
          <Routes>
            <Route
              path="/"
              element={<Home tributesRefreshTrigger={tributesRefreshTrigger} />}
            />
            <Route path="/clarkson-generator" element={<ClarksonGenerator />} />
          </Routes>
          <Marquee />
          <div className={styles.bannerContainer}>
            <BottomBanner />
          </div>
        </>
      )}
    </>
  );
}

export default App;
