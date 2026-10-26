import type { IIconProps } from "@/types/icon";

export const ReloadIcon: React.FC<IIconProps> = ({
  size = 24,
  color = "currentColor",
  className,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M22 12C22 17.52 17.52 22 12 22C6.48 22 3.11 16.44 3.11 16.44M3.11 21.44V16.44H7.63M2 12C2 6.48 6.44 2 12 2C18.67 2 22 7.56 22 7.56M17.56 7.56H22V2.56"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={color}
      />
    </svg>
  );
};
