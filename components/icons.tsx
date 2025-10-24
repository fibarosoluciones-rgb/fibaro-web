import { SVGProps } from "react";

const baseIconProps: SVGProps<SVGSVGElement> = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const createIcon = (paths: JSX.Element[]) =>
  function Icon(props: SVGProps<SVGSVGElement>) {
    return (
      <svg {...baseIconProps} {...props}>
        {paths}
      </svg>
    );
  };

export const PlusIcon = createIcon([
  <path key="v" d="M12 5v14" />, 
  <path key="h" d="M5 12h14" />, 
]);

export const SparklesIcon = createIcon([
  <path key="1" d="M12 3v4" />, 
  <path key="2" d="M12 17v4" />, 
  <path key="3" d="M3 12h4" />, 
  <path key="4" d="M17 12h4" />, 
  <path key="5" d="m5.6 5.6 2.8 2.8" />, 
  <path key="6" d="m15.6 15.6 2.8 2.8" />, 
  <path key="7" d="m5.6 18.4 2.8-2.8" />, 
  <path key="8" d="m15.6 8.4 2.8-2.8" />, 
]);

export const UsersIcon = createIcon([
  <path key="1" d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />, 
  <circle key="2" cx={9} cy={7} r={4} />, 
  <path key="3" d="M23 21v-2a4 4 0 0 0-3-3.87" />, 
  <path key="4" d="M16 3.13a4 4 0 0 1 0 7.75" />, 
]);

export const ZapIcon = createIcon([
  <path key="1" d="M13 2 3 14h9l-1 8 10-12h-9z" />, 
]);

export const FolderTreeIcon = createIcon([
  <path key="1" d="M3 7h5l2 3h11" />, 
  <path key="2" d="M3 3h4l2 2" />, 
  <rect key="3" x={3} y={13} width={6} height={7} rx={1} />, 
  <rect key="4" x={13} y={13} width={8} height={7} rx={1} />, 
  <path key="5" d="M9 16h4" />, 
]);

export const TrashIcon = createIcon([
  <path key="1" d="M3 6h18" />, 
  <path key="2" d="M8 6V4h8v2" />, 
  <path key="3" d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />, 
  <line key="4" x1={10} x2={10} y1={11} y2={17} />, 
  <line key="5" x1={14} x2={14} y1={11} y2={17} />, 
]);
