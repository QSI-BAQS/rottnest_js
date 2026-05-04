import { RottStatusResponseMSG } from "../../obj/CallGraphNet";
import { AppServiceMessage } from "../AppServiceMessage";
import { CallGraphPacketKind } from "../CallGraphProtocol";
import { MessageType } from "../Protocol";
import { WebSocketHookDefault } from "./Common";

/**
  * Hooks/Callbacks that are used within the call graph
  * classes to enable a clean interaction with the callgraph
  * instances
  */
export class CallGraphWebSocketHooks extends WebSocketHookDefault {

  constructor() {
  	super();
  	this.setInternalMap(
		  {
		    [CallGraphPacketKind.GraphNotReady]: super.MakeHookWrapper(this, 'graphNotReadyHook'),
		    [CallGraphPacketKind.RootGraph]: super.MakeHookWrapper(this, 'getRootGraphHook'),
		    [CallGraphPacketKind.Graph]: super.MakeHookWrapper(this, 'getGraphHook'),
		    [CallGraphPacketKind.GetGraphConfirmation]: super.MakeHookWrapper(this, 'getGraphConfirmationHook'),
		    [CallGraphPacketKind.Node]: super.MakeHookWrapper(this, 'getNodeStatusHook'),
		    [CallGraphPacketKind.RunNodeConfirmation]: super.MakeHookWrapper(this, 'runNodeHook'),
		  }
  	)
  }
  
  requestRootGraph(context: any) {
    const cgspace = context;
    const container = cgspace.props.wdaggr;
    const appService = container.getServices().getNetworkService();

    appService.sendObj(MessageType.CallGraph.GetRootGraph, JSON.stringify({}))
  }
  

  getGraphConfirmationHook(_context: any, _jsonObj: any, _asm: AppServiceMessage) {
    //TODO: Need to handle confirmation
    console.log("YO!")
  }
  
  getRootGraphHook(context: any, _jsonObj: any, asm: AppServiceMessage) {
    const parserOps = super.getParserOps();
    const cgspace = context;
    const container = context.props.architecture;

		let graph = parserOps.decodeGraph(asm);
		let expands = true;

		cgspace.props.stash.insert('cgviz_chart_gid_data',
				JSON.stringify({ expands, }));

		cgspace.props.stash.insert('node_column',
				JSON.stringify(0));

		if(graph) {
			container.getStateData()
			  .getCallGraphState()
			  .setGraphViewData(graph);
			
		}
		cgspace.resetState();
		const nState = {...cgspace.state}
		nState.refresh = true;
		cgspace.setState(nState);

  }


  getGraphHook(context: any, _jsonObj: any, asm: AppServiceMessage) {
				//let gid = jsonObj.gid;
				const cgspace = context;
        const container = context.props.architecture;
				let parserOps = super.getParserOps()
				let graph = parserOps.decodeGraph(asm);
				let expands = true;
				let expGid = 'invalid';

				if(graph) {
					container.getStateData()
					  .getCallGraphState()
					  .setGraphViewData(graph);

					if(graph.graph) {
						let sz = graph.graph.size;
						if(sz) {	
							if(sz === 1) {
								const e = graph.graph.
								values().map((et: any) => {
									return et;
								}).toArray()[0];
								expands = e.expands;
								expGid = e.id;
							}	
							
						}

					}
				}
				cgspace.props.stash.insert('node_column',
						JSON.stringify(0));
				cgspace.props.stash.insert('cgviz_chart_gid_data',JSON.stringify({
						expands,
						gid: expGid,
						idx: expGid
					}));
			
				cgspace.resetState();
				const nState = {...cgspace.state}
				nState.refresh = true;
				cgspace.setState(nState);
    
  }

  graphNotReadyHook(_context: any, _jsonObj: any, _asm: AppServiceMessage) {
    // TODO: Need to finish ready hook
  }

  runNodeHook(context: any, jsonObj: any, _asm: AppServiceMessage) {
        const cgspace = context;
        const container = cgspace.props.architecture;
				let rrBuf = container.getServices().getRunResultService();
				//A lot of heavy lifting done with this
				//to address a terrible messaging system
				const [rkind, mdat] = rrBuf.decodeAndSort(jsonObj
									  .payload);
				let shouldUpdate = false;
				//TODO: This is bloody nasty!
				// WARNING: You are dealing with something quite gross here!
				let modMeta = container.getModulesMeta();
				if(rkind === "CUIDObj" || rkind === "CUIDTotal") {
					modMeta.setEnable("CallGraph");
					modMeta.setEnable("Chart");
					shouldUpdate = true;
				}
					
				if(rkind === "VisualResult") {
					container.getStateData()
						.getVisState()
						.setVizData(mdat);
					modMeta.setEnable("Visualiser");
					cgspace.props.stash.insert('viz_sim_data', JSON.stringify({
							simready: true }));
					shouldUpdate = true;
				}

				if(shouldUpdate) {
					container.getServices()
					  .getRefreshService()
					  .triggerRefresh();
				}


  }


  getNodeStatusHook(context: any, _jsonObj: any, asm: AppServiceMessage) {
    const cgspace = context;
    // const container = context.props.architecture;
		const containerMsg = new RottStatusResponseMSG();
		const rData = asm.parseDataTo(containerMsg);
		if(rData) {
			const cuData = rData
				.curesult;
			cgspace.state.cunitMap	
				.set(cuData.cu_id,
				     cuData);
			cgspace.props.stash
			.insert('node_column',
				JSON
				.stringify(cuData));
				const nState 
				= {...cgspace.state}
			cgspace.setState(nState);
    }
  }
  
}
