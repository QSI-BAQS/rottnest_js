
import { ArchActionTracker } from '../../ArchActionTracker';
import { SuperconductingDesignBuffer } from '../des/buf/SuperconductingDesignBuffer';
import {RegionDataList}  from './RegionDataList';
/**
 * This allows for undo and redo functionality
 * within the container system
 */
export class RegionsSnapshotStack implements ArchActionTracker<RegionDataList> {

	bufferComponent: SuperconductingDesignBuffer;
	redoListStack: Array<RegionDataList> = [];
	regionListStack: Array<RegionDataList> = [];
	capacity: number = 128;

	constructor(bufcomp: SuperconductingDesignBuffer) {
		this.bufferComponent = bufcomp;
	}

	/**
	 * New regionList object will be pushed onto
	 * the stack. This happens when a new region is
	 * drawn
	 */
	push(list: RegionDataList) {
		if(this.regionListStack.length >= 
		   this.capacity) {
			this.regionListStack.pop();	
			this.regionListStack.unshift(list);
		} else {
			this.regionListStack.unshift(list);
		}
	}
	
	/**
	 * Used as part of the undo functionality,
	 * when the user hits undo, it will pop what is
	 * in the regionListStack
	 */
	pop(): RegionDataList | null | undefined {
		if(this.regionListStack.length > 0) {
			let res = this.regionListStack.shift();
			return res;
		}
		return null;
	}
	
	/**
	 * Takes the current regiondata list and
	 * adds it to the redo list.
	 *
	 * It will then pop the top the undo list.
	 * This will be then used as the current
	 * region data list in the container
	 * 
	 */
	undo(current: RegionDataList): RegionDataList | null {
		//Only valid case
		if(this.regionListStack.length > 0) {
			let res = this.regionListStack.shift();
			this.redoListStack.unshift(current);
			if(res) {
				return res;
			}
		}
		return null;
	}

	/**
	 * Pops the redo list and replaces it
	 * as the current regiondatalist, the 
	 * current regiondatalist will then be
	 * placed in the undo list
	 */
	redo(current: RegionDataList): RegionDataList | null {
				
		if(this.redoListStack.length > 0) {
			let res = this.redoListStack.shift();
			this.regionListStack.unshift(current);
			if(res) {
				return res;
			}
		}
		return null;
	}

	/**
	 * On an action taken in the designer UI, this will
	 * take the current buffer and push it down before
	 * replacing ti with a new one
	 */
	action(current: RegionDataList) {
		this.push(current);
		this.redoListStack = [];
	}

	
  // Performs an undo operation
  performUndo(): void {
  	
  }

  // Performs a redo operation
  performRedo(): void {
  	
  }

  // Performs an action
  performAction(): void {
  	
  }

}
