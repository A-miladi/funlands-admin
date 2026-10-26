import type { ComponentType } from "react";
import type { IIconProps } from "@/types/icon";
import { cn } from "@/lib/utils/cn";
import { HomeIcon } from "@/components/icons/home";
import { UsersIcon } from "@/components/icons/users";
import { UserIcon } from "@/components/icons/user";
import { GameIcon } from "@/components/icons/GameIcon";
import { PlayIcon } from "@/components/icons/PlayIcon";
import { PowerIcon } from "@/components/icons/power";
import { CupIcon } from "@/components/icons/cup";
import { WarningIcon } from "@/components/icons/warning";
import { CheckIcon } from "@/components/icons/check";
import { RejectIcon } from "@/components/icons/reject";
import { ContentIcon } from "@/components/icons/content";
import { LogoutIcon } from "@/components/icons/logout";
import { ChevronIcon } from "@/components/icons/chevron";
import { SecurityIcon } from "@/components/icons/Security";
import { BurgerMenu } from "@/components/icons/BurgerMenu";
import { EyeIcon } from "@/components/icons/eye";
import { CloseIcon } from "@/components/icons/close";
import { ArrowBack } from "@/components/icons/arrow-left";
import { SearchIcon } from "@/components/icons/search";
import { LockIcon } from "@/components/icons/lock";
import { MailIcon } from "@/components/icons/mail";
import { ChartIcon } from "@/components/icons/chart";
import { CalendarIcon } from "@/components/icons/calendar";
import { DownloadIcon } from "@/components/icons/download";
import { SettingsIcon } from "../icons/Setting";
import { ReportIcon } from "../icons/Report";
import { ExcelIcon } from "../icons/Excel";
import { CsvIcon } from "../icons/csv";
import { LayoutIcon, CategoriesIcon, AvatarIcon, ModerationIcon } from "../icons/admin-navigation";
const icons: Record<string, ComponentType<IIconProps>> = {
  home: HomeIcon,
  users: UsersIcon,
  user: UserIcon,
  game: GameIcon,
  play: PlayIcon,
  start: PowerIcon,
  power: PowerIcon,
  trophy: CupIcon,
  cup: CupIcon,
  error: WarningIcon,
  warning: WarningIcon,
  check: CheckIcon,
  approve: CheckIcon,
  reject: RejectIcon,
  content: ContentIcon,
  logout: LogoutIcon,
  down: ChevronIcon,
  shield: SecurityIcon,
  menu: BurgerMenu,
  eye: EyeIcon,
  close: CloseIcon,
  arrow: ArrowBack,
  search: SearchIcon,
  lock: LockIcon,
  mail: MailIcon,
  chart: ChartIcon,
  calendar: CalendarIcon,
  export: DownloadIcon,
  setting: SettingsIcon,
  report: ReportIcon,
  excel: ExcelIcon,
  csv: CsvIcon,
  layout: LayoutIcon,
  categories: CategoriesIcon,
  avatar: AvatarIcon,
  moderation: ModerationIcon,
};
export function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Component = icons[name] ?? HomeIcon;
  return <Component size={20} className={cn("size-5 shrink-0", className)} />;
}
