"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import type { LandingVariant } from "@/lib/landing-variant";
import {
  CALL_JOURNEYS,
  CALL_POINTS_BY_JOURNEY,
  CALL_SCRIPTS,
  type CallJourneyId,
} from "@/lib/call-scripts";

const VERSUS = [
  {
    dim: true,
    label: "Email reminder",
    stat: "~10%",
    body: "Often buried in inboxes or promotions. Customers may see it much later—or never. It rarely creates the urgency needed to confirm an order or resolve a delivery issue.",
  },
  {
    dim: true,
    label: "WhatsApp",
    stat: "40–50%",
    body: "Much better reach and engagement, but customers can still ignore the message, postpone the action, or forget to respond.",
  },
  {
    dim: false,
    label: "Voice Call + WhatsApp",
    stat: "70–80%",
    body: "A call creates a real-time interaction. The customer can confirm, clarify, reschedule, or take action immediately. WhatsApp then delivers the link, details, or follow-up.",
  },
];

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "00:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function seedBars(seed: string, count = 48) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h << 5) - h + seed.charCodeAt(i);
  return Array.from({ length: count }, (_, i) => {
    const n = Math.abs(Math.sin(h + i * 1.7)) * 0.65 + 0.2;
    return n;
  });
}

export function CallDemo({ variant = "full" }: { variant?: LandingVariant }) {
  const showCallPoints = variant !== "cold";
  const showVersus = variant === "full";
  const [journey, setJourney] = useState<CallJourneyId>("cod");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSec, setCurrentSec] = useState(0);
  const [durationSec, setDurationSec] = useState(CALL_SCRIPTS.cod.durationSec);
  const audioRef = useRef<HTMLAudioElement>(null);
  const durationRef = useRef(durationSec);

  durationRef.current = durationSec;

  const script = CALL_SCRIPTS[journey];
  const callPoints = CALL_POINTS_BY_JOURNEY[journey];
  const bars = useMemo(() => seedBars(journey), [journey]);
  const hasAudio = Boolean(script.audioSrc);
  const done = progress >= 0.995;
  const pausedMidTrack = !playing && progress > 0 && !done;

  const resetPlayback = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setPlaying(false);
    setProgress(0);
    setCurrentSec(0);
  }, []);

  const selectJourney = useCallback(
    (id: CallJourneyId) => {
      resetPlayback();
      setJourney(id);
      setDurationSec(CALL_SCRIPTS[id].durationSec);
    },
    [resetPlayback]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !script.audioSrc) return;

    audio.pause();
    audio.currentTime = 0;
    setPlaying(false);
    setProgress(0);
    setCurrentSec(0);
    setDurationSec(script.durationSec);
    durationRef.current = script.durationSec;
    audio.load();
  }, [journey, script.audioSrc, script.durationSec]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasAudio) return;

    const syncDuration = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        durationRef.current = audio.duration;
        setDurationSec(audio.duration);
      }
    };

    const onTimeUpdate = () => {
      const dur =
        audio.duration > 0 ? audio.duration : durationRef.current;
      setCurrentSec(audio.currentTime);
      setProgress(dur > 0 ? audio.currentTime / dur : 0);
    };

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      setProgress(1);
      const dur = audio.duration > 0 ? audio.duration : durationRef.current;
      setCurrentSec(dur);
    };

    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("durationchange", syncDuration);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("durationchange", syncDuration);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [hasAudio, journey]);

  useEffect(() => () => audioRef.current?.pause(), []);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !hasAudio) return;

    if (!audio.paused) {
      audio.pause();
      setPlaying(false);
      return;
    }

    if (audio.ended || done) {
      audio.currentTime = 0;
      setProgress(0);
      setCurrentSec(0);
    }

    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }, [done, hasAudio]);

  const scrub = useCallback(
    (value: number) => {
      const audio = audioRef.current;
      const dur = audio && audio.duration > 0 ? audio.duration : durationSec;
      const next = value / 100;
      const nextTime = next * dur;

      setProgress(next);
      setCurrentSec(nextTime);

      if (audio && hasAudio) {
        audio.currentTime = nextTime;
        if (next >= 1) audio.pause();
      }
    },
    [durationSec, hasAudio]
  );

  const playhead = `${Math.round(progress * 100)}%`;

  return (
    <section className="sec sec-alt" id="call">
      <div className="wrap">
        <Reveal className="sec-head">
          <div className="eyebrow">The part every founder asks about first</div>
          <h2>&quot;Will my customer hang up on a robot?&quot;</h2>
          <p>
            Fair question. Press play — this is a recorded call in Hindi, not a chat
            transcript. Switch the journey to hear how each recovery flow sounds.
          </p>
        </Reveal>

        <div className="call">
          <Reveal className="call-playback">
            <div className="langs">
              {CALL_JOURNEYS.map((j) => (
                <button
                  key={j.id}
                  type="button"
                  className={`lang${journey === j.id ? " active" : ""}`}
                  onClick={() => selectJourney(j.id)}
                >
                  {j.label}
                </button>
              ))}
            </div>

            <div className="call-rec">
              {hasAudio ? (
                <audio
                  key={journey}
                  ref={audioRef}
                  src={script.audioSrc}
                  preload="metadata"
                  aria-hidden
                />
              ) : null}

              <div className="call-rec-head">
                <div>
                  <span className="call-rec-label">
                    Call recording · {script.recordingLanguage}
                  </span>
                  <strong>{script.meta}</strong>
                </div>
                <div className="call-rec-status">
                  <span className={`call-rec-live${playing ? " on" : ""}`}>
                    {playing ? "Playing" : pausedMidTrack ? "Paused" : done ? "Complete" : "Ready"}
                  </span>
                  <span className="call-rec-time">
                    {formatTime(currentSec)} / {formatTime(durationSec)}
                  </span>
                </div>
              </div>

              <div className="call-rec-wave" aria-hidden>
                {bars.map((h, i) => {
                  const pos = i / bars.length;
                  const lit = progress > pos;
                  const active = playing && Math.abs(progress - pos) < 0.04;
                  return (
                    <span
                      key={i}
                      className={`call-rec-bar${lit ? " lit" : ""}${active ? " active" : ""}`}
                      style={{ height: `${Math.round(h * 100)}%` }}
                    />
                  );
                })}
                <span className="call-rec-playhead" style={{ left: playhead }} />
              </div>

              <label className="call-rec-scrub">
                <span className="sr-only">Scrub recording</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={0.5}
                  value={progress * 100}
                  onChange={(e) => scrub(+e.target.value)}
                  disabled={!hasAudio}
                />
              </label>

              <div className="call-rec-foot">
                <button
                  type="button"
                  className="call-rec-play btn btn-primary"
                  onClick={toggle}
                  disabled={!hasAudio}
                  aria-pressed={playing}
                >
                  {playing
                    ? "Pause"
                    : pausedMidTrack
                      ? "Resume"
                      : done
                        ? "Replay"
                        : "Play recording"}
                </button>
                <div className="call-rec-langnote">
                  <span>{script.recordingNote}</span>
                  <p>{script.agentLanguagesNote}</p>
                </div>
              </div>
            </div>
          </Reveal>

          {showCallPoints && (
            <Reveal>
              <div className="call-points" key={journey}>
                {callPoints.map((cp) => (
                  <div className="cp" key={cp.n}>
                    <span className="n">{cp.n}</span>
                    <div>
                      <h4>{cp.title}</h4>
                      <p>{cp.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          )}
        </div>

        {!showVersus && (
          <Reveal>
            <p className="call-proof-line">
              Messages get ignored. Calls get answered. Voice + WhatsApp:{" "}
              <b>70–80% response</b> vs WhatsApp alone at 40–50%.
            </p>
          </Reveal>
        )}

        {showVersus && (
        <div style={{ marginTop: 48 }}>
          <Reveal className="sec-head mb-26">
            <div className="eyebrow">Why calling, and not another WhatsApp?</div>
            <h2 className="vs-headline">
              Because messages can be ignored. Calls demand a response.
            </h2>
          </Reveal>
          <Reveal className="vs">
            {VERSUS.map((card) => (
              <div key={card.label} className={`vscard${card.dim ? " dim" : " win"}`}>
                <div className="h">{card.label}</div>
                <div className="big">{card.stat}</div>
                <p>{card.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
        )}
      </div>
    </section>
  );
}
