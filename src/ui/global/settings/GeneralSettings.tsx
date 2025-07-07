import React from "react";

import RottnestContainer from '../../container/RottnestContainer';

import styles from '../styles/SettingsForm.module.css';

/**
 * PluginSettingsProps
 *
 * Used for 
 *
 */
export interface PluginSettingsProps {
  index: number;
  selected: string;
  config: string;
  container: RottnestContainer;
  saveFn: () => void;
  cancelFn: () => void;
}

/**
 * PluginSettingsData
 *
 * Used for maintaining settings for the pluggable elements
 */
export interface PluginSettingsData {
  index: number;
  selected: string;
  config: string;
}

export class PluginSettings
  extends React.Component<PluginSettingsProps, PluginSettingsData> {

  state: PluginSettingsData = {
    index: 0,
    selected: '',
    config: '',
        
  }

  /**
   * Saves the configuration
   * window
   */
  saveConfig() {
    const savfn = this.props.saveFn;
    savfn();
  }

  /**
   * Cancels the configuration
   * window
   */
  cancelConfig() {
    
    const cancelfn = this.props.cancelFn;
    cancelfn();
  }
  

  render() {
    
    return (
      <>
        <div className={styles.pluginSettings}>
          <label></label>
        </div>
      </>
    )
  }
}
