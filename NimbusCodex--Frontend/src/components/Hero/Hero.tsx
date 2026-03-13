import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ChevronDown } from 'lucide-react';
import styles from './Hero.module.css';

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    type Particle = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      alpha: number;
    };

    const particles: Particle[] = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79,70,229,${p.alpha})`;
        ctx.fill();
      });

      // Draw faint connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(79,70,229,${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className={styles.hero}>
      <canvas ref={canvasRef} className={styles.canvas} />

      <div className={styles.gradientOrb1} />
      <div className={styles.gradientOrb2} />

      <div className={styles.content}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          Now in Beta — Free during early access
        </div>

        <h1 className={styles.title}>
          Instant Cloud
          <span className={styles.titleGradient}> Coding</span>
          <br />
          Environments
        </h1>

        <p className={styles.subtitle}>
          Launch Python, Node, Java, C++, Go or Rust in seconds.
          <br />
          Code, run, and iterate — entirely in your browser.
        </p>

        <div className={styles.actions}>
          <a href="#environments" className={styles.primaryBtn}>
            <Zap size={16} />
            Start Coding
          </a>
          <a href="#environments" className={styles.secondaryBtn}>
            Explore Environments
          </a>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span>9+</span> Environments
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <span>&lt;10s</span> Launch Time
          </div>
          <div className={styles.divider} />
          <div className={styles.stat}>
            <span>100%</span> Browser-based
          </div>
        </div>
      </div>

      <div className={styles.scrollHint}>
        <ChevronDown size={20} className={styles.scrollIcon} />
      </div>
    </section>
  );
}
