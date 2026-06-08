import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { FaPersonWalkingArrowRight } from "react-icons/fa6";

/* ─────────────── PALETTE ─────────────── */
const C = {
  cream: "#FBF8F3",
  warm: "#F6EFE4",
  sand: "#EAE0D2",
  sandLight: "#F2EBE0",
  bronze: "#9E6B45",
  bronze2: "#C8975C",
  bronzeGlow: "#E4C49A",
  bronzeLight: "#F0DFC4",
  text: "#261A10",
  textMid: "#6B4F38",
  textLight: "#A68868",
  white: "#FFFFFF",
  accent: "#7A4828",
  rose: "#E8D5C4",
};

/* ─────────────── IMAGES ─────────────── */
const IMGS = {
  hero: "https://media.istockphoto.com/id/1856117770/photo/modern-beauty-salon.jpg?s=612x612&w=0&k=20&c=dVZtsePk2pgbqDXwVkMm-yIw5imnZ2rnkAruR7zf8EA=",
  barber: "https://media.istockphoto.com/id/626416292/photo/the-hands-of-young-barber-making-haircut-to-attractive-man.jpg?s=612x612&w=0&k=20&c=kWoXXYFdXZzXvNfBSNNCT9MMJhPngx-SMBV1asorB2g=",
  blonde: "https://media.istockphoto.com/id/2197259047/video/hairdresser-combing-and-cutting-hair-of-blonde-girl-client-in-hair-salon.jpg?s=640x640&k=20&c=HiG0opcCkCFKqtOVVnXl0iyhsHpzlbgcqMWuGKqP81s=",
  salon2: "https://media.istockphoto.com/id/134052142/photo/hair-salon-situation.jpg?s=612x612&w=0&k=20&c=HM4Tl3ATijpIS1Rv097UHwmZ3OfmqGXkniNLuTCqB0A=",
  color: "https://media.istockphoto.com/id/1165466938/photo/stylist-choosing-color-from-hair-samples-for-woman-in-salon.jpg?s=612x612&w=0&k=20&c=Dyg5TaIWZIMBjXkFPay-yWiCdwX01RJB_KRL6u_KuXM=",
  eyebrow: "https://media.istockphoto.com/id/1973194125/photo/hairdresser-shaping-eyebrows-of-man-client-using-razor-in-barbershop.jpg?s=612x612&w=0&k=20&c=VsiQg5qDRkQB9-BUdvhJMfbc1AeS6uSBFUcHKDC6xo8=",
};

const NAV = [
  { label: "Home", id: "home" },
  { label: "Services", id: "services" },
  { label: "Features", id: "features" },
  { label: "Why Salonique", id: "why" },
  { label: "About Us", id: "about" },
];

/* ─────────────── HOOKS ─────────────── */
function useActiveSection() {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-38% 0px -52% 0px" }
    );
    NAV.forEach(({ id }) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);
  return active;
}

/* ─────────────── SHARED COMPONENTS ─────────────── */
function Reveal({ children, delay = 0, dir = "up" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: dir === "up" ? 40 : dir === "down" ? -40 : 0, x: dir === "left" ? 50 : dir === "right" ? -50 : 0 }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

const Tag = ({ children }) => (
  <span style={{
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "0.58rem", letterSpacing: "0.32em",
    color: C.bronze, textTransform: "uppercase", fontWeight: 600,
  }}>{children}</span>
);

const GLine = ({ w = 48, vertical = false }) => (
  <div style={{
    flexShrink: 0,
    width: vertical ? 1 : w, height: vertical ? w : 1,
    background: `linear-gradient(${vertical ? "180deg" : "90deg"}, ${C.bronze2}, transparent)`,
  }} />
);

/* ─────────────── CURSOR GLOW (magnetic) ─────────────── */
function CursorGlow() {
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const sx = useSpring(mx, { stiffness: 120, damping: 22 });
  const sy = useSpring(my, { stiffness: 120, damping: 22 });
  useEffect(() => {
    const move = (e) => { mx.set(e.clientX - 140); my.set(e.clientY - 140); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <motion.div style={{
      position: "fixed", zIndex: 0, pointerEvents: "none",
      width: 280, height: 280, borderRadius: "50%",
      background: `radial-gradient(circle, ${C.bronzeGlow}28, transparent 70%)`,
      x: sx, y: sy,
    }} />
  );
}

/* ══════════════════════════════════════════
   APP
══════════════════════════════════════════ */
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection();
  const { scrollY } = useScroll();
  const heroImgY = useTransform(scrollY, [0, 700], [0, 120]);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 40));
    return unsub;
  }, [scrollY]);

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", background: C.cream, color: C.text, overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=DM+Sans:wght@300;400;500;600&family=Tenor+Sans&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: ${C.bronze2}; border-radius: 4px; }
        ::selection { background: ${C.bronzeLight}; color: ${C.text}; }
        img { display: block; max-width: 100%; }
        button { cursor: pointer; }
      `}</style>

      <CursorGlow />

      {/* ═══════════════ NAVBAR ═══════════════ */}
      <motion.nav
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
          height: 72,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 3.5rem",
          background: scrolled ? "rgba(251,248,243,0.96)" : "rgba(251,248,243,0.0)",
          borderBottom: scrolled ? `1px solid ${C.sand}` : "1px solid transparent",
          transition: "background 0.45s ease, border-color 0.45s ease, backdrop-filter 0.45s ease",
        }}
      >
        {/* Logo */}
        <motion.div
          onClick={() => go("home")}
          whileHover={{ scale: 1.03 }}
          style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer" }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            border: `1.5px solid ${C.bronze2}`,
            background: C.bronzeLight,
            display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
          }}>
            <img
              src="./Logo1.png"
              alt="Salonique"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML = `<span style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:700;color:${C.bronze}">S</span>`;
              }}
            />
          </div>
          <div>
            <p style={{ fontFamily: "'Tenor Sans', sans-serif", fontSize: "1.22rem", letterSpacing: "0.12em", color: C.text, lineHeight: 1.05 }}>
              SALON<span style={{ color: C.bronze }}>IQUE</span>
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.5rem", letterSpacing: "0.28em", color: C.textLight, textTransform: "uppercase", marginTop: 2 }}>
              Unisex Salon · Est. 2014
            </p>
          </div>
        </motion.div>

        {/* Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          {NAV.map((n) => {
            const isActive = active === n.id;
            return (
              <motion.button
                key={n.id}
                onClick={() => go(n.id)}
                whileHover={{ color: C.bronze }}
                style={{
                  background: "none", border: "none",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.7rem", letterSpacing: "0.16em", textTransform: "uppercase",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? C.bronze : C.textMid,
                  position: "relative", padding: "4px 0",
                  transition: "color 0.3s",
                }}
              >
                {n.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-bar"
                    style={{
                      position: "absolute", bottom: -2, left: 0, right: 0,
                      height: 1.5, borderRadius: 2, background: C.bronze,
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                )}
              </motion.button>
            );
          })}
          <motion.button
            onClick={() => go("about")}
            whileHover={{ background: C.bronze, color: C.white, scale: 1.04, boxShadow: `0 6px 24px ${C.bronze2}50` }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: "transparent", border: `1.5px solid ${C.bronze}`,
              color: C.bronze, padding: "9px 26px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.67rem", letterSpacing: "0.2em", textTransform: "uppercase",
              fontWeight: 600, transition: "all 0.3s",
            }}
          >
            Book Now
          </motion.button>
        </div>
      </motion.nav>

      {/* ═══════════════ HERO ═══════════════ */}
      <section id="home" style={{
        position: "relative", minHeight: "100vh",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        overflow: "hidden",
      }}>

        {/* Left — cream background with content */}
        <div style={{
          position: "relative", zIndex: 2,
          background: C.cream,
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "100px 3.5rem 80px 4rem",
        }}>
          {/* Decorative corner */}
          <div style={{
            position: "absolute", top: 90, left: 0,
            width: 3, height: 120,
            background: `linear-gradient(to bottom, transparent, ${C.bronze2}, transparent)`,
          }} />

          <motion.div
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "2rem" }}
          >
            <GLine w={32} />
            <Tag>India's Premier Unisex Salon</Tag>
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 style={{
              fontSize: "clamp(3rem, 4.8vw, 5rem)",
              fontWeight: 400, lineHeight: 1.06,
              letterSpacing: "-0.01em",
              color: C.text,
            }}>
              Where Every<br />
              <span style={{ fontStyle: "italic", color: C.bronze, fontWeight: 300 }}>Strand Tells</span><br />
              <span style={{ fontWeight: 700 }}>Your Story</span>
            </h1>
          </motion.div>

          {/* Stats inline */}
          <motion.div
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.65 }}
            style={{ display: "flex", gap: "2.5rem", margin: "2rem 0 1.8rem", flexWrap: "wrap" }}
          >
            {[["12+", "Years"], ["20K+", "Clients"], ["4.9★", "Rating"], ["25+", "Experts"]].map(([v, l]) => (
              <div key={l} style={{ borderLeft: `2px solid ${C.bronze2}`, paddingLeft: 14 }}>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.6rem", fontWeight: 600, color: C.bronze, lineHeight: 1 }}>{v}</p>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", color: C.textLight, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 4 }}>{l}</p>
              </div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.92rem", lineHeight: 1.88, fontWeight: 300,
              color: C.textMid, maxWidth: 430, marginBottom: "2rem",
            }}
          >
            A sanctuary of style and confidence. Expert stylists, premium products, and a philosophy that beauty belongs to everyone — regardless of gender or background.
          </motion.p>

          {/* Service chips */}
          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.95 }}
            style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: "2.5rem" }}
          >
            {["Haircuts", "Coloring", "Beard Grooming", "Skincare", "Bridal Styling"].map((chip) => (
              <motion.span
                key={chip}
                whileHover={{ background: C.bronze, color: C.white, borderColor: C.bronze, scale: 1.05 }}
                style={{
                  fontFamily: "'DM Sans',sans-serif", fontSize: "0.63rem",
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  border: `1px solid ${C.sand}`, padding: "6px 16px",
                  color: C.textMid, background: C.white,
                  transition: "all 0.28s",
                }}
              >{chip}</motion.span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.05 }}
            style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
          >
            <motion.button
              onClick={() => go("services")}
              whileHover={{ background: C.accent, scale: 1.04, boxShadow: `0 10px 32px ${C.bronze}55` }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: C.bronze, color: C.white, border: "none",
                padding: "14px 38px",
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase",
                fontWeight: 600, transition: "all 0.3s",
              }}
            >Explore Services</motion.button>
            <motion.button
              onClick={() => go("about")}
              whileHover={{ background: C.sandLight, scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: "transparent",
                border: `1.5px solid ${C.sand}`,
                color: C.textMid, padding: "14px 38px",
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase",
                fontWeight: 500, transition: "all 0.3s",
              }}
            >Our Story</motion.button>
          </motion.div>

          {/* Walk-in badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.25 }}
            style={{
              marginTop: "2.8rem",
              display: "inline-flex", alignItems: "center", gap: 14,
              background: C.white, border: `1px solid ${C.sand}`,
              padding: "14px 20px",
              boxShadow: `0 4px 28px ${C.bronze2}18`,
              alignSelf: "flex-start",
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
              style={{
                width: 38, height: 38, borderRadius: "50%",
                background: C.bronzeLight,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1rem",
              }}
            ><FaPersonWalkingArrowRight size={28} /></motion.div>
            <div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "0.8rem", color: C.text }}>Walk-ins Welcome</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", color: C.textLight, letterSpacing: "0.1em", marginTop: 2 }}>Open 7 days · 9 AM – 9 PM</p>
            </div>
          </motion.div>
        </div>

        {/* Right — image mosaic */}
        <div style={{ position: "relative", overflow: "hidden" }}>
          {/* Main image with parallax */}
          <motion.div style={{ position: "absolute", inset: 0, y: heroImgY }}>
            <img src={IMGS.hero} alt="Salon" style={{ width: "100%", height: "115%", objectFit: "cover" }} />
          </motion.div>
          {/* Gradient fade on left edge */}
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(to right, ${C.cream}00, ${C.cream}60 12%, transparent 35%)`,
            zIndex: 2,
          }} />
          {/* Floating inset small images */}
          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            style={{
              position: "absolute", bottom: "12%", right: "6%",
              width: 150, height: 190,
              border: `3px solid ${C.white}`,
              overflow: "hidden", zIndex: 3,
              boxShadow: `0 12px 40px rgba(0,0,0,0.18)`,
            }}
          >
            <motion.img src={IMGS.color} alt=""
              whileHover={{ scale: 1.1 }} transition={{ duration: 0.7 }}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.9 }}
            style={{
              position: "absolute", top: "15%", right: "4%",
              width: 120, height: 140,
              border: `3px solid ${C.white}`,
              overflow: "hidden", zIndex: 3,
              boxShadow: `0 8px 32px rgba(0,0,0,0.15)`,
            }}
          >
            <motion.img src={IMGS.barber} alt=""
              whileHover={{ scale: 1.1 }} transition={{ duration: 0.7 }}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </motion.div>
          {/* Bronze label */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
            style={{
              position: "absolute", bottom: "6%", left: "8%", zIndex: 3,
              background: C.bronze, padding: "10px 20px",
            }}
          >
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.28em", color: C.white, textTransform: "uppercase" }}>Est. 2014 · Hydrabad</p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ MARQUEE ═══════════════ */}
      <div style={{ background: C.bronze, padding: "13px 0", overflow: "hidden" }}>
        <motion.div
          animate={{ x: [0, -1400] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          style={{ display: "flex", gap: "4rem", whiteSpace: "nowrap", alignItems: "center" }}
        >
          {Array(8).fill(0).map((_, i) =>
            ["✦ Precision Cuts", "✦ Expert Coloring", "✦ Beard & Eyebrow Grooming", "✦ Bridal Styling", "✦ Skin Treatments", "✦ Unisex Excellence"].map((t) => (
              <span key={`${i}${t}`} style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", letterSpacing: "0.3em", color: C.white, textTransform: "uppercase" }}>{t}</span>
            ))
          )}
        </motion.div>
      </div>

      {/* ═══════════════ SERVICES ═══════════════ */}
      <section id="services" style={{ padding: "8rem 3.5rem", background: C.white }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "5rem" }}>
          <Reveal>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1rem" }}>
                <GLine w={36} />
                <Tag>Our Services</Tag>
              </div>
              <h2 style={{ fontSize: "clamp(2.2rem, 4vw, 3.8rem)", fontWeight: 400, lineHeight: 1.1 }}>
                Curated for<br /><em style={{ fontStyle: "italic", color: C.bronze, fontWeight: 300 }}>every soul</em>
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.15} dir="left">
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", color: C.textLight, lineHeight: 1.85, maxWidth: 300, fontWeight: 300, textAlign: "right" }}>
              From precision cuts to vivid transformations — our menu is as diverse as our clientele.
            </p>
          </Reveal>
        </div>

        {/* ROW 1 */}
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 0.72fr", gap: 3, minHeight: 380 }}>
            <div style={{ overflow: "hidden", position: "relative" }}>
              <motion.img src={IMGS.barber} alt="Haircut"
                whileHover={{ scale: 1.06 }} transition={{ duration: 0.8 }}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", top: 18, left: 18, background: C.bronze, padding: "4px 14px" }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.58rem", letterSpacing: "0.24em", color: C.white, textTransform: "uppercase" }}>Signature</span>
              </div>
            </div>
            <div style={{ padding: "3rem 2.5rem", background: C.warm, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: C.bronze2, textTransform: "uppercase", marginBottom: "1rem" }}>01 — Haircuts</p>
              <h3 style={{ fontSize: "2rem", fontWeight: 400, lineHeight: 1.2, marginBottom: "1.2rem" }}>Precision<br /><em style={{ fontStyle: "italic", color: C.bronze }}>Crafted</em> Cuts</h3>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", color: C.textMid, lineHeight: 1.85, fontWeight: 300, marginBottom: "1.6rem" }}>
                Tailored to your face shape, lifestyle, and personality — from textured crops to flowing layers.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <GLine w={24} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.67rem", letterSpacing: "0.18em", color: C.bronze, textTransform: "uppercase" }}>From ₹499</span>
              </div>
            </div>
            <div style={{ overflow: "hidden" }}>
              <motion.img src={IMGS.salon2} alt=""
                whileHover={{ scale: 1.07 }} transition={{ duration: 0.8 }}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </Reveal>

        {/* ROW 2 */}
        <Reveal delay={0.1}>
          <div style={{ display: "grid", gridTemplateColumns: "0.85fr 1.8fr", gap: 3, minHeight: 360, marginTop: 3 }}>
            <div style={{ padding: "3rem 2.5rem", background: C.sand, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: C.bronze2, textTransform: "uppercase", marginBottom: "1rem" }}>02 — Coloring</p>
              <h3 style={{ fontSize: "2rem", fontWeight: 400, lineHeight: 1.2, marginBottom: "1.2rem" }}>Vivid<br /><em style={{ fontStyle: "italic", color: C.bronze }}>Colour</em><br />Mastery</h3>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", color: C.textMid, lineHeight: 1.85, fontWeight: 300, marginBottom: "1.6rem" }}>
                Balayage, ombré, fantasy colour — our experts blend science and artistry.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <GLine w={24} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.67rem", letterSpacing: "0.18em", color: C.bronze, textTransform: "uppercase" }}>From ₹1,299</span>
              </div>
            </div>
            <div style={{ overflow: "hidden", position: "relative" }}>
              <motion.img src={IMGS.color} alt="Coloring"
                whileHover={{ scale: 1.04 }} transition={{ duration: 0.8 }}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", top: 18, right: 18, background: C.white, border: `1px solid ${C.sand}`, padding: "4px 14px" }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.58rem", letterSpacing: "0.24em", color: C.bronze, textTransform: "uppercase" }}>Popular</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* ROW 3 */}
        <Reveal delay={0.15}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 3, minHeight: 310, marginTop: 3 }}>
            <div style={{ overflow: "hidden" }}>
              <motion.img src={IMGS.eyebrow} alt="Grooming"
                whileHover={{ scale: 1.07 }} transition={{ duration: 0.8 }}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ padding: "3rem 2.5rem", background: C.bronzeLight, display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: C.accent, textTransform: "uppercase", marginBottom: "1rem" }}>03 — Grooming</p>
              <h3 style={{ fontSize: "2rem", fontWeight: 400, lineHeight: 1.2, marginBottom: "1.2rem", color: C.text }}>
                Refined<br /><em style={{ fontStyle: "italic", color: C.accent }}>Masculine</em><br />Grooming
              </h3>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", color: C.textMid, lineHeight: 1.85, fontWeight: 300 }}>
                Hot towel shaves, beard sculpting, eyebrow threading — grooming as an art form.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "1.6rem" }}>
                <GLine w={24} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.67rem", letterSpacing: "0.18em", color: C.accent, textTransform: "uppercase" }}>From ₹349</span>
              </div>
            </div>
            <div style={{ overflow: "hidden" }}>
              <motion.img src={IMGS.blonde} alt=""
                whileHover={{ scale: 1.07 }} transition={{ duration: 0.8 }}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section id="features" style={{ padding: "8rem 3.5rem", background: C.cream, position: "relative", overflow: "hidden" }}>
        {/* Watermark */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%) rotate(-8deg)",
          fontSize: "clamp(8rem, 22vw, 20rem)", fontWeight: 700, fontStyle: "italic",
          fontFamily: "'Cormorant Garamond', serif",
          color: `${C.bronze2}06`, letterSpacing: "0.04em",
          userSelect: "none", pointerEvents: "none", whiteSpace: "nowrap",
        }}>Artistry</div>

        <div style={{ position: "relative" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: "5rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: "1.2rem" }}>
                <GLine w={40} />
                <Tag>Why We're Different</Tag>
                <GLine w={40} />
              </div>
              <h2 style={{ fontSize: "clamp(2.2rem, 4vw, 3.8rem)", fontWeight: 400, lineHeight: 1.1 }}>
                Every detail,<br /><em style={{ fontStyle: "italic", color: C.bronze, fontWeight: 300 }}>intentional</em>
              </h2>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem", color: C.textLight, maxWidth: 480, margin: "1.2rem auto 0", lineHeight: 1.8, fontWeight: 300 }}>
                Six pillars that define the Salonique experience and keep our clients coming back.
              </p>
            </div>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>

            {/* ── BIG FEATURE ROWS ── */}
            {[
              {
                n: "01",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
                title: "Unisex Sanctuary",
                body: "No gender barriers, no judgement — just extraordinary service for every individual who walks through our doors. Our space, language, and services are designed for all.",
                side: "left",
                img: "https://media.istockphoto.com/id/1251555171/video/vintage-barbershop-interior-movement-along-the-chairs-wooden-tables-and-mirrors-stylish-hair.jpg?s=640x640&k=20&c=BbxeXTPFa5JJMKp-M0ubjGNPdtY634PE4gKW9MiorRE=",
                imgLabel: "Inclusive Space",
              },
              {
                n: "02",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                ),
                title: "Premium International Products",
                body: "Kérastase, Wella Professionals, Redken, L'Oréal Professionnel — we invest in products that protect your hair while delivering transformational results.",
                side: "right",
                img: "https://media.istockphoto.com/id/1165466938/photo/stylist-choosing-color-from-hair-samples-for-woman-in-salon.jpg?s=612x612&w=0&k=20&c=Dyg5TaIWZIMBjXkFPay-yWiCdwX01RJB_KRL6u_KuXM=",
                imgLabel: "Premium Range",
              },
              {
                n: "03",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                  </svg>
                ),
                title: "Internationally Trained Stylists",
                body: "Our team trains annually in international fashion capitals. They bring global trends and techniques to your appointment, tailored to your unique style vision.",
                side: "left",
                img: "https://media.istockphoto.com/id/965181864/photo/rear-view-of-young-man-getting-a-modern-haircut.jpg?s=612x612&w=0&k=20&c=UpN1sw334_CChq25d0G6mN3Hoynn1w61vZGZihaPeZo=",
                imgLabel: "Expert Craftsmanship",
              },
            ].map((f, i) => (
              <Reveal key={f.n} delay={i * 0.12}>
                <motion.div
                  initial="rest"
                  whileHover="hover"
                  style={{
                    display: "grid",
                    gridTemplateColumns: f.side === "left" ? "220px 1fr 340px" : "340px 1fr 220px",
                    minHeight: 220,
                    borderTop: `1px solid ${C.sand}`,
                  }}
                >
                  {/* LEFT SIDE: icon block (left rows) OR image (right rows) */}
                  {f.side === "left" ? (
                    // Icon block
                    <motion.div
                      variants={{ rest: { background: C.warm }, hover: { background: C.sand } }}
                      transition={{ duration: 0.4 }}
                      style={{
                        display: "flex", flexDirection: "column", justifyContent: "center",
                        alignItems: "center", padding: "2.5rem", gap: "1rem",
                      }}
                    >
                      <motion.div
                        variants={{
                          rest: { background: "rgba(200,151,92,0.1)", color: C.bronze2, rotate: 0, scale: 1 },
                          hover: { background: C.bronze2, color: C.white, rotate: 8, scale: 1.1 },
                        }}
                        transition={{ duration: 0.4 }}
                        style={{
                          width: 72, height: 72, borderRadius: "50%",
                          border: `1.5px solid ${C.bronze2}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        {f.icon}
                      </motion.div>
                      <motion.span
                        variants={{ rest: { color: C.textLight }, hover: { color: C.bronze } }}
                        style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 600 }}
                      >{f.n}</motion.span>
                    </motion.div>
                  ) : (
                    // Image block (left of right rows)
                    <div style={{ overflow: "hidden", position: "relative" }}>
                      <motion.img
                        src={f.img} alt={f.title}
                        variants={{ rest: { scale: 1, filter: "brightness(0.9)" }, hover: { scale: 1.06, filter: "brightness(1)" } }}
                        transition={{ duration: 0.8 }}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <motion.div
                        variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
                        transition={{ duration: 0.4 }}
                        style={{
                          position: "absolute", bottom: 0, left: 0, right: 0,
                          background: "linear-gradient(to top, rgba(38,26,16,0.75), transparent)",
                          padding: "1.2rem 1.5rem",
                        }}
                      >
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.22em", color: "rgba(251,248,243,0.85)", textTransform: "uppercase" }}>{f.imgLabel}</span>
                      </motion.div>
                    </div>
                  )}

                  {/* MIDDLE: text */}
                  <motion.div
                    variants={{ rest: { background: C.white }, hover: { background: C.cream } }}
                    transition={{ duration: 0.4 }}
                    style={{ display: "flex", alignItems: "center", padding: "3rem", gap: "2rem" }}
                  >
                    <div style={{ flex: 1 }}>
                      <motion.div
                        variants={{ rest: { width: 0 }, hover: { width: 48 } }}
                        transition={{ duration: 0.45 }}
                        style={{ height: 1, background: C.bronze2, marginBottom: "1rem" }}
                      />
                      <h3 style={{ fontSize: "1.65rem", fontWeight: 500, marginBottom: "0.9rem", lineHeight: 1.25 }}>{f.title}</h3>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.83rem", color: C.textMid, lineHeight: 1.88, fontWeight: 300, maxWidth: 520 }}>{f.body}</p>
                    </div>
                  </motion.div>

                  {/* RIGHT SIDE: image (left rows) OR icon block (right rows) */}
                  {f.side === "left" ? (
                    // Image block (right of left rows)
                    <div style={{ overflow: "hidden", position: "relative" }}>
                      <motion.img
                        src={f.img} alt={f.title}
                        variants={{ rest: { scale: 1, filter: "brightness(0.9)" }, hover: { scale: 1.06, filter: "brightness(1)" } }}
                        transition={{ duration: 0.8 }}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                      <motion.div
                        variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
                        transition={{ duration: 0.4 }}
                        style={{
                          position: "absolute", bottom: 0, left: 0, right: 0,
                          background: "linear-gradient(to top, rgba(38,26,16,0.75), transparent)",
                          padding: "1.2rem 1.5rem",
                        }}
                      >
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.22em", color: "rgba(251,248,243,0.85)", textTransform: "uppercase" }}>{f.imgLabel}</span>
                      </motion.div>
                    </div>
                  ) : (
                    // Icon block (right of right rows)
                    <motion.div
                      variants={{ rest: { background: C.warm }, hover: { background: C.sand } }}
                      transition={{ duration: 0.4 }}
                      style={{
                        display: "flex", flexDirection: "column", justifyContent: "center",
                        alignItems: "center", padding: "2.5rem", gap: "1rem",
                      }}
                    >
                      <motion.div
                        variants={{
                          rest: { background: "rgba(200,151,92,0.1)", color: C.bronze2, rotate: 0, scale: 1 },
                          hover: { background: C.bronze2, color: C.white, rotate: 8, scale: 1.1 },
                        }}
                        transition={{ duration: 0.4 }}
                        style={{
                          width: 72, height: 72, borderRadius: "50%",
                          border: `1.5px solid ${C.bronze2}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        {f.icon}
                      </motion.div>
                      <motion.span
                        variants={{ rest: { color: C.textLight }, hover: { color: C.bronze } }}
                        style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 600 }}
                      >{f.n}</motion.span>
                    </motion.div>
                  )}
                </motion.div>
              </Reveal>
            ))}

            {/* ── BOTTOM 3 CARDS ── */}
            <Reveal delay={0.1}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: `1px solid ${C.sand}` }}>
                {[
                  {
                    n: "04",
                    icon: (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                      </svg>
                    ),
                    title: "Zero Wait Policy",
                    body: "Precision scheduling so your time is always honoured. Book online, arrive, and begin immediately.",
                  },
                  {
                    n: "05",
                    icon: (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    ),
                    title: "Personal Consultation",
                    body: "Every appointment opens with a dedicated style consult — your vision guides every decision we make.",
                  },
                  {
                    n: "06",
                    icon: (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
                      </svg>
                    ),
                    title: "Luxury Ambience",
                    body: "Warm lighting, curated playlist, artisanal beverages — the atmosphere makes the experience complete.",
                  },
                ].map((f, i) => (
                  <motion.div
                    key={f.n}
                    initial="rest"
                    whileHover="hover"
                    style={{
                      padding: "3.5rem 2.8rem",
                      borderRight: i < 2 ? `1px solid ${C.sand}` : "none",
                      cursor: "default",
                      position: "relative", overflow: "hidden",
                    }}
                  >
                    {/* Sweep bg */}
                    <motion.div
                      variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      style={{
                        position: "absolute", inset: 0,
                        background: C.warm,
                        transformOrigin: "left",
                        zIndex: 0,
                      }}
                    />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <motion.div
                        variants={{ rest: { y: 0, color: C.bronze2 }, hover: { y: -4, color: C.bronze } }}
                        transition={{ duration: 0.35 }}
                        style={{ marginBottom: "1.2rem" }}
                      >
                        {f.icon}
                      </motion.div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.8rem" }}>
                        <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: C.textLight, textTransform: "uppercase", fontWeight: 600 }}>{f.n}</span>
                        <motion.div
                          variants={{ rest: { width: 0 }, hover: { width: 28 } }}
                          style={{ height: 1, background: C.bronze2 }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.35rem", fontWeight: 500, marginBottom: "0.9rem", lineHeight: 1.25 }}>{f.title}</h3>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", color: C.textLight, lineHeight: 1.85, fontWeight: 300 }}>{f.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ QUOTE BANNER ═══════════════ */}
      <div style={{ position: "relative", height: "52vh", overflow: "hidden" }}>
        <motion.img
          src={IMGS.salon2} alt=""
          initial={{ scale: 1.1 }} whileInView={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(38,26,16,0.5)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 2rem" }}>
          <Reveal>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: "1.5rem" }}>
                <GLine w={36} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.58rem", letterSpacing: "0.32em", color: C.bronzeGlow, textTransform: "uppercase", fontWeight: 600 }}>A Word From Our Studio</span>
                <GLine w={36} />
              </div>
              <p style={{
                fontSize: "clamp(1.6rem, 3.5vw, 3rem)", fontWeight: 300,
                fontStyle: "italic", color: C.white, lineHeight: 1.45,
                maxWidth: 720, margin: "0 auto",
              }}>
                "Every visit is a ritual. Every client, a canvas.<br />
                Every transformation, a work of art."
              </p>
              <motion.div
                initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.9, delay: 0.3 }}
                style={{ width: 80, height: 1, background: C.bronze2, margin: "1.8rem auto 0" }}
              />
            </div>
          </Reveal>
        </div>
      </div>

      {/* ═══════════════ WHY SALONIQUE ═══════════════ */}
      <section id="why" style={{ padding: "8rem 3.5rem", background: C.warm }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "start" }}>
          {/* Left: stacked images */}
          <div style={{ position: "relative" }}>
            <Reveal dir="right">
              <div style={{ position: "relative", height: 500, overflow: "hidden" }}>
                <motion.img src={IMGS.blonde} alt=""
                  whileHover={{ scale: 1.04 }} transition={{ duration: 0.8 }}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45, duration: 0.7 }}
                  style={{
                    position: "absolute", bottom: -30, right: -30,
                    background: C.bronze, padding: "2rem 2.2rem",
                    textAlign: "center", minWidth: 160,
                  }}
                >
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "2.8rem", fontWeight: 700, color: C.white, lineHeight: 1 }}>12+</p>
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.22em", color: "rgba(255,255,255,0.75)", textTransform: "uppercase", marginTop: 8 }}>Years of Mastery</p>
                </motion.div>
              </div>
              <div style={{ marginTop: "3.5rem", height: 200, overflow: "hidden" }}>
                <motion.img src={IMGS.eyebrow} alt=""
                  whileHover={{ scale: 1.06 }} transition={{ duration: 0.7 }}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
                />
              </div>
            </Reveal>
          </div>

          {/* Right */}
          <div style={{ paddingTop: "1.5rem" }}>
            <Reveal>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
                <GLine w={36} />
                <Tag>Why Salonique</Tag>
              </div>
              <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 3.2rem)", fontWeight: 400, lineHeight: 1.15, marginBottom: "1.5rem" }}>
                The difference is<br />in how we make<br /><em style={{ color: C.bronze, fontStyle: "italic" }}>you feel</em>
              </h2>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.9rem", color: C.textMid, lineHeight: 1.9, fontWeight: 300, marginBottom: "3rem" }}>
                We didn't build just a salon — we built a community. A space where skill meets empathy, where every person walks out looking and feeling extraordinary.
              </p>
            </Reveal>

            {[
              { n: "01", t: "Decade of Mastery", b: "Over a decade shaping confidence across India — thousands who return again and again." },
              { n: "02", t: "Award-Winning Team", b: "Recognised nationally for creative excellence, client satisfaction, and innovative artistry." },
              { n: "03", t: "Inclusive Philosophy", b: "Beauty has no boundaries here. Our language, space, and services welcome every identity." },
              { n: "04", t: "Transparent Pricing", b: "No hidden charges, no pressure upsells — honest pricing for extraordinary results." },
            ].map((p, i) => (
              <Reveal key={p.n} delay={i * 0.1}>
                <motion.div
                  initial="rest" whileHover="hover"
                  style={{
                    display: "flex", gap: "2rem", alignItems: "flex-start",
                    padding: "1.6rem 0",
                    borderTop: `1px solid ${C.sand}`,
                    cursor: "default",
                  }}
                >
                  <motion.span
                    variants={{ rest: { color: C.textLight }, hover: { color: C.bronze } }}
                    transition={{ duration: 0.25 }}
                    style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.12em", minWidth: 26, paddingTop: 4 }}
                  >{p.n}</motion.span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <p style={{ fontSize: "1.15rem", fontWeight: 500, marginBottom: "0.4rem" }}>{p.t}</p>
                      <motion.div
                        variants={{ rest: { width: 0 }, hover: { width: 30 } }}
                        style={{ height: 1, background: C.bronze2, marginBottom: 4 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", color: C.textLight, lineHeight: 1.8, fontWeight: 300 }}>{p.b}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ ABOUT US ═══════════════ */}
      <section id="about" style={{ padding: "8rem 3.5rem", background: C.white }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: "5.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: "1.2rem" }}>
              <GLine w={40} />
              <Tag>About Salonique</Tag>
              <GLine w={40} />
            </div>
            <h2 style={{ fontSize: "clamp(2.2rem, 4.5vw, 4rem)", fontWeight: 400, lineHeight: 1.1 }}>
              Born from passion,<br /><em style={{ fontStyle: "italic", color: C.bronze, fontWeight: 300 }}>refined by artistry</em>
            </h2>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 4, minHeight: 560 }}>
          {/* Image mosaic */}
          <Reveal dir="right">
            <div style={{ display: "grid", gridTemplateRows: "1.4fr 1fr", gridTemplateColumns: "1.5fr 1fr", gap: 4, height: "100%" }}>
              <div style={{ gridRow: "1/3", gridColumn: "1/2", overflow: "hidden" }}>
                <motion.img src={IMGS.hero} alt=""
                  whileHover={{ scale: 1.04 }} transition={{ duration: 0.8 }}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ overflow: "hidden" }}>
                <motion.img src={IMGS.color} alt=""
                  whileHover={{ scale: 1.07 }} transition={{ duration: 0.7 }}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ overflow: "hidden" }}>
                <motion.img src={IMGS.barber} alt=""
                  whileHover={{ scale: 1.07 }} transition={{ duration: 0.7 }}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          </Reveal>

          {/* Content panel */}
          <Reveal delay={0.2}>
            <div style={{
              background: C.warm, padding: "3.5rem",
              height: "100%", display: "flex", flexDirection: "column", justifyContent: "center",
            }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.92rem", color: C.textMid, lineHeight: 1.95, fontWeight: 300, marginBottom: "1.8rem" }}>
                Salonique was founded in 2014 with one vision — a space where <em style={{ fontStyle: "italic", color: C.bronze }}>every person</em> could experience world-class beauty in an atmosphere of warmth and sophistication.
              </p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.92rem", color: C.textMid, lineHeight: 1.95, fontWeight: 300, marginBottom: "3rem" }}>
                Our 25+ internationally trained stylists bring creativity and precision to every appointment. We are not just a salon — we are a community built on trust, craft, and the belief that everyone deserves to feel extraordinary.
              </p>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "3rem", paddingBottom: "3rem", borderBottom: `1px solid ${C.sand}` }}>
                {[["25+", "Expert Stylists"], ["20K+", "Happy Clients"], ["4.9★", "Google Rating"], ["8", "National Awards"]].map(([v, l]) => (
                  <motion.div key={l} whileHover={{ x: 4 }} style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <div style={{ width: 3, height: 36, background: `linear-gradient(to bottom, ${C.bronze2}, transparent)` }} />
                    <div>
                      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.7rem", fontWeight: 600, color: C.bronze, lineHeight: 1 }}>{v}</p>
                      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", color: C.textLight, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: 4 }}>{l}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Address */}
              <div style={{ marginBottom: "2.5rem" }}>
                <Tag>Find Us</Tag>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", color: C.textMid, lineHeight: 1.75, marginTop: 10 }}>
                  12, Anna Salai, Hyderabad<br />Telangana, 500 001<br />Open daily · 9 AM – 9 PM
                </p>
              </div>

              <motion.button
                onClick={() => go("home")}
                whileHover={{ background: C.accent, scale: 1.04, boxShadow: `0 10px 32px ${C.bronze}55` }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: C.bronze, color: C.white, border: "none",
                  padding: "15px 42px", alignSelf: "flex-start",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase",
                  fontWeight: 600, transition: "all 0.3s",
                }}
              >Book Your Appointment</motion.button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer style={{ background: C.text, color: C.cream, padding: "5.5rem 3.5rem 2.5rem" }}>
        {/* Top strip */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingBottom: "3.5rem", marginBottom: "3.5rem", borderBottom: `1px solid rgba(250,247,242,0.1)` }}>
          <Reveal>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.8rem" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", border: `1.5px solid ${C.bronze2}`, background: "rgba(200,151,92,0.18)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <img src="./Logo1.png" alt=""
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </div>
                <p style={{ fontFamily: "'Tenor Sans',sans-serif", fontSize: "1.3rem", letterSpacing: "0.1em", color: C.cream }}>
                  SALON<span style={{ color: C.bronze2 }}>IQUE</span>
                </p>
              </div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", color: "rgba(250,247,242,0.45)", lineHeight: 1.8, maxWidth: 260, fontWeight: 300 }}>
                India's premier unisex salon — where every strand tells a story of excellence and every visit leaves you transformed.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <motion.button
              onClick={() => go("about")}
              whileHover={{ background: C.bronze2, color: C.white, scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                background: "transparent", border: `1.5px solid ${C.bronze2}`,
                color: C.bronze2, padding: "12px 34px",
                fontFamily: "'DM Sans',sans-serif",
                fontSize: "0.7rem", letterSpacing: "0.22em", textTransform: "uppercase",
                fontWeight: 600, transition: "all 0.3s",
              }}
            >Book an Appointment</motion.button>
          </Reveal>
        </div>

        {/* Links grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2.5rem", marginBottom: "4rem" }}>
          {[
            { t: "Navigate", links: ["Home", "Services", "Features", "Why Salonique", "About Us"] },
            { t: "Services", links: ["Precision Haircuts", "Colour & Highlights", "Beard Grooming", "Skin Treatments", "Bridal Styling"] },
            { t: "Connect", links: ["Instagram", "Facebook", "WhatsApp Us", "Book Online", "Reviews"] },
            { t: "Contact", links: ["12, Anna Salai, Hyderabad", "Telangana — 500 001", "+91 98765 43210", "hello@salonique.in", "Open 9 AM – 9 PM"] },
          ].map((col) => (
            <div key={col.t}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.58rem", letterSpacing: "0.3em", color: C.bronze2, textTransform: "uppercase", marginBottom: "1.4rem", fontWeight: 600 }}>{col.t}</p>
              {col.links.map((l) => (
                <p key={l}
                  style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", color: "rgba(250,247,242,0.42)", marginBottom: "0.65rem", cursor: "pointer", transition: "color 0.3s", fontWeight: 300, lineHeight: 1.5 }}
                  onMouseEnter={(e) => e.target.style.color = C.bronze2}
                  onMouseLeave={(e) => e.target.style.color = "rgba(250,247,242,0.42)"}
                >{l}</p>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: `1px solid rgba(250,247,242,0.08)`, paddingTop: "1.8rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.68rem", color: "rgba(250,247,242,0.28)", letterSpacing: "0.1em" }}>
            © 2026 Salonique. All rights reserved. · Hyderabad, Telangana
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy Policy", "Terms of Service", "Sitemap"].map((l) => (
              <p key={l}
                style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.68rem", color: "rgba(250,247,242,0.28)", cursor: "pointer", transition: "color 0.3s", letterSpacing: "0.1em" }}
                onMouseEnter={(e) => e.target.style.color = C.bronze2}
                onMouseLeave={(e) => e.target.style.color = "rgba(250,247,242,0.28)"}
              >{l}</p>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}