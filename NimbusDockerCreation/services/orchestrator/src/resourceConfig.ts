/**
 * Resource configuration for different environment images.
 * Host machine is 16 GB RAM and 8 cores.
 */

export interface ResourceLimits {
  memory: number;      // Hard limit in bytes
  memoryReservation: number; // Soft limit in bytes
  nanoCpus: number;    // CPU limit in nano units (10^9 = 1 core)
}

export const DEFAULT_LIMITS: ResourceLimits = {
  memory: 256 * 1024 * 1024,      // 256 MB
  memoryReservation: 128 * 1024 * 1024, // 128 MB
  nanoCpus: 0.5 * 1e9,            // 0.5 Cores
};

export const RESOURCE_CONFIG: Record<string, ResourceLimits> = {
  'python-basic': {
    memory: 256 * 1024 * 1024,
    memoryReservation: 128 * 1024 * 1024,
    nanoCpus: 0.5 * 1e9,
  },
  'node-ts': {
    memory: 256 * 1024 * 1024,
    memoryReservation: 128 * 1024 * 1024,
    nanoCpus: 0.5 * 1e9,
  },
  'cpp': {
    memory: 256 * 1024 * 1024,
    memoryReservation: 128 * 1024 * 1024,
    nanoCpus: 0.5 * 1e9,
  },
  'node-fullstack': {
    memory: 384 * 1024 * 1024,
    memoryReservation: 128 * 1024 * 1024,
    nanoCpus: 0.75 * 1e9,
  },
  'java': {
    memory: 384 * 1024 * 1024,
    memoryReservation: 128 * 1024 * 1024,
    nanoCpus: 0.75 * 1e9,
  },
  'python-ds': {
    memory: 512 * 1024 * 1024,
    memoryReservation: 256 * 1024 * 1024,
    nanoCpus: 1.0 * 1e9,
  },
  'python-ml': {
    memory: 768 * 1024 * 1024,
    memoryReservation: 384 * 1024 * 1024,
    nanoCpus: 1.5 * 1e9,
  },
};

export function getResourceLimits(env: string): ResourceLimits {
  return RESOURCE_CONFIG[env] || DEFAULT_LIMITS;
}
