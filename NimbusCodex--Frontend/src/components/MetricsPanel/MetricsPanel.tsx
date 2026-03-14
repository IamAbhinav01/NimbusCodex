import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Cpu, MemoryStick } from 'lucide-react';
import styles from './MetricsPanel.module.css';

interface DataPoint {
  time: string;
  cpu: number;
  mem: number;
}

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateInitialData(): DataPoint[] {
  return Array.from({ length: 12 }, (_, i) => ({
    time: `${i * 2}s`,
    cpu: randomBetween(10, 75),
    mem: randomBetween(25, 80),
  }));
}

interface Props {
  sessionId?: string | null;
  cpuLimit?: number;
  memoryLimit?: number;
}

export default function MetricsPanel({ sessionId, cpuLimit = 0.5, memoryLimit = 256 }: Props) {
  const { token } = useAuth();
  const [data, setData] = useState<DataPoint[]>([]);
  const tickRef = useRef(0);

  useEffect(() => {
    if (!sessionId || !token) return;

    const pollStats = async () => {
      try {
        console.log(`[MetricsPanel Debug] Polling stats for ${sessionId} with token starts with: ${token?.substring(0, 10)}`);
        
        const res = await fetch(`http://localhost:4000/api/sessions/${sessionId}/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!res.ok) {
          console.warn(`[MetricsPanel Warning] Stats fetch failed with status ${res.status}`);
          const errText = await res.text();
          console.warn(`[MetricsPanel Warning] Error body: ${errText}`);
          return;
        }

        const stats = await res.json();
        
        tickRef.current += 2;
        setData((prev) => {
          const next = [...prev.slice(-14), {
            time: `${tickRef.current}s`,
            cpu: stats.cpuPercent,
            mem: stats.memPercent,
          }];
          return next;
        });
      } catch (err) {
        console.error('[MetricsPanel] Polling failed:', err);
      }
    };

    const interval = setInterval(pollStats, 2000);
    console.log(`[MetricsPanel] Starting stats polling for session: ${sessionId}`);
    return () => {
      console.log(`[MetricsPanel] Stopping stats polling for session: ${sessionId}`);
      clearInterval(interval);
    };
  }, [sessionId, token]);

  const latest = data.length > 0 ? data[data.length - 1] : { cpu: 0, mem: 0 };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Resource Monitor</h3>
        <span className={styles.liveDot}>
          <span className={styles.dot} />
          LIVE
        </span>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statIcon}>
            <Cpu size={14} />
          </div>
          <div>
            <div className={styles.statLabel}>CPU (Allocated: {cpuLimit} vCPU)</div>
            <div className={styles.statValue} style={{ color: '#4f46e5' }}>
              {latest?.cpu ?? 0}%
            </div>
          </div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statIcon}>
            <MemoryStick size={14} />
          </div>
          <div>
            <div className={styles.statLabel}>Memory (Allocated: {memoryLimit} MB)</div>
            <div className={styles.statValue} style={{ color: '#06b6d4' }}>
              {latest?.mem ?? 0}%
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data} margin={{ top: 5, right: 8, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="cpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="mem" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,54,61,0.5)" />
            <XAxis
              dataKey="time"
              tick={{ fill: '#484f58', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#484f58', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: '#161b22',
                border: '1px solid #30363d',
                borderRadius: 8,
                fontSize: 12,
                color: '#e6edf3',
              }}
              cursor={{ stroke: '#30363d', strokeWidth: 1 }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, color: '#8b949e' }}
              iconType="circle"
              iconSize={8}
            />
            <Area
              type="monotone"
              dataKey="cpu"
              name="CPU %"
              stroke="#4f46e5"
              strokeWidth={2}
              fill="url(#cpu)"
              dot={false}
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              dataKey="mem"
              name="Memory %"
              stroke="#06b6d4"
              strokeWidth={2}
              fill="url(#mem)"
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
