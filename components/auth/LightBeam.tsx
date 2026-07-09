"use client";
import { LazyMotion, domAnimation, m, type Transition } from "framer-motion";

interface LightBeamProps {
  duration?: number;
  className?: string;
}

const LightBeam = ({ duration = 8, className = "" }: LightBeamProps) => {
  const transitionAnimate: Transition = {
    duration: duration,
    repeat: Infinity,
    ease: "linear",
  };
  return (
    <LazyMotion features={domAnimation}>
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        {/* Light beam top edge */}
        <m.div
          className={`h-0.5 w-1/3 top-0 left-0 absolute bg-linear-to-r from-transparent via-primary/80 to-transparent ${className}`}
          animate={{ x: ["-100%", "300%"] }}
          transition={transitionAnimate}
        />

        {/* Light beam right edge */}
        <m.div
          className={`w-0.5 h-1/3 top-0 right-0 absolute bg-linear-to-b from-transparent via-primary/80 to-transparent ${className}`}
          animate={{ y: ["-100%", "300%"] }}
          transition={{ ...transitionAnimate, delay: duration * 0.25 }}
        />

        {/* Light beam bottom edge */}
        <m.div
          className={`w-1/3 h-0.5 right-0 bottom-0 absolute bg-linear-to-l from-transparent via-primary/80 to-transparent ${className}`}
          animate={{ x: ["100%", "-300%"] }}
          transition={{ ...transitionAnimate, delay: duration * 0.5 }}
        />

        {/* Light beam left edge */}
        <m.div
          className={`w-0.5 h-1/3 left-0 bottom-0 absolute bg-linear-to-t from-transparent via-primary/80 to-transparent ${className}`}
          animate={{ y: ["100%", "-300%"] }}
          transition={{ ...transitionAnimate, delay: duration * 0.75 }}
        />
      </div>
    </LazyMotion>
  );
};
export default LightBeam;
