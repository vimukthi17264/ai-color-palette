import { useState, useEffect } from 'react';

export const useSharePrompt = () => {
  const [shouldPromptShare, setShouldPromptShare] = useState(false);

  useEffect(() => {
    const handleShareEvent = () => {
      const lastPrompt = localStorage.getItem('lastSharePrompt');
      const currentDate = new Date().toDateString();

      if (!lastPrompt || lastPrompt !== currentDate) {
        setTimeout(() => {
          setShouldPromptShare(true);
          localStorage.setItem('lastSharePrompt', currentDate);
        }, 3000);
      }
    };

    window.addEventListener('triggerSharePrompt', handleShareEvent);

    return () => {
      window.removeEventListener('triggerSharePrompt', handleShareEvent);
    };
  }, []);

  return { shouldPromptShare, setShouldPromptShare };
};