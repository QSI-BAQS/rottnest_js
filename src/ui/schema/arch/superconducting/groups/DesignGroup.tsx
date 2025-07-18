
import { ReactElement } from "react";
import { RegionContainer, ToolContainer } from "../ui/container/ColumnContainer";
import { ArchWorkspaceGroup, ArchWorkspaceProps } from "../../ArchWorkspace";
import { ArchWorkspaceZone } from "../../../../workspace/WorkspaceZone.tsx";
import { DesignSpace } from "../ui/DesignSpace";

/**
 * Constructs the workspace group that will be used by the workspace component
 * within rottnest
 */
export class SuperconductingDesignUIGroup implements ArchWorkspaceGroup {

	/**
	 * Constructs an architecture design group
	 */
	makeGroup(data: ArchWorkspaceProps): Array<ReactElement> {

		const desSpace = <DesignSpace {...data} />;

		const group = [
			<ToolContainer key={"arch_toolcontainer"} 
				{...data} />,
			<ArchWorkspaceZone
				key={"arch_wz_design_space"}
				wsComponent={desSpace}
				workspaceData={{
					architecture: data.workspaceData.architecture,
					archcontext: data.workspaceData.archcontext,
					stash: data.workspaceData.stash
				}} />,
			<RegionContainer 
				key={"arch_region_container"}
				{...data} />,
		];	

		return group;
	}

}


