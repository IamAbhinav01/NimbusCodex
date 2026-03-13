import { Play, Loader2 } from 'lucide-react';
import styles from './RunButton.module.css';

interface Props {
  onRun: () => void;
  isRunning: boolean;
}

export default function RunButton({ onRun, isRunning }: Props) {
  return (
    <div className={styles.container}>
      <button
        className={`${styles.btn} ${isRunning ? styles.running : ''}`}
        onClick={onRun}
        disabled={isRunning}
        aria-label={isRunning ? 'Running code…' : 'Run code'}
      >
        <span className={styles.ripple} />
        {isRunning ? (
          <>
            <Loader2 size={18} className={styles.spinner} />
            Running…
          </>
        ) : (
          <>
            <Play size={18} fill="currentColor" />
            Run Code
          </>
        )}
      </button>

      <div className={styles.shortcuts}>
        <kbd>Ctrl</kbd>
        <span>+</span>
        <kbd>Enter</kbd>
      </div>
    </div>
  );
}
