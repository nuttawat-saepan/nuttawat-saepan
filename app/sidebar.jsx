"use client";

import { useEffect, useRef, useState } from "react";

const sections = [
  ["Home", "#home"],
  ["Profile", "#profile"],
  ["What I do", "#what-i-do"],
  ["Projects", "#projects"],
  ["Contact", "#contact"],
];

const FOCUSABLE = "a[href], button:not([disabled])";

// The menu is a non-modal dialog so the hamburger beside it stays clickable and can close it.
// Inertness, the focus loop, Escape and focus return are handled here instead of by showModal().
export default function Sidebar() {
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");

  function visibleToggle() {
    return [...document.querySelectorAll(".sidebar-toggle, .mobile-menu-toggle")].find((button) => button.offsetParent !== null);
  }

  function openMenu(button) {
    const hash = window.location.hash;
    setActiveSection(sections.some(([, href]) => href === hash) ? hash : "#home");
    toggleRef.current = button;
    menuRef.current.show();
    setIsOpen(true);
  }

  function closeMenu({ restoreFocus = true } = {}) {
    if (!menuRef.current.open) return;
    menuRef.current.close();
    setIsOpen(false);
    if (restoreFocus) (toggleRef.current ?? visibleToggle())?.focus();
  }

  function toggleMenu(event) {
    if (menuRef.current.open) closeMenu();
    else openMenu(event.currentTarget);
  }

  useEffect(() => {
    const outside = [document.querySelector(".portfolio-viewport"), document.querySelector(".skip-link"), ...document.querySelectorAll(".monogram, .sidebar-name")];
    outside.forEach((element) => element?.toggleAttribute("inert", isOpen));
    if (!isOpen) return;

    menuRef.current.querySelector(".menu-links a")?.focus();

    function onKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== "Tab") return;
      const order = [toggleRef.current ?? visibleToggle(), ...menuRef.current.querySelectorAll(FOCUSABLE)].filter(Boolean);
      const index = order.indexOf(document.activeElement);
      const next = event.shiftKey ? (index <= 0 ? order.length - 1 : index - 1) : (index === order.length - 1 ? 0 : index + 1);
      event.preventDefault();
      order[next].focus();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      outside.forEach((element) => element?.removeAttribute("inert"));
    };
  }, [isOpen]);

  function menuButton(className) {
    return (
      <button className={className} type="button" onClick={toggleMenu}
        aria-label={isOpen ? "ปิดเมนูหลัก" : "เปิดเมนูหลัก"} aria-controls="sidebar-navigation" aria-expanded={isOpen}>
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

      <dialog ref={menuRef} className="fullscreen-menu" id="sidebar-navigation" aria-label="เมนูหลัก" onClose={() => setIsOpen(false)}>
        <div className="menu-heading">
          <a className="menu-brand" href="#home" onClick={() => closeMenu({ restoreFocus: false })}>Nuttawat Saepan<i className="dot" aria-hidden="true">.</i></a>
        </div>
        <nav className="menu-links" aria-label="เลือกส่วนของพอร์ต">
          {sections.map(([label, href], index) => (
            <a key={href} href={href} onClick={() => closeMenu({ restoreFocus: false })} aria-current={activeSection === href ? "location" : undefined}
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
