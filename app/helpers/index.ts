export const getRandomURLs = (urls: string[], min = 5, max = 10): string[] => {
    const numUrlsToSelect = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffledUrls = [...urls].sort(() => Math.random() - 0.5);
    return shuffledUrls.slice(0, numUrlsToSelect);
  };