["VITE_MAIN_WEBSITE_URL"].forEach((key) => {
  if (!import.meta.env[key]) {
    throw new Error(`Missing env variable: ${key}`);
  }
});