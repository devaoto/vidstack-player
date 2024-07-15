import { useEffect, useState } from "react";

import * as Slider from "@radix-ui/react-slider";
import {
  formatTime,
  Thumbnail,
  TimeSlider,
  useMediaRemote,
  useMediaState,
  useSliderPreview,
} from "@vidstack/react";

export function Volume() {
  const volume = useMediaState("volume"),
    canSetVolume = useMediaState("canSetVolume"),
    remote = useMediaRemote();

  if (!canSetVolume) return null;

  return (
    <Slider.Root
      className="group relative inline-flex h-10 w-full max-w-[80px] cursor-pointer touch-none select-none items-center outline-none"
      value={[volume * 100]}
      onValueChange={([value]) => {
        remote.changeVolume(value / 100);
      }}
    >
      <Slider.Track className="h-[5px] w-full rounded-sm bg-white/30 relative">
        <Slider.Range className="bg-media-brand absolute h-full rounded-sm will-change-[width]" />
      </Slider.Track>
      <Slider.Thumb
        aria-label="Volume"
        className="block h-[15px] w-[15px] rounded-full border border-[#cacaca] bg-white outline-none opacity-0 ring-white/40 transition-opacity group-hocus:opacity-100 focus:opacity-100 focus:ring-4 will-change-[left]"
      />
    </Slider.Root>
  );
}

export interface TimeSliderProps {
  thumbnails?: string;
}

export function Time({ thumbnails }: TimeSliderProps) {
  return (
    <TimeSlider.Root className="time-slider group relative mx-[7.5px] inline-flex h-10 w-full cursor-pointer touch-none select-none items-center outline-none">
      <TimeSlider.Chapters className="relative flex h-full w-full items-center rounded-[1px]">
        {(cues, forwardRef) =>
          cues.map((cue) => (
            <div
              className="last-child:mr-0 relative mr-0.5 flex h-full w-full items-center rounded-[1px]"
              style={{ contain: "layout style" }}
              key={cue.startTime}
              ref={forwardRef}
            >
              <TimeSlider.Track className="relative ring-media-focus z-0 h-[5px] w-full rounded-sm bg-white/30 group-data-[focus]:ring-[3px]">
                <TimeSlider.TrackFill className="bg-media-brand absolute h-full w-[var(--chapter-fill)] rounded-sm will-change-[width]" />
                <TimeSlider.Progress className="absolute z-10 h-full w-[var(--chapter-progress)] rounded-sm bg-white/50 will-change-[width]" />
              </TimeSlider.Track>
            </div>
          ))
        }
      </TimeSlider.Chapters>

      <TimeSlider.Thumb className="absolute left-[var(--slider-fill)] top-1/2 z-20 h-[15px] w-[15px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#cacaca] bg-white opacity-0 ring-white/40 transition-opacity group-data-[active]:opacity-100 group-data-[dragging]:ring-4 will-change-[left]" />

      <TimeSlider.Preview className="flex flex-col items-center opacity-0 transition-opacity duration-200 data-[visible]:opacity-100 pointer-events-none">
        {thumbnails ? (
          <TimeSlider.Thumbnail.Root
            src={thumbnails}
            className="block h-[var(--thumbnail-height)] max-h-[160px] min-h-[80px] w-[var(--thumbnail-width)] min-w-[120px] max-w-[180px] overflow-hidden border border-white bg-black"
          >
            <TimeSlider.Thumbnail.Img />
          </TimeSlider.Thumbnail.Root>
        ) : null}

        <TimeSlider.ChapterTitle className="mt-2 text-sm" />

        <TimeSlider.Value className="text-[13px]" />
      </TimeSlider.Preview>
    </TimeSlider.Root>
  );
}
