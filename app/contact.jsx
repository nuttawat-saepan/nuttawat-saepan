"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useLetterGlow from "./letter-glow";

// Contact details shown in the last panel. Resume: drop the PDF at public/resume.pdf.
export const contact = {
  email: "nuttawatsaepan@gmail.com",
  github: "https://github.com/nuttawat-saepan",
  resume: "/resume.pdf",
  place: "Bangkok, Thailand",
};

const HEADLINE = (
  <>Get in<br />touch<i className="dot">.</i></>
);

// Contact, after the user's two references (25 Nov): the layout of khanhnguyen.design's last panel
// (huge headline top left, links top right, "Contact to" + the email bottom left, a line bottom right),
// and the footer wordmark of melius.com: grey letters on a dotted ground, where a soft glow trails the
// pointer and lights only the letters (and the dots near it), fading when the pointer leaves.
// Our colours: the glow is the portfolio red with a warm paper highlight. Timings in MOTION_SPEC.md.
export default function Contact() {
  const footerRef = useRef(null);
  const titleRef = useRef(null);
  const glowRef = useRef(null);
  const dotsRef = useRef(null);
  const [time, setTime] = useState("");

  // Bangkok local time, once a minute (rendered after mount so the server and client agree).
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Bangkok" });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const timer = setInterval(tick, 30_000);
    return () => clearInterval(timer);
  }, []);

  const glowTargets = useCallback(() => [glowRef.current], []);
  useLetterGlow({ area: footerRef, bounds: titleRef, targets: glowTargets, dots: dotsRef });

  return (
    <footer ref={footerRef} className="contact" id="contact" data-theme="ink" aria-labelledby="contact-title">
      <span ref={dotsRef} className="ct-dots" aria-hidden="true" />
      <div className="frame contact-grid">
        <p className="chapter" aria-hidden="true"><span className="chapter-num">04</span><span className="chapter-name">/ contact</span></p>
        <ul className="contact-links">
          <li><a href={contact.github} target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a></li>
          <li><a href={contact.resume} target="_blank" rel="noopener">Resume <span aria-hidden="true">↗</span></a></li>
        </ul>
        <h2 ref={titleRef} id="contact-title" className="contact-title" lang="en">
          <span className="ct-base">{HEADLINE}</span>
          <span ref={glowRef} className="ct-glow glow-layer glow-fill" aria-hidden="true">{HEADLINE}</span>
        </h2>
        <div className="contact-mail">
          <p className="contact-to">Contact to</p>
          <a className="contact-email" href={`mailto:${contact.email}`}>{contact.email}</a>
        </div>
        <div className="contact-return">
          <p className="contact-place">{contact.place}<span aria-hidden="true"> — </span><time suppressHydrationWarning>{time ? `${time} GMT+7` : "GMT+7"}</time></p>
          <a className="wl-all contact-home" href="#home">Back to home <span aria-hidden="true">↑</span></a>
        </div>
      </div>
    </footer>
  );
}
