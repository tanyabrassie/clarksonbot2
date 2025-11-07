import { useState, useEffect } from "react";
import { Header } from "./components/Header/Header";
import { SplashPage } from "./components/Splashpage";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Unmount splash after fade-out completes
    // Title translate completes at 13640ms, fade-out takes 2000ms
    // Total: 13640ms + 2000ms = 15640ms
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 15640);

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
