"use client";

import { useState, useEffect } from "react";
import {
  Trophy, Camera, Users, Mail, MapPin, Clock, Menu, X, Heart,
  Star, Phone, Facebook, Instagram, Edit3, Save, LogOut, Plus,
  Trash2, FileText, ChevronUp,
} from "lucide-react";
import Image from "next/image";

// ─── DATA STORE (editable via Admin) ─────────────────────────────────────────
const DEFAULT_DATA = {
  hero: {
    headline: "BACK ON TRACK",
    subhead: "Pete Wright Memorial Summer All-Comers Track & Field Series",
    tagline:
      "Over 20 years of keeping kids and families healthy by engaging the entire community.",
    ctaText: "View Upcoming Meets",
  },
  about: {
    title: "About Back on Track",
    orgName: "Cumberland Valley Athletic Club",
    mission:
      "The Pete Wright Memorial Summer All-Comers Track & Field Series is BACK ON TRACK! For over 20 years, this All-Comers Meet has been an established Hagerstown track & field event for all ages. During the summer months it provides a multitude of track and field events for the tri-state region. BACK ON TRACK's mission is to keep kids and families healthy by engaging the entire community.",
    director: "Laura Salvatore",
    directorTitle: "Meet Director",
    nonprofit:
      "Cumberland Valley Athletic Club is a registered 501(c)(3) nonprofit organization. All donations are tax-deductible to the extent allowed by law.",
    ein: "EIN: [To be provided]",
  },
  meets: [
    { id: 1, date: "June 11, 2026", time: "6:00 PM", location: "Hagerstown Community College Track", title: "Meet #1 — Season Opener", events: "100m, 200m, 400m, 800m, 1500m, Long Jump, Shot Put", status: "upcoming" },
    { id: 2, date: "June 25, 2026", time: "6:00 PM", location: "Hagerstown Community College Track", title: "Meet #2", events: "100m, 200m, 400m, 800m, Mile, High Jump, Discus", status: "upcoming" },
    { id: 3, date: "July 9, 2026", time: "6:00 PM", location: "Hagerstown Community College Track", title: "Meet #3", events: "100m, 200m, 400m, 800m, 1500m, Long Jump, Shot Put", status: "upcoming" },
    { id: 4, date: "July 23, 2026", time: "6:00 PM", location: "Hagerstown Community College Track", title: "Meet #4 — Season Finale", events: "All Events Championship Meet", status: "upcoming" },
  ],
  results: [
    { id: 1, season: "2025", meetName: "Meet #1 — Season Opener", date: "June 12, 2025", downloadUrl: "#", highlights: "Over 120 athletes participated!" },
    { id: 2, season: "2025", meetName: "Meet #2", date: "June 26, 2025", downloadUrl: "#", highlights: "New meet record in the 800m!" },
    { id: 3, season: "2025", meetName: "Meet #3", date: "July 10, 2025", downloadUrl: "#", highlights: "Great turnout despite the heat." },
    { id: 4, season: "2025", meetName: "Meet #4 — Season Finale", date: "July 24, 2025", downloadUrl: "#", highlights: "Best season finale yet!" },
  ],
  sponsors: [
    { id: 1, name: "Community Sponsor 1", level: "Gold", logoUrl: "", website: "#" },
    { id: 2, name: "Community Sponsor 2", level: "Silver", logoUrl: "", website: "#" },
    { id: 3, name: "Community Sponsor 3", level: "Bronze", logoUrl: "", website: "#" },
  ],
  gallery: [
    { id: 1, caption: "Athletes at the starting line", year: "2025", category: "action" },
    { id: 2, caption: "Long jump competition", year: "2025", category: "action" },
    { id: 3, caption: "Award ceremony", year: "2025", category: "ceremony" },
    { id: 4, caption: "Community volunteers", year: "2025", category: "community" },
    { id: 5, caption: "Young athletes warming up", year: "2025", category: "action" },
    { id: 6, caption: "Shot put event", year: "2025", category: "action" },
  ],
  contact: {
    email: "backontrack@cvathletic.org",
    phone: "(301) 555-0100",
    address: "Hagerstown Community College, 11400 Robinwood Dr, Hagerstown, MD 21742",
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
  },
  waiverUrl: "/Back-on-Track-Athlete-Waiver.pdf",
  privacyPolicy:
    "Cumberland Valley Athletic Club is committed to protecting your privacy. We collect only the information necessary to communicate about our events. We do not sell or share personal information with third parties. Photos and videos taken at our events may be used for promotional purposes. Please see our photo/media release form for details regarding images of minors.",
};

const ADMIN_PASSWORD = "BOT2026";

const colors = {
  orange: "#F5A123",
  orangeLight: "#FFF3E0",
  orangeDark: "#E8930A",
  black: "#1A1A1A",
  medGray: "#555555",
  lightGray: "#F5F5F5",
};

export default function HomePage() {
  const [data, setData] = useState(DEFAULT_DATA);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminPasswordError, setAdminPasswordError] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [editData, setEditData] = useState({});
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [selectedResultSeason, setSelectedResultSeason] = useState("2025");
  const [galleryFilter, setGalleryFilter] = useState("all");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "schedule", "results", "gallery", "sponsors", "contact"];
      for (const s of [...sections].reverse()) {
        const el = document.getElementById(s);
        if (el && el.getBoundingClientRect().top <= 150) {
          setActiveSection(s);
          break;
        }
      }
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setAdminMode(true);
      setShowAdminLogin(false);
      setAdminPassword("");
      setAdminPasswordError(false);
    } else {
      setAdminPasswordError(true);
    }
  };

  const openEdit = (type, item = null) => {
    setEditData(item ? { ...item } : {});
    setEditModal(type);
  };

  const saveEdit = () => {
    if (!editModal) return;
    const newData = { ...data };
    if (editModal === "hero") newData.hero = { ...newData.hero, ...editData };
    else if (editModal === "about") newData.about = { ...newData.about, ...editData };
    else if (editModal === "contact") newData.contact = { ...newData.contact, ...editData };
    else if (editModal === "meet-edit") {
      newData.meets = newData.meets.map((m) => (m.id === editData.id ? editData : m));
    } else if (editModal === "meet-add") {
      newData.meets = [...newData.meets, { ...editData, id: Date.now() }];
    } else if (editModal === "result-edit") {
      newData.results = newData.results.map((r) => (r.id === editData.id ? editData : r));
    } else if (editModal === "result-add") {
      newData.results = [...newData.results, { ...editData, id: Date.now() }];
    } else if (editModal === "sponsor-edit") {
      newData.sponsors = newData.sponsors.map((s) => (s.id === editData.id ? editData : s));
    } else if (editModal === "sponsor-add") {
      newData.sponsors = [...newData.sponsors, { ...editData, id: Date.now() }];
    }
    setData(newData);
    setEditModal(null);
    setEditData({});
  };

  const deleteItem = (type, id) => {
    const newData = { ...data };
    if (type === "meet") newData.meets = newData.meets.filter((m) => m.id !== id);
    if (type === "result") newData.results = newData.results.filter((r) => r.id !== id);
    if (type === "sponsor") newData.sponsors = newData.sponsors.filter((s) => s.id !== id);
    setData(newData);
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "schedule", label: "Schedule" },
    { id: "results", label: "Results" },
    { id: "gallery", label: "Gallery" },
    { id: "sponsors", label: "Sponsors" },
    { id: "contact", label: "Contact" },
  ];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div style={{ paddingBottom: adminMode ? 56 : 0 }}>
      {/* ── NAVIGATION ─── */}
      <nav className="nav">
        <div className="nav-inner">
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }} onClick={() => scrollTo("home")}>
            <span style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 900, fontStyle: "italic", fontSize: "1.6rem", letterSpacing: "0.03em", lineHeight: 1, whiteSpace: "nowrap", WebkitTextStroke: "1.5px #F5A123", color: "transparent" }}>
              BACK
            </span>
            <span style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 900, fontStyle: "italic", fontSize: "1.6rem", letterSpacing: "0.03em", lineHeight: 1, whiteSpace: "nowrap", color: "#F5A123" }}>
              ON
            </span>
            <span style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 900, fontStyle: "italic", fontSize: "1.6rem", letterSpacing: "0.03em", lineHeight: 1, whiteSpace: "nowrap", WebkitTextStroke: "1.5px #F5A123", color: "transparent" }}>
              TRACK
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-icon.png" alt="" style={{ height: 34, marginLeft: "-0.15rem" }} />
          </div>
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className={activeSection === item.id ? "active" : ""} onClick={(e) => { e.preventDefault(); scrollTo(item.id); }}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* ── MOBILE NAV ─── */}
      <div className={`mobile-nav ${mobileMenuOpen ? "open" : ""}`}>
        <button className="mobile-close" onClick={() => setMobileMenuOpen(false)}>
          <X size={32} />
        </button>
        {navItems.map((item) => (
          <a key={item.id} href={`#${item.id}`} onClick={(e) => { e.preventDefault(); scrollTo(item.id); }}>
            {item.label}
          </a>
        ))}
      </div>

      {/* ── HERO ─── */}
      <section id="home" className="hero">
        <div className="hero-track">
          <div className="hero-track-lanes" />
          <div className="hero-track-lines" />
        </div>
        <div className="hero-content">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-icon.png" alt="Back on Track Icon" className="hero-icon" />

          {adminMode ? (
            <div className="admin-edit-overlay" onClick={() => openEdit("hero", data.hero)}>
              <button className="admin-edit-btn"><Edit3 size={14} /></button>
              <h1>BACK ON <span>TRACK</span></h1>
            </div>
          ) : (
            <h1>BACK ON <span>TRACK</span></h1>
          )}

          <div className="hero-sub">{data.hero.subhead}</div>
          <p className="hero-tagline">{data.hero.tagline}</p>
          <a className="btn-primary" href="#schedule" onClick={(e) => { e.preventDefault(); scrollTo("schedule"); }}>
            {data.hero.ctaText}
          </a>
        </div>
      </section>

      {/* ── INFO BAR ─── */}
      <div className="info-bar">
        <div className="info-bar-inner">
          <div className="info-item">
            <span className="info-item-label">All Ages Welcome</span>
            <span className="info-item-value">Youth to Masters</span>
          </div>
          <div className="info-item">
            <span className="info-item-label">Summer Series</span>
            <span className="info-item-value">June — July 2026</span>
          </div>
          <div className="info-item">
            <span className="info-item-label">Location</span>
            <span className="info-item-value">Hagerstown, MD</span>
          </div>
          <div className="info-item">
            <span className="info-item-label">501(c)(3) Nonprofit</span>
            <span className="info-item-value">Cumberland Valley AC</span>
          </div>
        </div>
      </div>

      {/* ── ABOUT ─── */}
      <section id="about" className="section">
        <div className="section-subtitle">Our Mission</div>
        {adminMode ? (
          <div className="admin-edit-overlay" onClick={() => openEdit("about", data.about)}>
            <button className="admin-edit-btn"><Edit3 size={14} /></button>
            <h2 className="section-title">{data.about.title}</h2>
            <p className="section-desc" style={{ maxWidth: "none" }}>{data.about.mission}</p>
          </div>
        ) : (
          <>
            <h2 className="section-title">{data.about.title}</h2>
            <p className="section-desc" style={{ maxWidth: "none" }}>{data.about.mission}</p>
          </>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem", marginTop: "2rem" }}>
          {[
            { icon: <Users size={28} />, title: "For Everyone", desc: "Athletes of all ages and abilities — from first-time runners to seasoned competitors. Students, parents, coaches, and community members are all welcome." },
            { icon: <Trophy size={28} />, title: "Track & Field Events", desc: "Sprints, distance, jumps, throws, and relays. A full slate of events every meet to challenge and inspire athletes at every level." },
            { icon: <Heart size={28} />, title: "Community Driven", desc: "Run by volunteers who believe in keeping kids active and families connected through the power of sport in the tri-state region." },
          ].map((card, i) => (
            <div key={i} style={{ padding: "2rem", borderRadius: 16, background: colors.lightGray, textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: colors.orangeLight, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", color: colors.orange }}>{card.icon}</div>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{card.title}</h3>
              <p style={{ fontWeight: 200, fontSize: "0.9rem", color: colors.medGray }}>{card.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "2.5rem", padding: "1.5rem", borderRadius: 12, border: `2px solid ${colors.orange}`, background: colors.orangeLight }}>
          <p style={{ fontWeight: 400, fontSize: "0.9rem" }}>
            <strong style={{ fontWeight: 700 }}>{data.about.orgName}</strong> — {data.about.nonprofit}
            <br /><span style={{ color: colors.medGray }}>{data.about.ein}</span>
          </p>
        </div>
      </section>

      {/* ── SCHEDULE ─── */}
      <section id="schedule" className="section-alt">
        <div className="section-inner">
          <div className="section-subtitle">2026 Season</div>
          <h2 className="section-title">Upcoming Meets</h2>
          <p className="section-desc">Mark your calendar for this summer&apos;s All-Comers Track & Field Series. All meets are free to attend and open to athletes of every age and ability.</p>

          <div className="waiver-banner">
            <FileText size={28} style={{ color: colors.orange, flexShrink: 0 }} />
            <p>
              <strong>Participant Waiver Required</strong>
              All athletes must have a signed waiver form. Parents/guardians must sign for minors. Waivers are also available at each meet.
            </p>
            <a className="btn-primary" href={data.waiverUrl} target="_blank" rel="noopener noreferrer" style={{ padding: "0.6rem 1.5rem", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
              Download Waiver
            </a>
          </div>

          {adminMode && (
            <button className="btn-sm primary" onClick={() => openEdit("meet-add")} style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Plus size={14} /> Add Meet
            </button>
          )}

          <div className="meets-grid">
            {data.meets.map((meet) => (
              <div key={meet.id} className="meet-card">
                <div className="meet-card-header">
                  <h3>{meet.title}</h3>
                  <div className="meet-card-date">{meet.date}</div>
                </div>
                <div className="meet-card-body">
                  <div className="meet-card-detail"><Clock size={16} /><span>{meet.time} — Registration at 5:30 PM</span></div>
                  <div className="meet-card-detail"><MapPin size={16} /><span>{meet.location}</span></div>
                  <div className="meet-card-detail"><Trophy size={16} /><span>{meet.events}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
                    <span className={`meet-status ${meet.status}`}>{meet.status}</span>
                    {adminMode && (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className="btn-sm ghost" onClick={() => openEdit("meet-edit", meet)}><Edit3 size={12} /></button>
                        <button className="btn-sm danger" onClick={() => deleteItem("meet", meet.id)} style={{ padding: "0.4rem 0.6rem" }}><Trash2 size={12} /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESULTS ─── */}
      <section id="results" className="section-dark">
        <div className="section-inner">
          <div className="section-subtitle" style={{ color: colors.orange }}>Past Performances</div>
          <h2 className="section-title">Meet Results & Standings</h2>
          <p className="section-desc">Check out past meet results and season standings. Results are posted after each meet.</p>

          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            {["2025", "2024", "2023"].map((year) => (
              <button key={year} className={`btn-sm ${selectedResultSeason === year ? "primary" : "ghost"}`} style={selectedResultSeason !== year ? { color: "white", borderColor: "rgba(255,255,255,0.2)" } : {}} onClick={() => setSelectedResultSeason(year)}>
                {year} Season
              </button>
            ))}
          </div>

          {adminMode && (
            <button className="btn-sm primary" onClick={() => openEdit("result-add")} style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Plus size={14} /> Add Result
            </button>
          )}

          <div className="results-list">
            {data.results.filter((r) => r.season === selectedResultSeason).map((result) => (
              <div key={result.id} className="result-row">
                <div className="result-info">
                  <h4>{result.meetName}</h4>
                  <p>{result.date} — {result.highlights}</p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <a href={result.downloadUrl} className="result-badge">View Results</a>
                  {adminMode && (
                    <>
                      <button className="btn-sm ghost" style={{ color: "white", borderColor: "rgba(255,255,255,0.2)" }} onClick={() => openEdit("result-edit", result)}><Edit3 size={12} /></button>
                      <button className="btn-sm danger" style={{ padding: "0.4rem 0.6rem" }} onClick={() => deleteItem("result", result.id)}><Trash2 size={12} /></button>
                    </>
                  )}
                </div>
              </div>
            ))}
            {data.results.filter((r) => r.season === selectedResultSeason).length === 0 && (
              <p style={{ color: "rgba(255,255,255,0.5)", textAlign: "center", padding: "2rem" }}>No results yet for {selectedResultSeason} season.</p>
            )}
          </div>
        </div>
      </section>

      {/* ── GALLERY ─── */}
      <section id="gallery" className="section">
        <div className="section-subtitle">Photos & Videos</div>
        <h2 className="section-title">Gallery</h2>
        <p className="section-desc">Relive the action from past meets. Photos and videos from our community of athletes.</p>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {["all", "action", "ceremony", "community"].map((cat) => (
            <button key={cat} className={`btn-sm ${galleryFilter === cat ? "primary" : "ghost"}`} onClick={() => setGalleryFilter(cat)} style={{ textTransform: "capitalize" }}>
              {cat}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {data.gallery.filter((g) => galleryFilter === "all" || g.category === galleryFilter).map((item) => (
            <div key={item.id} className="gallery-item">
              <div className="gallery-placeholder"><Camera size={32} /><span>Photo Coming Soon</span></div>
              <div className="gallery-caption">{item.caption} — {item.year}</div>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", color: colors.medGray, marginTop: "2rem", fontWeight: 200, fontSize: "0.9rem" }}>
          Note: Photos of minors are shared only with proper media release forms on file. Contact us for our photo policy.
        </p>
      </section>

      {/* ── NEWSLETTER CTA ─── */}
      <div className="section-orange">
        <h2 style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 900, fontStyle: "italic", fontSize: "clamp(1.5rem, 3vw, 2.2rem)", marginBottom: "0.5rem" }}>
          Stay in the Loop
        </h2>
        <p style={{ fontWeight: 400, fontSize: "1rem", maxWidth: 500, margin: "0 auto 1.5rem", opacity: 0.85 }}>
          Get meet schedules, results, and community updates delivered to your inbox.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="newsletter-form" style={{ maxWidth: 450 }}>
            <input type="email" placeholder="Your email address" style={{ borderColor: "rgba(0,0,0,0.15)" }} />
            <button className="btn-primary" style={{ background: colors.black, color: "white", boxShadow: "none" }}>Subscribe</button>
          </div>
        </div>
      </div>

      {/* ── SPONSORS ─── */}
      <section id="sponsors" className="section-alt">
        <div className="section-inner">
          <div className="section-subtitle">Our Partners</div>
          <h2 className="section-title">Sponsors</h2>
          <p className="section-desc">Thank you to our generous sponsors who make Back on Track possible. Interested in sponsoring? Contact us to learn about sponsorship opportunities.</p>

          {adminMode && (
            <button className="btn-sm primary" onClick={() => openEdit("sponsor-add")} style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <Plus size={14} /> Add Sponsor
            </button>
          )}

          <div className="sponsors-grid">
            {data.sponsors.map((sponsor) => (
              <div key={sponsor.id} className="sponsor-card">
                <div className="sponsor-logo-placeholder"><Star size={24} /></div>
                <div className="sponsor-name">{sponsor.name}</div>
                <div className="sponsor-level">{sponsor.level} Sponsor</div>
                {adminMode && (
                  <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "0.75rem" }}>
                    <button className="btn-sm ghost" onClick={() => openEdit("sponsor-edit", sponsor)}><Edit3 size={12} /></button>
                    <button className="btn-sm danger" style={{ padding: "0.4rem 0.6rem" }} onClick={() => deleteItem("sponsor", sponsor.id)}><Trash2 size={12} /></button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <a className="btn-outline" href="#contact" onClick={(e) => { e.preventDefault(); scrollTo("contact"); }} style={{ color: colors.black, borderColor: colors.black }}>
              Become a Sponsor
            </a>
          </div>
        </div>
      </section>

      {/* ── CONTACT ─── */}
      <section id="contact" className="section">
        <div className="section-subtitle">Get in Touch</div>
        <h2 className="section-title">Contact Us</h2>
        <p className="section-desc">Questions about the meets, volunteering, or sponsorship? We&apos;d love to hear from you.</p>

        {adminMode && (
          <button className="btn-sm primary" onClick={() => openEdit("contact", data.contact)} style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Edit3 size={14} /> Edit Contact Info
          </button>
        )}

        <div className="contact-grid">
          <div>
            <div className="contact-info-item"><Mail size={20} /><div><h4>Email</h4><p>{data.contact.email}</p></div></div>
            <div className="contact-info-item"><Phone size={20} /><div><h4>Phone</h4><p>{data.contact.phone}</p></div></div>
            <div className="contact-info-item"><MapPin size={20} /><div><h4>Meet Location</h4><p>{data.contact.address}</p></div></div>
            <div className="contact-info-item"><Users size={20} /><div><h4>Meet Director</h4><p>{data.about.director} — {data.about.directorTitle}</p></div></div>
            <div className="social-links">
              <a href={data.contact.facebook} target="_blank" rel="noopener noreferrer" className="social-link"><Facebook size={20} /></a>
              <a href={data.contact.instagram} target="_blank" rel="noopener noreferrer" className="social-link"><Instagram size={20} /></a>
            </div>
          </div>
          <div>
            <div style={{ background: colors.lightGray, borderRadius: 16, padding: "2rem", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem", minHeight: 300 }}>
              <MapPin size={48} style={{ color: colors.orange, opacity: 0.5 }} />
              <p style={{ fontWeight: 700, textAlign: "center", color: colors.medGray }}>Map — Hagerstown Community College Track</p>
              <p style={{ fontSize: "0.85rem", color: colors.medGray, textAlign: "center", fontWeight: 200 }}>11400 Robinwood Dr, Hagerstown, MD 21742</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─── */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1rem" }}>
              <span style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 900, fontStyle: "italic", fontSize: "1.4rem", letterSpacing: "0.03em", lineHeight: 1, whiteSpace: "nowrap", WebkitTextStroke: "1.5px #F5A123", color: "transparent" }}>
                BACK
              </span>
              <span style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 900, fontStyle: "italic", fontSize: "1.4rem", letterSpacing: "0.03em", lineHeight: 1, whiteSpace: "nowrap", color: "#F5A123" }}>
                ON
              </span>
              <span style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 900, fontStyle: "italic", fontSize: "1.4rem", letterSpacing: "0.03em", lineHeight: 1, whiteSpace: "nowrap", WebkitTextStroke: "1.5px #F5A123", color: "transparent" }}>
                TRACK
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-icon.png" alt="" style={{ height: 30, marginLeft: "-0.15rem" }} />
            </div>
            <p>Pete Wright Memorial Summer<br />All-Comers Track & Field Series</p>
            <p style={{ marginTop: "0.75rem" }}>A program of {data.about.orgName}</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            {navItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} onClick={(e) => { e.preventDefault(); scrollTo(item.id); }}>{item.label}</a>
            ))}
          </div>
          <div>
            <h4>Legal</h4>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowPrivacy(true); }}>Privacy Policy</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowPrivacy(true); }}>Terms of Use</a>
            <a href={data.waiverUrl} target="_blank" rel="noopener noreferrer">Athlete Waiver Form</a>
            <a href="/Back-on-Track-Photo-Media-Release.pdf" target="_blank" rel="noopener noreferrer">Photo/Media Release</a>
            <p style={{ marginTop: "0.75rem", fontSize: "0.8rem" }}>{data.about.ein}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} {data.about.orgName}. All rights reserved.</span>
          <span style={{ cursor: "pointer", transition: "color 0.2s" }} onClick={() => setShowAdminLogin(true)}>Admin</span>
        </div>
      </footer>

      {/* ── ADMIN BAR ─── */}
      {adminMode && (
        <div className="admin-bar">
          <div className="admin-bar-left">
            <div className="admin-indicator"><div className="admin-dot" />Admin Mode Active</div>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}>Click any section to edit. Changes are saved in-memory.</span>
          </div>
          <button className="btn-sm primary" onClick={() => setAdminMode(false)} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <LogOut size={14} /> Exit Admin
          </button>
        </div>
      )}

      {/* ── ADMIN LOGIN MODAL ─── */}
      {showAdminLogin && !adminMode && (
        <div className="admin-login" onClick={() => setShowAdminLogin(false)}>
          <div className="admin-login-box" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontStyle: "italic" }}>Admin Login</h2>
            <p>Enter the admin password to edit site content.</p>
            <input type="password" placeholder="Password" value={adminPassword} onChange={(e) => { setAdminPassword(e.target.value); setAdminPasswordError(false); }} onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()} style={adminPasswordError ? { borderColor: "#f44336" } : {}} />
            {adminPasswordError && <p style={{ color: "#f44336", fontSize: "0.85rem", marginBottom: "0.75rem" }}>Incorrect password. Try again.</p>}
            <button className="btn-primary" onClick={handleAdminLogin} style={{ width: "100%" }}>Log In</button>
            <button className="btn-sm ghost" onClick={() => setShowAdminLogin(false)} style={{ marginTop: "0.75rem" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── EDIT MODALS ─── */}
      {editModal && (
        <div className="admin-modal" onClick={() => setEditModal(null)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            {editModal === "hero" && (
              <>
                <h3>Edit Hero Section</h3>
                <div className="admin-field"><label>Headline</label><input value={editData.headline || ""} onChange={(e) => setEditData({ ...editData, headline: e.target.value })} /></div>
                <div className="admin-field"><label>Subheadline</label><input value={editData.subhead || ""} onChange={(e) => setEditData({ ...editData, subhead: e.target.value })} /></div>
                <div className="admin-field"><label>Tagline</label><textarea value={editData.tagline || ""} onChange={(e) => setEditData({ ...editData, tagline: e.target.value })} /></div>
                <div className="admin-field"><label>Button Text</label><input value={editData.ctaText || ""} onChange={(e) => setEditData({ ...editData, ctaText: e.target.value })} /></div>
              </>
            )}
            {editModal === "about" && (
              <>
                <h3>Edit About Section</h3>
                <div className="admin-field"><label>Section Title</label><input value={editData.title || ""} onChange={(e) => setEditData({ ...editData, title: e.target.value })} /></div>
                <div className="admin-field"><label>Organization Name</label><input value={editData.orgName || ""} onChange={(e) => setEditData({ ...editData, orgName: e.target.value })} /></div>
                <div className="admin-field"><label>Mission Statement</label><textarea value={editData.mission || ""} onChange={(e) => setEditData({ ...editData, mission: e.target.value })} style={{ minHeight: 150 }} /></div>
                <div className="admin-field"><label>Director Name</label><input value={editData.director || ""} onChange={(e) => setEditData({ ...editData, director: e.target.value })} /></div>
                <div className="admin-field"><label>EIN</label><input value={editData.ein || ""} onChange={(e) => setEditData({ ...editData, ein: e.target.value })} /></div>
              </>
            )}
            {(editModal === "meet-edit" || editModal === "meet-add") && (
              <>
                <h3>{editModal === "meet-add" ? "Add New Meet" : "Edit Meet"}</h3>
                <div className="admin-field"><label>Meet Title</label><input value={editData.title || ""} onChange={(e) => setEditData({ ...editData, title: e.target.value })} /></div>
                <div className="admin-field"><label>Date</label><input value={editData.date || ""} onChange={(e) => setEditData({ ...editData, date: e.target.value })} placeholder="e.g., June 11, 2026" /></div>
                <div className="admin-field"><label>Time</label><input value={editData.time || ""} onChange={(e) => setEditData({ ...editData, time: e.target.value })} placeholder="e.g., 6:00 PM" /></div>
                <div className="admin-field"><label>Location</label><input value={editData.location || ""} onChange={(e) => setEditData({ ...editData, location: e.target.value })} /></div>
                <div className="admin-field"><label>Events</label><textarea value={editData.events || ""} onChange={(e) => setEditData({ ...editData, events: e.target.value })} /></div>
                <div className="admin-field"><label>Status</label><select value={editData.status || "upcoming"} onChange={(e) => setEditData({ ...editData, status: e.target.value })}><option value="upcoming">Upcoming</option><option value="completed">Completed</option></select></div>
              </>
            )}
            {(editModal === "result-edit" || editModal === "result-add") && (
              <>
                <h3>{editModal === "result-add" ? "Add Result" : "Edit Result"}</h3>
                <div className="admin-field"><label>Season Year</label><input value={editData.season || ""} onChange={(e) => setEditData({ ...editData, season: e.target.value })} placeholder="e.g., 2026" /></div>
                <div className="admin-field"><label>Meet Name</label><input value={editData.meetName || ""} onChange={(e) => setEditData({ ...editData, meetName: e.target.value })} /></div>
                <div className="admin-field"><label>Date</label><input value={editData.date || ""} onChange={(e) => setEditData({ ...editData, date: e.target.value })} /></div>
                <div className="admin-field"><label>Highlights</label><input value={editData.highlights || ""} onChange={(e) => setEditData({ ...editData, highlights: e.target.value })} /></div>
                <div className="admin-field"><label>Results URL</label><input value={editData.downloadUrl || ""} onChange={(e) => setEditData({ ...editData, downloadUrl: e.target.value })} placeholder="https://..." /></div>
              </>
            )}
            {(editModal === "sponsor-edit" || editModal === "sponsor-add") && (
              <>
                <h3>{editModal === "sponsor-add" ? "Add Sponsor" : "Edit Sponsor"}</h3>
                <div className="admin-field"><label>Sponsor Name</label><input value={editData.name || ""} onChange={(e) => setEditData({ ...editData, name: e.target.value })} /></div>
                <div className="admin-field"><label>Sponsorship Level</label><select value={editData.level || "Bronze"} onChange={(e) => setEditData({ ...editData, level: e.target.value })}><option value="Gold">Gold</option><option value="Silver">Silver</option><option value="Bronze">Bronze</option></select></div>
                <div className="admin-field"><label>Website URL</label><input value={editData.website || ""} onChange={(e) => setEditData({ ...editData, website: e.target.value })} placeholder="https://..." /></div>
              </>
            )}
            {editModal === "contact" && (
              <>
                <h3>Edit Contact Info</h3>
                <div className="admin-field"><label>Email</label><input value={editData.email || ""} onChange={(e) => setEditData({ ...editData, email: e.target.value })} /></div>
                <div className="admin-field"><label>Phone</label><input value={editData.phone || ""} onChange={(e) => setEditData({ ...editData, phone: e.target.value })} /></div>
                <div className="admin-field"><label>Address</label><input value={editData.address || ""} onChange={(e) => setEditData({ ...editData, address: e.target.value })} /></div>
                <div className="admin-field"><label>Facebook URL</label><input value={editData.facebook || ""} onChange={(e) => setEditData({ ...editData, facebook: e.target.value })} /></div>
                <div className="admin-field"><label>Instagram URL</label><input value={editData.instagram || ""} onChange={(e) => setEditData({ ...editData, instagram: e.target.value })} /></div>
              </>
            )}
            <div className="admin-btn-row">
              <button className="btn-sm ghost" onClick={() => setEditModal(null)}>Cancel</button>
              <button className="btn-sm primary" onClick={saveEdit} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><Save size={14} /> Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ── PRIVACY MODAL ─── */}
      {showPrivacy && (
        <div className="privacy-modal" onClick={() => setShowPrivacy(false)}>
          <div className="privacy-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontWeight: 900, fontStyle: "italic", fontSize: "1.5rem", marginBottom: "1.5rem" }}>Privacy Policy & Terms of Use</h2>
            <p style={{ fontWeight: 200, lineHeight: 1.8, marginBottom: "1.5rem" }}>{data.privacyPolicy}</p>
            <p style={{ fontWeight: 200, lineHeight: 1.8, marginBottom: "1.5rem" }}>For questions about our privacy practices or to request removal of your information, please contact us at {data.contact.email}.</p>
            <p style={{ fontWeight: 700, fontSize: "0.85rem", color: colors.medGray }}>{data.about.orgName} — {data.about.ein}</p>
            <div className="admin-btn-row"><button className="btn-sm primary" onClick={() => setShowPrivacy(false)}>Close</button></div>
          </div>
        </div>
      )}

      {/* ── SCROLL TO TOP BUTTON ─── */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          style={{
            position: "fixed",
            bottom: adminMode ? 80 : 32,
            right: 32,
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: colors.orange,
            color: "#fff",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
            zIndex: 9998,
            transition: "transform 0.2s, opacity 0.3s",
            opacity: 1,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <ChevronUp size={26} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
