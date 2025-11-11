import { useState, useEffect } from "react";
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

function App() {
  const [showSplash, setShowSplash] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Unmount splash after slide-down completes
    // Title translate completes at 13640ms, slide-down takes 1500ms
    // Add 200ms buffer to ensure animation fully completes
    // Total: 13640ms + 1500ms + 200ms = 15340ms
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 15340);

    // 15340
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    // Show modal 3 seconds after splash page slides away
    // Splash completes at 15340ms, add 3000ms = 18340ms
    const modalTimer = setTimeout(() => {
      setShowModal(true);
    }, 18340);

    return () => clearTimeout(modalTimer);
  }, []);

  return (
    <>
      <Header />
      {showSplash && <SplashPage />}
      {showModal && <FanClubModal onClose={() => setShowModal(false)} />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <MainGrid>
                <LeftSideBar
                  stats={<ClarksonStats />}
                  avatar={<ClarksonAvatar />}
                />
                <CenterContent>
                  <BuildABot />
                </CenterContent>
                <RightContent></RightContent>
              </MainGrid>
            </>
          }
        />
        <Route path="/clarkson-generator" element={<ClarksonGenerator />} />
      </Routes>
      <Marquee />
      <BottomBanner />
    </>
  );
}

export default App;
