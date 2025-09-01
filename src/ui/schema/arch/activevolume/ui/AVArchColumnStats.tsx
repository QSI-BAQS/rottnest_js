import React from "react";
import { NullObject } from "../../../../../util/NullObject";
import { ArchWorkspace, ArchWorkspaceData } from "../sigs/ArchWorkspace";
import styles from "../styles/NoArchColumn.module.css";

/**
 * Workspace properties that expose
 * the required stuff related to the architecture object
 * as well as the UI context grouping
 */
export type AVColumnProps = {
  workspaceData: ArchWorkspaceData,
}

/**
 * NoArchColumn, it is just a foller component
 */
export class AVStatsColumn extends React.Component<AVColumnProps, NullObject> 
	implements ArchWorkspace {
		
  /**
   * Simple render method for displaying
   * the results as defined by the class
   */
  render() {

    const displayText = "Stats"
    
    return (<div className={styles.noarchColumn}>
      <header className={styles.noarchName}>{displayText}</header>
    </div>)
  }

}
