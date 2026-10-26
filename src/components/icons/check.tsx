import type { IIconProps } from "@/types/icon";

export const CheckIcon: React.FC<IIconProps> = ({
  size = 24,
  color = "currentColor",
  className,
}) => {
  return (
    <svg
      className={className}
      aria-hidden="true"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
    >
      <path
        d="M186.4 480.3l219.5 253.8c7.8 9 21.4 10 30.4 2.2 0.6-0.5 1.2-1.1 1.7-1.7L839.6 300c7.6-8.2 7.6-20.9-0.1-29.1-7.7-8.2-20.4-9.1-29.2-2.1L433.8 573.6c-7.3 5.9-17.5 6.4-25.3 1.3l-194-126.3c-9-5.8-20.8-4.2-27.9 3.8-7.1 7.9-7.1 19.9-0.2 27.9z"
        fill={color}
      />
    </svg>
  );
};
