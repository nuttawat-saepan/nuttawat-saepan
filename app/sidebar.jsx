"use client";

import { useRef, useState } from "react";

const sections = [
  ["Home", "#home"],
  ["Profile", "#profile"],
  ["Projects", "#projects"],
  ["Techstack", "#techstack"],
  ["Contact", "#contact"],
];

export default function Sidebar() {
  const menuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");

  function openMenu() {
    const hash = window.location.hash;
    setActiveSection(sections.some(([, href]) => href === hash) ? hash : "#home");
    menuRef.current.showModal();
    setIsOpen(true);
  }

  function closeMenu() {
    menuRef.current.close();
    setIsOpen(false);
  }

  function menuButton(className) {
    return (
      <button className={className} type="button" onClick={openMenu}
        aria-label="เปิดเมนูหลัก" aria-haspopup="dialog" aria-controls="sidebar-navigation" aria-expanded={isOpen}>
        <span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" />
      </button>
    );
  }

  return (
    <header className="site-header" id="top" data-theme="paper" data-menu-open={isOpen}>
      <div className="frame header-inner">
        <a className="monogram" href="#home" aria-label="Nuttawat Saepan — Home">NS<i className="dot" aria-hidden="true">.</i></a>
        {menuButton("mobile-menu-toggle")}
      </div>

      <div className="sidebar">
        {menuButton("sidebar-toggle")}
        <span className="sidebar-edition" lang="en">Folio — Edition</span>
        <a className="sidebar-name" href="#home" aria-label="Nuttawat Saepan — Home">Nuttawat Saepan</a>
        <span className="sidebar-year">© 2026</span>
      </div>

      <dialog ref={menuRef} className="fullscreen-menu" id="sidebar-navigation"
        aria-label="เมนูหลัก" onCancel={closeMenu} onClose={() => setIsOpen(false)}>
        <div className="menu-heading">
          <a className="menu-brand" href="#home" onClick={closeMenu}>Nuttawat Saepan<i className="dot" aria-hidden="true">.</i></a>
          <button className="menu-close" type="button" onClick={closeMenu} aria-label="ปิดเมนูหลัก" autoFocus>
            <span aria-hidden="true" /><span aria-hidden="true" />
          </button>
        </div>
        <nav className="menu-links" aria-label="เลือกส่วนของพอร์ต">
          {sections.map(([label, href], index) => (
            <a key={href} href={href} onClick={closeMenu} aria-current={activeSection === href ? "location" : undefined}
              style={{ "--item-index": index }}>
              <span className="menu-label"><span>{label}</span></span>
              <span className="menu-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
        <div className="menu-footer"><span>Software engineer</span><span>© 2026</span></div>
      </dialog>
    </header>
  );
}
