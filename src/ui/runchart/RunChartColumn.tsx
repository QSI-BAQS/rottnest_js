import React from "react";
import {CGResult, CGResultDummy, CUReqResult, CUReqResultDummy} 
	from "../../obj/CallGraph.ts";
import { ArchWorkspace, ArchWorkspaceData } 
	from "rottnest-plugin/schema/ArchWorkspace";
import { MessageType } from "../../net/Protocol.ts";
import styles from '../styles/CGSpace.module.css'
import { BufferMapKey } from "../workspace/buffermap/BufferMapCommon.ts";
import { RunChartConstants } from "./RunChartConstants.ts";


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
  * RunChartSelectedNodeBox
  * 
  */
export class RunChartSelectedNodeBox extends React.Component<CGNodeData, {}>  {

	cuId = RunChartConstants.UnitId;

	actionOnNode(data: any,
		    runReady: boolean, simReady: boolean) {
		if(simReady) {
			console.log(simReady);
			console.log(data);
			this.gotoVisualiserWithData(data);
		} else if(runReady) {
			this.runGraphNode(data);
		}
	}

	/**
	  * Runs the graph node for the
	  * If a visualiser object already exists in this system
	  * Then the object should 
	  */
	runGraphNode(data: any) {
		const container = this.props.workspaceData
			.architecture as any; //WARN: Unsafe assumption
		
		const appService = container.getConnectionManager().getNetworkService();
		appService.sendObj(MessageType.CallGraph.RunGraphNode, {
				graph_id: data.idx
			})
	}

	gotoVisualiserWithData(_data: any) {

		
		const container = this.props.workspaceData
			.architecture as any; //WARN: Unsafe assumption

		const workspace = this.props.workspaceData;
		const context = workspace.archcontext;
		const refresh = container.getServices().getRefreshService();
		console.log(container);
		const bmap = this.props.workspaceData.stash;
		const bmapViz = JSON.parse(bmap.get(BufferMapKey.Visualiser.CurrentData));
		let simReady = false;
		if(bmapViz) {
			simReady = bmapViz.vis_obj !== undefined ||
				bmapViz.vis_obj !== null;
		}

		if(simReady) {
			//Grab data here?
			const vizData = container
				.getStateData()
				.getVisState()
				.getVizData();
			
			bmap.insert(BufferMapKey.Visualiser.CurrentData, JSON.stringify(vizData)); 
			//TODO: You got to fix this
			console.log(context);
			context.move("visualiser", bmapViz.vis_obj);
			refresh.triggerRefresh();
		}
	}

	getGlobalVolumes(): CGResult {

		const container = this.props.workspaceData
			.architecture as any; //WARN unsafe assumption
		const rrbuf = container.getServices().getRunResultService();

		const gvolumes = rrbuf.getTotalArray();
		if(gvolumes.length > 0) {
			const lastVol = gvolumes[gvolumes.length-1]!;

			return lastVol;
		} else {
			return CGResultDummy();
		}
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

	render() {
		const ndata = this.props;	
		//const cuObj = this.props.cuReqData;
		let cuResults = this.getGlobalVolumes();
		let cuVolume = cuResults.volumes;
		let cuTocks = cuResults.tocks;
	        let tsourceInfo = cuResults.tSource;
		let cuDetailsReady = false;

		let nName = RunChartConstants.Node.NotSelected;
		let nDescription = RunChartConstants.Node.NoDescription;
		let nKind = RunChartConstants.Node.NoKind;

		let compStr = this.getCompilationFinished();
		if(ndata.nodeData !== null 
		   && ndata.nodeData !== undefined) {
			const nd = ndata.nodeData;
			nKind = nd.kind;
			nName = nd.idx;
		}
		let tdata = [];		
	
    if(tsourceInfo) {
			for(const k in tsourceInfo) {
				const tdat = tsourceInfo[k];
				tdata.push(
					<div key={`tdat_${k}`}>
					{k}:{tdat}	
					</div>
				);
			}
		}


		const compInfo = (<div className={styles.dataSegment}>
				  <header>Compilation State:</header>
					<span>
					{compStr}
					</span>

			</div>)
		const tDisp = tdata === null ? 
			<></>:
			<div className={styles.dataSegment}>
				<header>Last Run - T Source Info:</header>
				{tdata}
			</div>
		const tockDisp = cuTocks === null ? 
			<></>:
			<div className={styles.dataSegment}>
				<header>Last Run - Tocks Info:</header>
				<div>
					<span>
					Graph-State
					</span>
					<span>: </span>
					<span>
					{cuTocks.graph_state}
					</span>
				</div>
				<div>
					<span>
					Bell Input 
					</span>
					<span>: </span>
					<span>
					{cuTocks.bell}
					</span>
				</div>
				<div>
					<span>
					T-Schedule
					</span>
					<span>: </span>
					<span>
					{cuTocks.t_schedule}
					</span>
				</div>
				<div>
					<span>
					Bell Output
					</span>
					<span>: </span>
					<span>
					{cuTocks.bell2}
					</span>
				</div>
				<div>
					<span>
					Total 
					</span>
					<span>: </span>
					<span>
					{cuTocks.total}
					</span>
				</div>
			</div>

		
		const renResult = !cuDetailsReady ? 
			(<div className={styles.nodePanel}>
			 	<header>
				<div>Id: {nName} </div> 
				<div>Type: {nKind} </div>
				</header>
				<div>
				{nDescription}
				</div>
				<div className={styles
					.dataSegment}>
					<header>
					{ RunChartConstants.Headers.GlobalVolumes }
					</header>

					<div><span>Reg.Vol: </span>
					<span>{cuVolume
						.REGISTER_VOLUME}
					</span></div>
					<div><span>Fac.Vol: </span>
					<span>{cuVolume
						.FACTORY_VOLUME}
					</span></div>
					<div><span>Rout.Vol: </span>
					<span>{cuVolume
						.ROUTING_VOLUME}
					</span></div>
					<div><span>TIdle.Vol: </span>
					<span>{cuVolume
						.T_IDLE_VOLUME}
					</span></div>
					<div><span>Bell-Rout.Vol: </span>
					<span>{cuVolume
						.BELL_ROUTING_VOLUME}
					</span></div>
					<div><span>Bell-Idle.Vol: </span>
					<span>{cuVolume
						.BELL_IDLE_VOLUME}
					</span></div>
					<div><span>Non-Part.Vol: </span>
					<span>{cuVolume
						.NP_VOLUME}
					</span></div>
				</div>
				{compInfo}
				{tDisp}
				{tockDisp}
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

		let sData = bmap.get('current_node');
		let idx = 'Not Selected';
		let cuReq = CUReqResultDummy();
		let kind = 'Not ready';
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
					{ RunChartConstants.Headers.Volumes }
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

