"use client";

import "@vidstack/react/player/styles/base.css";

import { useEffect, useRef } from "react";

import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  Poster,
  Track,
  type MediaCanPlayDetail,
  type MediaCanPlayEvent,
  type MediaPlayerInstance,
  type MediaProviderAdapter,
  type MediaProviderChangeEvent,
  TextTrack,
} from "@vidstack/react";

import { VideoLayout } from "./components/layout/video-layout";
import { textTracks } from "./tracks";
import { useState } from "react";
import { Button } from "@nextui-org/react";

interface Interval {
  startTime: number;
  endTime: number;
}

interface Skip {
  interval: Interval;
  skipType: string;
  skipId: string;
  episodeLength: number;
}

interface SkipTimesResponse {
  found: boolean;
  results: Skip[];
  message: string;
  statusCode: number;
}

export function Player() {
  let player = useRef<MediaPlayerInstance>(null);
  const [skipTimes, setSkipTimes] = useState<SkipTimesResponse | null>(null);
  const [openingButton, setOpeningButton] = useState(false);
  const [endingButton, setEndingButton] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `https://api.aniskip.com/v2/skip-times/54744/2?types[]=ed&types[]=mixed-ed&types[]=mixed-op&types[]=op&types[]=recap&episodeLength=`
      );

      if (res.ok) {
        const data = await res.json();
        setSkipTimes(data);
      }
    })();
  }, []);

  function onProviderChange(
    provider: MediaProviderAdapter | null,
    nativeEvent: MediaProviderChangeEvent
  ) {
    if (isHLSProvider(provider)) {
      provider.config = {};
    }
  }

  const opening =
    skipTimes?.results?.find((item) => item.skipType === "op") || null;
  const ending =
    skipTimes?.results?.find((item) => item.skipType === "ed") || null;
  const episodeLength =
    skipTimes?.results?.find((item) => item.episodeLength)?.episodeLength || 0;

  const skiptime: { startTime?: number; endTime?: number; text: string }[] = [];

  if (opening?.interval) {
    skiptime.push({
      startTime: opening.interval.startTime,
      endTime: opening.interval.endTime,
      text: "Opening",
    });
  }

  if (ending?.interval) {
    skiptime.push({
      startTime: ending.interval.startTime ?? 0,
      endTime: ending.interval.endTime ?? 0,
      text: "Ending",
    });
  } else {
    skiptime.push({
      startTime: opening?.interval.endTime ?? 0,
      endTime: episodeLength,
      text: "",
    });
  }

  function onCanPlay() {
    if (skiptime) {
      const track = new TextTrack({
        kind: "chapters",
        default: true,
        label: "English",
        language: "en-US",
        type: "json",
      });
      for (const cue of skiptime) {
        console.log(skiptime);
        track.addCue(
          new window.VTTCue(
            Number(cue.startTime),
            Number(cue.endTime),
            cue.text
          )
        );
      }
      player.current!.textTracks.add(track);
    }
  }

  useEffect(() => {
    player.current!.subscribe(({ currentTime, duration }) => {
      if (skiptime && skiptime.length > 0) {
        const opStart = skiptime[0]?.startTime ?? 0;
        const opEnd = skiptime[0]?.endTime ?? 0;

        const epStart = skiptime[2]?.startTime ?? 0;
        const epEnd = skiptime[2]?.endTime ?? 0;

        const opButtonText = skiptime[0]?.text || "";
        const edButtonText = skiptime[2]?.text || "";

        setOpeningButton(
          opButtonText === "Opening" &&
            currentTime > opStart &&
            currentTime < opEnd
        );
        setEndingButton(
          edButtonText === "Ending" &&
            currentTime > epStart &&
            currentTime < epEnd
        );
      }
    });
  }, [skiptime]);

  function handleOpening() {
    Object.assign(player.current ?? {}, {
      currentTime: skiptime[0]?.endTime ?? 0,
    });
  }

  function handleEnding() {
    Object.assign(player.current ?? {}, {
      currentTime: skiptime[2]?.endTime ?? 0,
    });
  }

  return (
    <MediaPlayer
      className="w-full aspect-video bg-slate-900 text-white font-sans overflow-hidden rounded-md ring-media-focus data-[focus]:ring-4 relative"
      title="Sprite Fight"
      src="https://fds.biananset.net/_v7/63eaec38cc24343592acf4e001c367ebf1dea16ccd06ee984fac77f75e9db0dd2548da1a386db5959879b83dea1df3df5c0005ecf7226720883fdbf99937a42a9bd7c3f02b1cf8d0cd6767f21558b25004f074d83ac29f2ae6f7f8957db1abf0515d2064779cc7198e6903eff6bc07450c6610e20f2bcbbd0778223761912fd1/master.m3u8"
      crossOrigin
      playsInline
      onProviderChange={onProviderChange}
      onCanPlay={onCanPlay}
      ref={player}
    >
      <MediaProvider>
        <Poster
          className="absolute inset-0 block h-full w-full rounded-md opacity-0 transition-opacity data-[visible]:opacity-100 object-cover"
          src="https://files.vidstack.io/sprite-fight/poster.webp"
          alt="Girl walks into campfire with gnomes surrounding her friend ready for their next meal!"
        />
        {textTracks.map((track) => (
          <Track {...track} key={track.src} />
        ))}

        {openingButton && (
          <button
            onClick={handleOpening}
            className="bg-blue-500 absolute z-[9999] bottom-20 left-5 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200"
          >
            Skip Opening
          </button>
        )}

        {endingButton && (
          <button
            onClick={handleEnding}
            className="bg-blue-500 absolute z-[9999] bottom-20 left-5 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200"
          >
            Skip Ending
          </button>
        )}
      </MediaProvider>

      <VideoLayout thumbnails="https://s.megastatics.com/thumbnails/b8b6231b7f0692aaa2e9e07dc5fd5612/thumbnails.vtt" />
    </MediaPlayer>
  );
}
