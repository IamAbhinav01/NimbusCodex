import type { Environment } from '../../data/environments';
import styles from './EnvironmentCard.module.css';

interface Props {
  env: Environment;
  onClick: (env: Environment) => void;
}

export default function EnvironmentCard({ env, onClick }: Props) {
  return (
    <div
      className={styles.card}
      onClick={() => onClick(env)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(env)}
      aria-label={`Open ${env.name} environment`}
    >
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <span className={styles.icon}>{env.icon}</span>
        </div>
        <div className={styles.langBadge}>{env.language}</div>
      </div>

      <h3 className={styles.name}>{env.name}</h3>
      <p className={styles.description}>{env.description}</p>

      <div className={styles.divider} />

      <div className={styles.footer}>
        <div className={styles.libraries}>
          {env.libraries.slice(0, 3).map((lib) => (
            <span key={lib} className={styles.libTag}>{lib}</span>
          ))}
          {env.libraries.length > 3 && (
            <span className={styles.libMore}>+{env.libraries.length - 3}</span>
          )}
        </div>
        <span className={styles.arrow}>→</span>
      </div>
    </div>
  );
}
