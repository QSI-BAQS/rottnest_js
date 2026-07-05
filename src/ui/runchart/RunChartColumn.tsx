import React, { ReactElement } from "react";
import {CGResult, CUReqResult, CUReqResultDummy} 
	from "../../obj/CallGraph.ts";
import { ArchWorkspace, ArchWorkspaceData } 
	from "rottnest-plugin/schema/ArchWorkspace";
import styles from '../styles/CGSpace.module.css'
import { BufferMapKey } from "../workspace/buffermap/BufferMapCommon.ts";
import { RunChartConstants } from "./RunChartConstants.ts";
import { DownloadFile } from "../../util/FileDownload.ts";


type NodeData = {
	idx: string 
	kind: string
}

type CGNodeColumnData = {
	workspaceData: ArchWorkspaceData
}


type CGNodeData = {
	cuReqData: CUReqResult
	workspaceData: ArchWorkspaceData 
	nodeData: NodeData | null
}


/**
  * RunChartVolumesData
  * This is used to populate the object with the
  * necessary data
  */
export type RunChartPanelData = {
	header: string
	fuzzyWordLengths: Array<number>,
	normalKey: boolean,
	toExponential: boolean,
	data: { [key: string]: number | string }
}


/**
  * RunChartDataViewProps
  * This is used to extract required data for global
  * and selected node
  */
export type RunChartDataViewProps = {
	lastTEntry: string | null,
	cuTocks: {[key: string]: number},
	cuVolume: {[key: string]: number}
	toExponential: boolean,
}

/**
  * Generalised segment that can be used
  * for global data and node data
  */
const RunChartSegmentDataView = (props: RunChartDataViewProps) => {

	const lastTEntry = props.lastTEntry;
	const cuTocks = props.cuTocks;
	const cuVolume = props.cuVolume;
	const expo = props.toExponential;

	const tDisp = lastTEntry === null ?
		<></> :
		<RunChartGlobalData header={RunChartConstants.Headers.TSource}
			normalKey={false}
			fuzzyWordLengths={[1, 2, 3]}
			toExponential={false}
			data={{ "Source" : lastTEntry }}
		/>;

	const volumesData =(
		<RunChartGlobalData
			header={RunChartConstants.Headers.GlobalVolumes}
			fuzzyWordLengths={[4, 8, 4]}
			normalKey={true}
			toExponential={expo}
			data={cuVolume}
		/>
	);

	const tocksDisp = cuTocks === null ?
		<></> :
		<RunChartGlobalData header={RunChartConstants.Headers.Tocks}
			normalKey={true}
			toExponential={expo}
			fuzzyWordLengths={[9, 9, 9]}
			data={cuTocks}
		/>


	return {
		volumeComponent: volumesData,
		tocksComponent: tocksDisp,
		tSourceComponent: tDisp
	};
}


/**
  * RunChartGlobalData
  * Displays the global volumes
  */
export class RunChartGlobalData extends React.Component<RunChartPanelData, {}> {

	/**
	  * Given a word, it will recompute a new minimum that can be displayed
	  * for the key
	  */
	minWithFuzzy(word: string, minLength: number, fuzzyLength: number) {
		if(word.length < fuzzyLength) {
			return word.length;
		} else {
			return minLength;
		}
	}

	/**
	  * To display the form
	  * and return a string
	  */
	toScientificNotationString(v: number, places: number) {
		return v.toExponential(places);
	}

	/**
	  * Normalises the key
	  * To ensure that the first letter is capitalised for the word
	  */
	recapitalise(word: string) {
		const first = word[0].toUpperCase();
		const rest = word.slice(1, word.length).toLowerCase();;

		return `${first}${rest}`;
	}

	/**
	  * A method to use a key and display it in a somewhat more appropriate manner
	  * It makes some big assumptions on what should be here
	  */
	normaliseKey(key: string, fuzzylengths: Array<number>) {
		const spl = key.split("_");
		const startstr = this.recapitalise(spl[0]);
		const laststr = this.recapitalise(spl[spl.length-1]);
		const commonMin = 3;

		const firstFuzz = fuzzylengths[0];

		if(spl.length == 1) {
			return this.recapitalise(startstr);
		} else if(spl.length == 2) {

			const lastFuzz = fuzzylengths[1];
			const comp1Min = this.minWithFuzzy(startstr, commonMin, firstFuzz);
			const comp3Min = this.minWithFuzzy(laststr, commonMin, lastFuzz);

			const component1 = `${startstr.substring(0, comp1Min)}`;
			const endComponent = `${laststr.substring(0, comp3Min)}`;
			const displayComponent = `${component1}. ${endComponent}`
			return displayComponent;
		} else if(spl.length == 3) {
			const midstr = this.recapitalise(spl[1]);
			const midFuzz = fuzzylengths[1];
			const lastFuzz = fuzzylengths[fuzzylengths.length-1];
			

			const comp1Min = this.minWithFuzzy(startstr, commonMin, firstFuzz);
			const comp2Min = this.minWithFuzzy(midstr, commonMin, midFuzz);
			const comp3Min = this.minWithFuzzy(laststr, commonMin, lastFuzz);

			const component1 = `${startstr.substring(0, comp1Min)}`;
			const component2 = `${midstr.substring(0, comp2Min)}`;
			const endComponent = `${laststr.substring(0, comp3Min)}`;
			const displayComponent = `${component1}. ${component2} ${endComponent}`
			return displayComponent;
		} else {
			return key;
		}
	}
	
	/**
	  * Renders the global volumes
	  * Simple render that will use the keys associated with the field value
	  */
	render() {
		const headerString = this.props.header;
		const data = this.props.data;
		const normalKey = this.props.normalKey;
		const fuzzyLengths = this.props.fuzzyWordLengths;
		const volumeEntries: Array<ReactElement> = [];
		const expo = this.props.toExponential;
		const places = 5;

		for(const key in data) {
			let volValue = data[key];
			if(expo && typeof volValue === 'number') {
				
				volValue = this.toScientificNotationString(Number(volValue), places);
			}
			
			const dispKey = !normalKey ? key :
				this.normaliseKey(key, fuzzyLengths);				
			
			volumeEntries.push(
				(
					<>
						<div className={styles.dataEntrySegment}>
							<span className={styles.dataEntrySegmentHeader}>{dispKey}: </span>
							<span>{volValue}</span>
						</div>
					</>
				)
			);
		}


		return (
				<div className={styles.dataSegment}>
					<header className={styles.runchartDataHeader}>
					{ headerString }
					</header>
					{volumeEntries}
				</div>
			)
	}		
}

/**
  * Split the panels into two parts
  * This will contain tocks data for the left panel
  */
export class RunChartAuxColumn extends React.Component<CGNodeColumnData, {}> {

	render() {

		const wsData = this.props.workspaceData;
		const bmap = wsData.stash;
		const graphRef = bmap.getStash()
			.get(BufferMapKey.CallGraph.GraphRef);

		let sData = bmap.get(BufferMapKey.RunChart.CurrentNode);
		let cuReq = CUReqResultDummy();
		let idx = RunChartConstants.Node.NotSelected;
		let kind = RunChartConstants.Node.StateNotReady;

		if(sData !== null) {
			const objDez = JSON.parse(sData);
			idx = objDez.idx;
			if(graphRef) {
				let comp = graphRef.graph.get(idx);
				if(comp) {
					cuReq.cu_id = comp.cu_id;
					kind = comp.name;
				}
			}

		}
		
		return(
			<div className={styles.widgetViewContainer}>
				<header className={styles
					.widgetContainerHeader}>
					{ RunChartConstants.Headers.SelectedNode }
				</header>
				<RunChartAuxNode
					nodeData={{ idx, kind  }}
					cuReqData={cuReq}
					workspaceData={
						{...wsData}
					}/>
			</div>
		);
	}
}


/**
  * Use by the AuxColumn itself, this
  * will be focused on clickable data within the graph itself and things
  * which are a little more "live".
  */
export class RunChartAuxNode extends React.Component<CGNodeData,
	RunChartDataViewState> {

	state: RunChartDataViewState = {
		sciNotation: false
	}

	/**
	  * Toggles if the scientific notation is enabled or not
	  */
	toggleNotation() {
		const nState = {
			sciNotation: !this.state.sciNotation
		};

		this.setState(nState);
	}

	getRunResultService() {
		
		const container = this.props.workspaceData
			.architecture as any; //WARN unsafe assumption
		const rrbuf = container.getServices().getRunResultService();
		return rrbuf;
	}

	getCompilationFinished(): string {
		const container = this.props.workspaceData
			.architecture as any; //WARN unsafe assumption
		const rrbuf = container.getServices().getRunResultService();

		const gendcomp = rrbuf.getEndComp();
		if(gendcomp.length > 0) {
			return RunChartConstants.CompilationState.Finished;
		} else {
			return RunChartConstants.CompilationState.Compiling;
		}
	}

	isDataAvailable() {
		return this.getRunResultService().isDataAvailable();
	}

	/**
	  * Gets the node summary from the index specified 
	  */
	getNodeSummary(index: number) {
		const container = this.props.workspaceData
			.architecture as any; //WARN unsafe assumption
		const rrbuf = container.getServices().getRunResultService();

		const results = rrbuf.getNodeSummary(index);
		return results;
		
	}


	render() {

		const self = this;
		let nName = RunChartConstants.Node.NotSelected;
		let cuDetailsReady = false;
		const dataAvailable = this.isDataAvailable();
		const ndata = this.props;
		const expo = this.state.sciNotation;
		let nodeIndex = 0;
		if(ndata.nodeData !== null 
		   && ndata.nodeData !== undefined) {
			const nd = ndata.nodeData;
			nName = nd.idx;
			if(Number.isInteger(nd.idx)) {
				nodeIndex = Number(nd.idx);
				cuDetailsReady = true;
			}
		}
		
		let cuResults = this.getNodeSummary(nodeIndex!);
    let tsourceInfo = cuResults.tSource;
		let cuVolume = cuResults.cuVolume;
		let cuTocks = cuResults.cuTocks;
		let cached = cuResults.cached;
		let lastTEntry = '';
		let tdata = [];
		
    if(tsourceInfo) {
			for(const k in tsourceInfo) {
				const tdat = tsourceInfo[k];
				tdata.push(
					<div key={`tdat_${k}`}>
					{k}:{tdat}	
					</div>
				);
				lastTEntry = `${k}:${tdat}`;	
			}
		}		
		
		const { volumeComponent, tocksComponent, tSourceComponent }
			= RunChartSegmentDataView({
				lastTEntry,
				cuTocks,
				cuVolume,
				toExponential: this.state.sciNotation
			})

		const nodeData = (
			<RunChartGlobalData
				header={`Id: ${nName}`}
				fuzzyWordLengths={[5, 12, 12]}
				normalKey={false}
				toExponential={expo}
				data={{ "Cached" : cached ? 'Yes' : 'No' }} />
		);

		const toggleExpo = () => {
			self.toggleNotation();
		}
		const renResult = cuDetailsReady && dataAvailable ? 
			(<div className={styles.nodePanel}
				onClick={toggleExpo}>
				{nodeData}
				{volumeComponent}
				{tocksComponent}
				{tSourceComponent}
			 </div>):
			(<div>
			 Data Not Selected
			 </div>);	

		return (
			<div className={styles.widgetBoxContent}>
				{renResult}
			</div>
		)

	}
}

/**
  * RunChart Button props
  * Used to display the button that would be appropriate
  * for the column in question
  */
export type RunChartColumnButtonProps = {
	text: string,
	onAction: (data: any) => void
	contextData: any
}

/**
  * Button to allow for particular utilities
  * Such as clearning cache and downloading data
  */
export const RunChartColumnButton = (props: RunChartColumnButtonProps) => {

	const btnText = props.text;
	const onAction = props.onAction;
	const ctxData = props.contextData;

	return (
		<div>
			<button className={`${styles.vizButton}`}
				onClick={(_) => { onAction(ctxData) }}>
			{btnText}</button>
		</div>
	)
} 

/**
  * Just need to represent if it has scientific notation
  * or not
  */
export type RunChartDataViewState = {
	sciNotation: boolean
}

/**
  * RunChartSelectedNodeBox
  */
export class RunChartSelectedNodeBox extends React.Component<CGNodeData, RunChartDataViewState>  {

	state: RunChartDataViewState = {
		sciNotation: false
	}
	cuId = RunChartConstants.UnitId;

	/**
	  * Toggles if the scientific notation is enabled or not
	  */
	toggleNotation() {
		const nState = {
			sciNotation: !this.state.sciNotation
		};

		this.setState(nState);
	}

	/**
	  * Retrieves the data from the
	  * run result service
	  */
	getRunResultService() {
		
		const container = this.props.workspaceData
			.architecture as any; //WARN unsafe assumption
		const rrbuf = container.getServices().getRunResultService();

		return rrbuf;
	}

	/**
	  * Gets the refresh service so
	  * it can trigger a clear
	  */
	getRefreshService() {
		
		const container = this.props.workspaceData
			.architecture as any; //WARN unsafe assumption
		const refresh = container.getServices().getRefreshService();

		return refresh;
	}

	/**
	  * Gets the global volumes from the 
	  * RunResultService
	  */
	getGlobalVolumes(): CGResult {
		const results = this.getRunResultService().getResultSummary();
		return results;
	}

	/**
	  * Gets the datetime that the run was placed on
	  * This is also to help the user know when the run was made
	  */
	getDateTime() {
		return this.getRunResultService().getDateTime();
	}

	/**
	  * Gets the runcache state
	  * This is to retrieve the state and show if it is an old
	  * result set or a new one
	  */
	getRunCacheState() {
		return this.getRunResultService().isFromStorageCache();
			
	}

	/**
	  * Uses runresult service to then trigger clearData
	  */
	clearRunCache() {
		this.getRunResultService().clearData();
		this.getRunResultService().reset();
	}

	/**
	  * Checks to see if the data is available
	  * from the RunResultService
	  */
	isDataAvailable() {
		return this.getRunResultService().isDataAvailable();
	}

	/**
	  * Downloads the data
	  * This is to retrieve the data from rrbuf and download
	  */
	downloadData() {
		const rrbuf = this.getRunResultService();
		const serialData = rrbuf.getSerializedRunChartData();
		const dtObj = this.getDateTime();
		const fmtDateString =
			`${dtObj.getFullYear()}-${(dtObj.getMonth()+1)}-${(dtObj.getDate())}`;
		const fmtTimeString =
			`${dtObj.getHours()}-${dtObj.getMinutes()}-${dtObj.getSeconds()}`
		const dtstring = `${fmtDateString}_${fmtTimeString}`;
		const chartLabel = `rundata-${dtstring}.json`;
		const serialBlob = new Blob([JSON.stringify({
			data: serialData.volumeSet,
			globalVolumes: serialData.lastEntry.volumes,
			globalTocks: serialData.lastEntry.tocks
		})],
				{type:'application/json'});
		DownloadFile(chartLabel, serialBlob);
	}

	render() {

		const self = this;
		const dataAvailable = this.isDataAvailable();
		let cuResults = this.getGlobalVolumes();
		let datetime = this.getDateTime();
		let fromCache = this.getRunCacheState();
		const expo = this.state.sciNotation;
		let cuVolume = cuResults.volumes;
		let cuDetailsReady = false;
		let cuTocks = cuResults.tocks;


    let tsourceInfo = cuResults.tSource;
		
		let lastTEntry = '';
		let tdata = [];		
    if(tsourceInfo) {
			for(const k in tsourceInfo) {
				const tdat = tsourceInfo[k];
				tdata.push(
					<div key={`tdat_${k}`}>
					{k}:{tdat}	
					</div>
				);
				lastTEntry = `${k}:${tdat}`;	
			}
		}

		const datetimeDisp = datetime === null ?
			<></> :
			( <>
				<header className={styles.widgetContainerHeader}>Run Completed On:</header>
				<header>
					{datetime !== null && dataAvailable
						? datetime.toLocaleString() : "No Run Information"}
				</header>
				<header>
					{`Cached Results: ${fromCache ? "Yes" : "No"}`}
				</header>
				</>
			)
		const tDisp = tdata === null ?
			<></> :
			<RunChartGlobalData header={RunChartConstants.Headers.TSource}
				normalKey={false}
				fuzzyWordLengths={[1, 2, 3]}
				toExponential={false}
				data={{ "Source" : lastTEntry }}
			/>;

		const volumesData =(
			<RunChartGlobalData
				header={RunChartConstants.Headers.GlobalVolumes}
				fuzzyWordLengths={[4, 8, 4]}
				normalKey={true}
				toExponential={expo}
				data={cuVolume}
			/>
		);

		const tocksDisp = cuTocks === null ?
			<></> :
			<RunChartGlobalData header={RunChartConstants.Headers.Tocks}
				normalKey={true}
				fuzzyWordLengths={[9, 9, 9]}
				toExponential={expo}
				data={cuTocks}
			/>
		const downloadDataButton = (
			<RunChartColumnButton
				text={"Download Data"}
				onAction={(_data: any) => {
					self.downloadData();
				}}
				contextData={{}}
				/>

		);

		const clearCacheButton = (
			<RunChartColumnButton
				text={"Reset Data"}
				onAction={(_data: any) => {
					self.clearRunCache();
					self.getRefreshService()
						.triggerRefresh();

				}}
				contextData={{}}
				/>

		);


		const toggleExpo = () => {
			self.toggleNotation();
		}
		
		const renResult = !cuDetailsReady && dataAvailable ? 
			(<div className={styles.nodePanel}
				onClick={toggleExpo}>
				{datetimeDisp}
				{volumesData}
				{tocksDisp}
				{tDisp}
				{downloadDataButton}
				{clearCacheButton}
			 </div>)
			:
			(<div>
				Data Not Ready
			 </div>);	

		return (
			<div className={styles.widgetBoxContent}>
				{renResult}
			</div>
		)
	}
}

export class RunChartNodeColumn 
	extends React.Component<CGNodeColumnData, {}> implements ArchWorkspace {
		
	render() {

		const wsData = this.props.workspaceData;
		const bmap = wsData.stash;
		const graphRef = bmap.getStash()
			.get(BufferMapKey.CallGraph.GraphRef);

		let sData = bmap.get(BufferMapKey.RunChart.CurrentNode);
		let cuReq = CUReqResultDummy();
		let idx = RunChartConstants.Node.NotSelected;
		let kind = RunChartConstants.Node.StateNotReady;

		if(sData !== null) {
			const objDez = JSON.parse(sData);
			idx = objDez.idx;
			if(graphRef) {
				let comp = graphRef.graph.get(idx);
				if(comp) {
					cuReq.cu_id = comp.cu_id;
					kind = comp.name;
				}
			}

		}

		
		return (
			<div className={styles.widgetViewContainer}>
				<header className={styles
					.widgetContainerHeader}>
					{ RunChartConstants.Headers.GlobalData }
				</header>
				<RunChartSelectedNodeBox 
					nodeData={{
						idx,
						kind 
					}}
					cuReqData={cuReq}
					workspaceData={
						{...wsData}
					}/>
			</div>
		)
	}
}

