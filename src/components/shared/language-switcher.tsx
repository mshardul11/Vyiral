"use client";

import { Globe } from "lucide-react";
import { locales } from "@/i18n/config";
import { useLocale } from "@/contexts/locale-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type LanguageSwitcherProps = {
  variant?: "default" | "compact";
};

export function LanguageSwitcher({ variant = "default" }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useLocale();
  const current = locales.find((l) => l.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={variant === "compact" ? "icon" : "sm"}
          className={
            variant === "compact"
              ? "h-9 w-9 shrink-0"
              : "gap-2 text-muted-foreground hover:text-foreground"
          }
          aria-label={t("common.chooseLanguage")}
        >
          <Globe className="h-4 w-4" />
          {variant !== "compact" && (
            <span className="max-w-[5rem] truncate text-xs sm:max-w-none sm:text-sm">
              {current?.native ?? locale}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="glass-panel max-h-[min(70vh,24rem)] w-52 overflow-y-auto"
      >
        <DropdownMenuLabel>{t("common.chooseLanguage")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {locales.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLocale(l.code)}
            className={locale === l.code ? "bg-primary/15 text-primary" : ""}
          >
            <span className="font-medium">{l.native}</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {l.label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
