const intro = document.querySelector('.opening');
const hero = document.querySelector('.editorial-hero');
const portrait = document.querySelector('.portrait-space img');
const canvas = document.querySelector('.portrait-space canvas');
const context = canvas.getContext('2d');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const words = ['SOFTWARE', 'MOBILE', 'ROBOTICS'];
const changing = document.querySelector('.opening-changing');
const media = [...document.querySelector('.opening-media').children];
const topTitle = hero.querySelector('h1');
const bottomTitle = hero.querySelector('.hero-bottom-title');
for (const title of [topTitle, bottomTitle]) {
  const text = title.textContent;
  title.textContent = '';
  for (const letter of text) {
    const span = document.createElement('span');
    span.textContent = letter;
    title.append(span);
  }
}
let width = 0;
let height = 0;
let pointerX = .5;
let pointerY = .5;
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
    const displacement = wave * (pulse * height * .12 + near * height * .018);
    context.drawImage(portrait, sx + x / scale, sy, 2 / scale, sh, x, displacement, 2.2, height);
  }
}
function animate(time) {
  const elapsed = time - started;
  const index = Math.min(2, Math.floor(elapsed / 900));
  changing.textContent = words[index];
  media.forEach((element, i) => element.classList.toggle('active', i === index));
  const entering = Math.max(0, Math.min(1, (elapsed - 2700) / 950));
  intro.style.setProperty('--enter', entering);
  document.body.classList.toggle('intro-finished', entering === 1);
  paint(time);
  const turn = Math.max(0, Math.sin((time - started - 3600) / 1400));
  for (const title of [topTitle, bottomTitle]) {
    [...title.children].forEach((letter, i) => {
      letter.style.transform = i % 3 === 1 ? 'rotateY(' + (turn * 180) + 'deg)' : '';
    });
  }
  if (running) frame = requestAnimationFrame(animate);
}
function updateMotion() {
  cancelAnimationFrame(frame);
  running = !reduced.matches && !document.hidden;
  if (reduced.matches) {
    intro.hidden = true;
    document.body.classList.add('intro-finished');
    paint(0);
  } else if (running) {
    intro.hidden = false;
    frame = requestAnimationFrame(animate);
  }
}
hero.addEventListener('pointermove', event => {
  const rect = hero.getBoundingClientRect();
  pointerX = (event.clientX - rect.left) / rect.width;
  pointerY = (event.clientY - rect.top) / rect.height;
});
window.addEventListener('resize', resize);
document.addEventListener('visibilitychange', updateMotion);
reduced.addEventListener('change', updateMotion);
portrait.addEventListener('load', () => paint(0));
document.addEventListener('keydown', event => {
  if (event.key === 'Tab' || event.key === 'Escape') started = performance.now() - 4000;
});
resize();
document.fonts.ready.then(() => {
  started = performance.now();
  updateMotion();
  media[1].play().catch(() => {});
});
