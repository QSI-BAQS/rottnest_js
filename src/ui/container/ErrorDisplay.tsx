import React from 'react';
import { NullObject } from '../../util/NullObject.ts';
import styles from '../styles/ErrorDisplay.module.css';
import { RefreshService } from '../../service/RefreshService.ts';
import { ErrorState } from '../context/global/modules/ErrorState.ts';

/**
 * Settings Properties, initialises
 * as hidden and provide a connection to the
 * root container that it can connect to.
 *
 * Warning: We have coupled this component
 * 	to the root container.
 */
export type ErrorProps = {
	errorState: ErrorState
	refreshService: RefreshService
};


/**
 * Settings form component, will be always present
 * in the display but turned off and on when needed
 */
export default class ErrorDisplay extends React.Component<ErrorProps, NullObject> {
	

	errorState = this.props.errorState;
	refreshServce = this.props.refreshService;

	/**
	 * An event to ensure that the error is 
	 */
	clearError() {
		this.errorState.clearError();
		this.refreshServce.triggerRefresh();
	}

	/**
	 * Renders the error, if an error is not set it will rendering nothing
	 */
	render() {
		const [isError, errorMsg] = this.errorState.getErrorState();
		if(isError) {
			const msg = errorMsg;
			const msgSpl = msg.split("\n").map((e) => {
				return <pre className={styles.preFormatDump}>{e}</pre>
			});
			console.log(msgSpl);
			return (
				<div className={styles.errorDisplay} 
					style={{position:'absolute'}}>
					<header className={styles.errorHeader}>An issue occurred</header>
					<div>
					Either a message from the backend
					or an event did not trigger correctly.
					</div>
					<div>JSON Dump: </div>
					<div className={styles.preFormatDump}>{msgSpl}</div>
					<button onClick={() => {this.clearError() }}
					className={styles.errorButton}>
					Got it
					</button>
				</div>
			);
		} else {
			console.warn("No error set but attempt to render was made")
			return (<></>);
		}
	}
}
