import { ReactElement } from "react";
import { ArchWorkspaceGroup, ArchWorkspaceProps }
  from "../sigs/ArchWorkspace";
import { AVDesignSpace } from "../ui/ActiveVolumeDesignSpace.tsx";
import { ArchWorkspaceZone } from "../sigs/ArchWorkspaceZone.tsx";
import { AVDesignColumn } from "../ui/AVArchColumnDesigner.tsx";
import { AVStatsColumn } from "../ui/AVArchColumnStats.tsx";

/**
 * Constructs the workspace group that will be used by the workspace component
 * within rottnest
 */
export class ActiveVolumeDesignGroup implements ArchWorkspaceGroup {

	/**
	* Constructs an architecture design group
	*/
	makeGroup(data: ArchWorkspaceProps): Array<ReactElement> {

		const desSpace = <AVDesignSpace key={"av_despace"}
			 {...data} />;

		const group = [
			<AVDesignColumn key={"activevolume_column_1"} 
				workspaceData={data.workspaceData}/>,
			<ArchWorkspaceZone
				key={"arch_av_design_space"}
				wsComponent={desSpace}
				workspaceData={{
					architecture: data.workspaceData.architecture,
					archcontext: data.workspaceData.archcontext,
					stash: data.workspaceData.stash
				}} />,
			<AVStatsColumn
				key={"activevolume_column_2"}
				workspaceData={data.workspaceData} />,
		];	

		return group;
	}

}
