const KEY = "jetset:selectedCity";
const EVENT = "jetset:city-selected";

export const setSelectedCity = (city: string) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, city);
  window.dispatchEvent(new CustomEvent<string>(EVENT, { detail: city }));
};

export const consumeSelectedCity = (): string => {
  if (typeof window === "undefined") return "";
  const value = sessionStorage.getItem(KEY) || "";
  sessionStorage.removeItem(KEY);
  return value;
};

export const onCitySelected = (callback: (city: string) => void) => {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => callback((e as CustomEvent<string>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
};
