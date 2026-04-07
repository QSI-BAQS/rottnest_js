import React, { ChangeEvent, MouseEvent } from "react";


import styles from '../../styles/PluginSettingsForm.module.css';
import { CloseOutlined, ProfileOutlined } from "@ant-design/icons";
import { PluginData } from "../../../obj/plugin/Generic";
import RottnestApplication from "../../container/RottnestApplication";
import { ProgramParam } from "../../../obj/plugin/Program";
import { ProgramParametersContainer } from "./ProgramParameterSettings";


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
  index: number
  selected: string | null
  prevselected: string | null
  config: string
  configActive: boolean
  params: ProgramPluginParams | null
  hasBeenModified: boolean,
  plgArgsData: Array<ProgramParam>,
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
    selected: this.props.getSelected(this.props.container),
    prevselected: null,
    configActive: true,
    config: this.props.getConfig(this.props.container),
    plgArgsData: this.props.getParams(this.props.container,
      this.props.getSelected(this.props.container))!,
    plgArgs: JSON.stringify(this.props.getParams(this.props.container,
      this.props.getSelected(this.props.container))),
    params: null,
    hasBeenModified: false
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
        params: this.state.plgArgsData
      },
      container: this.props.container
    }
    savfn(sdata);
    const container = this.props.container;
    // const params = this.props.getParams(this.props.container,
    const prgPluginSrv = container.getServices().getProgramPluginService();
    const params = JSON.parse(prgPluginSrv.getProgramConfig());

    // this.props.getSelected(this.props.container));
    const nstate = {...this.state };
    nstate.params = {
      parameters: params!,
    }
  }

  /**
   * Saves the configuration
   * related to architectures and programs and others
   */
  saveConfig() {
    const savfn = this.props.saveConfigFn;

    const sdata = {
      pluginData: {
        plgKey: 'params',
        plgValue: JSON.stringify(this.state.plgArgsData),
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
  

  /**
   * Renders the component
   */
  render() {

    const tryParams = this.props.getParams(this.props.container,
      this.props.getSelected(this.props.container))

    const params = tryParams ? tryParams : [];


    const container = this.props.container;
    const plglabel = this.props.plgname;
    const plgIsSet = container.getServices()
      .getProgramPluginService()
      .isCurrentSet();
    const hasBeenModified = this.state.hasBeenModified;
    const plgOptions = this.props.plgItemsGetter(container);
    let selectedKey = this.props.getSelected(container);

    if(!plgIsSet && !hasBeenModified) {
      if(plgOptions.length > 0) {
        selectedKey = this.state.selected = plgOptions[0].keyName;
        this.state.plgArgs = JSON.stringify(this.props.getParams(container, selectedKey));
      }
    } 
    if(this.state.selected === null) {
      this.state.selected = selectedKey;
    } else if(this.state.selected !== this.state.prevselected) {

      this.state.prevselected = this.state.selected;
      selectedKey = this.state.selected;
    } else {
      selectedKey = this.state.selected;
    }
    
    //const plgArgs = this.state.plgArgsData;
    const ref = this;
    const saveDataOnClick = (_e: MouseEvent<HTMLButtonElement>) => {
      ref.saveData();
    };

    //TODO: Possibly remove this
    // const saveConfigOnClick = (_e: MouseEvent<HTMLButtonElement>) => {
    //   ref.saveConfig();
    // };

    const configOnClick = (_e: MouseEvent<HTMLButtonElement>) => {
      // Opens the config data
      ref.toggleConfig();
    };

    // const configOnChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    //   let textCfg = e.target.value;
    //   let data = {...ref.state};
    //   data.hasBeenModified = true;
    //   data.plgArgs = textCfg;
    //   //data.plgArgs = JSON.parse(textCfg);
    //   ref.setState(data);
    // }

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
    //Config space with current config and executable information
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
            params={params} />
      </div>
      </>
    ) : <></>
    //
    // Removed: Adjusting the settings
    // <textarea className={styles.pluginTextArea}
    //   value={plgArgs} onChange={configOnChange}>
    // </textarea>
    //
    //
    
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
              onChange={onDropdownChange} defaultValue={selectedKey}>
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
  plgItems: Array<PluginEntry>
}


/**
 * A settings list component
 */
function PluginSettingsList(props: PluginOptionsData) {
  const entries = props.plgItems.map((e) => {
    return <option key={`program_${e.keyName}`} className={styles.plgOption}
      value={e.keyName}>{e.keyName}
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
