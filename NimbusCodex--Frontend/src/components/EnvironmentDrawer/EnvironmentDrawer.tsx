import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Rocket, Check } from 'lucide-react';
import type { Environment } from '../../data/environments';
import styles from './EnvironmentDrawer.module.css';

interface Props {
  env: Environment | null;
  onClose: () => void;
}

export default function EnvironmentDrawer({ env, onClose }: Props) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleLaunch = () => {
    if (!env) return;
    navigate(`/lab?env=${env.id}`);
  };

  return (
    <>
      <div
        className={`${styles.overlay} ${env ? styles.overlayVisible : ''}`}
        onClick={onClose}
      />
      <div
        className={`${styles.drawer} ${env ? styles.drawerOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={env ? `${env.name} environment details` : 'Environment details'}
      >
        {env && (
          <div className={styles.content}>
            <div className={styles.handle} />

            <button className={styles.closeBtn} onClick={onClose} aria-label="Close drawer">
              <X size={18} />
            </button>

            <div
              className={styles.header}
              style={{ '--accent': env.color } as React.CSSProperties}
            >
              <div className={styles.iconRing}>
                <span className={styles.icon}>{env.icon}</span>
              </div>
              <div>
                <h2 className={styles.name}>{env.name}</h2>
                <p className={styles.desc}>{env.description}</p>
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Libraries Included</h3>
              <ul className={styles.libList}>
                {env.libraries.map((lib) => (
                  <li key={lib} className={styles.libItem}>
                    <span className={styles.checkIcon}>
                      <Check size={13} />
                    </span>
                    <code className={styles.libName}>{lib}</code>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Language</h3>
              <span
                className={styles.langPill}
                style={{ '--accent': env.color } as React.CSSProperties}
              >
                {env.language}
              </span>
            </div>

            <button
              className={styles.launchBtn}
              onClick={handleLaunch}
              style={{ '--accent': env.color } as React.CSSProperties}
            >
              <Rocket size={16} />
              Launch Environment
            </button>
          </div>
        )}
      </div>
    </>
  );
}
