import React from 'react';
import Toolbox from '../Toolbox';
import ToolboxOptions from '../ToolboxOptions';
import RegionList from '../RegionList';
import RegionSettings from '../RegionSettings';
import toolStyle from '../styles/ToolContainer.module.css'
import regionStyle from '../styles/RegionContainer.module.css'
import { ArchWorkspace, ArchWorkspaceProps } from '../../../ArchWorkspace';
import { RegionData } from '../../obj/RegionData';
import { RottnestRouterKindMap } from '../../obj/RegionKindMap';
import ErrorList from '../err/ErrorList';
import { Superconducting2DArchitecture } from '../../Superconducting';

/**
 * ContainerDefaults,
 * Not really used anymore
 */
const ContainerDefaults = {
	toolbox: { 
		headerName: "Toolbox",
		selectedToolIndex: 0,
	},
	options: {	
		headerName: "Tool Options",
		toolKind: 0,
	},
	regionList: {
		headerName: "Regions",
		regions: []
	},
	errorList: {
		errors: []
	}

}

/**
 * Region Container that is a column container
 * that contains both region list and errors
 */
export class ToolContainer extends 
	React.Component<ArchWorkspaceProps, {}> 
	implements ArchWorkspace {	
	render() {
		const container = this.props
			.workspaceData.architecture;
		return (
			<div 
				className={toolStyle.toolContainer}
				data-component="tool_container"
				data-help-id="tool_container"
				onMouseMove={
					(_) => {
						//container
						//.resetDSMove(); //This may require a cleaner way to reset the move when
							//the cursor goes out of bounds
					}
				}
			>
				<Toolbox 
					toolbox={ 
						{ headerName: 
						ContainerDefaults
						.toolbox.headerName 
						} 
					} 
					container={container}
					data-component="toolbox_panel"
					data-help-id="toolbox_panel"
				/>
				<ToolboxOptions  
					headerName={"Options"}
					container={container}
					data-component="toolbox_options"
					data-help-id="toolbox_options"
				/>
			</div>
		)
	}

}

/**
 * Region Container that is a column container
 * that contains both region list and errors
 */
export class RegionContainer 
	extends React.Component<ArchWorkspaceProps, {}> 
	implements ArchWorkspace {


	render() {
		const container = this.props.workspaceData
			.architecture as Superconducting2DArchitecture;
		const regionList = container.getStateData()
			.getWorkState()
			.getRegionList();
		
		const regListInfo = container.getStateData()
			.getWorkState()
			.getRegionListData();

		const selected = regListInfo.selectedKind;
		const regKeyVal = regListInfo.selectedKind 
			!== null ?
			regListInfo.selectedKind : 'NA';
		const regSingular = RegionData.SingularKind(
			regKeyVal);
		const regKind = 
			regSingular as keyof RottnestRouterKindMap;
			//TODO: Not certain of the type change ^
		const subtypesCol = selected === '' || 
			selected === null ? [] :
			regListInfo.subTypes[regKind]
		
		const connRecs = container.getStateData().getWorkState()
			.getValidAdjacentsOfSelected();

		const regData = container.getStateData().getUIState().getSelectedRegionData();
		let connectedIdx = 0;
		let connectedKind = null;
		
		if(regData) {
			if(regData.connectionToIdx !== null) {
				connectedIdx = regData
				.connectionToIdx;
			}
			if(regData.connectionToKind!== null) {
				connectedKind = regData
				.connectionToKind;
			}
		} 
		
		return (
			<div
				className={regionStyle.regionContainer}
				data-component="region_container"
				data-help-id="region_container"
				onMouseMove={
					(_) => {
						//container.resetDSMove();
					}
				}
			>
				<RegionList
					regions={regionList}
					container={container}
					data-component="region_list"
					data-help-id="region_list"
				/>
				<RegionSettings
					container={container}
					data-component="region_settings"
					data-help-id="region_settings"
					subTypes={
						{
						subtypes:
						 subtypesCol,
						currentlySelected:
						 regListInfo
						 .selectedIdx
						}
					}
					connections={
						{
						connections:
						 connRecs,
						connectedIdx:
						 connectedIdx,
						connectedKind:
						 connectedKind
						}
					}
				/>

					
					
				<ErrorList archObject={container}
					errors={[]}
					data-component="error_list"
					data-help-id="error_list"
					/>
			</div>
		)

	}
}

