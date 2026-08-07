document.addEventListener('DOMContentLoaded', () => {
  const world = document.createElement('div');
  world.className = 'geometric-world';
  world.setAttribute('aria-hidden', 'true');
  world.innerHTML = `
    <div class="geo-shape geo-sphere"></div>
    <div class="geo-shape geo-cube"><i></i><b></b></div>
    <div class="geo-shape geo-ring"></div>
    <div class="geo-shape geo-pyramid"></div>
    <div class="geo-dot geo-dot-a"></div>
    <div class="geo-dot geo-dot-b"></div>`;
  document.body.prepend(world);

  if (!window.anime || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  anime({ targets:'.geo-dot', scale:[.65,1.25], opacity:[.35,.9], delay:anime.stagger(300), direction:'alternate', loop:true, duration:1400, easing:'easeInOutQuad' });

  const journey = anime.timeline({ autoplay:false, easing:'linear' });
  journey
    .add({ targets:'.geo-sphere', translateY:[0,-230], translateX:[0,-100], rotate:[0,130], scale:[1,1.35], duration:1000 }, 0)
    .add({ targets:'.geo-cube', translateY:[0,260], translateX:[0,120], rotate:[-12,145], scale:[1,.72], duration:1000 }, 0)
    .add({ targets:'.geo-ring', translateY:[0,-310], translateX:[0,-90], rotate:[0,240], scale:[1,.82], duration:1000 }, 0)
    .add({ targets:'.geo-pyramid', translateY:[0,220], translateX:[0,-60], rotate:[0,120], duration:1000 }, 0);
  let frame = 0;
  const scrub = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    journey.seek(journey.duration * Math.min(1, Math.max(0, scrollY / max)));
    frame = 0;
  };
  addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(scrub); }, { passive:true });
  scrub();
});
