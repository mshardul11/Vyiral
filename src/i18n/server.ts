import { cookies } from "next/headers";
import {
  defaultLocale,
  isLocaleCode,
  LOCALE_COOKIE,
  type LocaleCode,
} from "./config";

/** Resolve locale from the request cookie (server components / RSC). */
export async function getServerLocale(): Promise<LocaleCode> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return value && isLocaleCode(value) ? value : defaultLocale;
}
