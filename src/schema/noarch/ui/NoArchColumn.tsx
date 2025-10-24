import React from "react";
import styles from "../styles/NoArchColumn.module.css";
import { ArchWorkspace, ArchWorkspaceData } from "rottnest-plugin/schema/ArchWorkspace";

/**
 * Workspace properties that expose
 * the required stuff related to the architecture object
 * as well as the UI context grouping
 */
export type NoArchColumnProps = {
  workspaceData: ArchWorkspaceData,
  disptext: string
}

/**
 * NoArchColumn, it is just a foller component
 */
export class NoArchColumn extends React.Component<NoArchColumnProps,{}> 
	implements ArchWorkspace {
		
  /**
   * Simple render method for displaying
   * the results as defined by the class
   */
  render() {

    const displayText = this.props.disptext;
    
    return (<div className={styles.noarchColumn}>
      <header className={styles.noarchName}>{displayText}</header>
    </div>)
  }

}
