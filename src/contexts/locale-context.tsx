"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultLocale,
  LOCALE_COOKIE,
  type LocaleCode,
} from "@/i18n/config";
import { getMessage, type MessageKey } from "@/i18n/get-message";
import { getMessages } from "@/i18n/messages";

type LocaleContextValue = {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  t: (key: MessageKey) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

type LocaleProviderProps = {
  children: ReactNode;
  /** From server `cookies()` so SSR and hydration use the same locale. */
  initialLocale?: LocaleCode;
};

export function LocaleProvider({
  children,
  initialLocale = defaultLocale,
}: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<LocaleCode>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    const maxAge = 60 * 60 * 24 * 365;
    document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${maxAge};SameSite=Lax`;
  }, [locale]);

  const messages = useMemo(() => getMessages(locale), [locale]);

  const setLocale = useCallback((next: LocaleCode) => {
    setLocaleState(next);
  }, []);

  const t = useCallback(
    (key: MessageKey) => getMessage(messages, key),
    [messages]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}

export function useT() {
  return useLocale().t;
}
