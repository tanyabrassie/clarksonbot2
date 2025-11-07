import { useState, useEffect } from "react";
import { Header } from "./components/Header/Header";
import { SplashPage } from "./components/Splashpage";

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
    </>
  );
}

export default App;
