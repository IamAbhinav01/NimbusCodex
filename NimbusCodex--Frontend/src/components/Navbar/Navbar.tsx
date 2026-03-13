import { Link } from 'react-router-dom';
import { Terminal, Github, BookOpen, Zap } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Terminal size={18} />
          </div>
          <span className={styles.logoText}>
            Nimbus<span className={styles.accent}>Codex</span>
          </span>
        </Link>

        <div className={styles.links}>
          <a href="#" className={styles.navLink}>
            <BookOpen size={14} />
            Docs
          </a>
          <a
            href="https://github.com/IamAbhinav01/NimbusCodex"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navLink}
          >
            <Github size={14} />
            GitHub
          </a>
          <Link to="/lab" className={styles.launchBtn}>
            <Zap size={14} />
            Launch
          </Link>
        </div>
      </div>
    </nav>
  );
}
