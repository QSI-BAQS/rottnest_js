import React, { ChangeEvent, MouseEvent } from "react";


import styles from '../../styles/PluginSettingsForm.module.css';
import { CloseOutlined, ProfileOutlined } from "@ant-design/icons";
import { PluginData } from "../../../obj/plugin/Generic";
import RottnestApplication from "../../container/RottnestApplication";


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
  getParams:(rott:RottnestApplication, ident: string) => ProgramPluginParams;
}

/**
 * PluginSettingsData
 * Used for maintaining settings for the pluggable elements
 */
export interface PluginSettingsData {
  index: number;
  selected: string | null;
  config: string;
  configActive: boolean
  params: ProgramPluginParams | null
}

/**
 * Parameter entry
 */
export type ProgramParam = {
  name: string
  type: string
  value: number | string
  default?: number | string
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
    selected: null,
    configActive: false,
    config: this.props.getConfig(this.props.container),
    params: null,
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
    const savfn = this.props.saveDataFn;

    const sdata = {
      pluginData: {
        plgKey: this.state.selected || '',
        plgValue: this.state.selected || '',
      },
      container: this.props.container
    }
    console.log(sdata);
    savfn(sdata);
  }

  /**
   * Saves the configuration
   * related to architectures and programs and others
   */
  saveConfig() {
    const savfn = this.props.saveConfigFn;

    const sdata = {
      pluginData: {
        plgKey: 'config',
        plgValue: this.state.config,
      },
      container: this.props.container
    }
    
    savfn(sdata);
    
  }

  /**
   * Cancels the configuration
   * window
   */
  cancelConfig() {
    
    const sdata = {
      pluginData: {
        plgKey: '',
        plgValue: '',
      },
      container: this.props.container
    }
    const cancelfn = this.props.cancelFn;
    cancelfn(sdata);
  }
  

  /**
   * Renders the component
   */
  render() {

    console.log(this.props);
    const container = this.props.container;
    const selectedKey = this.props.getSelected(container);
    const plglabel = this.props.plgname;
    const plgOptions = this.props.plgItemsGetter(container);
    const plgConfig = this.state.config;

    if(this.state.selected === null) {
      this.state.selected = selectedKey;
    }
    
    const ref = this;
    const saveDataOnClick = (_e: MouseEvent<HTMLButtonElement>) => {
      ref.saveData();
    };

    const saveConfigOnClick = (_e: MouseEvent<HTMLButtonElement>) => {
      ref.saveConfig();
    };

    const configOnClick = (_e: MouseEvent<HTMLButtonElement>) => {
      // Opens the config data
      ref.toggleConfig();
    };

    const configOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      let textCfg = e.target.value;
      let data = {...ref.state};
      data.config = textCfg;
      ref.setState(data);
    }

    const cancelFn = (_e: MouseEvent<HTMLButtonElement>) => {
      ref.cancelConfig();
    }

    const onDropdownChange = (e: ChangeEvent<HTMLSelectElement>) => {
      const key = e.target.value;
      let nstate = {...ref.state};
      nstate.selected = key;
      ref.setState(nstate);
    }
    const configEnabled = this.state.configActive;
    const configSpace = configEnabled ? (
      <div className={styles.pluginConfigTextSpace}>
        <textarea className={styles.pluginTextArea} value={plgConfig}
          onChange={configOnChange}>
          
        </textarea>
        <button className={styles.savePluginConfig}
          onClick={saveConfigOnClick}>
          Save Configuration
        </button>
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
              onChange={onDropdownChange} defaultValue={selectedKey}>
              <PluginSettingsList plgItems={plgOptions} selected={selectedKey}/>
            </select>
            <div className={styles.pluginMid}>
              <button className={styles.pluginApply}
                onClick={saveDataOnClick}>
                Apply Selection
              </button>
              <div className={styles.pluginSep}></div>
              <button className={styles.pluginConfig}
                onClick={configOnClick}>
                <ProfileOutlined />
              </button>
            </div>
          </div>
          {configSpace}
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
}

/**
 * Options data for the plugin component
 */
export type PluginOptionsData = {
  selected: string,
  plgItems: Array<PluginEntry>
}


/**
 * A settings list component
 */
function PluginSettingsList(props: PluginOptionsData) {
  const entries = props.plgItems.map((e) => {
    return <option key={`arch_${e.keyName}`} className={styles.plgOption} value={e.keyName}>{e.keyName}</option>
    
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
