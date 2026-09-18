import { useEffect, useState } from 'react';
import { useTodoStore } from '@/stores/useTodoStore';

export function useDailyRollover() {
  const { checkSmartRollover } = useTodoStore();
  const [justRolledOver, setJustRolledOver] = useState(false);

  useEffect(() => {
    // Initial check on app load
    if (checkSmartRollover()) {
      setJustRolledOver(true);
    }

    // Check when user refocuses window
    const handleFocus = () => {
      if (checkSmartRollover()) {
        setJustRolledOver(true);
      }
    };

    // Check when user changes tabs back to VibeSpace
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        if (checkSmartRollover()) {
          setJustRolledOver(true);
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkSmartRollover]);

  return { justRolledOver };
}
