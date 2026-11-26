// The window starts with +12 V and +5 V already in regulation.
const minimumVolts=3.14, railReadyMs=18, t3Ms=120, boardDelayMs=40;
const powerGoodMs=railReadyMs+t3Ms, resetReleaseMs=powerGoodMs+boardDelayMs;
const durationMs=220;

const phases=[
  {id:'main-rails',ms:0},
  {id:'rails-ready',ms:railReadyMs,label:'3.3 V 达标',color:'main'},
  {id:'power-ok',ms:powerGoodMs,label:'PWR_OK 拉高',color:'ready'},
  {id:'boot-handoff',ms:resetReleaseMs,label:'释放平台复位',color:'control'},
];

export const startupTiming={
  durationMs,minimumVolts,t3Ms,boardDelayMs,phases,
  railPoints:[[0,2.93],[5,2.98],[railReadyMs,minimumVolts],[26,3.30],[durationMs,3.30]],
};

export function startupSnapshot(time) {
  const ms=Math.min(durationMs,Math.max(0,Math.round(time)||0));
  const points=startupTiming.railPoints;
  const upper=Math.max(1,points.findIndex(([end])=>end>=ms));
  const [from,low]=points[upper-1], [to,high]=points[upper];
  const volts=low+(high-low)*(ms-from)/(to-from);
  const railValid=ms>=railReadyMs, powerGood=ms>=powerGoodMs, resetReleased=ms>=resetReleaseMs;
  const phase=phases[resetReleased?3:powerGood?2:railValid?1:0];
  return {ms,volts,railValid,powerGood,resetReleased,phase};
}
