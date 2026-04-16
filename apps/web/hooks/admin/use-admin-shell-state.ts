"use client";

import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";

const SIDEBAR_STORAGE_KEY = "scalzo-admin-sidebar-collapsed";

function readStoredSidebarState() {
  try {
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function writeStoredSidebarState(isCollapsed: boolean) {
  try {
    window.localStorage.setItem(
      SIDEBAR_STORAGE_KEY,
      isCollapsed ? "true" : "false",
    );
  } catch {}
}

function buildProfileInitials(userEmail: string | null) {
  const normalizedEmail = userEmail?.trim() ?? "";

  if (!normalizedEmail) {
    return "SS";
  }

  const localPart = normalizedEmail.split("@")[0] ?? normalizedEmail;
  const collapsedLocalPart = localPart.replace(/[^a-zA-Z0-9]/g, "");

  return collapsedLocalPart.slice(0, 2).toUpperCase() || "SS";
}

export function useAdminShellState(input: {
  pathname: string;
  userEmail: string | null;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const profileMenuButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setIsSidebarCollapsed(readStoredSidebarState());
  }, []);

  useEffect(() => {
    writeStoredSidebarState(isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  useEffect(() => {
    setIsProfileMenuOpen(false);
  }, [input.pathname, isSidebarCollapsed]);

  const handlePointerDown = useEffectEvent((event: MouseEvent) => {
    if (!profileMenuRef.current?.contains(event.target as Node)) {
      setIsProfileMenuOpen(false);
    }
  });

  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsProfileMenuOpen(false);
      profileMenuButtonRef.current?.focus();
    }
  });

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return;
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handlePointerDown, handleKeyDown, isProfileMenuOpen]);

  const profileInitials = useMemo(
    () => buildProfileInitials(input.userEmail),
    [input.userEmail],
  );

  return {
    isProfileMenuOpen,
    isSidebarCollapsed,
    profileInitials,
    profileMenuButtonRef,
    profileMenuRef,
    setIsProfileMenuOpen,
    toggleProfileMenu: () => setIsProfileMenuOpen((current) => !current),
    toggleSidebar: () => setIsSidebarCollapsed((current) => !current),
  };
}
