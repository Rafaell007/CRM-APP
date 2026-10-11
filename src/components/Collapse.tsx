import type { ReactNode } from "react";

interface CollapseProps {
  isOpen: boolean;
  children: ReactNode;
}

// height: auto cannot be animated, so this is a grid whose single row grows
// from 0fr to 1fr; the inner wrapper is what gets clipped. `inert` keeps the
// hidden content out of keyboard focus and screen readers while closed.
const Collapse = ({ isOpen, children }: CollapseProps) => (
  <div
    className={`grid transition-[grid-template-rows] duration-250 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
    inert={!isOpen}
  >
    <div className="min-h-0 overflow-hidden">{children}</div>
  </div>
);

export default Collapse;
