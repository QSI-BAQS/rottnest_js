import React from "react";
import { NullObject } from "../../../../../util/NullObject";
import { ArchWorkspace, ArchWorkspaceData } from "../sigs/ArchWorkspace";
import styles from "../styles/NoArchColumn.module.css";

/**
 * Workspace properties that expose
 * the required stuff related to the architecture object
 * as well as the UI context grouping
 */
export type NoArchColumnProps = {
  workspaceData: ArchWorkspaceData,
}

/**
 * NoArchColumn, it is just a foller component
 */
export class AVDesignColumn extends React.Component<NoArchColumnProps, NullObject> 
	implements ArchWorkspace {
		
  /**
   * Simple render method for displaying
   * the results as defined by the class
   */
  render() {

    const displayText = "Properties"
    
    return (<div className={styles.noarchColumn}>
      <header className={styles.noarchName}>{displayText}</header>
    </div>)
  }

}
