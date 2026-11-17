"use client";

const sections = [
  ["Profile", "#profile"],
  ["Projects", "#projects"],
  ["Techstack", "#techstack"],
  ["Contact", "#contact"],
];

export default function Sidebar() {
  function closeMenu(event) {
    event.currentTarget.closest("[popover]").hidePopover();
  }

  return (
    <header className="site-header" id="top" data-theme="paper">
      <div className="frame header-inner">
        <a className="monogram" href="#home" aria-label="Nuttawat Saepan — Home">NS<i className="dot" aria-hidden="true">.</i></a>
        <nav aria-label="เมนูหลัก">
          {sections.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        </nav>
      </div>

      <div className="sidebar">
        <button className="sidebar-toggle" type="button" popoverTarget="sidebar-navigation" aria-label="เมนูหลัก">
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        <span className="sidebar-edition" lang="en">Folio — Edition</span>
        <a className="sidebar-name" href="#home" aria-label="Nuttawat Saepan — Home">Nuttawat Saepan</a>
        <span className="sidebar-year">© 2026</span>

        <nav className="sidebar-navigation" id="sidebar-navigation" popover="auto" aria-label="เมนูหลัก">
          <a href="#home" onClick={closeMenu}>Home</a>
          {sections.map(([label, href]) => <a key={href} href={href} onClick={closeMenu}>{label}</a>)}
        </nav>
      </div>
    </header>
  );
}
