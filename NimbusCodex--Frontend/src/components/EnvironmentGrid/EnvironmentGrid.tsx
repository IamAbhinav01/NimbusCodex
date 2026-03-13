import type { Environment } from '../../data/environments';
import EnvironmentCard from '../EnvironmentCard/EnvironmentCard';
import styles from './EnvironmentGrid.module.css';

interface Props {
  onSelectEnv: (env: Environment) => void;
  environments: Environment[];
}

export default function EnvironmentGrid({ onSelectEnv, environments }: Props) {
  return (
    <section className={styles.section} id="environments">
      <div className={styles.sectionHeader}>
        <p className={styles.label}>Environments</p>
        <h2 className={styles.heading}>Pick Your Stack</h2>
        <p className={styles.sub}>
          Fully pre-configured cloud environments — ready in under 2 seconds.
        </p>
      </div>
      <div className={styles.grid}>
        {environments.map((env, i) => (
          <div
            key={env.id}
            className={styles.cardWrapper}
            style={{ animationDelay: `${i * 55}ms` }}
          >
            <EnvironmentCard env={env} onClick={onSelectEnv} />
          </div>
        ))}
      </div>
    </section>
  );
}
