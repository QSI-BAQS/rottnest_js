import React from 'react';
import { ProjectSettingsCallbacks, ProjectSettingsState }
	from '../schema/global/modules/SettingsState';
import { ArchitectureProject }
	from '../schema/arch/ArchSchema';
import styles from '../styles/SettingsForm.module.css';

/**
 * Allows us to map to a transformer when we want
 * convert data
 */
type InputTransformerMap = {
	string: (input: any) => string
	number: (input: any) => number
}

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
 * Settings form component, will be always present
 * in the display but turned off and on when needed
 */
class SettingsForm extends React.Component<SettingsProps, 
	SettingsState> {

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
	settingsApply() {
		this.callbacks.applySettings();
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
		const inputChangeFn = (
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
		}

		const bodyData: any = this.state.project.body.object;

		return (
			<div className={styles.parentContainer} 
				style={{position:'relative',
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
				<label>Width & Height</label>
				<input type="number" name="width"
					className={styles.inputMult}
					value={bodyData.width} 
					onChange={(e) => 
						{inputChangeFn(e, 
						'width', 'number')}}/>x 
				<input type="number" name="height"
					className={styles
						.inputMult}	
					value={bodyData.height} 
					onChange={(e) => 
						{inputChangeFn(e, 
						'height', 'number')}}/>

				
				<label>Short Description</label>
				<input type="text" name="description"
					value={this.state
						.project.header
						.description} 
					onChange={(e) => 
						{inputChangeHeaderFn(e, 
						'description', 'string')}}/>
				
				<div className={styles
					.buttonSegment}>
					<button className={styles
						.settingsCancel}
						onClick={(_) => 
							sref
							.cancel()}
						type="button">
						Cancel
					</button>
					<button className={styles
						.settingsApply}
						onClick={(_) => 
						sref
						.settingsApply()
						} type="submit">
						Apply
					</button>
				</div>
			</form>
			</div>
		);
	}
}

export default SettingsForm;
