import React, { ChangeEvent, MouseEvent } from "react";
import { CloseOutlined, ProfileOutlined } from "@ant-design/icons";
import { PluginData } from "../../../obj/plugin/Generic";
import RottnestApplication from "../../container/RottnestApplication";
import { ProgramParam } from "../../../obj/plugin/Program";
import { ProgramParametersContainer } from "./ProgramParameterSettings";
import { ProgramParameters, ProgramPluginService } from "../../../service/ProgramPluginService";

import styles from '../../styles/PluginSettingsForm.module.css';

/**
 * Data along with the container to update it appropriately
 */
export type PluginPackage = {
  pluginData: PluginData,
  container: RottnestApplication
}


/**
 * PluginSettingsProps
 *
 * Used for displaying notes
 * about the pluggable settings
 *
 */
export interface ProgramPluginSettingsProps {
  plgname: string;
  index: number;
  plgItemsGetter: (rott: RottnestApplication) => Array<PluginEntry>
  container: RottnestApplication;
  // callbacks on plugin data
  getSelected: (rott: RottnestApplication) => string;
  getConfig: (rott: RottnestApplication) => string;
  saveDataFn: (data: PluginPackage) => void;
  saveConfigFn: (data: PluginPackage) => void;
  cancelFn:(data:PluginPackage) => void;
  getParams:(rott:RottnestApplication, ident: string)
    => Array<ProgramParam> | null;
}

/**
 * PluginSettingsData
 * Used for maintaining settings for the pluggable elements
 */
export interface PluginSettingsData {
  index: number,
  selected: string,
  parameters: ProgramParameters,
  config: string,
  configActive: boolean,
  params: ProgramPluginParams | null,
  hasBeenModified: boolean,
  plgArgs: any,
}


/**
 * Parameters and their bindings
 */
export type ProgramPluginParams = {
  parameters: Array<ProgramParam>
}

/**
 * Constructs a plugin settings component
 */
export class ProgramPluginSettings
  extends React.Component<ProgramPluginSettingsProps, PluginSettingsData> {

  state: PluginSettingsData = {
    index: this.props.index,
    selected: ProgramPluginService
      .GetPluginService()
      .getContext()
      .getExecutableName(),
    configActive: true,
    config: this.props.getConfig(this.props.container),
    parameters: ProgramPluginService
      .GetPluginService()
      .getContext()
      .getParameters(),

    plgArgs: JSON.stringify(this.props.getParams(this.props.container,
      this.props.getSelected(this.props.container))),
    params: null,
    hasBeenModified: false,
  }

  /**
    * Gets the option index - It is not currently used but is
    * reserved as a backup
    */
  getOptionIndex() {
    const prgService = ProgramPluginService.GetPluginService();
    const context = prgService.getContext();
    const programs = prgService.getProgramList();
    let index = prgService.getSelectedIndex();
    for(let i = 0; i < programs.length; i++) {
      const name = programs[i].name;
      if(context.getExecutableName() === name) {
        index = i;
        break;
      }
    }

    return index;
  }

  /**
   * Toggles the configuration settings
   */
  toggleConfig() {
    this.state.configActive = !this.state.configActive;
    this.updateState(this.state);
  }

  /**
   * Updates the current set of parameters
   */
  updateParams(params: ProgramPluginParams) {
    this.state.params = params;
    const nstate = {...this.state};
    this.updateState(nstate);
  }

  /**
   * Updates the current state of
   * data
   */
  updateState(data: PluginSettingsData) {
    this.setState(data);  
  }

  /**
   * Saves the data related to the current
   * program
   */
  saveData() {
    const prgService = this.props.container
      .getServices()
      .getProgramPluginService()
    prgService.saveContext();
  }

  /**
   * Saves the configuration
   * related to architectures and programs and others
   */
  saveConfig() {
    const prgService = this.props.container
      .getServices()
      .getProgramPluginService()
    prgService.saveContext(true);
  }

  /**
   * Cancels the configuration
   * window
   */
  cancelConfig() {
    const sdata = {
      container: this.props.container
    } as any;
    const cancelfn = this.props.cancelFn;
    cancelfn(sdata);
  }
  

  /**
   * Renders the component
   */
  render() {
    const container = this.props.container;
    const prgService = container.getServices().getProgramPluginService();
    const plglabel = this.props.plgname;
    const cancelFnWindow = this.props.cancelFn;
    const plgOptions = prgService.getProgramList();
    const selectedKey = this.state.selected;
    
    const ref = this;
    const saveDataOnClick = (_e: MouseEvent<HTMLButtonElement>) => {
      prgService.setCurrentExecutable(selectedKey);
      ref.saveData();
    };

    const configOnClick = (_e: MouseEvent<HTMLButtonElement>) => {
      ref.toggleConfig();
    };

    const configClose = () => {
      const data = {
        container: container
      }
      cancelFnWindow(data as any)
    }


    const cancelFn = (_e: MouseEvent<HTMLButtonElement>) => {
      ref.cancelConfig();
    }

    const onDropdownChange = (e: ChangeEvent<HTMLSelectElement>) => {
      const key = e.target.value;
      let nstate = {...ref.state};
      nstate.selected = key;
      ref.setState(nstate);
    };

    const configEnabled = this.state.configActive;
    const currentExe = this.props.getSelected(container);
    const statement = "Currently Selected Program Parameters";
    const configContainer = configEnabled && currentExe !== 'NoPrg' ? (
      <>
      <div className={styles.pluginHeader}>
        <label className={styles.pluginHeaderLabel}>{statement}</label>
      </div>
      <div className={styles.pluginConfigTextSpace}>
        <ProgramParametersContainer
          services={this.props.container.getServices()}
          parameterKeys={prgService.getContext().getParameterKeys()}
          closeFn={configClose}/>
      </div>
      </>
    ) : <></>
    
    const configSpace = configEnabled ? (
      <div className={styles.pluginConfigTextSpace}>

        <div className={styles.pluginHeader}>
          <label className={styles.pluginHeaderLabel}>Current Program: {currentExe}</label>
        </div>
      </div>) : <></>;

    return (
      <>
        <div className={styles.pluginSettings}>
          <div className={styles.pluginHeader}>
            <label className={styles.pluginHeaderLabel}>{plglabel}</label>
            <button className={styles.pluginExit}
              onClick={cancelFn}><CloseOutlined /></button>
          </div>
          <div>
            <select name={"plg_dropdown"} className={styles.pluginDropDown}
              onChange={onDropdownChange} 
              value={selectedKey}>
              <PluginSettingsList plgItems={plgOptions} selected={selectedKey}/>
            </select>
            <div className={styles.pluginMid}>
              <button className={styles.pluginApply}
                onClick={saveDataOnClick}>
                Set Program
              </button>

              <div className={styles.pluginSep}></div>
              <button className={styles.pluginConfig}
                onClick={configOnClick}>
                <ProfileOutlined />
              </button>
            </div>
          </div>
          {configSpace}
          {configContainer}
        </div>
      </>
    )
  }
}

/**
 * A particular entry that can be use
 */
export type PluginEntry = {
  keyName: string
  plgName: string
  params: Array<[string, string, any]>
}

/**
 * Options data for the plugin component
 */
export type PluginOptionsData = {
  selected: string,
  plgItems: Array<{ name: string }>
}


/**
 * A settings list component
 */
function PluginSettingsList(props: PluginOptionsData) {
  const entries = props.plgItems.map((e) => {
    return <option key={`program_${e.name}`} className={styles.plgOption}
      value={e.name}>{e.name}
      </option>
    
  });
  return (<>{entries}</>)
}

/**
 * Object data button in the global bar
 */
export type ProgramPluginObjectProps = {
  title: string
  issueFn: (rott:RottnestApplication) => string
  styleName: string
  response: (data: MouseEvent<HTMLButtonElement>, rott: RottnestApplication) => void
  settings: ProgramPluginSettingsProps
  container: RottnestApplication
  
}

/**
 * Plugin Object in the global bar
 * This will be associated with the global bar and allow the user to
 * modify the current arch and/or program
 */
export function ProgramPluginObject(props: ProgramPluginObjectProps) {

  const title = props.title;
  const issueFn = props.issueFn;
  const styleKey = props.styleName;  
  const responseFn = props.response;
  const rott = props.settings.container;
  const issued = issueFn(rott);

  
  const evfn = (e: MouseEvent<HTMLButtonElement>) => {
    responseFn(e, rott)
  }

  return (
    <>
      <button className={styles[styleKey]} onClick={evfn}>
        <div>{title}</div>
        <div>{issued}</div>
      </button>
    </>
  )
}
