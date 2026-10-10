import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { FieldPlot, Season } from '../../../types/farmSystem';
import { CROPS_CONFIG } from '../../../config/farmData';
import { calculateCropGrowth } from '../../../utils/cropGrowth';
import { setInstance, hideInstance, touchInstances } from '../decor';

/** Zone cánh đồng trong thế giới 3D thống nhất. Tọa độ local, bọc bởi <group position>. */

export interface FieldZoneProps {
  plots: FieldPlot[];
  selectedCropId: string;
  currentDay: number;
  timeOfDay: number;
  currentSeason: Season;
  isHardworking: boolean;
  newPlayerBoost: boolean;
  onPlowPlot: (plotId: number) => void;
  onPlantCrop: (plotId: number, cropId: string) => void;
  onHarvestPlot: (plotId: number, e: React.MouseEvent) => void;
  onCurePestPlot: (plotId: number) => void;
}

const SPACING = 1.3;
const SURFACE_TOP = 0.24;

type PlotStage = 'empty' | 'tilled' | 'sprout' | 'growing' | 'ready';

function stageOf(plot: FieldPlot, progress: number): PlotStage {
  if (plot.state === 'empty') return 'empty';
  if (plot.state === 'plowed') return 'tilled';
  if (plot.state === 'ready') return 'ready';
  if (!plot.cropId) return 'tilled';
  return progress < 0.35 ? 'sprout' : 'growing';
}

function surfaceColor(plot: FieldPlot, stage: PlotStage): string {
  const dry = plot.moisture < 30;
  switch (stage) {
    case 'empty': return dry ? '#EBD9A8' : '#DCC084';
    case 'tilled': return dry ? '#8A6242' : '#6B4A2F';
    case 'sprout':
    case 'growing': return dry ? '#75563A' : '#5A3D26';
    case 'ready': return '#556030';
  }
}

function makeFakeMouseEvent(clientX: number, clientY: number): React.MouseEvent {
  const rect = {
    left: clientX, top: clientY, width: 2, height: 2,
    right: clientX + 2, bottom: clientY + 2, x: clientX, y: clientY,
    toJSON: () => ({}),
  };
  return { target: { getBoundingClientRect: () => rect } } as unknown as React.MouseEvent;
}

export function FieldZone(props: FieldZoneProps) {
  const {
    plots, selectedCropId, currentDay, timeOfDay, currentSeason,
    isHardworking, newPlayerBoost,
    onPlowPlot, onPlantCrop, onHarvestPlot, onCurePestPlot,
  } = props;

  const frameRef = useRef<THREE.InstancedMesh>(null!);
  const surfRef = useRef<THREE.InstancedMesh>(null!);
  const ridgeRef = useRef<THREE.InstancedMesh>(null!);
  const sproutRef = useRef<THREE.InstancedMesh>(null!);
  const stemRef = useRef<THREE.InstancedMesh>(null!);
  const crownRef = useRef<THREE.InstancedMesh>(null!);
  const [hovered, setHovered] = useState<number | null>(null);

  const n = Math.max(1, plots.length);
  const nRidge = Math.max(1, plots.length * 3);
  const cols = Math.max(1, Math.ceil(Math.sqrt(plots.length)));

  const gridPos = (i: number): [number, number] => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return [(col - (cols - 1) / 2) * SPACING, (row - (Math.ceil(plots.length / cols) - 1) / 2) * SPACING];
  };

  const plotData = useMemo(() => {
    return plots.map((plot) => {
      let progress = 0;
      if (plot.cropId && plot.plantedDay !== null && CROPS_CONFIG[plot.cropId]) {
        try {
          const g = calculateCropGrowth(
            plot, plot.cropId, currentDay, timeOfDay || 0, currentSeason, isHardworking, newPlayerBoost
          );
          progress = Math.min(1, Math.max(0, (g.progressPercent || 0) / 100));
        } catch { /* giu nguyen 0 */ }
      }
      return { plot, progress, stage: stageOf(plot, progress) };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plots, currentDay, timeOfDay, currentSeason, isHardworking, newPlayerBoost]);

  useLayoutEffect(() => {
    const frame = frameRef.current, surf = surfRef.current, ridge = ridgeRef.current;
    const sprout = sproutRef.current, stem = stemRef.current, crown = crownRef.current;
    if (!frame || !surf || !ridge || !sprout || !stem || !crown) return;

    plotData.forEach(({ plot, progress, stage }, i) => {
      const [x, z] = gridPos(i);
      const hl = hovered === i ? 1.22 : 1;
      const pest = plot.hasPest;

      setInstance(frame, i, x, 0.03, z, 1.18, 0.3, 1.18,
        new THREE.Color('#3A2A18').multiplyScalar(hl).getStyle());
      setInstance(surf, i, x, 0.06, z, 1.04, 0.36, 1.04,
        new THREE.Color(surfaceColor(plot, stage)).multiplyScalar(hl).getStyle());

      const tilled = stage !== 'empty';
      for (let r = 0; r < 3; r++) {
        const ri = i * 3 + r;
        if (tilled) {
          setInstance(ridge, ri, x, SURFACE_TOP + 0.02, z - 0.3 + r * 0.3, 0.94, 0.08, 0.14,
            new THREE.Color(surfaceColor(plot, stage)).multiplyScalar(0.7 * hl).getStyle());
        } else hideInstance(ridge, ri);
      }

      const cy = SURFACE_TOP + 0.05;
      if (stage === 'sprout') {
        const s = 0.5 + progress * 1.4;
        setInstance(sprout, i, x, cy + 0.1 * s, z, s, s, s, pest ? '#B03A2E' : '#7CC46A');
        hideInstance(stem, i); hideInstance(crown, i);
      } else if (stage === 'growing') {
        const s = 0.45 + progress * 0.75;
        hideInstance(sprout, i);
        setInstance(stem, i, x, cy + 0.22 * s, z, 1, s, 1, pest ? '#8E3B2F' : '#4E8A3E');
        setInstance(crown, i, x, cy + (0.44 + 0.3 * progress) * s, z, s, s * 0.9, s,
          pest ? '#B03A2E' : '#58A447');
      } else if (stage === 'ready') {
        const s = 1.05;
        hideInstance(sprout, i);
        setInstance(stem, i, x, cy + 0.24, z, 1.1, 1.05, 1.1, '#C9A24B');
        setInstance(crown, i, x, cy + 0.62, z, s, s * 1.15, s, '#EFC44A');
      } else {
        hideInstance(sprout, i); hideInstance(stem, i); hideInstance(crown, i);
      }
    });

    [frame, surf, ridge, sprout, stem, crown].forEach(touchInstances);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plotData, hovered, cols]);

  const handlePlotClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const idx = e.instanceId;
    if (idx === undefined || idx >= plots.length) return;
    const plot = plots[idx];
    const fake = makeFakeMouseEvent(e.nativeEvent.clientX, e.nativeEvent.clientY);
    if (plot.state === 'empty') onPlowPlot(plot.id);
    else if (plot.state === 'plowed') onPlantCrop(plot.id, selectedCropId);
    else if (plot.state === 'ready') onHarvestPlot(plot.id, fake);
    else if (plot.hasPest) onCurePestPlot(plot.id);
  };

  const hoverProps = {
    onClick: handlePlotClick,
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (e.instanceId !== undefined) setHovered(e.instanceId);
      document.body.style.cursor = 'pointer';
    },
    onPointerOut: () => {
      setHovered(null);
      document.body.style.cursor = 'auto';
    },
  };

  return (
    <group>
      <instancedMesh ref={frameRef} args={[undefined, undefined, n]} {...hoverProps}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial flatShading roughness={0.95} />
      </instancedMesh>
      <instancedMesh ref={surfRef} args={[undefined, undefined, n]} {...hoverProps}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial flatShading roughness={0.95} />
      </instancedMesh>
      <instancedMesh ref={ridgeRef} args={[undefined, undefined, nRidge]} raycast={() => null}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial flatShading roughness={1} />
      </instancedMesh>
      <instancedMesh ref={sproutRef} args={[undefined, undefined, n]} raycast={() => null}>
        <icosahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial flatShading roughness={0.85} />
      </instancedMesh>
      <instancedMesh ref={stemRef} args={[undefined, undefined, n]} raycast={() => null}>
        <cylinderGeometry args={[0.035, 0.05, 0.5, 5]} />
        <meshStandardMaterial flatShading roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={crownRef} args={[undefined, undefined, n]} raycast={() => null}>
        <coneGeometry args={[0.3, 0.8, 6]} />
        <meshStandardMaterial flatShading roughness={0.85} />
      </instancedMesh>
    </group>
  );
}

export default FieldZone;
