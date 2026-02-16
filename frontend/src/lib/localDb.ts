/* --------------------------
   Set (string only)
--------------------------- */
export const setItemLocalDb = (key: string, value: string) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, value);
};

/* --------------------------
   Get
--------------------------- */
export const getItemFromLocalDb = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
};

/* --------------------------
   Remove
--------------------------- */
export const removeItemFrommLocalDb = (key: string) => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
};

/* --------------------------
   Clear multiple items
--------------------------- */
export const clearItemsFrommLocalDb = (keys: string[]) => {
  if (typeof window === "undefined") return;
  // keys.forEach((key) => localStorage.removeItem(key));
};
