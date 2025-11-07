import { useState, useEffect } from "react";
import { Header } from "./components/Header/Header";
import { SplashPage } from "./components/Splashpage";
import { LeftSideBar } from "./components/LeftSideBar/LeftSideBar";
import { MainGrid } from "./components/MainGrid";
import { ClarksonStats } from "./components/LeftSideBar/ClarksonStats/ClarksonStats";
import { ClarksonAvatar } from "./components/LeftSideBar/ClarksonAvatar/ClarksonAvatar";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Unmount splash after slide-down completes
    // Title translate completes at 13640ms, slide-down takes 1500ms
    // Add 200ms buffer to ensure animation fully completes
    // Total: 13640ms + 1500ms + 200ms = 15340ms
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 15340);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Header />
      {showSplash && <SplashPage />}
      <MainGrid>
        <LeftSideBar>
          <ClarksonStats />
          <ClarksonAvatar />
        </LeftSideBar>
      </MainGrid>
    </>
  );
}

export default App;
