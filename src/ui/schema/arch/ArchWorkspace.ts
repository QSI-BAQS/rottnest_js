import React from "react";
import { ArchitectureObject } from "./ArchSchema";

/**
 * Container that will refer to the architecture
 */
export type ArchContainerProps = {
	container: ArchitectureObject
}

/**
 * Architecture Workspace Data that
 * is used by all workspaces so tehy can get access to
 * other components and states
 */
export type ArchWorkspaceData = {
	arch: ArchitectureObject 
	stash: ArchStashMap
}

/**
 * WorkspaceProps, used by
 * all teh designers, ensures that all workspaces
 * are able to retrieve data from their ArchitectureObject
 */
export interface ArchWorkspaceProps {
	workspaceData: ArchWorkspaceData
	key?: string
}

/**
 * ArchWorkspace, inherits from React Component
 * to ensure that it is a react component object
 * and enforces the correct props usage
 */
export interface ArchWorkspace extends React.Component {	
	props: ArchWorkspaceProps
	workspaceObject?: boolean	
}

/**
 * Specifies how a workspace group is made
 * for respective architecture components
 */
export interface ArchWorkspaceGroup {
	makeGroup(data: ArchWorkspaceProps): Array<React.ReactElement>
}

/**
 * Map object that allows communication between workspaces
 * NOTE: It is a current workaround for callgraph related
 * mechanisms
 */
export class ArchStashMap {
	context: ArchStashMapTrigger;	
	map: Map<string, string> = new Map();
	sharedMap: Map<string, any> = new Map();

	/**
	 * Constructor for the stash
	 */
	constructor(context: ArchStashMapTrigger) {
		this.context = context;
	}

  /**
   * Stashes data within the map
   */
	stash(key: string, data: any) {
		this.sharedMap
			.set(key, data);
	}

  /**
   * Clears the data that is currently
   * contained in the stash
   */
	dropStash() {
		this.sharedMap.clear();
	}

  /**
   * Retrives the stashed data
   */
	getStash() {
		return this.sharedMap;
	}

	/**
	 * Inserts data that is mapped to a key
	 */
	insert(key: string, data: any) {
		this.map.set(key, data);
	}

	/**
	 * Retrieves data based on the key
	 * will return null if it doesn't map
	 */
	get(key: string): any | null {
		const res = this.map.get(key);
		if(res === null || res === undefined) {
			return null;
		} else {
			return res;
		}
	}

  /**
   * Clears the current entries within the map
   */
	clear() {
		this.map.clear();
	}
	
	/**
	 * Triggers a refresh of the workspace zone
	 */
	commit() {
		this.context.refresh();
	}
}

/**
 * A refresh function that is triggered
 * when data is comitted to the shared map
 */
export interface ArchStashMapTrigger {
	refresh(): void
}
