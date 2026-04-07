import React, { ChangeEvent, MouseEvent } from "react";
import { CloseOutlined, ProfileOutlined } from "@ant-design/icons";
import { PluginData } from "../../../obj/plugin/Generic";
import { NotifyID } from '../../../service/NotifyService';
import RottnestApplication from "../../container/RottnestApplication";
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
export interface PluginSettingsProps {
  plgname: string;
  index: number;
  container: RottnestApplication;
  plgItemsGetter: (rott: RottnestApplication) => Array<PluginEntry>
  getSelected: (rott: RottnestApplication) => string;
  getConfig: (rott: RottnestApplication) => string;
  saveDataFn: (data: PluginPackage) => void;
  saveConfigFn: (data: PluginPackage) => void;
  cancelFn:(data:PluginPackage) => void;
}

/**
 * PluginSettingsData
 *
 * Used for maintaining settings for the pluggable elements
 */
export interface PluginSettingsData {
  index: number;
  selected: string | null;
  config: string;
  configActive: boolean;
}

/**
 * Constructs a plugin settings component
 */
export class PluginSettings
  extends React.Component<PluginSettingsProps, PluginSettingsData> {

  state: PluginSettingsData = {
    index: this.props.index,
    selected: this.props.getSelected(this.props.container),
    configActive: false,
    config: this.props.getConfig(this.props.container)     
  }

  /**
   * Toggles the configuration settings
   */
  toggleConfig() {
    this.state.configActive = !this.state.configActive;
    this.updateState(this.state);
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
        params: []
      },
      container: this.props.container
    }
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
        params: []
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
        params: []
      },
      container: this.props.container
    }
    const cancelfn = this.props.cancelFn;
    cancelfn(sdata);
  }

  legacyRemap(kind: string) {
    const kindMap: { [key: string]: string } = {
      'Superconducting': 'Four Stage Superconducting',
      
    }

    const res = kindMap[kind];
    if(res) {
      return res;
    } else {
      return kind;
    }
    
  }

  /**
   * Renders the component
   */
  render() {
    
    const container = this.props.container;
    let selectedKey = this.props.getSelected(container);
    const plglabel = this.props.plgname;
    const plgOptions = this.props.plgItemsGetter(container);
    const plgConfig = this.state.config;

    if(this.state.selected === null) {
      this.state.selected = selectedKey;
    } else {
      selectedKey = this.state.selected;
    }

    selectedKey = this.legacyRemap(selectedKey);
    
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
  params: Array<[string, string, any]>
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
export type PluginObjectProps = {
  title: string
  issueFn: (rott:RottnestApplication) => string
  response: (data: MouseEvent<HTMLButtonElement>,
    rott: RottnestApplication) => void
  styleName: string
  settings: PluginSettingsProps
  container: RottnestApplication
  
}

/**
 * Plugin Object in the global bar
 * This will be associated with the global bar and allow the user to
 * modify the current arch and/or program
 */
export function PluginObject(props: PluginObjectProps) {

  const title = props.title;
  const issueFn = props.issueFn;
  const styleKey = props.styleName;  
  const responseFn = props.response;
  const rott = props.settings.container;
  const issued = issueFn(rott);

    
  const evfn = (e: MouseEvent<HTMLButtonElement>) => {
    //NOTE: We will need to trigger a check before it is called
    const util = rott.getServices().getUtilityService();
    if(!util.isConnected()) {
      util.notifyUI(NotifyID.ArchUnavailable);
    } else {
      responseFn(e, rott);
    }
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
