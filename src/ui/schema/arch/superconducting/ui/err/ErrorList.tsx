import { ArchitectureObject } from "../../../ArchSchema";
import React from "react";
import styles from '../styles/ErrorList.module.css';



type RuleResultKind = "Ok" | "Warning" | "Error";

export type RuleResult = {
  kind: RuleResultKind
  code: string
  msg: string
}

/**
 * The error data will provide a
 * description, name, identifier and reference related
 * to the region that is an issue
 */
type ErrorData = {
	ident: number
	name: string
	itemRefKey: string
	description: string
}

/**
 * ErrorItemData is an aggregate
 * that will outline the data and selected
 * property for it to be highlighted
 */
type ErrorItemData = {
	idx: number
	errorData: RuleResult
	selected: boolean
	updateSelected: (idx: number) => void
}

/**
 * Properties that are held by the error list
 */
type ErrorListData = {
	selectedIndex: number
}

/**
 * ErrorListing that holds an aggregation
 * of an array of errors
 */
type ErrorListing = {
	archObject: ArchitectureObject
	errors: Array<ErrorData>
}

/**
 * An ErrorItem that will display and reference
 * an issue within the design space / project
 *
 */
class ErrorItem extends React.Component<ErrorItemData, {}> {


	render() {
		const idx = this.props.idx;
		const ident = this.props.errorData.code;
		const errorName = this.props.errorData.code;
		const errorDesc = this.props.errorData.msg;
		const errorKind = this.props.errorData.kind;
		const isSelected = this.props.selected;
		const parentUpdateFn = this.props.updateSelected;
		
		const updateFn = () => {
			parentUpdateFn(idx)
		}

		return (
			<li key={ident}
				className={ 
					isSelected ? 
					styles.errorItem :
					styles.selectedErrorItem 
				}
				onClick={updateFn}>
				<span>{errorName}</span>
				<span>: </span>
				<span>{errorKind}</span>
				<div>{errorDesc}</div>
			</li>
		)
	}
}

/**
 * The ErrorList will display issues
 * within the project and design space
 */
class ErrorList extends React.Component<ErrorListing, ErrorListData> {
	state: ErrorListData = {
		selectedIndex: -1
	};

	/**
	 * Updates the selected index based on an on-click event
	 * in the error item
	 */
	updateSelected(idx: number) {
		this.state.selectedIndex = idx;
	}

	/**
	 * Renders a list of errors within a component
	 * the default styling will be applied
	 */
	render() {
		const headerName = 'Errors';
		//TODO: Fix this
		//const _archobj = this.props.archObject;
		//valservice.validate(archobj); //TODO: This needs to be prompted elsewhere
		
		//const errBuffers = valservice.getBuffers();
		//const [_valid, localres] = errBuffers.localbuf;
		/*const selfRef = this;

		const selUpdateFn = (idx: number) => {
			selfRef.updateSelected(idx);
		}*/
		const localres: Array<ErrorItem> = [];
		const errors = localres.map(
			(e: any, i: number) => <ErrorItem
					idx={i}
					errorData={e} 
					selected={i === this.state.selectedIndex }
					updateSelected={(_idx: number) => {}}

				/>
		);
		return (
			<div className={styles.errorList}>
				<header className={styles.errorListHeader}>
					{headerName}</header>
			<ul className={styles.errorListUL}>
				{errors}
			</ul>
			</div>
		)
	}

}

export default ErrorList;
