import type { ReactNode } from "react";

import { Button } from "@ui/components/ui/button";

export interface LogoutButtonProps {
  ariaLabel?: string;
  className?: string;
  hideLabel?: boolean;
  icon?: ReactNode;
  label?: string;
  message?: string;
  redirectPath?: string;
  size?: React.ComponentProps<typeof Button>["size"];
  variant?: React.ComponentProps<typeof Button>["variant"];
}
