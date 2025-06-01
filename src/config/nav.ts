import type { LucideIcon } from 'lucide-react';
import { LayoutDashboard, DatabaseZap, DollarSign, ListChecks, Sparkles, Palette, BarChartBig, Settings } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  label?: string;
  disabled?: boolean;
}

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Data Input',
    href: '/data-input',
    icon: DatabaseZap,
  },
  {
    title: 'Spending Power',
    href: '/spending-power',
    icon: DollarSign,
  },
  {
    title: 'Expenses',
    href: '/expenses',
    icon: ListChecks,
  },
  {
    title: 'Spending Advisor',
    href: '/spending-advisor',
    icon: Sparkles,
  },
  {
    title: 'Lifestyle Guide',
    href: '/lifestyle-guide',
    icon: Palette,
  },
  {
    title: 'Analysis',
    href: '/analysis',
    icon: BarChartBig,
  },
  // {
  //   title: 'Settings',
  //   href: '/settings',
  //   icon: Settings,
  // }
];
