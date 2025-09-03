import React, {MouseEvent, ReactElement} from 'react';

import HelpEvent from './Help.ts';
import LoadEvent from './Load.ts';
import SaveEvent from './Save.ts';
import UndoEvent from './Undo.ts';
import RedoEvent from './Redo.ts';
import ZoomInEvent from './ZoomIn.ts';
import ZoomOutEvent from './ZoomOut.ts';
import SettingsEvent from './Settings.ts';
import NewProjectEvent from './NewProject.ts';
import RunEvents from './Run.ts';
import ReconnectEvent from './ReconnectEvent.ts';
import NullEvents from './NullEvents.ts';
import LogoEvents from './LogoEvents.ts';
import ConnectionStatusButton from './DynamicButton.tsx';

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


import { ArchitectureProject } from '../schema/arch/ArchSchema.ts';
import { ProgramPluginGetName } from '../../obj/plugin/Program.ts';
import { PluginPackage, PluginObject, PluginObjectProps, PluginSettings }
	from './settings/GeneralSettings.tsx';

import RottnestApplication from '../container/RottnestApplication.tsx';
import styles from '../styles/GlobalBar.module.css';
import { LoadComponent } from './LoadExtra.tsx';
import { ProgramPluginObjectProps, ProgramPluginSettings } from './settings/ProgramSettings.tsx';
/**
 * GlobalBarProps, has a reference to
 * its container and a component map of values
 * which are a little more dynamic
 */
type GlobalBarProps = {
	container: RottnestApplication
	componentMap: Map<number, [string, ArchitectureProject<any>]>
}

/**
 * BarItemEvents, these are callbacks
 * that each baritem object will have associated
 */
type BarItemEvents = {
	leftClick: (project: RottnestApplication) => void
	auxEvent: (project: RottnestApplication) => void
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
	extra?: React.FC<{ rott: RottnestApplication}>
	iconComponent: ReactElement
	helpId?: string
}

/**
 * BarItemData properties that is given
 * from the design space
 */
type BarItemData = {
	containerRef: RottnestApplication
	description: BarItemDescription
	updatable?: [string, ArchitectureProject<any>]
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
	const extra = props.description.extra;
	const extraProps = { rott: props.containerRef };
	const extraComponent = extra ? extra(extraProps) : <></>;
	
	
	return (
		<li 
			key={ident}
			onClick={() => events.leftClick(containerRef)}
			className={`${styles.barItem} ${description.style || ''}`}
			title={tooltip}
		>
			<div className={styles.barItemContent}
				onClick={() => events.leftClick(containerRef)}>
				<span className={styles.barItemIcon}>{ico}</span>
				{(val || name) && (
					<span className={styles.barItemText}>{val || name}</span>
				)}
				{extraComponent}
			</div>
		</li>
	);
};

/**
 * GlobalBar data, holding onto arch and prog data
 */
export type GlobalBarData = {
	archData: PluginObjectProps,
	progData: ProgramPluginObjectProps
}

/**
 * GlobalBar object that will be set at the top of the
 * application.
 */
class GlobalBar extends React.Component<GlobalBarProps, GlobalBarData> {

	state: GlobalBarData = {
		archData: {
			title: 'Arch',
			issueFn: (rott: RottnestApplication) => {
				const currentArch = rott.getAppState().getArchitectureObject().getName();
				return currentArch;
			},
			styleName: 'pluginArch',
			response: (_e: MouseEvent<HTMLButtonElement>, rott: RottnestApplication) => {
				const archState = rott.getModuleStates().getArchState();
				if(archState.areSettingsActive()) {
					archState.closeArchSettings();
				} else {
					archState.showArchSettings();
				}
			},
			container: this.props.container,
			settings: {
				index: 0,
				plgname: 'Architecture',
				getSelected: (rott: RottnestApplication) => {
					return rott.getAppState().getArchitectureObject().getName();
				},
				getConfig: (rott: RottnestApplication) => {
					return rott.getServices().archplugins.getArchConfig().contents;
				},
				
				plgItemsGetter: (rott: RottnestApplication) => {
					return rott.getServices().getArchPluginService().getArchItems();
				},
				container: this.props.container,
				saveDataFn: (data: PluginPackage) => {
					const rott = data.container;
					rott.getServices().archplugins.saveArchData(data.pluginData);
					rott.getModuleStates().getArchState().closeArchSettings();
				},
				saveConfigFn: (data: PluginPackage) => {
					const rott = data.container;
					rott.getServices().archplugins.saveArchConfig(data.pluginData);
					rott.getModuleStates().getArchState().closeArchSettings();
					
				},
				cancelFn: (data: PluginPackage) => {
					const rott = data.container;
					rott.getModuleStates().getArchState().closeArchSettings();	
				}
			}
		},
		progData: {
			title: 'Program',
			styleName: 'pluginProgram',
			container: this.props.container,
			issueFn: (rott:RottnestApplication) => {
				const exe = rott.getServices()
					.getProgramPluginService()
					.getCurrentExe();

				return ProgramPluginGetName(exe);
			},
			response: (_e: MouseEvent<HTMLButtonElement>, rott: RottnestApplication) => {
				const progState = rott.getModuleStates().getProgramState();
				if(progState.areSettingsActive()) {
					progState.closeProgramSettings();
				} else {
					progState.showProgramSettings();
				}
			},
			settings: {
				plgname: 'Program',
				index: 0,
				getParams: (rott: RottnestApplication, ident: string) => {
						const plgService = rott.getServices().getProgramPluginService()
						const current = plgService
							.getCurrentExe();

						if(current.name === ident) {
							return current.params;
						} else {
							return plgService.getParameters(ident);
						}
				},
				getSelected: (rott: RottnestApplication) => {
					const e = rott.getServices().getProgramPluginService()
						.getCurrentExe().name;
					return e;
				},
				getConfig: (rott: RottnestApplication) => {
					return rott.getServices().getProgramPluginService().getProgramConfig();
				},
				plgItemsGetter: (rott: RottnestApplication) => {
					return rott.getServices().getProgramPluginService().getProgramList()
						.map((e => {
							return {
								keyName: e.name,
								plgName: e.name,
								params: e.params
							}
						}));
				},
				container: this.props.container,
				saveDataFn: (data: PluginPackage) => {
					const rott = data.container;
					rott.getServices().getProgramPluginService()
						.setCurrentExecutable(data.pluginData.plgKey);
					rott.getServices().getProgramPluginService().saveProgramData(data.pluginData);
					rott.getModuleStates().getProgramState().closeProgramSettings();
				},
				saveConfigFn: (_data: PluginPackage) => {
					
					//const rott = data.container;
					

					// rott.getServices().programplugins.saveProgramConfig(data.pluginData);
					// rott.getModuleStates().getProgramState().closeProgramSettings();					
				},
				cancelFn: (data: PluginPackage) => {
					const rott = data.container;
					rott.getModuleStates().getProgramState().closeProgramSettings();
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
			iconComponent: <div>RNST</div>
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
			id: 10, //TODO: Remove the separator
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
			image: "",
			events: NullEvents,
			helpId: "arch_help",
			style: styles.reconnect,
			iconComponent: <></>
		},
		{ 
			id: 500, 
			name: "ProgramOption", 
			toolTip: "Program Selected", 
			image: "",
			events: NullEvents,
			helpId: "program_help",
			style: styles.reconnect,
			iconComponent: <></>
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
			extra: LoadComponent,
			style: styles.load,
			helpId: "load",
			iconComponent: 
				<>
				<UploadOutlined />
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
			if (item.name === "ProgramOption") {
				renderItems.push(<PluginObject key={'plugin_prog_1'} {...this.state.progData} />);
				 				
			} else if (item.name === "ArchOption") {
				renderItems.push(<PluginObject key={'plugin_arch_1'} {...this.state.archData} />);

			} else if (item.name === "Reconnect" && item.events === ReconnectEvent) {
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

		const appState = container.state.appState;
		const appModules = appState.getModuleStates();

		const archPluginState = appModules.getStates().getArchState();
		const programPluginState = appModules.getStates().getProgramState();
		const archPluginActive = archPluginState.areSettingsActive();
		const archSettings = this.state.archData.settings;
		
		const programSettings = this.state.progData.settings;
		const programPluginActive = programPluginState.areSettingsActive();

		const archPluginMenu = (archPluginActive ?
			<PluginSettings {...archSettings} /> : <></>);
		
		const programPluginMenu = (programPluginActive ?
			<ProgramPluginSettings {...programSettings} /> : <></>);
		

		// For some reason they are not change...
		return (
			<div 
				className={styles.globalBar}
				data-component="toolbox"
				data-help-id="toolbox"
				onMouseMove={
					(_) => {
						//container.resetDSMove();
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
