
import { ReactElement } from "react";
import { LucideIcon } from "lucide-react";

export type NavSubItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export type NavItem = {
  title: string;
  icon: LucideIcon;
  href: string;
  subItems?: NavSubItem[];
};
