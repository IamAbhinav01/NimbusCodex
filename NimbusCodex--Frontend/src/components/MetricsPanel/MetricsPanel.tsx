import { useState, useEffect, useRef } from 'react';
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

export default function MetricsPanel() {
  const [data, setData] = useState<DataPoint[]>(generateInitialData);
  const tickRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      tickRef.current += 2;
      setData((prev) => {
        const next = [...prev.slice(-11), {
          time: `${tickRef.current}s`,
          cpu: randomBetween(10, 85),
          mem: randomBetween(20, 85),
        }];
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const latest = data[data.length - 1];

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
            <div className={styles.statLabel}>CPU</div>
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
            <div className={styles.statLabel}>Memory</div>
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
