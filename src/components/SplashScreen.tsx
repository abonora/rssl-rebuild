import { useEffect, useState } from 'react';

const SplashScreen = () => {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    
    if (hasSeenSplash) {
      setShow(false);
      return;
    }

    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1500);

    const hideTimer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem('hasSeenSplash', 'true');
    }, 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <img src="/logo.svg" alt="Logo" className="logo" />
    </div>
  );
};

export default SplashScreen; 