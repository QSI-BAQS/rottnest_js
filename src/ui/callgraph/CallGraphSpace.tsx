import React, {CSSProperties} from "react";
import {CallGraphData, CallGraphEntry, CUReqResult, RottCallGraphEntryDefault }
	from "../../obj/CallGraph.ts";
import { CallGraphWebSocketHooks }
	from "../../net/hooks/CallGraphHooks.ts";
import { AppServiceMessage }
	from "../../net/AppServiceMessage.ts";
import { ArchStashMap, ArchWorkspaceData }
	from "rottnest-plugin/schema/ArchWorkspace";
import { MessageType } from "../../net/Protocol.ts";

import styles from '../styles/CGSpace.module.css';


interface CGUpdateableContext {	
	pushPositionUpdate(pdata: CGLinePositionData): void
	getCoords(): CGObjectLineUpdatable 
}

interface CGUpdatable {	
	pushPositionUpdate(pdata: CGLinePositionData): void
	registerContext(ctx: CGUpdateableContext): void
	getCoords(): CGObjectLineUpdatable	
}

export interface ASContextHook {
	serviceHook(asm: AppServiceMessage): void
}

type CGPositionData = {
	x: number
	y: number
	depth: number
	parent: string
}

type CGViewState = { 
	dispPositions: Map<string, CGPositionData>
	
	//The x1, y1 position
	srcPositions: Map<string, Map<string, CGUpdatable>>

	//The x2, y2 position
	destPositions: Map<string, Map<string, CGUpdatable>>
	cunitMap: Map<string, CUReqResult>
	
	//registerMap: Map<string, CGObjectLine>
	refresh: boolean
	xOff: number
	yOff: number
	moveMode: boolean
}

type CGLayerEntry = {
	entryIdx: string 
	parentIdx: string
}

type CGTreeLayerData = {
	depth: number
	layerElements: Array<CGLayerEntry>
}


type CGTreeDisplayData = {
	layerData: Array<CGTreeLayerData>
}


/**
 * This will be aggregation of all the widget data,
 * we will have a selected index that allows the
 * component to select it and represent it
 *
 */
type CGAggr = {
	graph: CallGraphData
	workspaceData: ArchWorkspaceData
}

/**
 * CGDispData
 * 
 */
type CGDispData = {
	wdaggr: CGAggr
	index: string 
	selectedIdx: string
	cuId: string
	x: number
	y: number
	cuReqData: CUReqResult | null
	updateTrigger: (idx: string, data: CGPositionData) => void
  expands: boolean;
};

/**
 * CGObjectData
 */
type CGObjectData = {
	x: number
	y: number
	actualPosition: boolean
	moveMode: boolean
	cuReady: boolean
	dataReady: boolean
}

/**
 * CGObject, 
 */
class CGObject extends React.Component<CGDispData, 
	CGObjectData> {
	
	cuIndex = this.props.index;
	cuId = this.props.cuId
	//TODO: Don't look, it is awful
	apservice = this.props.wdaggr
		.workspaceData.architecture
			.getConnectionManager()
			.getNetworkService()

	updateFn = this.props.updateTrigger;
	
	state: CGObjectData = {
		x: this.props.x,
		y: this.props.y,
		actualPosition: false,
		moveMode: false,
		cuReady: false,
		dataReady: false,
	}

	data: {
		bufferMap: ArchStashMap
		idx: string 
		selectedIdx: string 
	} = {
		bufferMap: this.props.wdaggr
			.workspaceData
			.stash,
		idx: this.props.index,
		selectedIdx: this.props
			.selectedIdx
		
	}
	
	getWorkspaceOffsets(parent: ParentNode | null): [number, number] {

		if(parent) {
			const wparent = parent.parentNode as HTMLElement;
		
			if(wparent) {
				return [wparent.offsetLeft, wparent.offsetTop];
			}
		}
		return [0, 0];
		
	}

	onLineUpdate(offLeft: number, offTop: number) {
		//const xdiff = offLeft - this.state.x);
		this.updateFn(this.data.idx, {
			x: this.state.x - offLeft,
			y: this.state.y - offTop,
			depth: 0,
			parent: ''	
		});


	}	

	onHoverTrigger() {
		//1. Trigger an update on the panel
    this.data.bufferMap.insert(
      "current_node",
		JSON.stringify({
        idx: this.props.index,
      })
    );
    this.data.bufferMap.insert(
      "cgviz_chart_gid_data",
      JSON.stringify({
        expands: this.props.expands,
        gid: this.props.index,
        idx: this.props.index,
      })
    );
		this.data.bufferMap.commit();
	}

	onNodeMove(e: React.MouseEvent<HTMLDivElement>) {
		if(this.state.moveMode) {	
			const parent = e.currentTarget.parentNode;
			
			const [oleft, otop] = this.getWorkspaceOffsets(parent);
			const nx = e.clientX;
			const ny = e.clientY;
			
			this.state.x = nx;
			this.state.y = ny;

			let nState = {...this.state};
			this.onLineUpdate(oleft, otop);
			this.setState(nState);
		}
	}

	onNodeMouseUp(e: React.MouseEvent<HTMLDivElement>) {

		const bmap = this.props.wdaggr.workspaceData.stash;
		const btn = e.button;
		if(btn === 1) {

			bmap.insert('inner_mouse_event', JSON.stringify({
				innerMove:false 
			}))	
			let nState = {...this.state};
			nState.moveMode = false;
			this.setState(nState);
		}
	}

	onNodeMouseDown(e: React.MouseEvent<HTMLDivElement>) {
		const btn = e.button;
			
		const bmap = this.props.wdaggr.workspaceData.stash;
		if(btn === 1) {
			bmap.insert('inner_mouse_event', JSON.stringify({
				innerMove: true
			}))	
			const nx = e.clientX;
			const ny = e.clientY;
			this.state.x = nx;
			this.state.y = ny;
			this.state.moveMode = true;
			this.state.actualPosition = true;
			
			let nState = {...this.state};
			const parent = e.currentTarget.parentNode;
			
			const [oleft, otop] = this.getWorkspaceOffsets(parent);
			this.onLineUpdate(oleft, otop);
			this.setState(nState);

		} else if(btn === 0) {

			let expands = true;
			const chdata = JSON.parse(bmap
					.get('cgviz_chart_gid_data'));
			if(chdata) {
				 expands = chdata.expands;
				// expands = true;

			}
			console.log(chdata);
			console.log(this.props);
			if(expands) {
				if(this.props.cuReqData === null ||
				  this.props.cuReqData.status 
					!== 'complete') {


					console.log(this.props);
					
					// TODO: Check if it is a shim or not
					this.apservice.sendObj(MessageType.CallGraph.GetGraph, {
						'graph_id': this.data.idx
					});

					this.state.cuReady = true;
					this.state.dataReady = true;
				}
				const gidx = this.data.idx;
				let nnode = {
					idx: gidx
				};
				const nstr = JSON.stringify(nnode);
				this.data.bufferMap
					.insert('root_node',
						nstr);	
				this.data.bufferMap
					.insert('next_node',
						nstr);

				this.data.bufferMap.commit();
			} else {
				const container = this.props.wdaggr
					.workspaceData.architecture as any; //WARN: Dangerous assumption

				const rrBuf = container.getServices().getRunResultService();
				
				
				const gidx = this.props.index;
				const ifReqd = rrBuf
					.checkIfRequested(gidx);
				const ifFin = rrBuf
					.checkIfFinished(gidx);
				bmap.insert('viz_sim_data',
					JSON.stringify({
						simready: false,
						runready: true,
						runrequested: ifReqd,
						runfinished: ifFin,
					})
				);
				bmap.commit();
			}
		}	

	}		


	render() {
		//TODO: Update this with a zoom service
		//const rottContainer = this.props.wdaggr.workspaceData.architecture;
		const zoomService = this.props.wdaggr.workspaceData.architecture
			.getServices().getZoomService();
		const zoomValue = zoomService.getZoomValue();
		let widgetObj = this.props.wdaggr
			.graph.graph.get(
			this.props.index);
		const widget = widgetObj !== null ?
			widgetObj : RottCallGraphEntryDefault();
		
		let x = `${this.state.x-25}`;
		
		let ypx = `${this.state.y-25}`;
		let yperc = `${this.state.y}`;
		let zIndex = 5;
		if(this.state.moveMode) {
			zIndex = 200; //Makes it visible out of others
		}
		let sObj = { left: `${x}px`,top: `${ypx}px`,
			position: 'fixed',
			minWidth: `${80*(zoomValue/100)}px`,
			maxWidth: `${80*(zoomValue/100)}px`,
			zIndex: zIndex
		} as React.CSSProperties;
		if(!this.state.actualPosition) {

			x = `${this.state.x}%`;
			yperc = `${this.props.y}%`;
			sObj = {
				left: `calc(${x} - 25px)`,
				top: `${yperc}`,
				position: 'absolute',
				minWidth: `${80*(zoomValue/100)}px`,
				maxWidth: `${80*(zoomValue/100)}px`,

			} as React.CSSProperties

		}
		
		let description = '';
		let cuId = 'X_X';
		let compName = 'Compiling';
		if(widget) {
			compName = widget.name;
			cuId = widget.id;
			if(widget.description) {
				description = widget.description;
			}
		}

		return (
			<div style={sObj}
				className={styles.widgetObject}
				onMouseEnter={(_) => { 
					this.onHoverTrigger()}}
				onMouseDown={(e) => { this
					.onNodeMouseDown(e)}}
				onMouseUp={(e) => {this
					.onNodeMouseUp(e)}}
				onMouseMove={(e) => this
					.onNodeMove(e)}>
				<header 
					className={
						styles
						.widgetObjectHeader}>
					Id: {cuId}
				</header>
				<div className={styles
					.widgetObjectBody}>
				{description}	
				</div>
				<div className={
						styles.cuStatus}>
					{compName}	
				</div>
			</div>
		);
	}

}

type CGLinePositionData = {
	x1: number
	x2: number
	y1: number
	y2: number
	pairUnit1: string
	pairUnit2: string

}



type CGObjectLineData = {
	idx: string
	updateable: CGUpdatable
	pairUnit1: string 
	pairUnit2: string 
	x1: number
	x2: number
	y1: number
	y2: number
}

type CGObjectLineUpdatable = {
	updateable: CGUpdatable
	pairUnit1: string 
	pairUnit2: string 
	x1: number
	x2: number
	y1: number
	y2: number
}

export class CGObjectLine extends React.Component<CGObjectLineData, CGObjectLineUpdatable> 
	implements CGUpdateableContext {

	constructor(props: CGObjectLineData) {
		super(props);
		
		props.updateable.registerContext(this);
	}
		
	state: CGObjectLineUpdatable = {
		updateable: this.props.updateable,
		x1: this.props.x1, 
		x2: this.props.x2,
		y1: this.props.y1,
		y2: this.props.y2,
		pairUnit1: this.props.pairUnit1,
		pairUnit2: this.props.pairUnit2
	};

	getCoords() {
		return this.state;
	}

	pushPositionUpdate(pdata: CGLinePositionData) {
		const nState = {...this.state};
		nState.x1 = pdata.x1;
		nState.x2 = pdata.x2;
		nState.y1 = pdata.y1;
		nState.y2 = pdata.y2;
		nState.pairUnit1 = pdata.pairUnit1;
		nState.pairUnit2 = pdata.pairUnit2;
		this.setState(nState);

	}

	render() {
		//this.state.updateable.registerContext(this);
		const { idx } = this.props;
		const { x1, x2, y1, y2, pairUnit1, pairUnit2 } = this.state;
		let styPropUpdate: CSSProperties = {};
		if(this.state.pairUnit1 !== '%' || this.state.pairUnit2 !== '%') {
			styPropUpdate = { position: 'absolute' } as CSSProperties;
		}

		return (
			 <line style={styPropUpdate}
			 	key={`cu${idx}`} 
				x1={`${x1}${pairUnit1}`} 
				x2={`${x2}${pairUnit2}`} 
				y1={`${y1+5}${pairUnit1}`} 
				y2={`${y2+5}${pairUnit2}`} stroke={'white'} 
					strokeWidth={'1'}
			/>		)
	}
}


export class CallGraphSpace extends 
	React.Component<ArchWorkspaceData, CGViewState> 
	implements ASContextHook {
	
	appService = this.props.architecture.getConnectionManager()
		.getNetworkService();	
	state: CGViewState = {
		cunitMap: new Map(),
		dispPositions: new Map(),
		srcPositions: new Map(),
		destPositions: new Map(),
		refresh: true,
		xOff: 0,
		yOff: 0,
		moveMode: false,
	}

	callgraphHooks = new CallGraphWebSocketHooks();

	resetState() {
		this.state.cunitMap = new Map();
		this.state.dispPositions = new Map();
		this.state.srcPositions = new Map();
		this.state.destPositions = new Map();

	}
	
	/**
	 * Will trigger a send to get data of the callgraph
	 * when initialised - May need to re-initialise it when the
	 * event triggers
	 */
	componentDidMount() {
		const aps = this.props.architecture.getConnectionManager()
			.getNetworkService();
		aps.sendObj(MessageType.CallGraph.GetRootGraph,
			JSON.stringify({ graph_id: 0 }));
	}


	constructor(props: any) {
		super(props);
		const container = this.props.architecture;
		const aService = container.getConnectionManager().getNetworkService();
		aService.hookContext(this,MessageType.CallGraph.GetStatus);
		aService.hookContext(this,MessageType.CallGraph.GetGraph);
		aService.hookContext(this,MessageType.CallGraph.GetRootGraph);
		aService.hookContext(this,MessageType.CallGraph.RunGraphNode);
		aService.hookContext(this,MessageType.Data.RunResult);
	}
	
	serviceHook(asm: AppServiceMessage): void {
		const cgServiceHook = this.callgraphHooks;
		const cgspace = this;	
		cgServiceHook.trigger(cgspace, asm);
	}

	traverseGraph(graph: CallGraphData, 
		      rootIdx: string)
		: CGTreeDisplayData {

		const collection = graph.graph;
		//depth, parentIdx, entryIdx	
		let queue: Array<[number, string, string]> 
			=[[0,'', rootIdx]];
		// let seenList: Set<string> = new Set(); //TODO: May need to fix!
		let traversalData: Array<CGTreeLayerData> = [];
		let current: [number, string, string] 
			| undefined = undefined;

		while(queue.length > 0) {
			current = queue.shift();
			if(!current) { continue; }
			
			const [depth, parentIdx, idx] = current;
			const currentCG = collection.get(idx);
			
			if(currentCG === undefined) {
				return { layerData: [] };
			}
			const element = {
				entryIdx: idx,
				parentIdx
			};

			if(depth >= traversalData.length) {
				traversalData.push(
					{
						depth,
						layerElements:[
							element
						],
					}
				);
			} else {
				traversalData[depth]!
				.layerElements.push(element);	
			}
			//add children
			// TODO: This probably can be removed? idk?
			
			// for(let i = 0; i < currentCG
			//     .children.length; i++) {
			// 	const childIdx = currentCG
			// 		.children[i];
				
			// 	if(childIdx && !seenList.has(childIdx)) {
			// 		seenList.add(childIdx);
			// 		queue.push([depth+1, idx, 
			// 			   childIdx]);
			// 	}
			// }
		}

		return { layerData: traversalData }
	}
	
	identifyRoots(graph: CallGraphData): Array<[string, 
			      CallGraphEntry]> {
		
		let rootList: Array<[string, CallGraphEntry]> = [];
		let seenSet: Set<string> = new Set();
		for(const [_, cgobj] of graph.graph.entries()) {
			for(const ck of cgobj.children) {
				seenSet.add(ck);
			}
		}

		for(const [k, cgobj] of graph.graph.entries()) {
			if(!seenSet.has(k)) {
				rootList.push([k, cgobj]);
			}
		}

		return rootList;
	}

	updateLinePosition(idx: string, data: CGPositionData) {
		const srcObjs = this.state.srcPositions.get(idx);
		const destObjs = this.state.destPositions.get(idx);
		if(srcObjs) {
			let x2 = data.x;
			let y2 = data.y;
			let pairUnit1 = '%';
			
			for(const [sk, co] of srcObjs) {
				
				const coords = co.getCoords();
				let nPosition: CGLinePositionData = {
					x1: 0,
					y1: 0,
					x2,
					y2,
					pairUnit1,
					pairUnit2: 'px'

				};
				if(idx === sk) {
					nPosition.pairUnit1 = 'px';

					nPosition.x1 = x2;
					nPosition.y1 = y2;
				} else {

					nPosition.pairUnit1 = coords.pairUnit1;
					nPosition.x1 = coords.x1;	
					nPosition.y1 = coords.y1;
				}
				co.pushPositionUpdate(nPosition);
			}

		}
		if(destObjs) {
			let x1 = data.x;
			let y1 = data.y;
			let pairUnit2 = '%';
			for(const [dk, co] of destObjs) {
				
				const coords = co.getCoords();
				let nPosition: CGLinePositionData = {
					x1,
					y1,
					x2: 0,
					y2: 0,
					pairUnit1: 'px',
					pairUnit2

				};

				if(idx === dk) {
					nPosition.pairUnit2 = 'px';
					nPosition.x2 = x1;
					nPosition.y2 = y1;
				} else {
					nPosition.pairUnit2 = coords.pairUnit2;
					nPosition.x2 = coords.x2;
					nPosition.y2 = coords.y2;
				}
				
				co.pushPositionUpdate(nPosition);
			}
		}	
	}

	render() {
		let calcdHeight = 0;
		//const zoomValue = this.props.container.state.appStateData.zoomValue;
		const zoomValue = 100;
		const cgref = this;
		const bmap = this.props.stash;
		//TODO: We need to retrieve the graph information
		//	and update the details
		const container = this.props.architecture as any;
		// const graphFromContainer = container.getStateData()
		// 	.getCallGraphState().getGraphViewData();
		const graphFromContainer = container.getServices()
			.getCallGraphService()
			.getGraphViewData();
		bmap.stash('graph_ref', graphFromContainer);
		const waggr: CGAggr = {
			graph: graphFromContainer,
			workspaceData: this.props
		}
    // const rootList = this.identifyRoots(graphFromContainer);
    // TODO: Re-evaluate this operation
    const rootList = Array.from(graphFromContainer
    		.graph.entries()) as Array<Array<any>>;

		if(rootList.length !== 0) {
			
			let selectedIndex = rootList[0]![0];
			const selectedData = JSON.parse(
				bmap.get('root_node'));
			if(selectedData !== null) {
				//First index is the key
				selectedIndex = selectedData[0];
			}
				
			const upTrigger = (idx: string, data: CGPositionData) => {
				cgref.updateLinePosition(idx, data);
			};

			let cidx = 0;
			// let rowDrop = 0;
			// let prix = '';
			const rootN = rootList.length;
			const renderedCGs = 
				rootList
					.map((e) => { return this.traverseGraph(graphFromContainer, e[0]) })
						.map((ldw: CGTreeDisplayData) => { return ldw.layerData
							.map((wl: CGTreeLayerData, _lidx: number) => { cidx += 1;
			            const wlRes = wl.layerElements
		            	.map((w: CGLayerEntry, _idx: number) => {
		                const wname = waggr.graph.graph.get(w.entryIdx)?.name;
		                

			              let xdisp = cidx % 10 * 8 + 8;
			              let yoff = Math.floor(cidx / 10) / rootN * 600;
									  calcdHeight = Math.max(Math.floor(rootN / 10)*100, calcdHeight);
										const cuVal = this.state
										.cunitMap.get(wname !== undefined ? wname
											: '');
								const distCU = cuVal !== null 
								&& cuVal !== undefined ?
									cuVal : null;
								const wdispData : CGDispData = {
									wdaggr: waggr,
									index: w.entryIdx,
									x: xdisp,
									y: yoff,

									selectedIdx: selectedIndex,
									cuReqData: distCU,
									cuId: wname === undefined 
										? '' :
										wname,
									updateTrigger: upTrigger,
									// expands: 
		              expands: waggr.graph.graph.get(w.entryIdx)?.expands ?? false
								};
		                return <CGObject key={`cgobj_${wname}`} {...wdispData} />;
		              }
		            );
								return wlRes;
				})
			});
			
			const mouseDownContainer = (e: React.MouseEvent<HTMLDivElement>) => {
				const innerState = JSON.parse(bmap.get('inner_mouse_event'));
				let innerMove = false;
				if(innerState) {
					innerMove = innerState.innerMove;
				}


				if(e.button === 1 && !innerMove) {
					const nState = {...this.state};
					nState.moveMode = true;
					this.setState(nState);
				}
			};
			const mouseUpContainer = (e: React.MouseEvent<HTMLDivElement>) => {

				if(e.button === 1) {
					const nState = {...this.state};
					nState.moveMode = false;
					this.setState(nState);
				}
			};
			const mouseMoveContainer = (e: React.MouseEvent<HTMLDivElement>) => {
				const innerState = JSON.parse(bmap.get('inner_mouse_event'));
				let innerMove = false;
				if(innerState) {
					innerMove = innerState.innerMove;
				}

				if(this.state.moveMode && !innerMove) {
					const nState = {...this.state};
					nState.xOff += e.movementX;
					nState.yOff += e.movementY
					this.setState(nState);
				}
			};

			const cxoff = this.state.xOff;
			const cyoff = this.state.yOff;
			this.state.refresh = false;
				return (
					<div className={styles.widgetSpace}
					style={{height: `${zoomValue}%`, width:`${zoomValue}%`,
						fontSize: `${(11*(zoomValue/100))}pt`,
						top: `${cyoff}px`, left: `${cxoff}px` 
						}}
						onMouseDown={(e) => { mouseDownContainer(e)}}
						onMouseUp={(e) => { mouseUpContainer(e)}}
						onMouseMove={(e) => { mouseMoveContainer(e)}}
						>	
						{renderedCGs}
						<svg key={`svg_group`} className={styles.widgetSVGLineStack}>
						</svg>
					</div>
					)
				} else {
					const requestGraph = () => {
						bmap.insert('reset_rlist',
							JSON.stringify({ reset: true }));

						const aps = cgref.appService;
						cgref.resetState();
						aps.sendObj(MessageType.CallGraph.GetRootGraph,
							JSON.stringify({ graph_id: 0 }));
						
					}
				return (
					<div className={styles.widgetSpace}
						style={{height:`${calcdHeight}px`}}>
						<div className={styles.badGraph}>
						Unable to load call-graph
						<div><button className={styles.retryButton}
							onClick={(_) => requestGraph()}>
						Retry
						</button></div>
						</div>	
					</div>

				)
			}
	
		}
	}
