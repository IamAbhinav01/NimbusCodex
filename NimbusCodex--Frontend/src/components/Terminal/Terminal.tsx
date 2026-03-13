import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import styles from './Terminal.module.css';

export interface TerminalHandle {
  writeln: (text: string) => void;
  write: (text: string) => void;
  clear: () => void;
}

interface Props {
  language?: string;
}

const Terminal = forwardRef<TerminalHandle, Props>(({ language = 'python' }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useImperativeHandle(ref, () => ({
    writeln: (text: string) => xtermRef.current?.writeln(text),
    write: (text: string) => xtermRef.current?.write(text),
    clear: () => xtermRef.current?.clear(),
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    const term = new XTerm({
      theme: {
        background: '#0d1117',
        foreground: '#e6edf3',
        cursor: '#4f46e5',
        selectionBackground: 'rgba(79,70,229,0.3)',
        black: '#0d1117',
        brightBlack: '#484f58',
        green: '#22c55e',
        brightGreen: '#4ade80',
        cyan: '#06b6d4',
        brightCyan: '#22d3ee',
        blue: '#4f46e5',
        brightBlue: '#818cf8',
        yellow: '#eab308',
        red: '#ef4444',
        magenta: '#a855f7',
      },
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      fontSize: 13,
      lineHeight: 1.5,
      cursorBlink: true,
      cursorStyle: 'underline',
      scrollback: 1000,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(containerRef.current);
    fitAddon.fit();

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;

    // Welcome message
    term.writeln('\x1b[90m╭───────────────────────────────────────╮\x1b[0m');
    term.writeln(`\x1b[90m│\x1b[0m  \x1b[36mCloudLab Terminal\x1b[0m — \x1b[33m${language}\x1b[0m`);
    term.writeln('\x1b[90m╰───────────────────────────────────────╯\x1b[0m');
    term.writeln('');
    term.write('\x1b[32m$\x1b[0m ');

    const handleResize = () => fitAddonRef.current?.fit();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, [language]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.title}>Terminal</span>
        <div className={styles.dots}>
          <span className={styles.dot} style={{ background: '#ef4444' }} />
          <span className={styles.dot} style={{ background: '#eab308' }} />
          <span className={styles.dot} style={{ background: '#22c55e' }} />
        </div>
      </div>
      <div ref={containerRef} className={styles.terminal} />
    </div>
  );
});

Terminal.displayName = 'Terminal';
export default Terminal;
