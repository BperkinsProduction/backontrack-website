"use client";

import { useState, useEffect } from "react";
import {
  Trophy, Camera, Users, Mail, MapPin, Clock, Menu, X, Heart,
  Star, Phone, Facebook, Instagram, Edit3, Save, LogOut, Plus,
  Trash2, FileText, ChevronUp, Upload, ImageIcon, FolderPlus, Calendar, CheckCircle,
} from "lucide-react";
import Image from "next/image";

// ─── DATA STORE (editable via Admin) ─────────────────────────────────────────
const DEFAULT_DATA = {
  hero: {
    headline: "BACK ON TRACK",
    subhead: "Pete Wright Memorial Summer All-Comers Track & Field Series",
    tagline:
      "Over 25 years of promoting health, fitness and community through the sport of running for kids, families and athletes of all ages.",
    ctaText: "View Upcoming Meets",
    style: "white",
  },
  about: {
    title: "About Back on Track",
    orgName: "Cumberland Valley Athletic Club",
    mission:
      "The Pete Wright Memorial Summer All-Comers Track & Field Series is BACK ON TRACK! For over 20 years, this All-Comers Meet has been an established Hagerstown track & field event for all ages. During the summer months it provides a multitude of track and field events for the tri-state region. BACK ON TRACK's mission is to keep kids and families healthy by engaging the entire community.",
    director: "Laura Salvatore",
    directorTitle: "Meet Director",
    nonprofit:
      "Cumberland Valley Athletic Club (operating under the Road Runners Club of America) is a registered 501(c)(3) public charity focused on running and amateur sports, founded in 1976. Located at 1012 Valleybrook Dr, Hagerstown, MD 21740. All donations are tax-deductible to the extent allowed by law.",
    ein: "EIN: 52-1867770",
  },
  meets: [
    { id: 1, date: "TBA", time: "6:30 PM", location: "North Hagerstown High School, 1200 Pennsylvania Ave, Hagerstown, MD 21740", title: "Meet #1 — Season Opener", events: "100m, 200m, 400m, 800m, 1 Mile, 2 Mile, Shot Put, Relays", status: "upcoming" },
    { id: 2, date: "TBA", time: "6:30 PM", location: "North Hagerstown High School, 1200 Pennsylvania Ave, Hagerstown, MD 21740", title: "Meet #2", events: "100m, 200m, 400m, 800m, 1 Mile, 2 Mile, Shot Put, Relays", status: "upcoming" },
    { id: 3, date: "TBA", time: "6:30 PM", location: "North Hagerstown High School, 1200 Pennsylvania Ave, Hagerstown, MD 21740", title: "Meet #3", events: "100m, 200m, 400m, 800m, 1 Mile, 2 Mile, Shot Put, Relays", status: "upcoming" },
    { id: 4, date: "TBA", time: "6:30 PM", location: "North Hagerstown High School, 1200 Pennsylvania Ave, Hagerstown, MD 21740", title: "Meet #4 — Season Finale", events: "All Events Championship Meet", status: "upcoming" },
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
  albums: [],
  gallery: [],
  contact: {
    email: "backontrackhgr@gmail.com",
    phone: "(301) 555-0100",
    address: "North Hagerstown High School, 1200 Pennsylvania Ave, Hagerstown, MD 21740",
    facebook: "https://www.facebook.com/share/1AcREfrN7c/?mibextid=wwXIfr",
    instagram: "https://www.instagram.com/backontrackhgr?igsh=MTQ0c3F6bHZ3Ym81dQ==",
  },
  infoBar: [
    { label: "All Ages Welcome", value: "Youth to Masters" },
    { label: "Summer Series", value: "June \u2014 July 2026" },
    { label: "Location", value: "North Hagerstown High School" },
    { label: "501(c)(3) Nonprofit", value: "Cumberland Valley Athletic Club" },
  ],
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
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [selectedResultSeason, setSelectedResultSeason] = useState("2026");
  const [galleryFilter, setGalleryFilter] = useState("all");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);

  // ─── Load saved data from API on mount ───
  useEffect(() => {
    fetch("/api/data")
      .then((res) => {
        if (res.status === 200) return res.json();
        return null;
      })
      .then((saved) => {
        if (saved) {
          setData((prev) => ({ ...prev, ...saved }));
        }
      })
      .catch(() => {});
  }, []);

  // ─── Save data to API helper ───
  const persistData = (newData) => {
    fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "BOT2026", data: newData }),
    }).catch(() => {});
  };

  // ─── Cloudinary config ───
  const CLOUD_NAME = "dmvkf3ms8";
  const UPLOAD_PRESET = "backontrack_unsigned";

  // Fetch gallery images from Cloudinary for each album on mount
  useEffect(() => {
    const fetchAlbumPhotos = async (album) => {
      const tag = `album-${album.id}`;
      try {
        const res = await fetch(
          `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${tag}.json`
        );
        if (res.ok) {
          const json = await res.json();
          return json.resources.map((img) => ({
            id: img.public_id,
            albumId: album.id,
            imageUrl: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,w_600,h_400,q_auto,f_auto/${img.public_id}`,
            fullUrl: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/q_auto,f_auto/${img.public_id}`,
            caption: img.context?.custom?.caption || "",
          }));
        }
      } catch (e) {
        console.log(`Album ${album.name} fetch:`, e);
      }
      return [];
    };

    const fetchAll = async () => {
      // Also fetch any untagged gallery images
      try {
        const res = await fetch(
          `https://res.cloudinary.com/${CLOUD_NAME}/image/list/backontrack-gallery.json`
        );
        if (res.ok) {
          const json = await res.json();
          const images = json.resources.map((img) => ({
            id: img.public_id,
            albumId: "general",
            imageUrl: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,w_600,h_400,q_auto,f_auto/${img.public_id}`,
            fullUrl: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/q_auto,f_auto/${img.public_id}`,
            caption: img.context?.custom?.caption || "",
          }));
          if (images.length > 0) {
            setData((prev) => ({ ...prev, gallery: [...prev.gallery, ...images] }));
          }
        }
      } catch (e) {
        console.log("Gallery fetch:", e);
      }
    };
    fetchAll();
  }, []);

  // Fetch album photos when albums change
  useEffect(() => {
    if (data.albums.length === 0) return;
    const fetchAlbumPhotos = async () => {
      for (const album of data.albums) {
        const tag = `album-${album.id}`;
        try {
          const res = await fetch(
            `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${tag}.json`
          );
          if (res.ok) {
            const json = await res.json();
            const images = json.resources.map((img) => ({
              id: img.public_id,
              albumId: album.id,
              imageUrl: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,w_600,h_400,q_auto,f_auto/${img.public_id}`,
              fullUrl: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/q_auto,f_auto/${img.public_id}`,
              caption: img.context?.custom?.caption || "",
            }));
            if (images.length > 0) {
              setData((prev) => ({
                ...prev,
                gallery: [
                  ...prev.gallery.filter((g) => g.albumId !== album.id),
                  ...images,
                ],
              }));
            }
          }
        } catch (e) {
          console.log(`Album ${album.name} fetch:`, e);
        }
      }
    };
    fetchAlbumPhotos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.albums.length]);

  const openCloudinaryUpload = (albumId) => {
    if (!window.cloudinary) {
      alert("Upload widget is still loading. Please try again in a moment.");
      return;
    }
    const tag = albumId ? `album-${albumId}` : "backontrack-gallery";
    const folder = albumId ? `backontrack-gallery/${albumId}` : "backontrack-gallery";
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        folder: folder,
        tags: [tag, "backontrack-gallery"],
        sources: ["local", "camera"],
        multiple: true,
        maxFiles: 20,
        resourceType: "image",
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "heic", "heif", "gif", "bmp", "tiff", "tif"],
        maxFileSize: 25000000,
        styles: {
          palette: {
            window: "#1A1A1A",
            windowBorder: "#F5A123",
            tabIcon: "#F5A123",
            menuIcons: "#F5A123",
            textDark: "#1A1A1A",
            textLight: "#FFFFFF",
            link: "#F5A123",
            action: "#F5A123",
            inactiveTabIcon: "#888",
            error: "#FF4444",
            inProgress: "#F5A123",
            complete: "#28A745",
            sourceBg: "#2A2A2A",
          },
        },
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          const img = result.info;
          const newPhoto = {
            id: img.public_id,
            albumId: albumId || "general",
            imageUrl: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,w_600,h_400,q_auto,f_auto/${img.public_id}`,
            fullUrl: img.secure_url,
            caption: "",
          };
          setData((prev) => {
            const updated = {
              ...prev,
              gallery: [...prev.gallery, newPhoto],
            };
            // If this is the first photo in an album and no cover, set it as cover
            if (albumId) {
              updated.albums = updated.albums.map((a) =>
                a.id === albumId && !a.coverUrl
                  ? { ...a, coverUrl: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/c_fill,w_800,h_400,q_auto,f_auto/${img.public_id}` }
                  : a
              );
            }
            persistData(updated);
            return updated;
          });
        }
        if (result && result.event === "close") {
          setGalleryUploading(false);
        }
      }
    );
    setGalleryUploading(true);
    widget.open();
  };

  const openWaiverUpload = () => {
    if (!window.cloudinary) {
      alert("Upload widget is still loading. Please try again in a moment.");
      return;
    }
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        folder: "backontrack-waivers",
        sources: ["local"],
        multiple: false,
        maxFiles: 1,
        resourceType: "raw",
        clientAllowedFormats: ["pdf"],
        maxFileSize: 10000000,
        styles: {
          palette: {
            window: "#1A1A1A",
            windowBorder: "#F5A123",
            tabIcon: "#F5A123",
            menuIcons: "#F5A123",
            textDark: "#1A1A1A",
            textLight: "#FFFFFF",
            link: "#F5A123",
            action: "#F5A123",
            inactiveTabIcon: "#888",
            error: "#FF4444",
            inProgress: "#F5A123",
            complete: "#28A745",
            sourceBg: "#2A2A2A",
          },
        },
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          const url = result.info.secure_url;
          setData((prev) => {
            const updated = { ...prev, waiverUrl: url };
            persistData(updated);
            return updated;
          });
          alert("Waiver updated successfully!");
        }
      }
    );
    widget.open();
  };

  const deleteGalleryImage = async (publicId) => {
    setData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((g) => g.id !== publicId),
    }));
  };

  const addAlbum = () => {
    let displayDate = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    if (editData.albumDate) {
      const d = new Date(editData.albumDate + "T12:00:00");
      displayDate = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    }
    const newAlbum = {
      id: Date.now().toString(),
      name: editData.albumName || "New Album",
      date: displayDate,
      coverUrl: "",
    };
    setData((prev) => ({
      ...prev,
      albums: [...prev.albums, newAlbum],
    }));
    setEditModal(null);
    setEditData({});
  };

  const deleteAlbum = (albumId) => {
    setData((prev) => ({
      ...prev,
      albums: prev.albums.filter((a) => a.id !== albumId),
      gallery: prev.gallery.filter((g) => g.albumId !== albumId),
    }));
  };

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
    else if (editModal === "infobar") newData.infoBar = editData.items;
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
    persistData(newData);
    setEditModal(null);
    setEditData({});
  };

  const deleteItem = (type, id) => {
    const newData = { ...data };
    if (type === "meet") newData.meets = newData.meets.filter((m) => m.id !== id);
    if (type === "result") newData.results = newData.results.filter((r) => r.id !== id);
    if (type === "sponsor") newData.sponsors = newData.sponsors.filter((s) => s.id !== id);
    setData(newData);
    persistData(newData);
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
            <img src="/logo-nav.png" alt="" style={{ height: 34, marginLeft: "-0.15rem" }} />
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
      <section id="home" className="hero hero-white">
        <div className="hero-content">
          {adminMode && (
            <button className="hero-edit-home-btn" onClick={() => openEdit("hero", data.hero)}>
              <Edit3 size={14} /> Edit Home Screen
            </button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-stamp.png" alt="Back on Track" className="hero-stamp" />

          <div className="hero-sub">{data.hero.subhead}</div>
          <p className="hero-tagline">{data.hero.tagline}</p>
          <a className="btn-primary hero-btn-dark" href="#schedule" onClick={(e) => { e.preventDefault(); scrollTo("schedule"); }}>
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
            <span className="info-item-value">North Hagerstown High School</span>
          </div>
          <div className="info-item">
            <span className="info-item-label">501(c)(3) Nonprofit</span>
            <span className="info-item-value">Cumberland Valley Athletic Club</span>
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
          <p className="section-desc">Dates will be announced soon for this summer&apos;s All-Comers Track & Field Series. All meets are free to attend for students. All other participants: $5 per event. Open to athletes of every age and ability.</p>

          <div className="waiver-banner">
            <FileText size={28} style={{ color: colors.orange, flexShrink: 0 }} />
            <p>
              <strong>Participant Waiver Required</strong>
              All athletes must have a signed waiver form. Parents/guardians must sign for minors. Waivers are also available at each meet.
            </p>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexShrink: 0 }}>
              <a className="btn-primary" href={data.waiverUrl} target="_blank" rel="noopener noreferrer" style={{ padding: "0.6rem 1.5rem", fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                Download Waiver
              </a>
              {adminMode && (
                <button className="btn-sm primary" onClick={openWaiverUpload} style={{ display: "flex", alignItems: "center", gap: "0.4rem", whiteSpace: "nowrap" }}>
                  <Upload size={14} /> Replace Waiver
                </button>
              )}
            </div>
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
                  <div className="meet-card-detail"><Clock size={16} /><span>{meet.time} — Registration at 5:45 PM</span></div>
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
            {["2026", "2025", "2024", "2023"].map((year) => (
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

        {adminMode && (
          <div className="gallery-admin-bar">
            <button className="gallery-upload-btn" onClick={() => openEdit("album-add")}>
              <FolderPlus size={18} /> Create Album
            </button>
          </div>
        )}

        {data.albums.length === 0 && data.gallery.length === 0 ? (
          <div className="gallery-empty">
            <ImageIcon size={48} strokeWidth={1} />
            <p>Photos coming soon!</p>
            <p style={{ fontSize: "0.85rem", opacity: 0.6 }}>Check back after our first meet of the season.</p>
          </div>
        ) : (
          <>
            {/* ── Albums as scrolling sections ── */}
            {data.albums.map((album) => {
              const albumPhotos = data.gallery.filter((g) => g.albumId === album.id);
              return (
                <div key={album.id} className="album-section">
                  <div className="album-header">
                    {album.coverUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={album.coverUrl} alt={album.name} className="album-cover" />
                    ) : (
                      <div className="album-cover-placeholder">
                        <Camera size={32} />
                      </div>
                    )}
                    <div className="album-info">
                      <h3 className="album-name">{album.name}</h3>
                      <div className="album-date"><Calendar size={14} /> {album.date}</div>
                      <div className="album-count">{albumPhotos.length} photo{albumPhotos.length !== 1 ? "s" : ""}</div>
                    </div>
                    {adminMode && (
                      <div className="album-admin-actions">
                        <button className="gallery-upload-btn" onClick={() => openCloudinaryUpload(album.id)} style={{ fontSize: "0.8rem", padding: "0.5rem 1rem" }}>
                          <Upload size={14} /> Upload
                        </button>
                        <button className="album-delete-btn" onClick={() => deleteAlbum(album.id)} title="Delete album">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  {albumPhotos.length === 0 ? (
                    <div className="album-empty">
                      <p>No photos yet — {adminMode ? "click Upload to add photos" : "check back soon!"}</p>
                    </div>
                  ) : (
                    <div className="gallery-grid">
                      {albumPhotos.map((item) => (
                        <div key={item.id} className="gallery-item">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.imageUrl} alt={item.caption || "Gallery photo"} className="gallery-img" loading="lazy" />
                          {adminMode && (
                            <button className="gallery-delete-btn" onClick={() => deleteGalleryImage(item.id)} title="Remove photo">
                              <Trash2 size={14} />
                            </button>
                          )}
                          {item.caption && <div className="gallery-caption">{item.caption}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* ── General / untagged photos ── */}
            {data.gallery.filter((g) => g.albumId === "general").length > 0 && (
              <div className="album-section">
                <div className="album-header">
                  <div className="album-cover-placeholder">
                    <Camera size={32} />
                  </div>
                  <div className="album-info">
                    <h3 className="album-name">General Photos</h3>
                    <div className="album-count">{data.gallery.filter((g) => g.albumId === "general").length} photo{data.gallery.filter((g) => g.albumId === "general").length !== 1 ? "s" : ""}</div>
                  </div>
                  {adminMode && (
                    <div className="album-admin-actions">
                      <button className="gallery-upload-btn" onClick={() => openCloudinaryUpload(null)} style={{ fontSize: "0.8rem", padding: "0.5rem 1rem" }}>
                        <Upload size={14} /> Upload
                      </button>
                    </div>
                  )}
                </div>
                <div className="gallery-grid">
                  {data.gallery.filter((g) => g.albumId === "general").map((item) => (
                    <div key={item.id} className="gallery-item">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.imageUrl} alt={item.caption || "Gallery photo"} className="gallery-img" loading="lazy" />
                      {adminMode && (
                        <button className="gallery-delete-btn" onClick={() => deleteGalleryImage(item.id)} title="Remove photo">
                          <Trash2 size={14} />
                        </button>
                      )}
                      {item.caption && <div className="gallery-caption">{item.caption}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

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
        {newsletterSent ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", padding: "1rem", background: "rgba(0,0,0,0.1)", borderRadius: 12, maxWidth: 450, margin: "0 auto" }}>
            <CheckCircle size={22} />
            <span style={{ fontWeight: 700 }}>You&apos;re signed up! We&apos;ll be in touch.</span>
          </div>
        ) : (
          <form
            action="https://formsubmit.co/backontrackhgr@gmail.com"
            method="POST"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              fetch(form.action, { method: "POST", body: new FormData(form) })
                .then(() => setNewsletterSent(true))
                .catch(() => setNewsletterSent(true));
            }}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <input type="hidden" name="_subject" value="New Back on Track Newsletter Signup" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />
            <div className="newsletter-form" style={{ maxWidth: 450 }}>
              <input type="email" name="email" placeholder="Your email address" required style={{ borderColor: "rgba(0,0,0,0.15)" }} />
              <button type="submit" className="btn-primary" style={{ background: colors.black, color: "white", boxShadow: "none" }}>Subscribe</button>
            </div>
          </form>
        )}
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
            {data.sponsors.map((sponsor) => {
              const card = (
                <div key={sponsor.id} className="sponsor-card" style={sponsor.website && sponsor.website !== "#" ? { cursor: "pointer" } : {}}>
                  <div className="sponsor-logo-placeholder"><Star size={24} /></div>
                  <div className="sponsor-name">{sponsor.name}</div>
                  <div className="sponsor-level">{sponsor.level} Sponsor</div>
                  {adminMode && (
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "0.75rem" }}>
                      <button className="btn-sm ghost" onClick={(e) => { e.preventDefault(); e.stopPropagation(); openEdit("sponsor-edit", sponsor); }}><Edit3 size={12} /></button>
                      <button className="btn-sm danger" style={{ padding: "0.4rem 0.6rem" }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteItem("sponsor", sponsor.id); }}><Trash2 size={12} /></button>
                    </div>
                  )}
                </div>
              );
              return sponsor.website && sponsor.website !== "#" ? (
                <a key={sponsor.id} href={sponsor.website} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>{card}</a>
              ) : (
                card
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <a className="btn-outline" href="https://www.zeffy.com/en-US/donation-form/donate-to-pete-wright-memorial-all-comers-summer-track-series" target="_blank" rel="noopener noreferrer" style={{ color: colors.black, borderColor: colors.black }}>
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
            <div style={{ borderRadius: 16, overflow: "hidden", height: "100%", minHeight: 300 }}>
              <iframe
                title="North Hagerstown High School Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(data.contact.address)}&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 300 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
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
          <a href="https://bperkins-wlr.github.io" target="_blank" rel="noopener noreferrer" className="built-by-credit">
            Built by <span className="bp-credit-bp">BP</span><span className="bp-credit-slash">/</span><span className="bp-credit-wd">Web Design</span>
          </a>
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
                <div className="admin-field"><label>Highlights</label><input value={editData.highlights || ""} onChange={(e) => setEditData({ ...editData, highlights: e.target.value })} placeholder="e.g., Great turnout!" /></div>
                <div className="admin-field">
                  <label>Results PDF</label>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <input value={editData.downloadUrl || ""} onChange={(e) => setEditData({ ...editData, downloadUrl: e.target.value })} placeholder="URL will appear here after upload" style={{ flex: 1 }} />
                    <button type="button" className="btn-sm primary" onClick={() => {
                      if (!window.cloudinary) { alert("Upload widget is still loading."); return; }
                      const w = window.cloudinary.createUploadWidget({
                        cloudName: CLOUD_NAME, uploadPreset: UPLOAD_PRESET,
                        folder: "backontrack-results", sources: ["local"], multiple: false, maxFiles: 1,
                        resourceType: "raw", clientAllowedFormats: ["pdf"], maxFileSize: 10000000,
                        styles: { palette: { window: "#1A1A1A", windowBorder: "#F5A123", tabIcon: "#F5A123", menuIcons: "#F5A123", textDark: "#1A1A1A", textLight: "#FFFFFF", link: "#F5A123", action: "#F5A123", inactiveTabIcon: "#888", error: "#FF4444", inProgress: "#F5A123", complete: "#28A745", sourceBg: "#2A2A2A" } }
                      }, (err, res) => {
                        if (!err && res && res.event === "success") {
                          setEditData((prev) => ({ ...prev, downloadUrl: res.info.secure_url }));
                        }
                      });
                      w.open();
                    }} style={{ display: "flex", alignItems: "center", gap: "0.4rem", whiteSpace: "nowrap" }}>
                      <Upload size={14} /> Upload PDF
                    </button>
                  </div>
                </div>
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
            {editModal === "infobar" && (
              <>
                <h3>Edit Info Bar</h3>
                <p style={{ fontSize: "0.85rem", color: colors.medGray, marginBottom: "1rem" }}>Edit the orange info bar items shown below the hero section.</p>
                {(editData.items || []).map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", alignItems: "end" }}>
                    <div className="admin-field" style={{ flex: 1, marginBottom: 0 }}><label>Label {i + 1}</label><input value={item.label} onChange={(e) => { const items = [...editData.items]; items[i] = { ...items[i], label: e.target.value }; setEditData({ ...editData, items }); }} /></div>
                    <div className="admin-field" style={{ flex: 1, marginBottom: 0 }}><label>Value {i + 1}</label><input value={item.value} onChange={(e) => { const items = [...editData.items]; items[i] = { ...items[i], value: e.target.value }; setEditData({ ...editData, items }); }} /></div>
                    <button type="button" className="btn-sm danger" style={{ padding: "0.4rem 0.6rem", marginBottom: "0.15rem" }} onClick={() => { const items = editData.items.filter((_, idx) => idx !== i); setEditData({ ...editData, items }); }}><Trash2 size={12} /></button>
                  </div>
                ))}
                <button type="button" className="btn-sm ghost" onClick={() => setEditData({ ...editData, items: [...(editData.items || []), { label: "", value: "" }] })} style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.5rem" }}><Plus size={14} /> Add Item</button>
              </>
            )}
            {editModal === "album-add" && (
              <>
                <h3>Create New Album</h3>
                <p style={{ fontSize: "0.85rem", color: colors.medGray, marginBottom: "1rem" }}>Create an album for a specific meet or event to organize your photos.</p>
                <div className="admin-field"><label>Album Name</label><input placeholder="e.g. Meet #1 — Season Opener" value={editData.albumName || ""} onChange={(e) => setEditData({ ...editData, albumName: e.target.value })} /></div>
                <div className="admin-field"><label>Date</label><input type="date" value={editData.albumDate || ""} onChange={(e) => setEditData({ ...editData, albumDate: e.target.value })} /></div>
              </>
            )}
            <div className="admin-btn-row">
              <button className="btn-sm ghost" onClick={() => setEditModal(null)}>Cancel</button>
              {editModal === "album-add" ? (
                <button className="btn-sm primary" onClick={addAlbum} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><FolderPlus size={14} /> Create Album</button>
              ) : (
                <button className="btn-sm primary" onClick={saveEdit} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><Save size={14} /> Save Changes</button>
              )}
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
