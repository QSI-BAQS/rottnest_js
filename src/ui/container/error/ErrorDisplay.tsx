import React from 'react';
import { RefreshService } from '../../../service/RefreshService.ts';
import { ErrorState } from '../../context/global/modules/ErrorState.ts';
import { Util } from '../../../util';
import { ErrorMessage, ErrorStyle } from './ErrorCommon.ts';
import styles from '../../styles/ErrorDisplay.module.css';

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
export default class ErrorDisplay extends React.Component<ErrorProps, Util.Empty> {
	

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
			return (
				<div className={styles.errorDisplay} 
					style={ErrorStyle}>
					<header className={styles.errorHeader}>An issue occurred</header>
					<div>{ErrorMessage.BodyTemplate.message}</div>
					<div>{ErrorMessage.Dump.Header}</div>
					<div className={styles.preFormatDump}>{msgSpl}</div>
					<button onClick={() => {this.clearError() }}
					className={styles.errorButton}>
						{ErrorMessage.Button.message}
					</button>
				</div>
			);
		} else {
			console.warn(ErrorMessage.NoError.message);
			return (<></>);
		}
	}
}
