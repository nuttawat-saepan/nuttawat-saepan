"use client";

import { useEffect } from "react";

export default function Motion() {
  useEffect(() => {
    const intro = document.querySelector('.opening');
    const hero = document.querySelector('.editorial-hero');
    const portrait = document.querySelector('.portrait-space img');
    const canvas = document.querySelector('.portrait-space canvas');
    const context = canvas.getContext('2d');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const wordLayers = [...document.querySelectorAll('.opening-word')];
    const wordLetters = wordLayers.map(layer => [...layer.querySelectorAll('.opening-letter')]);
    const designLetters = [...document.querySelectorAll('.opening-design .opening-letter')];
    const wordStarts = [0, 1200, 2400, 3500];
    const expandStart = 4100;
    const introEnd = 5400;
    const clamp = value => Math.max(0, Math.min(1, value));
    const easeOut = value => 1 - Math.pow(1 - value, 3);
    function renderLetters(letters, elapsed, start, exit = Infinity) {
      letters.forEach((letter, index) => {
        const stagger = index * 28;
        const arriving = easeOut(clamp((elapsed - start - stagger) / 460));
        const leaving = clamp((elapsed - exit - stagger) / 320);
        const offset = (1 - arriving) * 115 - leaving * leaving * 115;
        const tilt = (1 - arriving) * -55 + leaving * 35;
        letter.style.transform = 'translateY(' + offset + '%) rotateX(' + tilt + 'deg)';
      });
    }
    function renderWords(elapsed) {
      wordLayers.forEach((layer, index) => {
        const exit = wordStarts[index + 1] ?? Infinity;
        layer.style.visibility = elapsed >= wordStarts[index] && elapsed < exit + 520 ? 'visible' : 'hidden';
        renderLetters(wordLetters[index], elapsed, wordStarts[index], exit);
      });
      renderLetters(designLetters, elapsed, 100);
    }
    const media = [...document.querySelector('.opening-media').children];
    const topTitle = hero.querySelector('h1');
    const bottomTitle = hero.querySelector('.hero-bottom-title');
    const introTitles = [...document.querySelector('.opening-stage').children];
    let titleMoves = [];
    let distortion = 0;
    function measureTitles() {
      introTitles.forEach(element => { element.style.transform = ''; });
      titleMoves = introTitles.map((element, index) => {
        const from = element.getBoundingClientRect();
        const to = [topTitle, bottomTitle][index].getBoundingClientRect();
        return {
          x: to.x + to.width / 2 - from.x - from.width / 2,
          y: to.y + to.height / 2 - from.y - from.height / 2,
          scale: to.width / from.width,
        };
      });
    }
    let width = 0;
    let height = 0;
    let pointerX = .5;
    let disposed = false;
    let frame = 0;
    let running = false;
    let started = performance.now();
    function resize() {
      width = hero.clientWidth;
      height = hero.clientHeight;
      const scale = Math.min(devicePixelRatio, 1.5);
      canvas.width = width * scale;
      canvas.height = height * scale;
      context.setTransform(scale, 0, 0, scale, 0, 0);
      measureTitles();
    }
    function paint(time) {
      if (!portrait.complete || !portrait.naturalWidth) return;
      context.clearRect(0, 0, width, height);
      const scale = Math.max(width / portrait.naturalWidth, height / portrait.naturalHeight);
      const sw = width / scale;
      const sh = height / scale;
      const sx = (portrait.naturalWidth - sw) / 2;
      const sy = (portrait.naturalHeight - sh) / 2;
      const cycle = (time / 1000) % 7;
      const pulse = reduced.matches ? 0 : Math.pow(Math.max(0, Math.sin(cycle * Math.PI / 3.5)), 5);
      for (let x = 0; x < width; x += 2) {
        const near = Math.exp(-Math.pow((x / width - pointerX) * 5, 2));
        const wave = Math.sin(x * 1.73 + time * .001) * Math.sin(x * .127 + time * .0007);
        const displacement = reduced.matches ? 0 : distortion * wave * (pulse * height * .12 + near * height * .018);
        context.drawImage(portrait, sx + x / scale, sy, 2 / scale, sh, x, displacement, 2.2, height);
      }
    }
    function animate(time) {
      const elapsed = time - started;
      renderWords(elapsed);
      const index = elapsed < 700 ? 0 : elapsed < 1200 ? 1 : elapsed < 1850 ? 0 : elapsed < 2400 ? 1 : elapsed < 3700 ? 2 : 3;
      media.forEach((element, i) => element.classList.toggle('active', i === index));
      const progress = clamp((elapsed - expandStart) / 1200);
      const entering = progress * progress * (3 - 2 * progress);
      const handoff = clamp((elapsed - (introEnd - 250)) / 250);
      introTitles.forEach((element, i) => {
        const move = titleMoves[i];
        element.style.transform = 'translate(' + move.x * entering + 'px,' + move.y * entering + 'px) scale(' + (1 + (move.scale - 1) * entering) + ')';
      });
      intro.style.setProperty('--enter', entering);
      intro.style.setProperty('--handoff', handoff);
      hero.style.setProperty('--reveal', handoff);
      document.body.classList.toggle('intro-finished', handoff === 1);
      distortion = clamp((elapsed - introEnd) / 800);
      if (hero.getBoundingClientRect().bottom > 0) paint(time);
      updateScroll();
      if (running) frame = requestAnimationFrame(animate);
    }
    function updateMotion() {
      cancelAnimationFrame(frame);
      running = !reduced.matches && !document.hidden;
      if (reduced.matches) {
        intro.hidden = true;
        document.body.classList.add('intro-finished');
        hero.style.setProperty('--reveal', 1);
        for (const title of [topTitle, bottomTitle]) {
          for (const letter of title.children) letter.style.transform = '';
        }
        paint(0);
      } else if (running) {
        intro.hidden = false;
        frame = requestAnimationFrame(animate);
      }
    }
    const profile = document.querySelector('.profile-section');
    const profileStage = document.querySelector('.profile-stage');
    const projects = document.querySelector('.projects-section');
    const images = [...document.querySelectorAll('.project-image')];
    const backs = [...document.querySelectorAll('.project-backdrop')];
    const copies = [...document.querySelectorAll('.project-copy')];
    function updateScroll() {
      const vh = window.innerHeight;
      const pr = profile.getBoundingClientRect();
      const pp = reduced.matches ? 1 : easeOut(clamp(-pr.top / Math.max(1,pr.height-vh)));
      profileStage.style.setProperty('--profile', pp);
      const rect = projects.getBoundingClientRect();
      const raw = clamp(-rect.top / Math.max(1, rect.height-vh)) * (images.length - .15);
      const current = Math.min(images.length-1, Math.floor(raw));
      const transition = current === images.length-1 ? 0 : easeOut(clamp((raw-current-.48)/.52));
      images.forEach((el,i)=> {
        const scale = i<=current ? 1 : i===current+1 ? transition : 0;
        el.style.transform = 'scale('+scale+')';
        backs[i].style.opacity = i===current ? 1 : i===current+1 ? transition : 0;
        const active = i===current && transition<.5 || i===current+1 && transition>=.5;
        const y = i===current ? -transition*100 : i===current+1 ? (1-transition)*100 : 100;
        copies[i].style.transform = 'translateY('+y+'%)';
        copies[i].style.opacity = i===current ? 1-transition : i===current+1 ? transition : 0;
        copies[i].style.pointerEvents = active || reduced.matches ? 'auto' : 'none';
        copies[i].inert = !active && !reduced.matches;
      });
    }
    function onAnchor(event) {
      const link = event.target.closest('a[href^="#project-"]');
      if (!link) return;
      const target = document.getElementById(link.hash.slice(1));
      if (target) target.open = true;
    }
    document.addEventListener('click', onAnchor);
    window.addEventListener('scroll', updateScroll, {passive:true});
    updateScroll();
    function onPointerMove(event) {
      const rect = hero.getBoundingClientRect();
      pointerX = (event.clientX - rect.left) / rect.width;
    }
    hero.addEventListener('pointermove', onPointerMove);
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', updateMotion);
    reduced.addEventListener('change', updateMotion);
    function onImageLoad() { paint(0); }
    portrait.addEventListener('load', onImageLoad);
    function onKeyDown(event) {
      if (event.key === 'Tab' || event.key === 'Escape') started = performance.now() - introEnd;
    }
    document.addEventListener('keydown', onKeyDown);
    resize();
    document.fonts.ready.then(() => {
      if (disposed) return;
      measureTitles();
      started = performance.now();
      updateMotion();
      media.filter(el => el.tagName === 'VIDEO').forEach(el => el.play().catch(() => {}));
    });
    return () => {
      disposed = true;
      running = false;
      cancelAnimationFrame(frame);
      document.removeEventListener('click', onAnchor);
      window.removeEventListener('scroll', updateScroll);
      hero.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', updateMotion);
      reduced.removeEventListener('change', updateMotion);
      portrait.removeEventListener('load', onImageLoad);
      document.removeEventListener('keydown', onKeyDown);
      media.filter(el => el.tagName === 'VIDEO').forEach(el => el.pause());
      document.body.classList.remove('intro-finished');
      hero.style.removeProperty('--reveal');
    };
  }, []);
  return null;
}
