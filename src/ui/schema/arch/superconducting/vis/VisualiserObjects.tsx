import { ReactElement } from 'react';
import BellState from './components/BellState.tsx'
import SurfaceCodeDouble from './components/SurfaceCodeDouble.tsx'
import SurfaceCode from './components/SurfaceCode.tsx'
import MagicState from './components/MagicState.tsx'


/**
 * Visualisation of a factory,
 * tl and br are cells that the factory
 * will consume
 */
export type VisFactory = {	
	loc_tl: Array<number> 
	loc_br: Array<number>
}

/**
 * Visualiser Region, outlines
 * range of cells that it has effected
 * If it is a factory region, a factories component
 * will be included
 */
export type VisRegion = {
	name: string
	loc_tl: Array<number>
	loc_br: Array<number>
	factories?: Array<VisFactory>
}

/**
 * Visualiser Frame Data
 * Outlines the currentFrame number that it is up to
 */
export type VisFrameData = {
  currentFrame: number
}

/**
 * Visualiser gate, it outlines
 * the id of the gate, the type of gate
 * and the active time
 */
export type VisGate = {
	id: number
	type: string
	active_time?: number	
	holds?: Array<[number, number]>
} 

/**
 * The run result
 * that has been provided to the visualiser
 */
export type VisRunResult = {
	width: number
	height: number
	layers: any	
	regions: Array<VisRegion>
	base_layer: VisDataLayer
}

/**
 * The data layer that will contain the necessary components
 * TODO: Fix up types because WHO KNOWS WHAT IT IS
 */
export type VisDataLayer = {
	board: Array<Array<VisCell>>
	gates: Array<VisGate>
	//factories?: Array<VisFactory>
}


/**
 * VisCell that contains a locked_by field, it will
 * be associated by some gate?
 */
export type VisCell = {
  type: string
  locked_by?: number
} 

/**
 * Pre-Rendered version of a patch cell
 */
export type PatchRenderData = {
  element: ReactElement
  id: string
  width: number
  height: number
}

/**
 * SymbolCell, it is used to outline 
 */
export type SymbolCell = {
	skey: string
  text?: string
  patch?: string
  remote?: string
  
}

/**
 * TBH, no clue what the this is, it just apparently has
 * two numbers which resemble their coordinates
 */
export type CellComp = [number | null, number | null]

/**
 * SymbolKindMap, allows for mapping
 * the different kinds to cells
 */
export type SymbolKindMap = {
	bell: SymbolCell
	locked: SymbolCell
	reg: SymbolCell
	route: SymbolCell
	magic_state: SymbolCell
	cultivator: SymbolCell
	reserved: SymbolCell
	factory_output: SymbolCell
	route_buffer: SymbolCell
	other: SymbolCell
	unused: SymbolCell
}

/**
 * ColorConfigMap provides a description
 * for a few subtypes
 */
export type ColorConfigMap = {
	SingleRowRegisterRegion: string
	MagicStateFactoryRegion: string
  CombShapedRegisterRegion: string
  TCultivatorBufferRegion: string
  MagicStateBufferRegion: string
  BellRegion: string
  RouteBus: string
}

// Constants that are used
// for internal construction of the visualiser
//
// Frame rate is used for the player to know how many
// frames to run per second
// 
export const CELL_SIZE: number = 100;
export const GLOBAL_SCALE: number = 0.4;
export const FRAMERATE: number = 4;

//
// PreRendered patches that are used within
// the visualiser so it is known rendered and re-usable
// 
export const PreRenderedPatches: Array<PatchRenderData> = [
  {
    element: <BellState />,
    id: "bell_state",
    width: 1,
    height: 1
  },
  {
    element: <SurfaceCode />,
    id: "surface_code",
    width: 1,
    height: 1
  },
  {
    element: <SurfaceCodeDouble />,
    id: "surface_code_double",
    width: 2,
    height: 1
  },
  {
    element: <MagicState />,
    id: "magic_state",
    width: 1,
    height: 1
  },
];

/**
 * SymbolMap is used as a look up for rendering
 * purposes.
 * Each element can either be: Text or Patch
 * Text is directly printable
 * Patch requires being looked up
 */
export const SymbolMap: SymbolKindMap = {
	bell: { skey:'bell_state' ,patch: "🔔", remote: "bell_state" },
	locked: { skey:'locked', text: "🔒" },
	reg: { skey:'register', patch: "surface_code", remote: "surface_code" },
	route: { skey:'route', text: " " },
	magic_state: { skey:'magic_state', patch: "✨", remote: "magic_state" },
	cultivator: { skey:'t_cultivator', text: "🌻" },
	reserved: { skey:'reserved', text: "⛔" },
	factory_output: { skey:'t_factory_output', text: "@" },
	route_buffer: { skey:'route_buffer', text: " " },
	other: { skey:'other', text: "?" },
	unused: { skey:'unused', text: " "},
};

/**
 * Color map for the visualiser
 */
export const ColorMap: ColorConfigMap = {
	SingleRowRegisterRegion: "yellow",
  CombShapedRegisterRegion: "yellow",
  MagicStateFactoryRegion: "blue",
  TCultivatorBufferRegion: "blue",
  MagicStateBufferRegion: "red",
  BellRegion: "magenta",
  RouteBus: "green",
};

