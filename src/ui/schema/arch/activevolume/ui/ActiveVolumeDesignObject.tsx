import React from "react";

export type AVDesignProps = {
  nregisters: number
  nancilla: number
  nfactories: number
}

//
// AVEventKind that outlines
// what kind of event was generated
// 
export type AVEventKind = {
  kind: string,
  data: {
    factory_id?: number
    ancilla_id?: number
    register_id?: number
    states?: number
    n_states?: number
  }
}

//
// An event that is recorded by the graph machine
// 
export type AVEvent = {
  cycles: number,
  step: number,
  kind: AVEventKind
}

//
// Visualiser Object produced by the AV
// Model.
// 
export type VisualObj = {
  registers: number,
  ancilla: number,
  tfactories: number,
  events: Array<Array<AVEvent>>
}


//
// Represents the current position
// within the graph
// 
export type VisPosition = {
  x: number
  y: number
  radius: number
}

export type VisUsedNode = {
  position: VisPosition,
  text: string
}


///
// Used for generating a line and also light up lines
// 
export type VisLine = {
  x1: number,
  x2: number,
  y1: number,
  y2: number,
}

export type VisUsedEdge = {
  edge: VisLine,
  colour: string
}

//
// Each frame contains information
// on the current frame number 
// 
export type VisualiserData = {
  frameNo: number
  cycles: Array<number>
  registers: Array<VisPosition>
  ancilla: Array<VisPosition>
  tfactories: Array<VisPosition>
  factory_edges: Array<VisLine>
  ancilla_edges: Array<VisLine>
  usedEdges: Array<Array<AVVisEvent>>
  usedNodes: Array<Array<AVVisEvent>>
  
  
}

export type EVKey = "Node" | "Edge"

export type EVMap = {
  [key: string]: EVKey
}

const EventToVisMap: EVMap = {
  "Idle" : "Node",
  "FactoryGeneration" : "Node",
  "AncillaIdle" : "Node",
  "AncillaStateReset" : "Node",
  "RegisterConsume" : "Node",
  "RegisterIdle" : "Node",
  "RegisterReset" : "Node",
  "FactoryStatesMove" : "Edge",
  "AncillaStateMove" : "Edge"
}

export type EVTag = {
  kind: string,
  idx: number
  cnt?: number
}

export type EVTagMap = {
  [key: string]: (event: AVEvent, data: VisualiserData) => EVTag
}

const EventToTag: EVTagMap = {
  "Idle" : (_event, _data): EVTag => {
    return { kind: 'Factory', idx: 0 } },
  "FactoryGeneration" : (e, _d): EVTag => {
    return { kind: 'Factory', idx: e.kind.data.factory_id !== undefined ? e.kind.data.factory_id : -1 } },
  "AncillaIdle" : (e, _d): EVTag => {
    return { kind: 'Ancilla', idx: e.kind.data.ancilla_id !== undefined ? e.kind.data.ancilla_id : -1 } },
  "AncillaStateReset" : (e, _d): EVTag => {
    return { kind: 'Ancilla', idx: e.kind.data.ancilla_id !== undefined ? e.kind.data.ancilla_id : -1 } }, 
  "RegisterConsume" : (e, _d): EVTag => {
    return { kind: 'Register', idx: e.kind.data.register_id !== undefined ? e.kind.data.register_id : -1 } },
  "RegisterIdle" : (e, _d): EVTag => {
    return { kind: 'Register', idx: e.kind.data.register_id !== undefined ? e.kind.data.register_id : -1 } },
  "RegisterReset" : (e, _d): EVTag => {
    return { kind: 'Register', idx: e.kind.data.register_id !== undefined ? e.kind.data.register_id : -1 } },
  "FactoryStatesMove" : (e, _d): EVTag => {
    return { kind: 'Factory', idx: e.kind.data.factory_id !== undefined ? e.kind.data.factory_id : -1,
    cnt: e.kind.data.n_states } },
  "AncillaStateMove" : (e, _d): EVTag => {
    return { kind: 'Ancilla', idx: e.kind.data.ancilla_id !== undefined ? e.kind.data.ancilla_id : -1, cnt: e.kind.data.register_id } },  
}

function NodeTagToPosition(tag: EVTag, data: VisualiserData): VisPosition {
  if(tag.kind === "Factory") {
    return data.tfactories[tag.idx];
  }
  else if(tag.kind === "Register") {
    return data.registers[tag.idx];
  } else {
    return data.ancilla[tag.idx];
  }
}

function EdgeTagToPosition(tag: EVTag, data: VisualiserData):
  [Array<{ edge: VisLine, color: string }>,
  Array<{ kind: EVKey, position: VisPosition}>] {
    

  let ns: Array<{ kind: EVKey, position: VisPosition}> = [];

  if(tag.kind === "Factory") {
    let s: Array<{ edge: VisLine, color: string}> = [];
    for(let i = 0; i < data.ancilla.length; i++) {
      let v = {
        edge: data.factory_edges[tag.idx * data.ancilla.length + i],
        color: 'red'
      };
      let n = { kind: 'Ancilla' as EVKey, position: data.ancilla[i] };
      s.push(v);
      ns.push(n);
    }

    return [s, ns];
    //TODO: Offset is total number of connections to ancilla
    //BUG: We need to fix this for other kinds of graphs
  } else {
    let target = 0;
    if(tag.cnt) {
      target = tag.cnt;
    }
    return [[{
      edge: data.ancilla_edges[(tag.idx * data.registers.length) + target],
      color: 'orange'
    }], ns]
  }
}

export type AVVisEvent = {
  kind: EVKey,
  evtag: EVTag,
  event: AVEvent,
  nodevis?: VisUsedNode
  edgevis?: VisUsedEdge
}


export function FrameEventBuilder(event: AVEvent, data: VisualiserData):
  { edges: Array<AVVisEvent>, nodes: Array<AVVisEvent> }  {
  const mkey = event.kind.kind;
  const ekind = EventToVisMap[mkey];

  const evtag = EventToTag[mkey](event, data);
  let edges: Array<AVVisEvent> = [];
  let nodes: Array<AVVisEvent> = [];
  
  
  if(ekind === "Node") {
    
    nodes.push({
      kind: ekind,
      event,
      evtag,
      nodevis: {
        position: NodeTagToPosition(evtag, data),
        text: '' //TODO: Just empty for now

      }
    });
    
  } else if(ekind === "Edge") {
    
    let [edgm, nodm] = EdgeTagToPosition(evtag, data);
    for(let i = 0; i < edgm.length; i++) {
      let d  = edgm[i];
      let fev: AVVisEvent = {
        kind: ekind,
        event,
        evtag,
        edgevis: {
          edge: d.edge,
          colour: d.color
        }
      };
      edges.push(fev);
    }
    for(let i = 0; i < nodm.length; i++) {
      let d  = nodm[i];
      let fev: AVVisEvent = {
        kind: d.kind,
        event,
        evtag,
        nodevis: {
          position: d.position,
          text: '',
        }
      };
      nodes.push(fev);
    }
  }

  return { edges, nodes };
}

export type CyclesAggr = {
  frameNodeEvents: Array<AVVisEvent>;
  frameEdgeEvents: Array<AVVisEvent>;
}

export function AttachFrameActivities(data: VisualiserData, obj: VisualObj, frameNo: number) {
  let isFinished = false;
  const cyclesList = [];
  let frameNodeEvents = [];
  let frameEdgeEvents = [];

  let currentCycles = 0;
  
  for(let i = 0; i < obj.events.length && !isFinished; i++) {
    //Find events for step == frameNo

    for(let j = 0; j < obj.events[i].length; j++) {
      //
      const e = obj.events[i][j];

      if(e.step === frameNo) {
        //We need to switch it
        if (currentCycles != e.cycles) {
          currentCycles = e.cycles;
          if(frameNodeEvents.length > 0 || frameEdgeEvents.length > 0) {
            const cycaggr = {
              frameNodeEvents,
              frameEdgeEvents
            };
            cyclesList.push(cycaggr);
            frameNodeEvents = [];
            frameEdgeEvents = [];
          }
          
        }
        
        const { edges, nodes } = FrameEventBuilder(e, data);
        for(let i = 0; i < nodes.length; i++) {
          let fev = nodes[i];
          frameNodeEvents.push(fev);
        }
        for(let i = 0; i < edges.length; i++) {
          let fev = edges[i];
          frameEdgeEvents.push(fev);          
        }
      } else if(e.step > frameNo) {
        //We should break here
        isFinished = true;
        break;
      }
      
    
    }

  }

  //Last check
  if(frameNodeEvents.length > 0 || frameEdgeEvents.length > 0) {
    const cycaggr = {
      frameNodeEvents,
      frameEdgeEvents
    };
    cyclesList.push(cycaggr);
    frameNodeEvents = [];
    frameEdgeEvents = [];
  }

  for(let i = 0; i < cyclesList.length; i++) {
    data.usedEdges.push(cyclesList[i].frameEdgeEvents);
    data.usedNodes.push(cyclesList[i].frameNodeEvents);
  }
  //We have everything with the aggregates
  
}

//
// Based on the visual object given,
// it will construct data that the visualiser can consume
// for displaying the animation
// 
export function ConstructAnimData(visualObj: {
    registers: number, ancilla: number, tfactories: number}): VisualiserData {

  
  let registers: Array<VisPosition> = [];
  for(let i = 0; i < visualObj.registers; i++) {
    registers.push({x: 50 * (i + 1), y: 20, radius: 10 });
  }

  let ancilla: Array<VisPosition> = [];
  let ancilla_edges: Array<VisLine> = [];
  for(let i = 0; i < visualObj.ancilla; i++) {
    ancilla.push({x: 50 * (i + 1), y: 100, radius: 10 });
    for(let j = 0; j < registers.length; j++) {
      ancilla_edges.push(
        {x1: 50 * (i + 1), y1: 100, x2: registers[j].x,
          y2: registers[j].y });
    }
  }
  let tfactories: Array<VisPosition> = [];
  let factory_edges: Array<VisLine> = [];
  for(let i = 0; i < visualObj.tfactories; i++) {
    
    tfactories.push({x: 50 * (i + 1), y: 180, radius: 10 });
    for(let j = 0; j < ancilla.length; j++) {
      factory_edges.push(
        {x1: 50 * (i + 1), y1: 180, x2: ancilla[j].x,
          y2: ancilla[j].y });
    }
  }


  let current_data = {
    frameNo: 0,
    cycles: [],
    registers,
    ancilla,
    tfactories,
    factory_edges,
    ancilla_edges,
    usedEdges: [],
    usedNodes: [],
  }

  

  //Construct the activity edges
  //Grouping are in pairs
  //AttachFrameActivities(current_data, visualObj, frameNo)  

  return current_data;
}


export function VisualiserDataEmpty() {
  
  return {
    frameNo: 0,
    cycles: [],
    registers: [],
    ancilla: [],
    tfactories: [],
    factory_edges: [],
    ancilla_edges: [],
    usedEdges: [],
    usedNodes: [],
    visualObj: null
  }
}




//
// Will draw a node that will represent either a
// register, ancilla or factory
// 
export function DrawActiveNode(vp: VisUsedNode) {

  const node_circ = <circle cx={vp.position.x} cy={vp.position.y} r={vp.position.radius}
    stroke={"orange"} strokeWidth={3} fill="none" />
  const node_text = <text x={vp.position.x} y={vp.position.y} textAnchor="middle"
      >
      {vp.text}
      </text>

  return (<>
    {node_circ}
    {node_text}
    </>)
  
}

//
// Will draw a node that will represent either a
// register, ancilla or factory
// 
export function DrawNode(vp: VisPosition, textrepr: string) {

  const node_circ = <circle cx={vp.x} cy={vp.y} r={vp.radius}
    stroke={"black"} strokeWidth={2} fill="white"
    key={`node_crc_passve_${textrepr}`} />
  const node_text = <text x={vp.x} y={vp.y+(vp.radius/2)}
    textAnchor="middle" key={`node_txt_circ_${textrepr}`}>
      {textrepr}
      </text>

  return (<>
    {node_circ}
    {node_text}
    </>)
  
}

//
// Draws a line between two visual object
// that are part of an svg
// 
export function DrawLineFromPositions(vp1: VisPosition, vp2: VisPosition, stroke_col: string) {
  const pStr = `${vp1.x},${vp1.y},${vp2.x},${vp2.y}`;
  const node_line = <line x1={vp1.x} y1={vp1.y} x2={vp2.x} y2={vp2.y} stroke={stroke_col} strokeWidth={2} key={`line_psv_${pStr}`}
    />

  return <>{node_line}</>;
  
}
//
// Draws a line between two visual object
// that are part of an svg
// 
export function DrawLine(vl: VisLine, stroke_col: string) {
  const pStr = `line_${vl.x1},${vl.y1},${vl.x2},${vl.y2}`;
  const node_line = <line x1={vl.x1} y1={vl.y1} x2={vl.x2} y2={vl.y2} stroke={stroke_col} strokeWidth={2} key={pStr} />

  return <>{node_line}</>;
  
}

//
// 1. Generate the positions on 3 rows
//   * Registers on top row
//   * Ancilla in the mid row
//   * Factories on the bottom row
//
// 2. Construct lines for every ancilla to all registers
//
// 3. Construct lines for every factory to all ancilla
//
// 4. The frame has a set of states that reflect what has changed between the two. 
//    * We need to detect the change between state
// 
// 
// 
export class AVDesignObject extends
  React.Component<AVDesignProps, VisualiserData> {

  state = VisualiserDataEmpty();

  genData() {
    const {nregisters, nancilla, nfactories } = this.props
    const vobj =
      {
        registers: nregisters,
        ancilla: nancilla,
        tfactories: nfactories 
      }
    const animdata = ConstructAnimData(vobj);
    return animdata;
  }


  drawLines(animdata: VisualiserData) {
    let lines = [];
    for(let i = 0; i < animdata.ancilla_edges.length; i++) {
      lines.push(DrawLine(animdata.ancilla_edges[i], "black"));
    }

    for(let i = 0; i < animdata.factory_edges.length; i++) {
      lines.push(DrawLine(animdata.factory_edges[i], "black"));
    }
    return lines;
  }

  drawNodes(animdata: VisualiserData) {
    
    let nodes = [];
    for(let i = 0; i < animdata.registers.length; i++) {
      nodes.push(DrawNode(animdata.registers[i], `r${i}`));
      
    }
    for(let i = 0; i < animdata.ancilla.length; i++) {
      nodes.push(DrawNode(animdata.ancilla[i], `a${i}`));
      
    }
    for(let i = 0; i < animdata.tfactories.length; i++) {
      nodes.push(DrawNode(animdata.tfactories[i], `t${i}`));
      
    }

    return nodes;
  }

  drawActiveNodes(animdata: VisualiserData, step: number) {
    
    //Use the event information to construct activities
    let nodes = [];
    if(animdata.usedNodes.length > 0) {
      for(let i = 0; i < animdata.usedNodes[step].length; i++) {
        
        const ele = animdata.usedNodes[step][i];
        const vis = ele.nodevis;
        if(vis) {
          if(vis.position) {
            nodes.push(DrawActiveNode(vis));
          } else {
            
            console.warn("undefined node, ", ele);
          }
        }
      }
    }
    return nodes;
  }

  drawActiveLines(animdata: VisualiserData, step: number) {
    //Use the event information to construct activities
    let lines = [];
    if(animdata.usedEdges.length > 0) {
      for(let i = 0; i < animdata.usedEdges[step].length; i++) {
        const ele = animdata.usedEdges[step][i];
        const vis = ele.edgevis;
        //const cnvis = ele.edgevis
        if(vis) {
          if(vis.edge) {
            lines.push(DrawLine(vis.edge, vis.colour));
            
          } else {
            console.warn("undefined edge, ", ele);
          }
          
        }
      }
    }

    return lines;
  }  

  render() {
    // TODO:  You need to revise this
    // WARN: Reusing a lot from VisualiserFrame
    // To get around some limitations
    const animdata = this.genData();
    const lines = this.drawLines(animdata);
    const nodes = this.drawNodes(animdata);
    const activeLines = this.drawActiveLines(animdata, 0);
    const activeNodes = this.drawActiveNodes(animdata, 0);
    const ox = 20;
    const oy = 20;
    const vwidth = 500;
    const vheight = 500; 
    console.log(this.props);
    console.log(nodes);

    return (
      <>
        <svg viewBox={`${-100-ox} ${-100-oy} ${vwidth} ${vheight}`} width={'100%'} height={720}
          style={{backgroundColor: '#aaaaaa'}}>
        {lines}
        {activeLines}
        {nodes}
        {activeNodes}
        </svg>
      </>)
  }

}
