import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers, Clock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Environment } from '../../data/environments';
import CodeEditor from '../CodeEditor/CodeEditor';
import Terminal, { type TerminalHandle } from '../Terminal/Terminal';
import MetricsPanel from '../MetricsPanel/MetricsPanel';
import RunButton from '../RunButton/RunButton';
import styles from './Workspace.module.css';

interface Props {
  environment: Environment;
}

/** Format seconds as mm:ss */
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function Workspace({ environment }: Props) {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [code, setCode] = useState(environment.template);
  const [isRunning, setIsRunning] = useState(false);
  const [isLaunching, setIsLaunching] = useState(true);
  const terminalRef = useRef<TerminalHandle>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Session timer state
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  // Session resource limits
  const [memoryLimit, setMemoryLimit] = useState<number>(256);
  const [cpuLimit, setCpuLimit] = useState<number>(0.5);

  // Ref to track the session ID across the async lifecycle for cleanup
  const activeSessionRef = useRef<string | null>(null);

  // ─── Launch Environment ───────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;

    const launchEnvironment = async () => {
      try {
        console.log('[Workspace] Launching environment...');
        const response = await fetch('http://localhost:4000/api/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ env: environment.id })
        });

        if (!response.ok) throw new Error('Failed to launch');

        const data = await response.json();
        console.log('[Workspace] Session created:', data.session_id);

        if (!isMounted) {
          console.log('[Workspace] Component unmounted during launch, cleaning up orphaned session:', data.session_id);
          // keepalive: true ensures the browser completes this request even after navigation
          fetch(`http://localhost:4000/api/sessions/${data.session_id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
            keepalive: true,
          }).catch(console.error);
          return;
        }

        activeSessionRef.current = data.session_id;
        setSessionId(data.session_id);
        if (data.end_time) setEndTime(new Date(data.end_time));
        if (data.cpu_limit) setCpuLimit(data.cpu_limit);
        if (data.memory_limit) setMemoryLimit(data.memory_limit);

        setIsLaunching(false);
        terminalRef.current?.writeln('\x1b[90m> Connected to CloudLab Runtime via Orchestrator\x1b[0m');
        terminalRef.current?.writeln('\x1b[32m✓ Environment ready.\x1b[0m');
        terminalRef.current?.writeln('');
        terminalRef.current?.write('\x1b[32m$\x1b[0m ');
      } catch (error) {
        if (isMounted) {
          setIsLaunching(false);
          terminalRef.current?.writeln('\x1b[31m✗ Failed to connect to Orchestrator service.\x1b[0m');
        }
      }
    };

    launchEnvironment();

    return () => {
      isMounted = false;
      const sid = activeSessionRef.current;
      console.log('[Workspace] Cleanup triggered. Active session:', sid);
      if (sid) {
        fetch(`http://localhost:4000/api/sessions/${sid}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
          keepalive: true, // keeps request alive after component unmounts / page navigates
        }).catch(err => console.error('[Workspace] Cleanup DELETE failed:', err));
        activeSessionRef.current = null;
      }
    };
  }, [environment.id, token]);

  // ─── Countdown timer (ticks every second) ────────────────────────────────
  useEffect(() => {
    if (!endTime) return;

    const tick = () => {
      const diff = Math.max(0, Math.floor((endTime.getTime() - Date.now()) / 1000));
      setSecondsLeft(diff);
      if (diff === 0) setIsExpired(true);
    };
    
    tick(); // run immediately
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  // ─── Session status polling (every 30s) ───────────────────────────────────
  useEffect(() => {
    if (!sessionId || isExpired) return;

    const poll = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/sessions/${sessionId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.status === 'expired') setIsExpired(true);
        if (data.end_time) setEndTime(new Date(data.end_time));
      } catch { /* non-fatal */ }
    };

    const id = setInterval(poll, 30_000);
    return () => clearInterval(id);
  }, [sessionId, isExpired, token]);

  // ─── Run code ─────────────────────────────────────────────────────────────
  const handleRun = useCallback(async () => {
    if (isRunning || isLaunching || !sessionId || isExpired) return;
    setIsRunning(true);

    terminalRef.current?.writeln(`\x1b[90m> Executing ${environment.name}...\x1b[0m`);

    try {
      const response = await fetch('http://localhost:4000/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sessionId, code, language: environment.language })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.details || errData.error || 'Execution failed');
      }

      const data = await response.json();
      const normalise = (s: string) => s.replace(/\r?\n/g, '\r\n');

      if (data.stdout) terminalRef.current?.write(normalise(data.stdout));
      if (data.stderr) terminalRef.current?.write(`\x1b[31m${normalise(data.stderr)}\x1b[0m`);

      terminalRef.current?.writeln(`\x1b[90m✓ Process finished (exit code ${data.exitCode})\x1b[0m`);
    } catch (error: any) {
      terminalRef.current?.writeln(`\x1b[31m✗ Execution Error: ${error.message}\x1b[0m`);
    } finally {
      terminalRef.current?.write('\x1b[32m$\x1b[0m ');
      setIsRunning(false);
    }
  }, [code, environment.language, isRunning, isLaunching, sessionId, token, isExpired]);

  // Ctrl+Enter shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleRun();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleRun]);

  // Derived state
  const isWarning = secondsLeft !== null && secondsLeft <= 300 && !isExpired;
  const timerColor = isExpired ? '#ef4444' : isWarning ? '#eab308' : '#22c55e';

  return (
    <div className={styles.workspace}>
      {/* ── Topbar ── */}
      <div className={styles.topbar}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          <ArrowLeft size={14} />
          Home
        </button>
        <div className={styles.envInfo}>
          <span className={styles.envIcon}>{environment.icon}</span>
          <span className={styles.envName}>{environment.name}</span>
          <span
            className={styles.envStatus}
            style={{ color: isLaunching ? '#eab308' : '#22c55e' }}
          >
            {isLaunching ? '⟳ Launching…' : '● Running'}
          </span>
        </div>
        <div className={styles.topRight}>
          {/* Session timer */}
          {secondsLeft !== null && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: timerColor, fontVariantNumeric: 'tabular-nums', fontSize: 12, fontWeight: 600 }}>
              <Clock size={12} />
              {isExpired ? 'Expired' : formatTime(secondsLeft)}
            </span>
          )}
          <Layers size={14} className={styles.topIcon} />
          <span>{environment.libraries.length} packages</span>
        </div>
      </div>

      {/* ── 5-min warning banner ── */}
      {isWarning && (
        <div style={{
          background: 'rgba(234,179,8,0.15)', borderBottom: '1px solid #854d0e',
          color: '#fde047', padding: '6px 16px', display: 'flex', alignItems: 'center',
          gap: 8, fontSize: 13,
        }}>
          <AlertTriangle size={14} />
          <strong>Session expires in {formatTime(secondsLeft!)}.</strong>&nbsp;Save your work — the sandbox will be destroyed automatically.
        </div>
      )}

      {/* ── Launching overlay ── */}
      {isLaunching && (
        <div className={styles.launchOverlay}>
          <div className={styles.launchCard}>
            <div className={styles.launchIcon}>{environment.icon}</div>
            <h2 className={styles.launchTitle}>Launching environment…</h2>
            <p className={styles.launchSub}>{environment.name}</p>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} />
            </div>
          </div>
        </div>
      )}

      {/* ── Expiry modal ── */}
      {isExpired && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
        }}>
          <div style={{
            background: '#18181b', border: '1px solid #3f3f46', borderRadius: 12,
            padding: 32, textAlign: 'center', maxWidth: 380,
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⏰</div>
            <h2 style={{ color: '#f4f4f5', margin: '0 0 8px' }}>Session Expired</h2>
            <p style={{ color: '#a1a1aa', margin: '0 0 24px', lineHeight: 1.6 }}>
              Your lab session has ended and the container has been automatically destroyed.
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8,
                padding: '10px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      )}

      {/* ── Main grid ── */}
      <div className={styles.grid}>
        <div className={styles.editorArea}>
          <CodeEditor language={environment.language} value={code} onChange={setCode} />
        </div>
        <div className={styles.rightPanel}>
          <MetricsPanel 
            sessionId={sessionId}
            cpuLimit={cpuLimit} 
            memoryLimit={memoryLimit} 
          />
        </div>
        <div className={styles.terminalArea}>
          <Terminal ref={terminalRef} language={environment.language} />
        </div>
        <div className={styles.runArea}>
          <RunButton onRun={handleRun} isRunning={isRunning} />
        </div>
      </div>
    </div>
  );
}
