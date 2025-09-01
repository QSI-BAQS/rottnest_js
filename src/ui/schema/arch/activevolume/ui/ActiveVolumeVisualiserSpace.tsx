
import React, { MouseEvent } from "react";
import { DownloadFile } from "./util/FileDownload.ts";
import { VisualiserFrame } from "./ActiveVolumeFrame.tsx";
import { ArchWorkspace, ArchWorkspaceData }
	from "../sigs/ArchWorkspace.ts";
import { OnRangeChange, OnVisualiserFrameNext, OnVisualiserFramePrev, OnVisualiserPlay, OnVisualiserReset }
	from "./ActiveVolumeVisualiserEvents.ts";
	
import style from "./styles/AVSchedulerVisualiser.module.css"

//
// Utilising the tickmarks from previous visualiser
// 
export const FRAMERATE: number = 60;

export function ConstructTickmarks(layerN: number) {
	
	let increment = 1000;
	if(layerN < 500) {
		increment = 10;
	} else if(layerN < 1000) {
		increment = 20;
	} else if(layerN < 5000) {
		increment = 100;
	} else if (layerN < 10000) {
		increment = 200;
	} else {
		increment = 1000;
	}

	let tickmarks = [];
	for(let i = 1; i <= layerN + increment - 1; i += increment) {
		tickmarks.push({ idx: i-1 });
	}
	return tickmarks;
}


export type AVFCSchedulerVisData = {
	data: any
	crfrm: number
	initd: boolean
	isPlaying: boolean
	offsets: [number, number]
	midDown: boolean
	interval: ReturnType<typeof setInterval> | null
}

//
// Visual Props for the Fully Connected graph props
// 
export type AVFCSchedulerVisProps = {
	workspaceData: ArchWorkspaceData
}

/**
 * Props that will allow you to set the title of the button
 * the onclick operation and the secondary data associated with it
 * 
 */
export type AVFCSchedulerButtonProps = {
	title: [string, string | null]
	visParent: AVTestVisualiser
	onClickOp: (viz: AVTestVisualiser) => void
	style: string
}

/**
 * Effectively just holds a singular value for input
 * Used to ensure that we move to different frames on change
 *
 */
export type AVFCSchedulerFrameData = {
	frame: number
}

/**
 * Just keeps track of the pressed state, useful for the title switching
 */
export type AVFCSchedulerButtonData = {
	toggleIdx: number
}


export class AVFCSchedulerControlButton
extends React.Component<AVFCSchedulerButtonProps, AVFCSchedulerButtonData>{

	data = {
		toggleIdx: 0
	}

	render() {

		const titles = this.props.title;
		const firstTitle = titles[0];
		const secondTitle = titles[1] != null ? titles[1] : titles[0];
		const renTitles = [firstTitle, secondTitle];

		
		const toggleIdx = this.data.toggleIdx;
		const title = renTitles[toggleIdx];
		const opfn = this.props.onClickOp;
		const viz = this.props.visParent;
		const sname = this.props.style;
		
		return (
			<>
				<button className={style[sname]} onClick={(_e) => { this.data.toggleIdx = (toggleIdx + 1) % 2;
					opfn(viz) }}>
					{title}
				</button>
			</>
		)
	}
}


/**
 * The control state information that
 * is used update/reflect the state of the controls
 */
export type AVFCSchedulerControlsProps = {
	isPlaying: boolean
	frameIdx: number
	parent: AVTestVisualiser
}

//
// Slider Props for the visualiser, could generalise this
// 
export type AVFCSchedulerFrameSliderProps = {
	min: number
	max: number
	crfrm: number
	tickmarks: Array<{idx: number}>
	parent: AVFCVisualiser
}

//
// Renderer for the slider
// 
export function AVFCSchedulerFrameSlider(props: AVFCSchedulerFrameSliderProps) {

	const min = props.min;
	const max = props.max;
	const crfrm = props.crfrm;
	const tickmarks = props.tickmarks;
	const vis = props.parent;
	const renOpt = tickmarks.map((o) => {
		if(o.idx === 0) {	
			return <option value={o.idx} label={`${o.idx+1}`}
			  key={`tm_gim_option_${o.idx}`} />
		} else if(o.idx === max) {
			return <option value={o.idx-1} label={`${o.idx}`}
			   key={`tm_gim_option_${o.idx}`} />
		} else {
			return <option value={o.idx} label={`${o.idx}`}
			  key={`tm_gim_option_${o.idx}`} />
		}
	});
	
	return (<>
		<div className={style.frameContainer}>
		<input className={style.frameSlider} type="range" name="frame" min={min} max={max}
			value={crfrm} onChange={(e) => {
				OnRangeChange(vis, Number(e.target.value))
			}} list="tickmarks" />
		</div>
		<div className={style.frameContainer}>
			<datalist
			id={"tickmarks"}
			className={style.frameTickmarks}>
		{renOpt}
		</datalist>
		</div>
		</>
		
	)
}

/**
 * The scheduler controls that 
 */
export class AVFCSchedulerControls
  extends React.Component<AVFCSchedulerControlsProps, {}> {

	playRow: Array<AVFCSchedulerButtonProps> = [
		{ title: ["Prev", null], visParent: this.props.parent, onClickOp: OnVisualiserFramePrev, style: "ctrlbtn" },
		{ title: ["Play ⏵", "Pause ⏸"], visParent: this.props.parent, onClickOp: OnVisualiserPlay, style: "ctrlplay" },
		{ title: ["Next", null], visParent: this.props.parent, onClickOp: OnVisualiserFrameNext, style: "ctrlbtn" },
		{ title: ["Reset", null], visParent: this.props.parent, onClickOp: OnVisualiserReset, style: "ctrlbtn" },
	];

	saveRow: Array<AVFCSchedulerButtonProps> = [
	/*{ title: ["Save", null], visParent: this.props.parent, onClickOp: OnVisualiserSaveFrame, style: "ctrlbtn_gim_save" },
		{ title: ["Save Animated", null], visParent: this.props.parent, onClickOp: OnVisualiserSaveAnimation, style: "ctrlbtn_gim_save" },
		{ title: ["Export", null], visParent: this.props.parent, onClickOp: OnVisualiserExportJSON, style: "ctrlbtn_gim_save" },*/
	];


	render() {
		const renPlayBtns = this.playRow
			.map((b, i) => <AVFCSchedulerControlButton key={`sch_gim_play_${i}`} {...b} />)	
		const renSaveBtns = this.saveRow
			.map((b, i) => <AVFCSchedulerControlButton key={`sch_gim_save_${i}`} {...b} />)	
		

		return (
			<div className={style.vizControls}>
				<div className={style.frameLabelContainer}>
					<label className={style.frameLabel}>Cycle Snapshot</label>
				</div>
				<div className={style.vizControlRow}>
				{renPlayBtns}
				</div>
				<div className={style.vizControlRow}>
				{renSaveBtns}
				</div>
			</div>
		)
	}
}

//
// This is a test class just to show that the visualiser is able to work and fix things
// as they come rather than supplying a full implementation
// 
export class AVTestVisualiser extends React.Component<AVFCSchedulerVisProps,
	AVFCSchedulerVisData> implements ArchWorkspace {

	state: AVFCSchedulerVisData = {
		crfrm: 0,
		initd: true,
		isPlaying: false,
		interval: null,
		data: this.getData(),
		offsets: [0, 0],
		midDown: false,
	}

	tick() {
		const nframes = this.getMax();
		const fmidx = this.state.crfrm;
		this.state.crfrm = (fmidx+1) < nframes ? fmidx + 1 : fmidx;
		this.setState({...this.state})
	}

	changeFrame(frame: number) {
		
		const nstate = {...this.state};
		nstate.crfrm = frame;
		this.setState(nstate);
	}

	togglePlay() {
		this.state.isPlaying = !this.state.isPlaying;
		if(this.state.isPlaying) {
			let self = this;
			this.state.interval = setInterval(() => self.tick(), 1000);
			this.setState({...this.state});
		} else {
			if(this.state.interval) {
				clearInterval(this.state.interval);
				this.setState({...this.state})
			}
		}
	}

	getData() {
		//TODO: Fix this ASAP
		return this.props.workspaceData.architecture.getExtensions()
			.getExtension('vizData') as any;
	}
	
	getMin() {
		return 0;
	}

	getMax() {
		console.log(this.getData().events.length)
		return this.getData().events.length;
	}

	nextFrame() {
		const nframes = this.getMax();
		const fmidx = this.state.crfrm;

		this.state.crfrm = fmidx < (nframes-1) ? fmidx + 1 : fmidx;
		if(this.state.interval) {
			clearInterval(this.state.interval);
		}
		this.setState({...this.state})
	}

	prevFrame() {
		
		const fmidx = this.state.crfrm;
		this.state.crfrm = fmidx > 0 ? fmidx - 1 : fmidx;
		if(this.state.interval) {
			clearInterval(this.state.interval);
		}
		this.setState({...this.state})
	}

	render() {
		const self = this;
		const frameNo = this.state.crfrm;
		const isPlaying = this.state.isPlaying;
		const importedData = this.getData();
		const frame = <VisualiserFrame frameNo={frameNo} visData={importedData} />

		return (
			<>
				{frame}
				<AVFCSchedulerControls frameIdx={frameNo} isPlaying={isPlaying} parent={self} />
			</>
		)
	}


}


export class AVFCVisualiser extends React.Component<AVFCSchedulerVisProps,
	AVFCSchedulerVisData> implements ArchWorkspace {
		
	
	getData() {
		//TODO: Fix this ASAP
		return this.props.workspaceData.architecture.getExtensions()
			.getExtension('vizData') as any;
	}

	state: AVFCSchedulerVisData = {
		crfrm: 0,
		initd: true,
		isPlaying: false,
		interval: null,
		data: this.getData(),
		offsets: [0, 0],
		midDown: false,
	}

	tick() {
		const nframes = this.getMax();
		const fmidx = this.state.crfrm;
		this.state.crfrm = (fmidx+1) < nframes ? fmidx + 1 : fmidx;
		this.setState({...this.state})
	}

	togglePlay() {
		this.state.isPlaying = !this.state.isPlaying;
		if(this.state.isPlaying) {
			let self = this;
			this.state.interval = setInterval(() => self.tick(), 500);
			this.setState({...this.state});
		} else {
			if(this.state.interval) {
				clearInterval(this.state.interval);
				this.setState({...this.state})
			}
		}
	}

	getMin() {
		return 0;
	}

	getMax() {
		return this.state.data.layers.length;
	}

	nextFrame() {
		const nframes = this.getMax();
		const fmidx = this.state.crfrm;

		this.state.crfrm = fmidx < (nframes-1) ? fmidx + 1 : fmidx;
		if(this.state.interval) {
			clearInterval(this.state.interval);
		}
		this.setState({...this.state})
	}

	prevFrame() {
		
		const fmidx = this.state.crfrm;
		this.state.crfrm = fmidx > 0 ? fmidx - 1 : fmidx;
		if(this.state.interval) {
			clearInterval(this.state.interval);
		}
		this.setState({...this.state})
	}

	reset() {	
		this.state.crfrm = 0;
		if(this.state.interval) {
			clearInterval(this.state.interval);
		}
		this.setState({...this.state})
	}

	saveFrame() {
		this.saveSVG(false)
	}

	saveAnimation() {
		this.saveSVG(true);
	}

	/// We construct a static markup and componentise everything
	saveSVG(_isAnimated: boolean) {}

	saveJSON() {
	  const b = new Blob([JSON.stringify(this.state.data)],
	  	{ type:"application/json" });

		DownloadFile("unit.json", b);		
	}

	componentDidMount() {
		if(this.state.isPlaying) {
			let self = this;
			this.state.interval = setInterval(() => self.tick(), 100);
		}
	}

	componentWillUnmount() {
		if(this.state.interval) {
			clearInterval(this.state.interval);
		}
	}


	
	changeFrame(v: number) {
		const nstate = {...this.state};
		nstate.crfrm = v;
		this.setState(nstate);
	}


	render() {
		const data = this.state.data;
		const vwidth = (data.width * 100) + 200;
		const vheight = (data.height * 100) + 200;
		const self = this;


		const mouseDownHandler = (e: MouseEvent<SVGElement>) => {

			if(e.button === 1) {
				
				const x = e.movementX;
				const y = e.movementY;

				const nState = {...this.state};
				const [oX, oY] = nState.offsets;

				const nPos: [number, number] = [
					oX + x,
					oY + y
				];

				nState.offsets = nPos;
				nState.midDown = true;

				this.setState(nState);
			}
			
		};

		const mouseMove = (e: MouseEvent<SVGElement>) => {
			if(self.state.midDown) {
				
			const x = e.movementX;
			const y = e.movementY;

			let newGS = {...this.state};
			let [oX, oY] = newGS.offsets;
			newGS.offsets = [
				oX + x,
				oY + y
			];
			this.setState(newGS);
			}	
		}

		const mouseUpHandler = (e: MouseEvent<SVGElement>) => {
			if(e.button === 1) {
				
				const x = e.movementX;
				const y = e.movementY;

				const nState = {...this.state};
				const [oX, oY] = nState.offsets;

				const nPos: [number, number] = [
					oX + x,
					oY + y
				];

				nState.offsets = nPos;
				nState.midDown = false;

				this.setState(nState);
			}
		};
		
		const [ox, oy] = self.state.offsets;
		//const svginst = this.state.svgd;
		//ratio: 1:100
		//TODO: Make it moveable and make it playable
		return (
			<>
				<svg viewBox={`${-100-ox} ${-100-oy} ${vwidth} ${vheight}`} width={'100%'} height={720} style={{backgroundColor: 'grey'}}
					onMouseDown={mouseDownHandler} onMouseUp={mouseUpHandler}
					onMouseMove={mouseMove}>
				</svg>
			</>
		);
		
	}

	
}

