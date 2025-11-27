import { useState, useEffect, useRef } from "react";

const useAudio = (src) => {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef(null);

  // Initialize audio instance and handle cleanup on unmount
  useEffect(() => {
    audioRef.current = new Audio(src);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    return () => {
      if (audioRef.current) audioRef.current.pause();
    };
  }, [src]);

  // Toggle playback state, handling browser autoplay policies
  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.play().catch((e) => console.warn("Audio blocked:", e));
      setIsMuted(false);
    } else {
      audioRef.current.pause();
      setIsMuted(true);
    }
  };

  return { isMuted, toggleAudio };
};

export default useAudio;
