
import { ArchitectureObject, ArchitectureProject } from "./ArchSchema";

export type RefreshFunction = () => void;


/**
 * Set of callbacks that we can use for forms
 */
export type ProjectSettingsCallbacks = {
	applySettings: (data: any) => void;
	cancelSettings: () => void;
	projectFill: () => ArchitectureProject<any>
	newProject: () => ArchitectureProject<any>
}

/**
 * ProjectState, it is used to modify and synchronise with
 * the current architecture object
 */
export class ProjectSettingsState<T=any> {

	refservice: RefreshFunction;
	archobject: ArchitectureObject;
	project: ArchitectureProject<T>
  showProjectNew: boolean = false;
  showProjectSettings: boolean = false;
  
  /**
   * Constructs a settings state, if a project is omitted as part of
   * its construction, it will use the default
   */
  constructor(archobject: ArchitectureObject,
  	trigger: RefreshFunction) {
    this.refservice = trigger;
    this.archobject = archobject;
    this.project = archobject.getProject();
  }

	/**
	 * Returns true if the new project flag is active
	 */
	isNewProjectActive(): boolean {
		return this.showProjectNew;
	}
	
	/**
	 * Returns true if the project settings flag is active
	 */
	isProjectSettingsActive(): boolean {
		return this.showProjectSettings;
	}

  /**
	 * Creates a settings form component that
	 * will allow the user to update project details
	 */
	showSettings() {
		this.showProjectSettings = true;
		this.showProjectNew = false;
		this.refservice();
	}

	/**
	 * Shows a new project
	 */
	showNewProject() {
		this.showProjectNew = true
		this.showProjectSettings = false;
		this.resetData();
		this.refservice();
	}

	/**
	 * Cleans up the current project and refreshes the state
	 */
  resetData() {
    const newProject = this.archobject.makeProject();
    this.project = newProject;
		this.refservice();
  }

	/**
	 * Applies the project with what was stored
	 * to the current designer
	 */
	applySettings(data: any) {
		this.showProjectNew = false;
		this.showProjectSettings = false;
		this.archobject.setProject(data);
		this.refservice();
	}
	
	/**
	 * Creates a settings form component that
	 * will allow the user to update project details
	 */
	cancelSettings() {
		this.showProjectSettings = false;
		this.refservice();
	}

	/**
	 * Just detects if the module should be visible
	 */
	isVisible() {
		return this.showProjectNew || this.showProjectSettings;
	}
	
  /**
   * Operation for when the user cancels a new project
   */
	cancelNewProject() {
		this.showProjectNew = false;
		this.showProjectSettings = false;
		this.resetData();
		this.refservice();
	}

	/**
	 * Retrieves the callbacks for the current/existing project
	 */
	callbacksForCurrent(): ProjectSettingsCallbacks {
		const ref = this;
		return {
			applySettings: (data: any) => ref.applySettings(data),
			cancelSettings: () => ref.cancelSettings(),
			projectFill: () => ref.project,
			newProject: () => ref.archobject.makeProject(),
		}
	}

	/**
	 * Retrieves the callbacks for a new project
	 */
	callbacksForNew(): ProjectSettingsCallbacks {
		const ref = this;
		return {
			applySettings: (data: any) => ref.applySettings(data),
			cancelSettings: () => ref.cancelNewProject(),
			projectFill: () => ref.archobject.makeProject(),
			newProject: () => ref.archobject.makeProject(),
		}
	}

	
}
