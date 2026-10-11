import { Link, type LinkProps } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

export interface NavItemData {
  label: string;
  Icon: LucideIcon;
  to?: NonNullable<LinkProps["to"]>; // no `to` = page not built yet, shown but not clickable
}

const BASE = "flex items-center gap-4 whitespace-nowrap rounded border px-4 py-4.5 text-base";

// TanStack Router marks the current page's link with data-status="active"
const THEMES = {
  light: {
    link: "border-border text-ink hover:border-ink data-[status=active]:border-ink data-[status=active]:bg-ink data-[status=active]:text-white",
    disabled: "border-border text-ink",
  },
  dark: {
    link: "border-border-dark text-ink-inverse hover:border-ink-inverse data-[status=active]:border-white data-[status=active]:bg-white data-[status=active]:text-ink",
    disabled: "border-border-dark text-ink-inverse",
  },
};

interface NavItemProps {
  item: NavItemData;
  theme: keyof typeof THEMES;
}

const NavItem = ({ item: { label, Icon, to }, theme }: NavItemProps) => {
  const content = (
    <>
      <Icon className="shrink-0" size={18} aria-hidden="true" />
      {label}
    </>
  );

  if (!to) {
    return (
      <span
        className={`${BASE} ${THEMES[theme].disabled} cursor-not-allowed opacity-45`}
        aria-disabled="true"
        title="Coming soon"
      >
        {content}
      </span>
    );
  }

  return (
    <Link to={to} className={`${BASE} ${THEMES[theme].link}`}>
      {content}
    </Link>
  );
};

export default NavItem;
