import React from "react";
import styles from "../styles/NoArchSpace.module.css";
import { ArchWorkspace, ArchWorkspaceData } from "rottnest-plugin/schema/ArchWorkspace";

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
export class NoArchSpace extends React.Component<NoArchWorkspaceProps,{}> 
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
