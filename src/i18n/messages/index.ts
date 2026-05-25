import type { LocaleCode } from "../config";
import { en, type Messages } from "./en";
import { hi } from "./hi";
import { ta } from "./ta";
import { te } from "./te";
import { bn } from "./bn";
import { mr } from "./mr";
import { gu } from "./gu";
import { kn } from "./kn";
import { ml } from "./ml";
import { pa } from "./pa";
import { or } from "./or";

export type { Messages };

const catalog: Record<LocaleCode, Messages> = {
  en,
  hi,
  ta,
  te,
  bn,
  mr,
  gu,
  kn,
  ml,
  pa,
  or,
};

export function getMessages(locale: LocaleCode): Messages {
  return catalog[locale] ?? en;
}
