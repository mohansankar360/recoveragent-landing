"use client";

import { useRef, useState } from "react";
import { Pause, Play, SpeakerHigh } from "@phosphor-icons/react";
import styles from "./RecoveryAudioPlayer.module.css";

function formatTime(value: number) {
  const seconds = Number.isFinite(value) ? Math.floor(value) : 0;
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function RecoveryAudioPlayer({ src = "/audio/abandoned_hindi.mp3", label = "recovery call" }: { src?: string; label?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(false);
  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try { await audio.play(); setError(false); } catch { setError(true); }
    } else audio.pause();
  };
  return <div className={styles.player}>
    <audio ref={audioRef} src={src} preload="metadata" onLoadedMetadata={(event) => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)} onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => setError(true)} />
    <button type="button" className={styles.play} onClick={toggle} aria-label={playing ? `Pause ${label}` : `Play ${label}`}>{playing ? <Pause size={19} weight="fill" /> : <Play size={19} weight="fill" />}</button>
    <div className={styles.track}><div className={styles.trackTop}><span>{playing ? "Playing call" : "Listen to the call"}</span><SpeakerHigh size={17} aria-hidden /></div><input aria-label="Call playback position" type="range" min="0" max={duration || 0} step="0.1" value={Math.min(current, duration)} disabled={!duration} onChange={(event) => { const time = Number(event.target.value); if (audioRef.current) audioRef.current.currentTime = time; setCurrent(time); }} /><div className={styles.times}><span>{formatTime(current)}</span><span>{duration ? formatTime(duration) : "--:--"}</span></div></div>
    {error && <p className={styles.error}>Unable to play the recording. <a href={src}>Open the audio file</a>.</p>}
  </div>;
}
