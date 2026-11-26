import type * as T from 'three';
import type { Vec3 } from './layout.ts';
import type { DesktopBuild } from './desktop-build.ts';

type Part = { object: T.Object3D; delta: T.Vector3 };

export type ModelTools = {
  build: DesktopBuild;
  assembly: (level: 'dimm') => T.Group;
  add: (id: string, object: T.Object3D, position: Vec3, delta?: Vec3, reveal?: number) => Part;
  instances: (id: string, positions: Vec3[], size: Vec3, reveal?: number,
              color?: string, geometry?: T.BufferGeometry) => Part[];
  box: (size: Vec3, color: string, metal?: number, radius?: number) => T.Mesh;
  pcb: (size: Vec3, kind?: string) => T.Mesh;
  material: (color: string, metal?: number, roughness?: number) => T.MeshStandardMaterial;
  label: (parent: T.Group, text: string, position: Vec3, width: number, color?: string, maxHeight?: number) => void;
};
