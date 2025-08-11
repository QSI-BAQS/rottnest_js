import React from "react";
import { NullObject } from "../../../../../util/NullObject";
import { ArchWorkspace, ArchWorkspaceData } from "../../ArchWorkspace";
import styles from "../styles/NoArchSpace.module.css";

/**
 * Workspace properties that expose
 * the required stuff related to the architecture object
 * as well as the UI context grouping
 */
export type NoArchWorkspaceProps = {
  workspaceData: ArchWorkspaceData,
}

/**
 * NoArchitecture space, it is a blank canvas with
 * simple words indicating that the user has no architecture selected
 */
export class NoArchSpace extends React.Component<NoArchWorkspaceProps, NullObject> 
	implements ArchWorkspace {
		
  /**
   * Simple render method for displaying
   * the results as defined by the class
   */
  render() {
    
    return (<div className={styles.noarchSpaceContainer}>
        <header className={styles.noarchNoSelectHeader}>No Architecture Selected</header>
    </div>)
  }

}
