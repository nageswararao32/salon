import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── palette ── */
const C = {
  cream: "#FBF8F3", warm: "#F6EFE4", sand: "#EAE0D2",
  bronze: "#9E6B45", bronze2: "#C8975C", bronzeLight: "#F0DFC4",
  text: "#261A10", textMid: "#6B4F38", textLight: "#A68868",
  white: "#FFFFFF", accent: "#7A4828", green: "#4CAF50",
};

/* ── DUMMY DATA ── */
const SHOPS = [
  {
    id: 1,
    name: "Salonique – Chennai Central",
    address: "124, Anna Salai, Teynampet, Chennai, TN 600018",
    phone: "+91 98765 43210",
    whatsapp: "919959441031",
    hours: "9 AM – 9 PM",
    img: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200&q=80",
    rating: "4.9★",
  },
  {
    id: 2,
    name: "Salonique – Tirupati",
    address: "18, Air Bypass Road, Tirupati, AP 517501",
    phone: "+91 91234 56789",
    whatsapp: "919959441031",
    hours: "10 AM – 8 PM",
    img: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1200&q=80",
    rating: "4.8★",
  },
  {
    id: 3,
    name: "Salonique – Vellore",
    address: "12, Anna Salai, Vellore, TN 632001",
    phone: "+91 99887 76655",
    whatsapp: "919959441031",
    hours: "9 AM – 9 PM",
    img: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=1200&q=80",
    rating: "4.8★",
  },
  {
    id: 4,
    name: "Salonique – Hyderabad",
    address: "55, Road No. 36, Jubilee Hills, Hyderabad, TS 500033",
    phone: "+91 90000 11223",
    whatsapp: "919959441031",
    hours: "9:30 AM – 8:30 PM",
    img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80",
    rating: "4.7★",
  },
  {
    id: 5,
    name: "Salonique – Bangalore",
    address: "89, MG Road, Ashok Nagar, Bengaluru, KA 560001",
    phone: "+91 88776 55443",
    whatsapp: "919959441031",
    hours: "9 AM – 9 PM",
    img: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200&q=80",
    rating: "4.9★",
  },
];

const SERVICE_CATEGORIES = [
  {
    cat: "Hair",
    icon: "✂",
    services: [
      { id: "h1", name: "Precision Haircut", price: 499, duration: "45 min" },
      { id: "h2", name: "Hair Wash & Blow Dry", price: 349, duration: "30 min" },
      { id: "h3", name: "Hair Spa Treatment", price: 899, duration: "60 min" },
      { id: "h4", name: "Keratin Treatment", price: 2499, duration: "120 min" },
    ],
  },
  {
    cat: "Color",
    icon: "◈",
    services: [
      { id: "c1", name: "Global Colour", price: 1299, duration: "90 min" },
      { id: "c2", name: "Balayage / Highlights", price: 2999, duration: "150 min" },
      { id: "c3", name: "Ombré", price: 2499, duration: "120 min" },
      { id: "c4", name: "Root Touch-Up", price: 799, duration: "60 min" },
    ],
  },
  {
    cat: "Grooming",
    icon: "◆",
    services: [
      { id: "g1", name: "Beard Sculpt & Trim", price: 349, duration: "30 min" },
      { id: "g2", name: "Hot Towel Shave", price: 449, duration: "40 min" },
      { id: "g3", name: "Eyebrow Threading", price: 149, duration: "15 min" },
      { id: "g4", name: "Men's Facial", price: 799, duration: "60 min" },
    ],
  },
  {
    cat: "Skin",
    icon: "◉",
    services: [
      { id: "s1", name: "Deep Cleanse Facial", price: 999, duration: "60 min" },
      { id: "s2", name: "Gold Facial", price: 1499, duration: "75 min" },
      { id: "s3", name: "Waxing (Full Arms)", price: 399, duration: "30 min" },
      { id: "s4", name: "Bridal Package", price: 8999, duration: "240 min" },
    ],
  },
];

const UPI_OPTIONS = [
  { id: "gpay", name: "Google Pay", color: "#4285F4", icon: "G", upi: "salonique@okicici" },
  { id: "phonepe", name: "PhonePe", color: "#5F259F", icon: "P", upi: "salonique@ybl" },
  { id: "paytm", name: "Paytm", color: "#00BAF2", icon: "₮", upi: "salonique@paytm" },
  { id: "upi", name: "Any UPI App", color: "#FF6B00", icon: "⊕", upi: "salonique@upi" },
];

/* ── TIME SLOTS ── */
const TIME_SLOTS = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM",
  "7:00 PM", "7:30 PM",
];

/* ── helpers ── */
const generateBookingId = () => "SLQ" + Date.now().toString(36).toUpperCase().slice(-6);

const getDatesFromToday = (n = 14) => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d);
  }
  return dates;
};

const fmt = (d) => d.toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric" });

/* ════════════════════════════════════════════
   STEP INDICATOR
════════════════════════════════════════════ */
function StepBar({ step }) {
  const steps = ["Details", "Services", "Schedule & Pay", "Confirmed"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, padding: "1.4rem 2rem", borderBottom: `1px solid ${C.sand}`, background: C.cream }}>
      {steps.map((s, i) => (
        <div key={s} style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
            <motion.div
              animate={{
                background: i < step ? C.bronze : i === step ? C.bronze2 : C.sand,
                scale: i === step ? 1.15 : 1,
              }}
              transition={{ duration: 0.35 }}
              style={{
                width: 30, height: 30, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.65rem", fontWeight: 700,
                fontFamily: "'DM Sans',sans-serif",
                color: i <= step ? C.white : C.textLight,
              }}
            >
              {i < step ? "✓" : i + 1}
            </motion.div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase", color: i <= step ? C.bronze : C.textLight, fontWeight: i === step ? 600 : 400 }}>{s}</p>
          </div>
          {i < steps.length - 1 && (
            <motion.div
              animate={{ background: i < step ? C.bronze2 : C.sand }}
              style={{ width: 48, height: 1, margin: "0 4px", marginBottom: 18 }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════
   STEP 1 – DETAILS
════════════════════════════════════════════ */
function StepDetails({ data, onChange, onNext }) {
  const [errors, setErrors] = useState({});
  const validate = () => {
    const e = {};
    if (!data.name.trim()) e.name = "Name is required";
    if (!data.phone.match(/^[6-9]\d{9}$/)) e.phone = "Enter valid 10-digit mobile number";
    if (data.email && !data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Invalid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div style={{ padding: "2rem 2.5rem 2.5rem" }}>
      <h3 style={{ fontSize: "1.5rem", fontWeight: 400, marginBottom: "0.4rem", color: C.text }}>
        Your <em style={{ color: C.bronze, fontStyle: "italic" }}>Details</em>
      </h3>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", color: C.textLight, marginBottom: "2rem" }}>Tell us a little about yourself to personalise your experience.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        {[
          { key: "name", label: "Full Name *", type: "text", placeholder: "e.g. Priya Sharma" },
          { key: "phone", label: "Mobile Number *", type: "tel", placeholder: "10-digit mobile number" },
          { key: "email", label: "Email (optional)", type: "email", placeholder: "you@email.com" },
        ].map(({ key, label, type, placeholder }) => (
          <div key={key}>
            <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: C.textMid, fontWeight: 600, display: "block", marginBottom: 6 }}>{label}</label>
            <input
              type={type}
              placeholder={placeholder}
              value={data[key]}
              onChange={(e) => onChange(key, e.target.value)}
              style={{
                width: "100%", padding: "11px 16px",
                border: `1.5px solid ${errors[key] ? "#e07070" : C.sand}`,
                fontFamily: "'DM Sans',sans-serif", fontSize: "0.88rem",
                color: C.text, background: C.white, outline: "none",
                transition: "border-color 0.3s",
              }}
              onFocus={(e) => e.target.style.borderColor = C.bronze2}
              onBlur={(e) => e.target.style.borderColor = errors[key] ? "#e07070" : C.sand}
            />
            {errors[key] && <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", color: "#e07070", marginTop: 4 }}>{errors[key]}</p>}
          </div>
        ))}

        <div>
          <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: C.textMid, fontWeight: 600, display: "block", marginBottom: 6 }}>Gender</label>
          <div style={{ display: "flex", gap: 10 }}>
            {["Female", "Male", "Non-binary", "Prefer not to say"].map((g) => (
              <motion.button
                key={g}
                onClick={() => onChange("gender", g)}
                whileHover={{ borderColor: C.bronze2 }}
                style={{
                  flex: 1, padding: "9px 4px",
                  border: `1.5px solid ${data.gender === g ? C.bronze : C.sand}`,
                  background: data.gender === g ? C.bronzeLight : C.white,
                  fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", color: data.gender === g ? C.bronze : C.textMid,
                  letterSpacing: "0.08em", transition: "all 0.3s", cursor: "pointer",
                }}
              >{g}</motion.button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: C.textMid, fontWeight: 600, display: "block", marginBottom: 6 }}>Special Requests</label>
          <textarea
            placeholder="Any specific requirements or allergies..."
            value={data.notes}
            onChange={(e) => onChange("notes", e.target.value)}
            rows={2}
            style={{
              width: "100%", padding: "11px 16px", resize: "none",
              border: `1.5px solid ${C.sand}`,
              fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem",
              color: C.text, background: C.white, outline: "none",
            }}
            onFocus={(e) => e.target.style.borderColor = C.bronze2}
            onBlur={(e) => e.target.style.borderColor = C.sand}
          />
        </div>
      </div>

      <motion.button
        onClick={() => { if (validate()) onNext(); }}
        whileHover={{ background: C.accent, boxShadow: `0 8px 28px ${C.bronze}50` }}
        whileTap={{ scale: 0.97 }}
        style={{
          marginTop: "2rem", width: "100%", padding: "14px",
          background: C.bronze, color: C.white, border: "none",
          fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem",
          letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600,
          cursor: "pointer", transition: "all 0.3s",
        }}
      >Continue to Services →</motion.button>
    </div>
  );
}

/* ════════════════════════════════════════════
   STEP 2 – SHOP + SERVICES
════════════════════════════════════════════ */
function StepServices({ data, onChange, onNext, onBack }) {
  const [activeCat, setActiveCat] = useState("Hair");

  const toggleService = (svc) => {
    const exists = data.services.find((s) => s.id === svc.id);
    if (exists) {
      onChange("services", data.services.filter((s) => s.id !== svc.id));
    } else {
      onChange("services", [...data.services, svc]);
    }
  };

  const total = data.services.reduce((s, v) => s + v.price, 0);

  return (
    <div style={{ padding: "1.5rem 2.5rem 2.5rem", display: "flex", flexDirection: "column", gap: 0 }}>
      <h3 style={{ fontSize: "1.5rem", fontWeight: 400, marginBottom: "0.3rem" }}>
        Choose <em style={{ color: C.bronze, fontStyle: "italic" }}>Location & Services</em>
      </h3>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", color: C.textLight, marginBottom: "1.5rem" }}>Pick your preferred branch, then select services.</p>

      {/* Shops */}
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.63rem", letterSpacing: "0.25em", textTransform: "uppercase", color: C.textMid, fontWeight: 600, marginBottom: "0.8rem" }}>Select Branch</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1.8rem" }}>
        {SHOPS.map((sh) => (
          <motion.div
            key={sh.id}
            onClick={() => onChange("shop", sh)}
            whileHover={{ x: 4 }}
            style={{
              display: "flex", alignItems: "center", gap: 14, padding: "12px 14px",
              border: `1.5px solid ${data.shop?.id === sh.id ? C.bronze : C.sand}`,
              background: data.shop?.id === sh.id ? C.bronzeLight : C.white,
              cursor: "pointer", transition: "all 0.28s",
            }}
          >
            <div style={{ width: 50, height: 50, overflow: "hidden", flexShrink: 0 }}>
              <img src={sh.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "0.82rem", color: C.text }}>{sh.name}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", color: C.textLight, marginTop: 1 }}>{sh.address}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.68rem", color: C.textMid, marginTop: 1 }}>{sh.phone} · {sh.hours}</p>
            </div>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem", color: C.bronze, fontWeight: 600 }}>{sh.rating}</p>
              <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${data.shop?.id === sh.id ? C.bronze : C.sand}`, background: data.shop?.id === sh.id ? C.bronze : "transparent", margin: "4px auto 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {data.shop?.id === sh.id && <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.white }} />}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Services */}
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.63rem", letterSpacing: "0.25em", textTransform: "uppercase", color: C.textMid, fontWeight: 600, marginBottom: "0.8rem" }}>Select Services</p>
      <div style={{ display: "flex", gap: 8, marginBottom: "1rem", flexWrap: "wrap" }}>
        {SERVICE_CATEGORIES.map((cat) => (
          <motion.button
            key={cat.cat}
            onClick={() => setActiveCat(cat.cat)}
            whileHover={{ borderColor: C.bronze2 }}
            style={{
              padding: "7px 16px",
              border: `1.5px solid ${activeCat === cat.cat ? C.bronze : C.sand}`,
              background: activeCat === cat.cat ? C.bronzeLight : C.white,
              fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", letterSpacing: "0.1em",
              color: activeCat === cat.cat ? C.bronze : C.textMid,
              cursor: "pointer", transition: "all 0.25s",
            }}
          >{cat.icon} {cat.cat}</motion.button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: "1.5rem" }}>
        {SERVICE_CATEGORIES.find((c) => c.cat === activeCat)?.services.map((svc) => {
          const sel = data.services.find((s) => s.id === svc.id);
          return (
            <motion.div
              key={svc.id}
              onClick={() => toggleService(svc)}
              whileHover={{ x: 4 }}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 16px", cursor: "pointer",
                border: `1.5px solid ${sel ? C.bronze : C.sand}`,
                background: sel ? C.bronzeLight : C.white,
                transition: "all 0.25s",
              }}
            >
              <div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 500, fontSize: "0.85rem", color: C.text }}>{svc.name}</p>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.68rem", color: C.textLight, marginTop: 2 }}>{svc.duration}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "0.9rem", color: C.bronze }}>₹{svc.price.toLocaleString("en-IN")}</p>
                <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${sel ? C.bronze : C.sand}`, background: sel ? C.bronze : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {sel && <span style={{ color: C.white, fontSize: "0.7rem", fontWeight: 700 }}>✓</span>}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Selected summary */}
      {data.services.length > 0 && (
        <div style={{ background: C.warm, padding: "12px 16px", marginBottom: "1.2rem", borderLeft: `3px solid ${C.bronze2}` }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", color: C.textMid, marginBottom: 6 }}>
            <strong>{data.services.length} service{data.services.length > 1 ? "s" : ""} selected</strong>
          </p>
          {data.services.map((s) => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", color: C.textMid }}>{s.name}</span>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", color: C.bronze }}>₹{s.price.toLocaleString("en-IN")}</span>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${C.sand}`, marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem", fontWeight: 700, color: C.text }}>Total</span>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", fontWeight: 700, color: C.bronze }}>₹{total.toLocaleString("en-IN")}</span>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 12 }}>
        <motion.button onClick={onBack} whileHover={{ background: C.sandLight }} style={{ flex: 0.4, padding: "13px", border: `1.5px solid ${C.sand}`, background: C.white, fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: C.textMid, cursor: "pointer", transition: "all 0.3s" }}>← Back</motion.button>
        <motion.button
          onClick={() => { if (!data.shop) { alert("Please select a branch"); return; } if (data.services.length === 0) { alert("Please select at least one service"); return; } onNext(); }}
          whileHover={{ background: C.accent, boxShadow: `0 8px 28px ${C.bronze}50` }}
          whileTap={{ scale: 0.97 }}
          style={{ flex: 1, padding: "13px", background: C.bronze, color: C.white, border: "none", fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem", letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 600, cursor: "pointer", transition: "all 0.3s" }}
        >Date, Time & Payment →</motion.button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   STEP 3 – DATE / TIME / PAYMENT
════════════════════════════════════════════ */
function StepSchedule({ data, onChange, onNext, onBack }) {
  const [payState, setPayState] = useState("idle"); // idle | processing | done
  const dates = getDatesFromToday();
  const total = data.services.reduce((s, v) => s + v.price, 0);

  const handlePay = () => {
    if (!data.date || !data.time) { alert("Please pick a date and time slot"); return; }
    if (!data.upi) { alert("Please select a payment method"); return; }
    setPayState("processing");
    setTimeout(() => {
      setPayState("done");
      setTimeout(() => onNext(), 900);
    }, 2200);
  };

  return (
    <div style={{ padding: "1.5rem 2.5rem 2.5rem" }}>
      <h3 style={{ fontSize: "1.5rem", fontWeight: 400, marginBottom: "0.3rem" }}>
        Pick a <em style={{ color: C.bronze, fontStyle: "italic" }}>Date & Time</em>
      </h3>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", color: C.textLight, marginBottom: "1.5rem" }}>Choose when you'd like to visit and complete your payment.</p>

      {/* Date picker */}
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.22em", textTransform: "uppercase", color: C.textMid, fontWeight: 600, marginBottom: "0.7rem" }}>Select Date</p>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 8, marginBottom: "1.5rem" }}>
        {dates.map((d, i) => {
          const label = fmt(d);
          const sel = data.date === label;
          return (
            <motion.button
              key={i}
              onClick={() => onChange("date", label)}
              whileHover={{ borderColor: C.bronze2 }}
              style={{
                flexShrink: 0, padding: "10px 14px", textAlign: "center",
                border: `1.5px solid ${sel ? C.bronze : C.sand}`,
                background: sel ? C.bronzeLight : C.white,
                cursor: "pointer", transition: "all 0.25s",
              }}
            >
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", color: sel ? C.bronze : C.textLight, letterSpacing: "0.1em", textTransform: "uppercase" }}>{d.toLocaleDateString("en-IN", { weekday: "short" })}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "1rem", fontWeight: 600, color: sel ? C.bronze : C.text, lineHeight: 1.2 }}>{d.getDate()}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", color: sel ? C.bronze : C.textLight }}>{d.toLocaleDateString("en-IN", { month: "short" })}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Time slots */}
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.22em", textTransform: "uppercase", color: C.textMid, fontWeight: 600, marginBottom: "0.7rem" }}>Select Time</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1.8rem" }}>
        {TIME_SLOTS.map((t) => {
          const sel = data.time === t;
          const booked = ["9:30 AM", "11:00 AM", "2:30 PM", "5:00 PM"].includes(t);
          return (
            <motion.button
              key={t}
              disabled={booked}
              onClick={() => !booked && onChange("time", t)}
              whileHover={!booked ? { borderColor: C.bronze2 } : {}}
              style={{
                padding: "7px 12px",
                border: `1.5px solid ${sel ? C.bronze : booked ? "#ddd" : C.sand}`,
                background: sel ? C.bronzeLight : booked ? "#f5f5f5" : C.white,
                fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem",
                color: sel ? C.bronze : booked ? "#bbb" : C.textMid,
                cursor: booked ? "not-allowed" : "pointer",
                opacity: booked ? 0.6 : 1,
                textDecoration: booked ? "line-through" : "none",
                transition: "all 0.25s",
              }}
            >{t}</motion.button>
          );
        })}
      </div>

      {/* Price summary */}
      <div style={{ background: C.warm, padding: "14px 18px", marginBottom: "1.5rem", borderLeft: `3px solid ${C.bronze2}` }}>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: C.textMid, fontWeight: 600, marginBottom: 8 }}>Order Summary</p>
        {data.services.map((s) => (
          <div key={s.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", color: C.textMid }}>{s.name}</span>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.78rem", color: C.bronze }}>₹{s.price.toLocaleString("en-IN")}</span>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${C.sand}`, marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", fontWeight: 700, color: C.text }}>Total Payable</span>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.3rem", fontWeight: 700, color: C.bronze }}>₹{total.toLocaleString("en-IN")}</span>
        </div>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", color: C.textLight, marginTop: 6 }}>
          📍 {data.shop?.name} · {data.date || "—"} at {data.time || "—"}
        </p>
      </div>

      {/* UPI */}
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.22em", textTransform: "uppercase", color: C.textMid, fontWeight: 600, marginBottom: "0.8rem" }}>Pay via UPI</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "1.8rem" }}>
        {UPI_OPTIONS.map((u) => (
          <motion.div
            key={u.id}
            onClick={() => onChange("upi", u)}
            whileHover={{ borderColor: u.color }}
            style={{
              display: "flex", alignItems: "center", gap: 10, padding: "12px 14px",
              border: `1.5px solid ${data.upi?.id === u.id ? u.color : C.sand}`,
              background: data.upi?.id === u.id ? `${u.color}12` : C.white,
              cursor: "pointer", transition: "all 0.25s",
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: u.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "0.9rem" }}>{u.icon}</div>
            <div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: "0.8rem", color: C.text }}>{u.name}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", color: C.textLight }}>{u.upi}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pay button */}
      <div style={{ display: "flex", gap: 12 }}>
        <motion.button onClick={onBack} whileHover={{ background: C.sandLight }} style={{ flex: 0.4, padding: "13px", border: `1.5px solid ${C.sand}`, background: C.white, fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: C.textMid, cursor: "pointer", transition: "all 0.3s" }}>← Back</motion.button>
        <motion.button
          onClick={handlePay}
          disabled={payState !== "idle"}
          whileHover={payState === "idle" ? { background: C.accent, boxShadow: `0 8px 28px ${C.bronze}50` } : {}}
          whileTap={payState === "idle" ? { scale: 0.97 } : {}}
          style={{
            flex: 1, padding: "13px",
            background: payState === "done" ? C.green : C.bronze,
            color: C.white, border: "none",
            fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem",
            letterSpacing: "0.22em", textTransform: "uppercase",
            fontWeight: 600, cursor: payState === "idle" ? "pointer" : "default",
            transition: "all 0.4s",
          }}
        >
          {payState === "idle" && `Pay ₹${total.toLocaleString("en-IN")} →`}
          {payState === "processing" && (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }} style={{ display: "inline-block" }}>⟳</motion.span>
              Processing...
            </span>
          )}
          {payState === "done" && "✓ Payment Confirmed!"}
        </motion.button>
      </div>

      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", color: C.textLight, textAlign: "center", marginTop: "0.8rem" }}>
        🔒 This is a demo — no real transaction will occur.
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════
   STEP 4 – CONFIRMATION
════════════════════════════════════════════ */
function StepConfirm({ data, bookingId, onClose }) {
  const total = data.services.reduce((s, v) => s + v.price, 0);
  const sentRef = useRef(false);
  const [sendStatus, setSendStatus] = useState({ user: "pending", shop: "pending" });

  const waMessage = encodeURIComponent(
    `★ Booking Confirmed – Salonique!\n\n` +
    `Hi ${data.name || "there"}! Your appointment is confirmed.\n\n` +
    `✦ Booking ID: ${bookingId}\n` +
    `➤ Location: ${data.shop?.name}\n` +
    `⏰ Date & Time: ${data.date} at ${data.time}\n` +
    `✂ Services: ${data.services.map((s) => s.name).join(", ")}\n` +
    `✦ Total: ₹${total.toLocaleString("en-IN")}\n\n` +
    `Thank you for choosing Salonique! We look forward to seeing you.\n` +
    `☎ ${data.shop?.phone}`
  );

  const shopWaMessage = encodeURIComponent(
    `★ New Booking Received – Salonique!\n\n` +
    `✦ Booking ID: ${bookingId}\n` +
    `☺ Client: ${data.name} · ☎ ${data.phone}\n` +
    `⏰ Date & Time: ${data.date} at ${data.time}\n` +
    `✂ Services: ${data.services.map((s) => s.name).join(", ")}\n` +
    `✦ Paid: ₹${total.toLocaleString("en-IN")} via ${data.upi?.name}\n\n` +
    `Please get ready to welcome ${data.name?.split(" ")[0] || "the client"}. Thank you!`
  );

  const smsMessage = encodeURIComponent(
    `Salonique Booking ${bookingId}: ${data.name}, ${data.date} at ${data.time}, ${data.shop?.name}. Services: ${data.services.map((s) => s.name).join(", ")}. Total: Rs.${total}. Contact: ${data.shop?.phone}`
  );

  const notifyUser = () => {
    if (!data.phone) return false;
    const phone = data.phone.replace(/\D/g, "");
    const win = phone.length === 10
      ? window.open(`https://wa.me/91${phone}?text=${waMessage}`, "_blank")
      : window.open(`sms:${data.phone}?body=${smsMessage}`, "_blank");
    if (win) setSendStatus((s) => ({ ...s, user: "sent" }));
    return !!win;
  };

  const notifyShop = () => {
    if (!data.shop?.whatsapp) return false;
    const win = window.open(`https://wa.me/${data.shop.whatsapp}?text=${shopWaMessage}`, "_blank");
    if (win) setSendStatus((s) => ({ ...s, shop: "sent" }));
    return !!win;
  };

  // The instant the booking is confirmed, push a live confirmation to both
  // the customer and the salon — no extra taps needed on the happy path.
  useEffect(() => {
    if (sentRef.current) return;
    sentRef.current = true;
    setSendStatus({
      user: notifyUser() ? "sent" : "blocked",
      shop: notifyShop() ? "sent" : "blocked",
    });
  }, []);

  return (
    <div style={{ padding: "2rem 2.5rem 2.5rem", textAlign: "center" }}>
      {/* Confetti-like animation */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 250, damping: 18 }}
        style={{
          width: 80, height: 80, borderRadius: "50%",
          background: `linear-gradient(135deg, ${C.bronze}, ${C.bronze2})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2rem", margin: "0 auto 1.5rem",
          boxShadow: `0 0 0 12px ${C.bronzeLight}, 0 0 0 24px ${C.sand}`,
        }}
      >✓</motion.div>

      <h3 style={{ fontSize: "2rem", fontWeight: 400, color: C.text, marginBottom: "0.4rem" }}>
        You're all <em style={{ color: C.bronze, fontStyle: "italic" }}>booked!</em>
      </h3>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", color: C.textLight, marginBottom: "2rem" }}>
        We're excited to see you, {data.name?.split(" ")[0] || "you"}. Your appointment is confirmed.
      </p>

      {/* Live notification status — auto-pushed to both customer and salon */}
      <div style={{ background: C.warm, padding: "12px 16px", marginBottom: "1.5rem", borderLeft: `3px solid ${C.bronze2}`, textAlign: "left" }}>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: C.textMid, fontWeight: 600, marginBottom: 8 }}>📡 Live Confirmation</p>
        {[
          { key: "user", label: `To you · ${data.phone || "—"}`, status: sendStatus.user, retry: notifyUser, available: !!data.phone },
          { key: "shop", label: `To ${data.shop?.name || "the salon"}`, status: sendStatus.shop, retry: notifyShop, available: !!data.shop?.whatsapp },
        ].map((row) => (
          <div key={row.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem", color: C.textMid }}>{row.label}</span>
            {row.status === "sent" ? (
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", color: C.green, fontWeight: 600 }}>✓ WhatsApp opened</span>
            ) : row.available ? (
              <motion.button
                onClick={row.retry}
                whileTap={{ scale: 0.96 }}
                style={{ background: "none", border: `1px solid ${C.bronze}`, color: C.bronze, fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "5px 12px", cursor: "pointer" }}
              >Tap to send</motion.button>
            ) : (
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.68rem", color: C.textLight }}>Unavailable</span>
            )}
          </div>
        ))}
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.62rem", color: C.textLight, marginTop: 10, lineHeight: 1.5 }}>
          We open a pre-filled WhatsApp chat for you and the salon the moment payment succeeds — if a pop-up was blocked, tap "send" above to deliver it.
        </p>
      </div>

      {/* Booking card */}
      <div style={{ background: C.warm, padding: "1.5rem", marginBottom: "1.8rem", textAlign: "left", border: `1px solid ${C.sand}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", paddingBottom: "1rem", borderBottom: `1px solid ${C.sand}` }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: C.textMid, fontWeight: 600 }}>Booking Confirmation</p>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem", fontWeight: 700, color: C.bronze }}>#{bookingId}</p>
        </div>
        {[
          ["👤 Client", data.name],
          ["📍 Location", data.shop?.name],
          ["🗓️ Date", data.date],
          ["⏰ Time", data.time],
          ["📱 Mobile", data.phone],
          ["💳 Payment", `${data.upi?.name} — ₹${total.toLocaleString("en-IN")}`],
        ].map(([k, v]) => (
          <div key={k} style={{ display: "flex", gap: 14, marginBottom: 8 }}>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem", color: C.textLight, minWidth: 100 }}>{k}</span>
            <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.8rem", fontWeight: 500, color: C.text }}>{v}</span>
          </div>
        ))}
        <div style={{ marginTop: "0.8rem", paddingTop: "0.8rem", borderTop: `1px solid ${C.sand}` }}>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.7rem", color: C.textMid, marginBottom: 6, fontWeight: 600 }}>Services Booked:</p>
          {data.services.map((s) => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem", color: C.textMid }}>• {s.name}</span>
              <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.75rem", color: C.bronze }}>₹{s.price.toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Copy details — WhatsApp delivery to both parties is automatic (see Live Confirmation above) */}
      <div style={{ display: "flex", gap: 10, marginBottom: "1.5rem" }}>
        <motion.button
          onClick={() => {
            const text = `Salonique Booking #${bookingId}\nDate: ${data.date} at ${data.time}\nLocation: ${data.shop?.name}\nServices: ${data.services.map(s => s.name).join(", ")}\nTotal: ₹${total}`;
            navigator.clipboard?.writeText(text).then(() => alert("Booking details copied!"));
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{
            flex: 1, padding: "12px",
            background: C.white, color: C.bronze,
            border: `1.5px solid ${C.bronze}`,
            fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem",
            letterSpacing: "0.16em", textTransform: "uppercase",
            fontWeight: 600, cursor: "pointer", transition: "all 0.3s",
          }}
        >📋 Copy Booking Details</motion.button>
      </div>

      <motion.button
        onClick={onClose}
        whileHover={{ background: C.sandLight }}
        style={{
          width: "100%", padding: "12px", background: C.white,
          border: `1.5px solid ${C.sand}`, color: C.textMid,
          fontFamily: "'DM Sans',sans-serif", fontSize: "0.72rem",
          letterSpacing: "0.18em", textTransform: "uppercase",
          fontWeight: 500, cursor: "pointer", transition: "all 0.3s",
        }}
      >Close & Return to Home</motion.button>

      <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.65rem", color: C.textLight, marginTop: "1rem" }}>
        A reminder will be sent to {data.phone} before your appointment. See you soon! 🌟
      </p>
    </div>
  );
}

/* ════════════════════════════════════════════
   BOOKING MODAL – MAIN EXPORT
════════════════════════════════════════════ */
export default function BookingModal({ isOpen, onClose }) {
  const [step, setStep] = useState(0);
  const [bookingId] = useState(generateBookingId);
  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", gender: "", notes: "",
    shop: null, services: [],
    date: "", time: "", upi: null,
  });

  // Persist to sessionStorage
  useEffect(() => {
    try { sessionStorage.setItem("salonique_booking", JSON.stringify(formData)); } catch (e) {}
  }, [formData]);

  // Restore on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("salonique_booking");
      if (saved) setFormData(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const update = (key, val) => setFormData((p) => ({ ...p, [key]: val }));

  const reset = () => {
    setStep(0);
    setFormData({ name: "", phone: "", email: "", gender: "", notes: "", shop: null, services: [], date: "", time: "", upi: null });
    try { sessionStorage.removeItem("salonique_booking"); } catch (e) {}
    onClose();
  };

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={step < 3 ? onClose : undefined}
            style={{
              position: "fixed", inset: 0, zIndex: 1000,
              background: "rgba(38,26,16,0.55)",
              backdropFilter: "blur(6px)",
            }}
          />

          {/* Centering wrapper — keeps the modal centered without fighting
              Framer Motion's own management of the `transform` property */}
          <div
            style={{
              position: "fixed", inset: 0, zIndex: 1001,
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "1.5rem",
              pointerEvents: "none",
            }}
          >
          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.96 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              pointerEvents: "auto",
              width: "min(680px, 96vw)",
              maxHeight: "90vh",
              background: C.cream,
              display: "flex", flexDirection: "column",
              boxShadow: "0 32px 80px rgba(38,26,16,0.28)",
              overflow: "hidden",
            }}
          >
            {/* Modal header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "1.2rem 2rem",
              background: C.text,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <p style={{ fontFamily: "'Tenor Sans',sans-serif", fontSize: "1.1rem", letterSpacing: "0.1em", color: C.cream }}>SALON<span style={{ color: C.bronze2 }}>IQUE</span></p>
                <div style={{ width: 1, height: 18, background: "rgba(250,247,242,0.2)" }} />
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.22em", color: "rgba(250,247,242,0.5)", textTransform: "uppercase" }}>Book Appointment</p>
              </div>
              {step < 3 && (
                <motion.button
                  onClick={onClose}
                  whileHover={{ rotate: 90, background: "rgba(250,247,242,0.1)" }}
                  style={{
                    background: "none", border: `1px solid rgba(250,247,242,0.2)`,
                    color: C.cream, width: 30, height: 30,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1rem", cursor: "pointer", transition: "all 0.25s", borderRadius: 2,
                  }}
                >✕</motion.button>
              )}
            </div>

            {/* Step bar */}
            <StepBar step={step} />

            {/* Scrollable body */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                >
                  {step === 0 && <StepDetails data={formData} onChange={update} onNext={() => setStep(1)} />}
                  {step === 1 && <StepServices data={formData} onChange={update} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
                  {step === 2 && <StepSchedule data={formData} onChange={update} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
                  {step === 3 && <StepConfirm data={formData} bookingId={bookingId} onClose={reset} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}