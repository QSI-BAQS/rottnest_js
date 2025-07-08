import React, {MouseEvent, ReactElement} from 'react';

import HelpEvent from './global/Help.ts';
import LoadEvent, { hiddenInputProc } from './global/Load.ts';
import SaveEvent from './global/Save.ts';
import UndoEvent from './global/Undo.ts';
import RedoEvent from './global/Redo.ts';
import ZoomInEvent from './global/ZoomIn.ts';
import ZoomOutEvent from './global/ZoomOut.ts';
import SettingsEvent from './global/Settings.ts';
import NewProjectEvent from './global/NewProject.ts';
import RunEvents from './global/Run.ts';
import ReconnectEvent from './global/ReconnectEvent.ts';
import NullEvents from './global/NullEvents.ts';

import {  
	SaveOutlined,
	UploadOutlined,
	ZoomInOutlined,
	ZoomOutOutlined,
	UndoOutlined,
	RedoOutlined,
	SettingOutlined,
	FlagOutlined,
	PlusSquareOutlined,
	PlaySquareOutlined,
	RollbackOutlined,
} from '@ant-design/icons';

import styles from './styles/GlobalBar.module.css';
import RottnestContainer from './container/RottnestContainer.tsx';
import {ProjectDetails} from '../model/Project.ts';
import LogoEvents from './global/LogoEvents.ts';
// Import the ConnectionStatusButton component
import ConnectionStatusButton from './global/DynamicButton.tsx';
import { PluginPackage, PluginObject, PluginObjectProps, PluginSettings } from './global/settings/GeneralSettings.tsx';
import { ArchitecturePluginGetName } from '../model/plugin/Architecture.ts';
import { ProgramPluginGetName } from '../model/plugin/Program.ts';

/**
 * GlobalBarProps, has a reference to
 * its container and a component map of values
 * which are a little more dynamic
 */
type GlobalBarProps = {
	container: RottnestContainer
	componentMap: Map<number, [string, 
		ProjectDetails]>
}

/**
 * BarItemEvents, these are callbacks
 * that each baritem object will have associated
 */
type BarItemEvents = {
	leftClick: (project: RottnestContainer) => void
	auxEvent: (project: RottnestContainer) => void
}

/**
 * BarItemDescription holds identifier, name
 * toolTip information and image reference
 */
type BarItemDescription = {
	id: number
	name: string
	toolTip: string
	image: string
	style?: string
	events: BarItemEvents
	iconComponent: ReactElement
	helpId?: string
}

/**
 * BarItemData properties that is given
 * from the design space
 */
type BarItemData = {
	containerRef: RottnestContainer
	description: BarItemDescription
	updatable?: [string, ProjectDetails]
}


/**
 * Improved BarItem component with better styling
 * and responsiveness
 */
const BarItem: React.FC<BarItemData> = (props) => {
	const { containerRef, description, updatable } = props;
	const val = updatable ? updatable[0] : '';
	const events = description.events;
	const ico = description.iconComponent;
	const name = description.name;
	const ident = description.id;
	const tooltip = description.toolTip;
	
	return (
		<li 
			key={ident}
			onClick={() => events.leftClick(containerRef)}
			className={`${styles.barItem} ${description.style || ''}`}
			title={tooltip}
		>
			<div className={styles.barItemContent}>
				<span className={styles.barItemIcon}>{ico}</span>
				{(val || name) && (
					<span className={styles.barItemText}>{val || name}</span>
				)}
			</div>
		</li>
	);
};

export type GlobalBarData = {
	archData: PluginObjectProps,
	progData: PluginObjectProps
}

/**
 * GlobalBar object that will be set at the top of the
 * application.
 */
class GlobalBar extends React.Component<GlobalBarProps, GlobalBarData> {

	state: GlobalBarData = {
		archData: {
			title: 'Arch',
			issueFn: (rott:RottnestContainer) => { return ArchitecturePluginGetName(rott
				.getCurrentArch()); },
			styleName: 'pluginArch',
			response: (_e: MouseEvent<HTMLButtonElement>, rott: RottnestContainer) => {
				rott.showArchitectureSettings();
			},
			settings: {
				plgname: 'Architecture',
				index: 0,
				selected: '',
				config: '',
				plgItemsGetter: (rott: RottnestContainer) => rott.getArchItems(),
				container: this.props.container,
				saveDataFn: (data: PluginPackage) => {
					const rott = data.container;
					rott.saveArchData(data.pluginData);
				},
				saveConfigFn: (data: PluginPackage) => {
					const rott = data.container;
					rott.saveArchConfig(data.pluginData);
					
				},
				cancelFn: (data: PluginPackage) => {
					const rott = data.container;
					rott.closeArchitectureSettings();
					
				}
			}
		},
		progData: {
			title: 'Program',
			issueFn: (rott:RottnestContainer) => {
				return ProgramPluginGetName(rott.getCurrentExe()); },
			styleName: 'pluginProgram',
			response: (_e: MouseEvent<HTMLButtonElement>, rott: RottnestContainer) => {
				rott.showProgramSettings();
			},
			settings: {
				plgname: 'Program',
				index: 0,
				selected: '',
				config: '',
				plgItemsGetter: (rott: RottnestContainer) => rott.getProgramList(),
				container: this.props.container,
				saveDataFn: (data: PluginPackage) => {
					const rott = data.container;
					rott.saveProgramConfig(data.pluginData);
					
				},
				saveConfigFn: (data: PluginPackage) => {
					const rott = data.container;
					rott.saveProgramConfig(data.pluginData);
					
				},
				cancelFn: (data: PluginPackage) => {
					const rott = data.container;
					rott.closeProgramSettings();
					
				}
				
			}
		}
	}
	
	barItems: Array<BarItemDescription> = [
		{ 
			id: 200,
			name: "", 
			toolTip: "Logo", 
			image: "",
			events: LogoEvents,
			style: styles.containerLogo,
			iconComponent: <div>Test Build</div>
		},
		{ 
			id: 0,
			name: "", 
			toolTip: "Zoom In", 
			image: "MagnifyPlus",
			events: ZoomInEvent,
			style: styles.zoomIn,
			iconComponent: <ZoomInOutlined />,
			helpId: "zoom_controls"
		},
		{ 
			id: 100, 
			name: "", 
			toolTip: "Zoom Value", 
			image: "",
			events: NullEvents,
			style: styles.zoomValue,
			iconComponent: <></>,
			helpId: "zoom_controls"
		},
		{ 
			id: 1, 
			name: "", 
			toolTip: "Zoom Out", 
			image: "MagnifyNegative",
			events: ZoomOutEvent,
			style: styles.zoomOut,
			iconComponent: <ZoomOutOutlined />,
			helpId: "zoom_controls"
		},
		{ 
			id: 2, 
			name: "Undo", 
			toolTip: "Undo", 
			image: "UndoArrow",
			events: UndoEvent,
			style: styles.undo,
			iconComponent: <UndoOutlined />,
			helpId: "undo_redo"
		},
		{ 
			id: 3, 
			name: "Redo", 
			toolTip: "Redo", 
			image: "RedoArrow",
			events: RedoEvent,
			style: styles.redo,
			iconComponent: <RedoOutlined />,
			helpId: "undo_redo"
		},
		{ 
			id: 10, 
			name: "", 
			toolTip: "", 
			image: "missing",
			events: NullEvents,
			style: styles.separator,
			iconComponent: <></>
		},
		{ 
			id: 400, 
			name: "ArchOption", 
			toolTip: "Architecture Selected", 
			image: "HelpImage",
			events: NullEvents,
			helpId: "arch_help",
			style: styles.reconnect,
			iconComponent: <PluginObject {...this.state.archData} />
		},
		{ 
			id: 500, 
			name: "ProgramOption", 
			toolTip: "Program Selected", 
			image: "HelpImage",
			events: NullEvents,
			helpId: "program_help",
			style: styles.reconnect,
			iconComponent: <PluginObject {...this.state.progData} />
		},
		{ 
			id: 200, 
			name: "Reconnect", 
			toolTip: "Reconnect to API", 
			image: "HelpImage",
			events: ReconnectEvent,
			helpId: "reconnect",
			style: styles.reconnect,
			iconComponent: <RollbackOutlined />
		},
		{ 
			id: 10, 
			name: "Run", 
			toolTip: "Run App (Experiment)", 
			image: "Run",
			events: RunEvents,
			style: styles.run,
			iconComponent: <PlaySquareOutlined />,
			helpId: "compile_button"
		},
		{ 
			id: 4, 
			name: "Save", 
			toolTip: "Save Project", 
			image: "SaveImage",
			events: SaveEvent,
			style: styles.save,
			iconComponent: <SaveOutlined />,
			helpId: "save",
		},
		{ 
			id: 5, 
			name: "Load", 
			toolTip: "Load", 
			image: "LoadImage",
			events: LoadEvent,
			style: styles.load,
			helpId: "load",
			iconComponent: 
				<>
				<UploadOutlined />
				<input className={styles.hiddenFile} 
					type="file" 
					onChange={(e) => {
						hiddenInputProc(e, this.props.container);
					}} />
				</>
		},
		{ 
			id: 8, 
			name: "New", 
			toolTip: "New Project", 
			image: "NewProjectImage",
			events: NewProjectEvent,
			style: styles.newProject,
			iconComponent: <PlusSquareOutlined />,
			helpId: "new",
		},
		{ 
			id: 6, 
			name: "Settings", 
			toolTip: "Access Settings", 
			image: "SettingsImage",
			events: SettingsEvent,
			style: styles.settings,
			iconComponent: <SettingOutlined />,
			helpId: "settings",
		},
		{ 
			id: 7, 
			name: "Help", 
			toolTip: "Access Help", 
			image: "HelpImage",
			events: HelpEvent,
			style: styles.help,
			iconComponent: <FlagOutlined />,
			helpId: "help",
		},
	];

	render() {
		const { componentMap, container } = this.props;
		
		// Create a new array for rendering the components
		// TODO: Got to update the renderables
		const renderItems: Array<ReactElement> = [];
		
		// Process each bar item
		this.barItems.forEach((item, idx) => {
			// Check if this is the reconnect button
			if (item.name === "Reconnect" && item.events === ReconnectEvent) {
				// Use our ConnectionStatusButton instead
				renderItems.push(
					<ConnectionStatusButton 
						key={`connection-${idx}`}
						container={container}
						onClick={() => ReconnectEvent.leftClick(container)}
					/>
				);
			} else {
				// Use the standard BarItem component
				renderItems.push(
					<BarItem 
						key={`bar_it_${idx}`}
						containerRef={container}
						description={item}
						updatable={componentMap.get(item.id)}
					/>
				);
			}
		});

		const archPluginActive = container.state.appStateData.archSettingsActive;
		const programPluginActive = container.state.appStateData.progSettingsActive;
		const archSettings = this.state.archData.settings;
		const programSettings = this.state.progData.settings;

		const archPluginMenu = (archPluginActive ?
			<PluginSettings {...archSettings} /> : <></>);
		
		const programPluginMenu = (programPluginActive ?
			<PluginSettings {...programSettings} /> : <></>);

		return (
			<div 
				className={styles.globalBar}
				data-component="toolbox"
				data-help-id="toolbox"
				onMouseMove={
					(_) => {
						container
						.resetDSMove();
					}
				}>
				<ul className={styles.barItemList}>
					{renderItems}
				</ul>
				{archPluginMenu}
				{programPluginMenu}
			</div>
		);
	}
}

export default GlobalBar;
