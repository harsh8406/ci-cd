import React, { useEffect, useRef, useState } from "react";

/**
 * Lightweight count-up animation, no extra dependency required.
 * Animates from 0 (or previous value) to `value` whenever it changes.
 */
const CountUp = ({ value = 0, duration = 900, suffix = "", decimals = 0 }) => {
  const [display, setDisplay] = useState(0);
  const startRef = useRef(null);
  const fromRef = useRef(0);

  useEffect(() => {
    fromRef.current = display;
    startRef.current = null;
    let raf;

    const step = (timestamp) => {
      if (startRef.current === null) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = fromRef.current + (value - fromRef.current) * eased;
      setDisplay(current);
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <span>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
};

export default CountUp;
