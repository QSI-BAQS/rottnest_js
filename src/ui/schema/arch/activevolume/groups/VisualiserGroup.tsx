import {ReactElement} from "react";

import { ArchWorkspaceGroup, ArchWorkspaceProps } from "../sigs/ArchWorkspace";
import { AVDesignColumn } from "../ui/AVArchColumnDesigner.tsx";
import { AVStatsColumn } from "../ui/AVArchColumnStats.tsx";
import { AVTestVisualiser } from "../ui/ActiveVolumeVisualiserSpace.tsx";
import { ArchWorkspaceZone } from "../sigs/ArchWorkspaceZone.tsx";

/**
 * Constructs a Visualiser UI group that can be used
 * 
 */	
export class ActiveVolumeVisualiserGroup implements ArchWorkspaceGroup {
	
	makeGroup(data: ArchWorkspaceProps): Array<ReactElement> {

		const desSpace = <AVTestVisualiser {...data} />;
		const group = [

			<AVDesignColumn key={"activevolume_column_1"} 
				workspaceData={data.workspaceData}/>,
			<ArchWorkspaceZone
				key={"widget_wz_design_space"}
				wsComponent={desSpace}
				workspaceData={{
					architecture: data.workspaceData.architecture,
					archcontext: data.workspaceData.archcontext,
					stash: data.workspaceData.stash
				}}
				/>,
			<AVStatsColumn
				key={"activevolume_column_2"}
				workspaceData={data.workspaceData} />,
		];	
		return group;
	}

}
