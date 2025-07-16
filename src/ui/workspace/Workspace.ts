import React from "react";
import {WorkspaceBufferMap} 
	from "./WorkspaceBufferMap";
import { ArchitectureObject } from "../schema/arch/ArchSchema";
import { ArchWorkspaceData } from "../schema/arch/ArchWorkspace";


export interface WorkspaceProps {
	workspaceData: ArchWorkspaceData
	key?: string
}

export interface Workspace extends React.Component {	
	props: WorkspaceProps
	workspaceObject?: boolean	
}

export interface WorkspaceGroup {
	MakeGroup(data: WorkspaceProps): Array<React.ReactElement>
}

export type WorkspaceContainerProps = {
	container: ArchitectureObject
}

export type WorkspaceData = {
	container: ArchitectureObject
	bufferMap: WorkspaceBufferMap
	key?: string
}
