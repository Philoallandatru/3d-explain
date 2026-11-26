import { inferenceTransferMs } from './inference-flow.mjs';

export const layerComputeOptions = Object.freeze([20, 100, 150, 220]);
export const defaultLayerComputeMs = 150;

function transfer(start, duration, computeEnd) {
  const end = start + duration;
  const coveredMs = Math.min(duration, Math.max(0, computeEnd - start));
  const uncoveredMs = duration - coveredMs;
  const segments = [];
  if (coveredMs > 0) segments.push({start, end: start + coveredMs, kind: 'covered'});
  if (uncoveredMs > 0) segments.push({start: start + coveredMs, end, kind: 'blocked'});
  return {coveredMs, uncoveredMs, segments};
}

export function planInferenceWindow(mode, source, computeMs) {
  const offload = mode === 'offload';
  const readMs = offload && source === 'ssd' ? inferenceTransferMs.ssd : 0;
  const copyMs = offload ? inferenceTransferMs.h2d : 0;
  const readyAt = readMs + copyMs;
  const nextAt = Math.max(computeMs, readyAt);
  const waitMs = nextAt - computeMs;

  // Keep the same horizontal scale when comparing residency and prefetch sources.
  const tickMs = 100;
  const largestReadyAt = inferenceTransferMs.ssd + inferenceTransferMs.h2d;
  const axisEnd = Math.ceil((Math.max(computeMs, largestReadyAt) + computeMs) / tickMs) * tickMs;
  const ticks = Array.from({length: axisEnd / tickMs + 1}, (_, i) => i * tickMs);
  const gpu = [{start: 0, end: computeMs, kind: 'compute', label: '当前层'}];
  if (waitMs > 0) gpu.push({start: computeMs, end: nextAt, kind: 'wait', label: '等待权重'});
  gpu.push({start: nextAt, end: nextAt + computeMs, kind: 'compute', label: '下一层'});

  return {
    computeMs, readyAt, nextAt, waitMs, axisEnd, ticks,
    ssd: transfer(0, readMs, computeMs),
    h2d: transfer(readMs, copyMs, computeMs),
    gpu,
  };
}
