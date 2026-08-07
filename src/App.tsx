import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import './App.css';

const chapters = [
  { id: '01', label: 'Observe', title: 'Small moments\nbecome worlds.', text: 'A quiet collection of photographs, places, and passing light.', accent: '#ff694a', shape: 'sphere' },
  { id: '02', label: 'Wander', title: 'Follow the\ncurious path.', text: 'Cities, coastlines, and the pleasing geometry found in between.', accent: '#675cff', shape: 'cube' },
  { id: '03', label: 'Keep', title: 'Make room\nfor wonder.', text: 'A personal archive of the things worth looking at twice.', accent: '#e7c64b', shape: 'ring' },
];

function ShapeWorld() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 70, damping: 24, mass: 0.4 });
  const sphereY = useTransform(smoothProgress, [0, 0.35, 0.7, 1], ['4vh', '-8vh', '13vh', '-3vh']);
  const cubeY = useTransform(smoothProgress, [0, 0.4, 0.8, 1], ['20vh', '-10vh', '8vh', '-14vh']);
  const ringY = useTransform(smoothProgress, [0, 0.4, 0.75, 1], ['-20vh', '6vh', '-8vh', '16vh']);
  const sphereRotate = useTransform(smoothProgress, [0, 1], [0, 210]);
  const cubeRotate = useTransform(smoothProgress, [0, 1], [12, -145]);
  const ringRotate = useTransform(smoothProgress, [0, 1], [-32, 160]);
  const worldScale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.14, 0.92]);

  return (
    <motion.div className="shape-world" style={{ scale: worldScale }} aria-hidden="true">
      <motion.div className="shape shape--sphere" style={{ y: sphereY, rotate: sphereRotate }} />
      <motion.div className="shape shape--cube" style={{ y: cubeY, rotate: cubeRotate }} />
      <motion.div className="shape shape--ring" style={{ y: ringY, rotate: ringRotate }} />
      <div className="shape shape--dot dot--one" />
      <div className="shape shape--dot dot--two" />
    </motion.div>
  );
}

export default function App() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>('[data-chapter]')];
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(Number((entry.target as HTMLElement).dataset.chapter))),
      { threshold: 0.56 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <ShapeWorld />
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Bryan home">b.</a>
        <p>Personal archive<br />of Bryan</p>
        <a className="contact-link" href="mailto:hello@example.com">Say hello <span>↗</span></a>
      </header>

      <nav className="chapter-nav" aria-label="Page sections">
        {chapters.map((chapter, index) => (
          <a className={active === index ? 'is-active' : ''} href={`#${chapter.label.toLowerCase()}`} key={chapter.id}>
            <span>{chapter.id}</span><i style={{ backgroundColor: chapter.accent }} />
          </a>
        ))}
      </nav>

      <section className="intro" id="top">
        <p className="eyebrow">Scroll to explore</p>
        <h1>Things I’ve<br /><em>noticed.</em></h1>
        <p className="intro-note">A little moving gallery.<br />No instructions needed.</p>
        <div className="scroll-cue"><span>↓</span> Take your time</div>
      </section>

      {chapters.map((chapter, index) => (
        <section className={`chapter chapter--${chapter.shape}`} id={chapter.label.toLowerCase()} data-chapter={index} key={chapter.id}>
          <div className="chapter-content">
            <p className="eyebrow" style={{ color: chapter.accent }}>{chapter.id} — {chapter.label}</p>
            <h2>{chapter.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h2>
            <p className="chapter-copy">{chapter.text}</p>
            <a href="#top" className="round-link" aria-label={`Explore ${chapter.label}`}>↗</a>
          </div>
          <p className="chapter-index">0{index + 1}</p>
        </section>
      ))}

      <footer>
        <p>Made with an eye for the in-between.</p>
        <a href="mailto:hello@example.com">hello@example.com</a>
      </footer>
    </main>
  );
}
