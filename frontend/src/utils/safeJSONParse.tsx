export const safeJSONParse = (data: string | null) => {
  try {
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn("Invalid JSON in storage:", data);
    return null;
  }
};
