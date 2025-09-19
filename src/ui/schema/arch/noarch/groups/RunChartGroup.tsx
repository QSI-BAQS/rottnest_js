

import {ReactElement} from "react";
import { RunChartContainer } from "../../../../runchart/RunChart";
import { CGGraphColumn, CGNodeColumn } from "./CallGraphColumn";
import { ArchWorkspaceZone } from "../../../../workspace/WorkspaceZone";
import { ArchWorkspaceGroup, ArchWorkspaceProps } from "rottnest-plugin/schema/ArchWorkspace";


/**
 * Constructs a callgraph UI group that can be used
 * TODO: Finish this
 */	
export class RunChartGroup implements ArchWorkspaceGroup {
	
	makeGroup(data: ArchWorkspaceProps): Array<ReactElement> {

		
		const wspace = <RunChartContainer workspaceData={data.workspaceData} />;
			
		const group = [
			<CGGraphColumn
			key={"widget_graph_column"} 
				{...data} />,
			<ArchWorkspaceZone 	
				key={"widget_wz_design_space"}
				wsComponent={wspace}
				workspaceData={{
					architecture: data.workspaceData.architecture,
					archcontext: data.workspaceData.archcontext,
					stash: data.workspaceData.stash
				}} 
				/>,
			<CGNodeColumn
				key={"widget_node_column"}
				{...data} />,
		];	
		return group;
	}

}
