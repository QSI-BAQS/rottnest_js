import {ReactElement} from "react";
import { ArchWorkspaceGroup, ArchWorkspaceProps } from "../../ArchWorkspace";
import { ArchWorkspaceZone } from "../../../../workspace/WorkspaceZone.tsx";
import { CGGraphColumn, CGNodeColumn } from "../ui/callgraph/CallGraphColumn.tsx";
import { SuperconductingVisualiserView } from "../vis/VisWorkspace.tsx";


/**
 * Constructs a Visualiser UI group that can be used
 */	
export class VisualiserGroup implements ArchWorkspaceGroup {
	
	makeGroup(data: ArchWorkspaceProps): Array<ReactElement> {

		const wspace = <SuperconductingVisualiserView
			workspaceData={data.workspaceData} />;
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
