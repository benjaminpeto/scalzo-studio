import { ArrowUpRight, ChevronRight, LogOut } from "lucide-react";
import Link from "next/link";

import { LogoutButton } from "@/components/logout-button";
import type { AdminProfileMenuProps } from "@/interfaces/admin/component-props";
import { cn } from "@/lib/utils";

export function AdminProfileMenu({
  buttonRef,
  isCollapsed,
  isOpen,
  profileInitials,
  toggle,
  userEmail,
}: AdminProfileMenuProps) {
  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Open profile menu"
        onClick={toggle}
        className={cn(
          "flex items-center border border-border/60 bg-[radial-gradient(circle_at_top,rgba(252,205,3,0.14),transparent_72%),linear-gradient(180deg,rgba(241,239,234,0.92),rgba(255,255,255,0.88))] text-left transition-colors hover:border-primary/30 hover:bg-card",
          isCollapsed
            ? "w-full justify-center rounded-[1.15rem] px-0 py-3 lg:size-12"
            : "w-full gap-3 rounded-[1.2rem] px-3 py-3",
        )}
      >
        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#161813,#735c00)] font-semibold tracking-[0.08em] text-white">
          {profileInitials}
        </span>
        <span className={cn("min-w-0 flex-1", isCollapsed && "lg:hidden")}>
          <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Session
          </span>
          <span className="mt-1 block truncate text-sm font-medium text-foreground">
            {userEmail ?? "Admin user"}
          </span>
        </span>
        <ChevronRight
          aria-hidden="true"
          className={cn(
            "size-[0.9rem] shrink-0 text-muted-foreground transition-transform",
            isOpen && "rotate-90",
            isCollapsed && "lg:hidden",
          )}
        />
      </button>

      {isOpen ? (
        <div
          role="menu"
          className={cn(
            "absolute z-20 w-56 rounded-[1.15rem] border border-border/70 bg-white/96 p-2 shadow-[0_18px_40px_rgba(27,28,26,0.12)] backdrop-blur",
            isCollapsed
              ? "bottom-0 left-[calc(100%+0.75rem)] lg:w-52"
              : "bottom-[calc(100%+0.75rem)] left-0 right-0",
          )}
        >
          <div className="px-3 py-2">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Signed in
            </p>
            <p className="mt-1 truncate text-sm font-medium text-foreground">
              {userEmail ?? "Admin user"}
            </p>
          </div>
          <div className="mt-1 space-y-1">
            <Link
              href="/"
              role="menuitem"
              className="flex items-center gap-2 rounded-[0.9rem] px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-container-low"
            >
              <ArrowUpRight aria-hidden="true" className="size-[0.95rem]" />
              <span>View site</span>
            </Link>
            <LogoutButton
              ariaLabel="Logout"
              className="w-full justify-start rounded-[0.9rem] border-0 bg-transparent px-3 py-2 text-sm font-medium shadow-none hover:bg-surface-container-low"
              icon={<LogOut aria-hidden="true" className="size-[0.95rem]" />}
              label="Logout"
              message="You have been signed out of the admin session."
              size="default"
              variant="ghost"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
