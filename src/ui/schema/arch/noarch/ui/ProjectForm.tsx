import React from "react";
import styles from './NoArchForm.module.css';
import { ProjectSettingsCallbacks, ProjectSettingsState } from "rottnest-plugin/schema/ArchProjectState";
import { ArchitectureProject } from "rottnest-plugin/schema/ArchSchema";

/**
 * Allows us to map to a transformer when we want
 * convert data
 */
type InputTransformerMap = {
	string: (input: any) => string
	number: (input: any) => number
}

/**
 * Outlines the the different transformations
 */
const InputTransformer: InputTransformerMap = {
	"string": (input: any) => String(input),
	"number": (input: any) => Number(input),
}

/**
 * Settings Properties, initialises
 * as hidden and provide a connection to the
 * root container that it can connect to.
 *
 * Warning: We have coupled this component
 * 	to the root container.
 */
export type SettingsProps = {
	isNew: boolean
	isHidden: boolean
	projectState: ProjectSettingsState
};


/**
 * Settings state, maintains the information
 * of the project unless otherwise refreshed
 * by the root container.
 */
export type SettingsState = {
	project: ArchitectureProject<any>
}

/**
 * A project form so we know what is being set up and
 * that it can specialise itself differently
 */
export class NoArchProjectForm extends React.Component<SettingsProps, SettingsState> {

	projectState: ProjectSettingsState;
	callbacks: ProjectSettingsCallbacks;
	state: SettingsState;

	constructor(props: SettingsProps) {
		super(props);
		this.projectState = props.projectState;
		this.callbacks = props.projectState.isNewProjectActive() ?
			props.projectState.callbacksForNew() :
			props.projectState.callbacksForCurrent()
		this.state = { project: this.callbacks.projectFill() };
	}

	/**
	 * Cancels the component and triggers a re-render
	 * of the root container
	 */
	cancel() {
		this.callbacks.cancelSettings();
	}

	/**
	 * Saves the changes to the project
	 * root container will likely consider if it needs
	 * to flush the changes to other components
	 */
	settingsApply(data: any) {
		this.callbacks.applySettings(data);
	}


	render() {
		const sref = this;
		const hidden = this.props.isHidden;
		// Changes for the header
		const inputChangeHeaderFn = (
			e: React.FormEvent<HTMLInputElement>,
			key: string, kind: keyof InputTransformerMap) => {

			const inpfn = InputTransformer[kind];
			const v: string | number = inpfn(e.currentTarget.value);
			const oldHeader = { ...this.state.project.header };
			const newHeader = { header: { [key]: v, ...oldHeader } };

			const newProject: SettingsState = { project: this.callbacks.newProject() };
			newProject.project.header = newHeader.header;
			newProject.project.body.object = this.state.project.body.object;			
			sref.setState(newProject);
		}

		// Changes for the body elements
		/*const inputChangeFn = (
			e: React.FormEvent<HTMLInputElement>,
			key: string, kind: keyof InputTransformerMap) => {

			const inpfn = InputTransformer[kind];
			const v: string | number = inpfn(e.currentTarget.value);
			const oldBody = { ...this.state.project.body };
			const newBody = { object: { [key]: v, ...oldBody } };
			const newProject: SettingsState = { project: this.callbacks.newProject() };
			newProject.project.header = this.state.project.header;
			newProject.project.body = newBody;			
			sref.setState(newProject);
		}*/


		return (
			<div className={styles.parentContainer} 
				style={{
				visibility: hidden ?
					"hidden" : "visible"
				}}>
			<form className={styles.settingsForm}
				onSubmit={(e) => 
					e.preventDefault()}>
				<h2>Settings</h2>
				<label>Project Name</label>
				<input type="text" name="projectName"
					value={this.state
						.project.header.name} 
					onChange={(e) => {
						inputChangeHeaderFn(e, 
						'name', 'string')}}/>
					<br />
				<label>Author</label>
				<input type="text" name="author"
					value={this.state
						.project.header.author} 
					onChange={(e) => 
						{inputChangeHeaderFn(e, 
						'author', 'string')}}/>

				
				<label>Short Description</label>
				<input type="text" name="description"
					value={this.state
						.project.header
						.description} 
					onChange={(e) => 
						{inputChangeHeaderFn(e, 
						'description', 'string')}}/>
				
				<div className={styles.buttonSegment}>
					<button className={styles.settingsCancel}
						onClick={(_) => 
							sref
							.cancel()}
						type="button">
						Cancel
					</button>
					<button className={styles.settingsApply}
						onClick={(_) => 
						sref
						.settingsApply(sref.state.project)
						} type="submit">
						Apply
					</button>
				</div>
			</form>
			</div>
		);
	}
}
