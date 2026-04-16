import type { ReactNode } from "react";
import { useId } from "react";

import Link from "next/link";

import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  defaultValue: string;
  name: string;
  options: FilterOption[];
  placeholder: string;
}

interface AdminListToolbarProps {
  clearHref: string;
  extraActions?: ReactNode;
  filters?: FilterConfig[];
  formAction: string;
  isFiltered: boolean;
  newHref?: string;
  newLabel?: string;
  query?: string;
  searchPlaceholder?: string;
  statusMessage?: string | null;
  summaryText: string;
  title: string;
}

export function AdminListToolbar({
  clearHref,
  extraActions,
  filters,
  formAction,
  isFiltered,
  newHref,
  newLabel,
  query,
  searchPlaceholder,
  statusMessage,
  summaryText,
  title,
}: AdminListToolbarProps) {
  const searchId = useId();

  return (
    <div className="space-y-3 border-b border-border/60 px-5 py-4 md:px-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold tracking-[-0.02em] text-foreground">
          {title}
        </h2>
        {newHref && newLabel ? (
          <Button asChild size="sm" className="rounded-full px-4">
            <Link href={newHref}>{newLabel}</Link>
          </Button>
        ) : null}
      </div>

      <form action={formAction} className="flex flex-wrap items-center gap-2">
        {searchPlaceholder !== undefined ? (
          <>
            <label htmlFor={searchId} className="sr-only">
              Search
            </label>
            <Input
              id={searchId}
              type="search"
              name="q"
              defaultValue={query}
              placeholder={searchPlaceholder}
              className="h-9 min-w-56 flex-1 rounded-full border border-border/70 bg-white/82 px-4 text-sm"
            />
          </>
        ) : null}

        {filters?.map((filter) => (
          <select
            key={filter.name}
            name={filter.name}
            defaultValue={filter.defaultValue}
            aria-label={filter.placeholder}
            className="input-shell h-9 rounded-full border border-border/70 bg-white/82 px-4 text-sm text-foreground"
          >
            <option value="">{filter.placeholder}</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}

        <Button
          type="submit"
          size="sm"
          aria-label="Apply filters"
          className="rounded-full px-4"
        >
          Apply
        </Button>

        {isFiltered ? (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full px-4"
          >
            <Link href={clearHref}>Clear</Link>
          </Button>
        ) : null}

        {extraActions}
      </form>

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">{summaryText}</p>
        {statusMessage ? (
          <p
            aria-live="polite"
            aria-atomic="true"
            className="text-xs font-medium text-foreground"
          >
            {statusMessage}
          </p>
        ) : null}
      </div>
    </div>
  );
}
