import { ReactNode, useEffect, useState } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  isVisible: boolean;
}

const PageTransition = ({ children, isVisible }: PageTransitionProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`page-transition ${isMounted ? 'mounted' : ''} ${isVisible ? 'visible' : ''}`}>
      {children}
    </div>
  );
};

export default PageTransition; 