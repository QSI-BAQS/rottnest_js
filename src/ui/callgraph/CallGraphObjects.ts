
import {
  CallGraphData,
  CUReqResult }
from '../../obj/CallGraph';

import { ArchWorkspaceData }
	from "rottnest-plugin/schema/ArchWorkspace";
import { CallGraphRequestStateKey } from './CallGraphDefaults.ts';
import { AppServiceMessage } from 'rottnest-plugin/schema/ArchDecls';

/**
 * CGUpdateableContext interface
 */
export interface CGUpdateableContext {	
	pushPositionUpdate(pdata: CGLinePositionData): void
	getCoords(): CGObjectLineUpdatable 
}

/**
 * Updatable callbacks
 */
export interface CGUpdatable {	
	pushPositionUpdate(pdata: CGLinePositionData): void
	registerContext(ctx: CGUpdateableContext): void
	getCoords(): CGObjectLineUpdatable	
}

/**
 * ContextHook interface for the service
 * hooks that can be latched onto the component
 */
export interface ASContextHook {
	serviceHook(asm: AppServiceMessage): void
}


/**
 * This will be aggregation of all the widget data,
 * we will have a selected index that allows the
 * component to select it and represent it
 *
 */
export type CGAggr = {
	graph: CallGraphData
	workspaceData: ArchWorkspaceData
}

/**
 * CGDispData
 * 
 */
export type CGDispData = {
	wdaggr: CGAggr
	index: string 
	selectedIdx: string
	cuId: string
	x: number
	y: number
	cuReqData: CUReqResult | null
	updateTrigger: (idx: string, data: CGPositionData) => void
  expands: boolean;
};

/**
 * CGObjectData
 */
export type CGObjectData = {
	x: number
	y: number
	actualPosition: boolean
	moveMode: boolean
	cuReady: boolean
	dataReady: boolean
}


/**
 * CGPositionData
 */
export type CGPositionData = {
	x: number
	y: number
	depth: number
	parent: string
}

export type CGViewState = { 
	dispPositions: Map<string, CGPositionData>
	
	//The x1, y1 position
	srcPositions: Map<string, Map<string, CGUpdatable>>

	//The x2, y2 position
	destPositions: Map<string, Map<string, CGUpdatable>>
	cunitMap: Map<string, CUReqResult>
	
	//registerMap: Map<string, CGObjectLine>
	refresh: boolean
	xOff: number
	yOff: number
	moveMode: boolean,
	requestState: CallGraphRequestStateKey,
}

/**
 * Used to identify the current callgraph layer
 * and link back to the parent index
 */
export type CGLayerEntry = {
	entryIdx: string 
	parentIdx: string
}

/**
 * CGTreeLayerData
 */
export type CGTreeLayerData = {
	depth: number
	layerElements: Array<CGLayerEntry>
}


/**
 * CGTreeDisplayData
 */
export type CGTreeDisplayData = {
	layerData: Array<CGTreeLayerData>
}



/**
 * CGLinePositionData
 */
export type CGLinePositionData = {
	x1: number
	x2: number
	y1: number
	y2: number
	pairUnit1: string
	pairUnit2: string

}


/**
 * CGObjectLineData
 */
export type CGObjectLineData = {
	idx: string
	updateable: CGUpdatable
	pairUnit1: string 
	pairUnit2: string 
	x1: number
	x2: number
	y1: number
	y2: number
}

/**
 * CGObjectLineUpdatable
 */
export type CGObjectLineUpdatable = {
	updateable: CGUpdatable
	pairUnit1: string 
	pairUnit2: string 
	x1: number
	x2: number
	y1: number
	y2: number
}

