import { Link, type LinkProps } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

export interface NavItemData {
  label: string;
  Icon: LucideIcon;
  to?: NonNullable<LinkProps["to"]>; // no `to` = page not built yet, shown but not clickable
}

interface NavItemProps {
  item: NavItemData;
  block: "admin-layout" | "waiter-layout"; // BEM block that styles the link
}

const NavItem = ({ item: { label, Icon, to }, block }: NavItemProps) => {
  const content = (
    <>
      <Icon className={`${block}__icon`} size={18} aria-hidden="true" />
      {label}
    </>
  );

  if (!to) {
    return (
      <span
        className={`${block}__link ${block}__link--disabled`}
        aria-disabled="true"
        title="Coming soon"
      >
        {content}
      </span>
    );
  }

  return (
    <Link
      to={to}
      className={`${block}__link`}
      activeProps={{ className: `${block}__link--active` }}
    >
      {content}
    </Link>
  );
};

export default NavItem;
