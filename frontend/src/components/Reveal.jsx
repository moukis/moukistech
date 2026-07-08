import { motion } from "framer-motion";

export function Reveal({ children, delay = 0, y = 30, className = "", as = "div" }) {
  const M = motion[as] || motion.div;
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  );
}

export function Overline({ children, className = "" }) {
  return (
    <span className={`font-mono-tech text-xs uppercase tracking-[0.25em] text-[#00E5FF] ${className}`}>
      {children}
    </span>
  );
}
