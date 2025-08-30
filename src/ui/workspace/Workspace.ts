import React from "react";
import {WorkspaceBufferMap} from "./WorkspaceBufferMap";
import { ArchitectureObject } from "../schema/arch/ArchSchema";
import { ArchWorkspaceData } from "../schema/arch/ArchWorkspace";

/**
 * Workspace Properties, used to create a clear
 * boundary on the workload
 */
export interface WorkspaceProps {
	workspaceData: ArchWorkspaceData
	key?: string
}

/**
 * Workspace, outlined for kind of component that is to be created
 * and likely merged with a workspace group
 */
export interface Workspace extends React.Component {	
	props: WorkspaceProps
	workspaceObject?: boolean	
}

/**
 * WorkspaceGroup, an assortment of component that are
 * constructed for a context
 */
export interface WorkspaceGroup {
	MakeGroup(data: WorkspaceProps): Array<React.ReactElement>
}

export type WorkspaceContainerProps = {
	archobj: ArchitectureObject
}

/**
 * WorkspaceData, holds an architecture object
 */
export type WorkspaceData = {
	container: ArchitectureObject
	bufferMap: WorkspaceBufferMap
	key?: string
}
