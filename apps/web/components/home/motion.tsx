"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

type AnimatedProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
};

type GroupProps = {
  children: React.ReactNode;
  className?: string;
  amount?: number;
  stagger?: number;
  delayChildren?: number;
};

type ScrollFloatProps = {
  children: React.ReactNode;
  className?: string;
  offset?: number;
};

type FoldOnScrollProps = {
  children: React.ReactNode;
  className?: string;
};

type DeckRevealProps = {
  children: React.ReactNode;
  className?: string;
};

const revealEase = [0.22, 1, 0.36, 1] as const;

const revealVariants = {
  hidden: { opacity: 0, y: 48, scale: 0.975 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.92, ease: revealEase },
  },
};

export function Reveal({
  children,
  className,
  delay = 0,
  amount = 0.12,
}: AnimatedProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={revealVariants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({
  children,
  className,
  amount = 0.12,
  stagger = 0.16,
  delayChildren = 0.14,
}: GroupProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: Omit<AnimatedProps, "delay" | "amount">) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={revealVariants}>
      {children}
    </motion.div>
  );
}

export function StaggerGroup({ children, className }: AnimatedProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.11,
            delayChildren: 0.08,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: AnimatedProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 32 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.92, ease: revealEase },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function TextReveal({
  children,
  className,
  delay = 0,
  amount = 0.06,
}: AnimatedProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ y: 24, opacity: 0.96, filter: "blur(2px)" }}
      whileInView={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.9, delay, ease: revealEase }}
    >
      {children}
    </motion.div>
  );
}

export function FloatingPanel({ children, className }: AnimatedProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rawY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [20, -20],
  );
  const y = useSpring(rawY, {
    stiffness: 120,
    damping: 22,
    mass: 0.5,
  });

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}

export function ScrollFloat({
  children,
  className,
  offset = 32,
}: ScrollFloatProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rawY = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [offset, -offset * 0.45],
  );
  const y = useSpring(rawY, {
    stiffness: 110,
    damping: 24,
    mass: 0.7,
  });

  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}

export function FoldOnScroll({ children, className }: FoldOnScrollProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    mass: 0.5,
  });

  const scale = useTransform(
    progress,
    [0, 1],
    reduceMotion ? [1, 1] : [1, 0.94],
  );
  const rotateX = useTransform(
    progress,
    [0, 1],
    reduceMotion ? [0, 0] : [0, -10],
  );
  const y = useTransform(progress, [0, 1], reduceMotion ? [0, 0] : [0, -52]);
  const opacity = useTransform(
    progress,
    [0, 1],
    reduceMotion ? [1, 1] : [1, 0.82],
  );

  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={cn("origin-top", className)}
      style={{
        scale,
        rotateX,
        y,
        opacity,
        transformPerspective: 1800,
      }}
    >
      {children}
    </motion.div>
  );
}

export function DeckRevealOnScroll({ children, className }: DeckRevealProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start center"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 24,
    mass: 0.55,
  });

  const y = useTransform(progress, [0, 1], reduceMotion ? [0, 0] : [-96, 0]);
  const opacity = useTransform(
    progress,
    [0, 1],
    reduceMotion ? [1, 1] : [0.52, 1],
  );
  const scale = useTransform(
    progress,
    [0, 1],
    reduceMotion ? [1, 1] : [0.965, 1],
  );

  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ y, opacity, scale }}>
      {children}
    </motion.div>
  );
}

export function HoverCard({
  children,
  className,
}: Omit<AnimatedProps, "delay" | "amount">) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      whileHover={{ y: -10, scale: 1.01 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: "spring", stiffness: 220, damping: 24, mass: 0.65 }}
    >
      {children}
    </motion.div>
  );
}
