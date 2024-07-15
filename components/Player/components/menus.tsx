import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
  useCaptionOptions,
  useMediaPlayer,
  useMediaState,
  useVideoQualityOptions,
  MuteButton,
} from "@vidstack/react";
import {
  CheckCircle,
  CircleIcon,
  SettingsIcon,
  SubtitlesIcon,
  Volume2 as VolumeHighIcon,
  Volume1 as VolumeLowIcon,
  VolumeX as MuteIcon,
} from "lucide-react";

import { buttonClass, tooltipClass } from "./buttons";
import { Volume } from "./sliders";

export interface MenuProps {
  side?: DropdownMenu.DropdownMenuContentProps["side"];
  align?: DropdownMenu.DropdownMenuContentProps["align"];
  offset?: DropdownMenu.DropdownMenuContentProps["sideOffset"];
  tooltipSide?: Tooltip.TooltipContentProps["side"];
  tooltipAlign?: Tooltip.TooltipContentProps["align"];
  tooltipOffset?: number;
}

const menuClass =
  "animate-out fade-out z-[9999] slide-in-from-bottom-4 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:slide-out-to-bottom-2 flex max-h-[400px] min-w-[260px] flex-col rounded-md border border-white/10 bg-black/95 p-2.5 font-sans text-[15px] font-medium outline-none backdrop-blur-sm duration-300";

export function Mute({
  side = "top",
  align = "end",
  offset = 0,
  tooltipSide = "top",
  tooltipAlign = "center",
  tooltipOffset = 0,
}: MenuProps) {
  const volume = useMediaState("volume"),
    isMuted = useMediaState("muted");
  return (
    <DropdownMenu.Root>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <DropdownMenu.Trigger className={buttonClass}>
            {isMuted || volume == 0 ? (
              <MuteIcon className="w-7 h-7" />
            ) : volume < 0.5 ? (
              <VolumeLowIcon className="w-7 h-7" />
            ) : (
              <VolumeHighIcon className="w-7 h-7" />
            )}
          </DropdownMenu.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Content
          className={tooltipClass}
          side={tooltipSide}
          align={tooltipAlign}
          sideOffset={tooltipOffset}
        >
          {isMuted ? "Unmute" : "Mute"}
        </Tooltip.Content>
      </Tooltip.Root>
      <DropdownMenu.Content
        className={menuClass}
        side={side}
        align={align}
        sideOffset={offset}
      >
        <DropdownMenu.Label className="flex gap-2 items-center w-full px-1.5 mb-2 font-medium text-[15px]">
          <h1>Mute</h1>
          <MuteButton>
            {isMuted || volume == 0 ? (
              <MuteIcon className="w-7 h-7" />
            ) : volume < 0.5 ? (
              <VolumeLowIcon className="w-7 h-7" />
            ) : (
              <VolumeHighIcon className="w-7 h-7" />
            )}
          </MuteButton>
        </DropdownMenu.Label>
        <DropdownMenu.Label className="flex gap-2 items-center w-full px-1.5 mb-2 font-medium text-[15px]">
          <h1>Volume</h1>
          <Volume />
        </DropdownMenu.Label>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

export function Quality({
  side = "top",
  align = "end",
  offset = 0,
  tooltipSide = "top",
  tooltipAlign = "center",
  tooltipOffset = 0,
}: MenuProps) {
  const options = useVideoQualityOptions({ sort: "descending" }),
    autoQuality = useMediaState("autoQuality"),
    currentQualityText = options.selectedQuality?.height + "p" ?? "",
    hint = !autoQuality ? currentQualityText : `Auto (${currentQualityText})`;

  return (
    <DropdownMenu.Root>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <DropdownMenu.Trigger
            aria-label="Quality"
            className={buttonClass}
            disabled={options.disabled}
          >
            <SettingsIcon className="w-7 h-7" />
          </DropdownMenu.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Content
          className={tooltipClass}
          side={tooltipSide}
          align={tooltipAlign}
          sideOffset={tooltipOffset}
        >
          Quality
        </Tooltip.Content>
      </Tooltip.Root>
      <DropdownMenu.Content
        className={menuClass}
        side={side}
        align={align}
        sideOffset={offset}
      >
        <DropdownMenu.Label className="flex items-center w-full px-1.5 mb-2 font-medium text-[15px]">
          <SettingsIcon className="w-5 h-5 mr-1.5 translate-y-px" />
          Quality
          <span className="ml-auto text-sm text-white/50">{hint}</span>
        </DropdownMenu.Label>
        <DropdownMenu.RadioGroup
          aria-label="Quality"
          className="w-full flex flex-col"
          value={options.selectedValue}
        >
          {options.map(({ label, value, select }) => (
            <Radio value={value} onSelect={select} key={value}>
              {label}
            </Radio>
          ))}
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

export function Captions({
  side = "top",
  align = "end",
  offset = 0,
  tooltipSide = "top",
  tooltipAlign = "center",
  tooltipOffset = 0,
}: MenuProps) {
  const player = useMediaPlayer(),
    options = useCaptionOptions(),
    hint = options.selectedTrack?.label ?? "Off";
  return (
    <DropdownMenu.Root>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <DropdownMenu.Trigger
            aria-label="Settings"
            className={buttonClass}
            disabled={options.disabled}
          >
            <SubtitlesIcon className="w-7 h-7" />
          </DropdownMenu.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Content
          className={tooltipClass}
          side={tooltipSide}
          align={tooltipAlign}
          sideOffset={tooltipOffset}
        >
          Captions
        </Tooltip.Content>
      </Tooltip.Root>
      <DropdownMenu.Content
        className={menuClass}
        side={side}
        align={align}
        sideOffset={offset}
        collisionBoundary={player?.el}
      >
        <DropdownMenu.Label className="flex items-center w-full px-1.5 mb-2 font-medium text-[15px]">
          <SubtitlesIcon className="w-5 h-5 mr-1.5 translate-y-px" />
          Captions
          <span className="ml-auto text-sm text-white/50">{hint}</span>
        </DropdownMenu.Label>
        <DropdownMenu.RadioGroup
          aria-label="Captions"
          className="w-full flex flex-col"
          value={options.selectedValue}
        >
          {options.map(({ label, value, select }) => (
            <Radio value={value} onSelect={select} key={value}>
              {label}
            </Radio>
          ))}
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

function Radio({
  children,
  ...props
}: DropdownMenu.DropdownMenuRadioItemProps) {
  return (
    <DropdownMenu.RadioItem
      className="ring-media-focus group relative flex w-full cursor-pointer select-none items-center justify-start rounded-sm p-2.5 outline-none hocus:bg-white/10 data-[focus]:ring-[3px] text-sm"
      {...props}
    >
      <CircleIcon className="h-4 w-4 text-white group-data-[state=checked]:hidden" />
      <CheckCircle className="text-media-brand hidden h-4 w-4 group-data-[state=checked]:block" />
      <span className="ml-2">{children}</span>
    </DropdownMenu.RadioItem>
  );
}
