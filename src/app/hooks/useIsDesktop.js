// hooks/useIsDesktop.js

import { useState, useEffect } from 'react';

const useIsDesktop = (breakpoint = 768) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Function to update the state based on window width
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= breakpoint);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isDesktop;
};

export default useIsDesktop;