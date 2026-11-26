// The complete upstream desktop configurator is outside this geometry adapter.
export type BoardChoice = 'motherboard' | 'z890' | 'b650m' | 'tomahawk' | 'aorus' | 'b850m';
export type DesktopBuild = {
  board: BoardChoice;
  processor: 'ryzen' | 'corei9';
  memory: 'dimm' | 'dimm4';
};
export const defaultBuild: DesktopBuild = {
  board: 'tomahawk', processor: 'ryzen', memory: 'dimm',
};
export const boardOptions = {
  motherboard: { formFactor: 'ATX', socket: 'AM5' },
  z890: { formFactor: 'ATX', socket: 'LGA 1851' },
  b650m: { formFactor: 'Micro-ATX', socket: 'AM5' },
  tomahawk: { formFactor: 'ATX', socket: 'AM5' },
  aorus: { formFactor: 'ATX', socket: 'LGA 1851' },
  b850m: { formFactor: 'Micro-ATX', socket: 'AM5' },
};
export const fittedParts = (build: DesktopBuild) => build;
