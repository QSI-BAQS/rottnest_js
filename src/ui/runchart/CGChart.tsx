import React, { ReactElement, useEffect, useRef, useState } from "react";
import style from '../styles/CGChart.module.css';
import * as d3 from "d3";
import { ScaleLinear, ScaleLogarithmic } from 'd3-scale';
import { CallGraphStatsData, CUAggrKey, CUDataKeyRef, CUScaleKeyRef, 
	DataAggregate, DataAggrIdentifier, DataAggrMap } from "./ChartData";
import { BufferMapKey } from "../workspace/buffermap/BufferMapCommon";
import { RunChartAll, RunChartAttributes, RunChartCacheOptions, RunChartConstants, RunChartScaleOptions, RunChartSVGGroup } from "./RunChartConstants";
import { ArchStashMap } from "rottnest-plugin/schema/ArchWorkspace";
import { noop } from "../../util/Noop";
import { Util } from "../../util";

type ScaleKey = "Linear" | "Log";



const onNodeClick = () => {
	//TODO: Clean this up
}

const LineColorList: Array<string> = [
	'#DDDDDD',
	'#2E2585',
	'#337538',
	'#5DA899',
	'#94CBEC',
	'#DCCD7D',
	'#C26A77',
	'#9F4A96',
	'#7E2954',
	'#FFAD00',
	'#D22730',
	'#DB3EB1',
	'#44D62C',
	'#00B2A9',
	'#E59E6D',
	
];

const CircleColorList: Array<string> = [
	'#DDDDDD',
	'#2E2585',
	'#337538',
	'#5DA899',
	'#94CBEC',
	'#DCCD7D',
	'#C26A77',
	'#9F4A96',
	'#7E2954',
];

type CacheSelectorProps = {
	currentKeyRef: CUScaleKeyRef 
	keyRefUpdate: (key: string) => void
	optPairs: Array<{
		value: string 
		display: string
	}>
}

const CacheSelector = (props: CacheSelectorProps): ReactElement => {

	const selected = props.currentKeyRef.keyvalue;
	
	const keyRefUpdate = props.keyRefUpdate;

	const onOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		keyRefUpdate(e.currentTarget.value);
	};
	
	const options = props.optPairs.map((e, i) => {
		return (
			<option key={`cacsel_${i}`} 
				value={e.value}>{e.display}</option>
		);
	});

	return (<div className={style.chartSel}>
		<select value={selected} onChange={onOptionChange}
			className={style.optionStyle}>
			{options}
		</select>
	       </div>)
}

/**
  * ScaleProperties for the runchart
  *
  */
type ScaleProps = {
	currentKeyRef: CUScaleKeyRef 
	keyRefUpdate: (key: string) => void
	optPairs: Array<{
		value: string 
		display: string
	}>
}

const ScaleSelector = (props: ScaleProps): ReactElement => {

	const selected = props.currentKeyRef.keyvalue;
	
	const keyRefUpdate = props.keyRefUpdate;

	const onOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		keyRefUpdate(e.currentTarget.value);
	};
	
	const options = props.optPairs.map((e, i) => {
		return (
			<option key={`copt_${i}`} 
				value={e.value}>{e.display}</option>
		);
	});

	return (
	<div className={style.chartSel}>
		<select value={selected} onChange={onOptionChange}
			className={style.optionStyle}>
			{options}
		</select>
  </div>)
}

type ChartSelectorProps = {

	currentKeyRef: CUDataKeyRef 
	keyRefUpdate: (key: string) => void
	optPairs: Array<{
		value: string 
		display: string
	}>
}

/**
  * ChartSelector
  * This selects the chart select type
  */
const ChartSelector = (props: ChartSelectorProps): ReactElement => {

	const selected = props.currentKeyRef.keyvalue;
	const keyRefUpdate = props.keyRefUpdate;

	const onOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		keyRefUpdate(e.currentTarget.value);
	};
	
	const options = props.optPairs.map((e, i) => {
		return (
			<option key={`copt_${i}`} 
				value={e.value}>{e.display}</option>
		);
	});

	return (<div className={style.chartSel}>
		<select value={selected} onChange={onOptionChange}
			className={style.optionStyle}>
			{options}
		</select>
		</div>)

}

/**
  * GenerateLegend
  * This presents the different kinds of types that can be displayed
  * for the runchart
  */
const GenerateLegend = (
	names: Array<string>,
	colors: Array<string>,
	enableSet: Array<boolean>,
	setEnableSet: (d: boolean[]) => void
): ReactElement => {

	const linesGend = names.map((name, idx) => {
		const col = colors[idx];
		const isSet = enableSet[idx];
		let legStyles = `${style.legendEntry}`;
		if(!isSet) {
			legStyles = `${style.legendEntry} ${style.fadedEntry}`;
		}

		return (
			<div key={`lin_legend_${idx}`} className={legStyles}
				onClick={() => {
					const cur = enableSet[idx];
					const nSet = [...enableSet];
					nSet[idx] = !cur;
					setEnableSet(nSet);
					}
				}>
			<span>{name}:</span>
			<div className={style.legendBox} 
			style={{backgroundColor: col}}></div>
			</div>
		)

	});

	return (
		<div className={style.legendContainer}>
		{linesGend}
		</div>
	)
}

/**
  * GenerateLine
  * Line to be drawn on the runchart
  */
const GenerateLine = (
	data: DataAggregate,
	xScale: ScaleLinear<number, number>,
	yScale: ScaleLinear<number, number> | ScaleLogarithmic<number, number>, 
	selKey: CUAggrKey,
	colorStr: string,
	key: string, _idx: number):  ReactElement => {	

	const lbuilder = d3
			.line<DataAggrIdentifier>()
			.x((d) => xScale(d.mxid ?? 0))
			.y((_d, ids) => yScale(data.aggrMap[selKey][ids] ?? 0));

	const lres = lbuilder(data.idxs);

	return (<path
		    key={key}
		    className={style.cgline}
		    d={lres ? lres : ''}
		    opacity={1}
		    stroke={colorStr}
		    fill="none"
		    strokeWidth={3}
		/>)
}

/**
  * GenerateNodes
  * Places the points within space
  */
const GenerateNodes = (
	lIdent: number,
	data: DataAggregate,
	xScale: d3.ScaleLinear<number, number>,
	yScale: d3.ScaleLinear<number, number>,
	scaleKey: string, 
	selKey: CUAggrKey,
	colorStr: string,
	bmap: ArchStashMap): Array<ReactElement> => {

	const cnode = bmap.get(BufferMapKey.RunChart.CurrentChartIndex);

	let selectedIdx = -1;
	let selectedRefId = -1;
	let selectedLine = -1;
	
	if(cnode) {
		const jcnode = JSON.parse(cnode);
		if(jcnode) {
			selectedIdx = jcnode.idx;
			selectedRefId = jcnode.refIdx;
			selectedLine = jcnode.lineIdx;
		}
	}
	
	let count = 0;
	return data.idxs.map((sample, i) => {
		
		const mxid = sample.mxid;

		const isCuidObj = (
			(sample.cuid !== null
			&& sample.cuid !== undefined));

		const selectedObj = (
			(selectedIdx === i) &&
			(selectedRefId === sample.mxid) &&
			(selectedLine === lIdent));

		const selStyle = !isCuidObj ?
				style.cuObjectNotCuidSelected :
				selectedObj ? 
					style.cuObjectSelected :
					RunChartConstants.StyleDefaults.None;

		let measuredValue = data.aggrMap[selKey][i];
		const onNodeHoverTrigger = (_isCuid: boolean) => {
			bmap.write(BufferMapKey.RunChart.CurrentNode,
			{
				idx: sample.mxid //NOTE: This has been disabled
			});
			bmap.write(BufferMapKey.RunChart.CurrentChartIndex, {
					idx: i,
					refIdx: sample.mxid, //NOTE: This has been disabled
					selKey: selKey,
					lineIdx: lIdent,
				}
			);
			bmap.commit();
		}


		const actionMouseOver = sample.cuid !== null ||
			sample.cuid !== undefined ? onNodeHoverTrigger :
			(_gg: any) => {};


		if(i >= data.aggrMap[selKey].length) {
			if(scaleKey === 'Log') {
				measuredValue = 1;
			} else {
				measuredValue = 0;
			}
		}
		
		//TODO: Check to see if this is correct 
		if((isNaN(measuredValue) || measuredValue == 0) && scaleKey === 'Log') {
			measuredValue = 1;
		}

		if(selKey === 'BELL_IDLE_VOLUME') {
			if(measuredValue > 150) {
				count++;
			}
		}

		const yValue = yScale(measuredValue);
		return (<circle
			key={`circ_${i}`}
			cx={xScale(mxid)}
			cy={`${yValue}`}
			r={4}
			stroke={colorStr}
		        fill={colorStr}
		        strokeWidth={1}
			className={`${style.cuObject} ${selStyle}`}
			onMouseOver={() => actionMouseOver(isCuidObj)}
			onClick={onNodeClick}
			/>
		)
	});
}


/**
  * ChartOptionsPairs
  * Used for 
  */
const ChartOptionPairs = [
	{ value: 'ALL', display: 'All'},
	{ value: 'REGISTER_VOLUME', display: 'Register Volume'},
	{ value: 'FACTORY_VOLUME', display: 'Factory Volume'},
	{ value: 'ROUTING_VOLUME', display: 'Routing Volume'},
	{ value: 'T_IDLE_VOLUME', display: 'T-Idle Volume'},
	{ value: 'BELL_IDLE_VOLUME', display: 'Bell-Idle Volume'},
	{ value: 'BELL_ROUTING_VOLUME', display: 'Bell-Routing Volume'}
];

/**
  * HDatKind
  * Horizontal line to be drawn
  */
export type HDatKind = {
	hlen: number
	hArr: Array<number> 
	hIdx: number
}

/**
  * ToggleCacheData
  */
function ToggleCacheData(data: DataAggregate, cacheOn: boolean): DataAggregate {
	if(cacheOn) {
		return data;
	}
	const aggrData = [[],[],[],[],[],[]]
	const daggr : DataAggregate = {
		globalMinMax: data.globalMinMax,
		idxs: [],
		aggrMap: {
			REGISTER_VOLUME: aggrData[0],
			FACTORY_VOLUME: aggrData[1],
			ROUTING_VOLUME: aggrData[2],
			T_IDLE_VOLUME: aggrData[3],
			BELL_IDLE_VOLUME: aggrData[4],
			BELL_ROUTING_VOLUME: aggrData[5],
		},
		dataRefs: aggrData
	}
	for(let i = 0; i < data.idxs.length; i++) {
		const idref = data.idxs[i];
		if(idref.cuid !== null) {
			for(let j = 0; j < daggr.dataRefs.length; j++) {
				const dref = daggr.dataRefs[j];
				dref.push(data.dataRefs[j][i]);
			}
			daggr.idxs.push(idref);
		}
	}
	return daggr;
}

export const CallGraphStatsSpace = (props: CallGraphStatsData) => {

	const [cacheref, setCacheRef] = useState<CUScaleKeyRef>({keyvalue: 'On'});
	const cacheIncluded = cacheref.keyvalue === 'On';
	const data = ToggleCacheData(props.graphData, cacheIncluded);
	const gMaxY = data.globalMinMax.maxY;
	const keyset = Object.keys(data.aggrMap);
	const [enableSet, setEnableSet] = useState<Array<boolean>>(
		ChartOptionPairs.map((_) => true) 
	);
	const nCols = CircleColorList;
	const nLins = LineColorList;	
	const bmap = props.workspaceData.stash;
	const [keyref, setKeyRef] = useState<CUDataKeyRef>({ keyvalue: String(props.selKey) });
	const [scaleref, setScaleRef] = useState<CUScaleKeyRef>({keyvalue: 'Linear'});
	const chartRef = useRef({}) as React.MutableRefObject<SVGSVGElement>;
	const margins = props.dimensions.margins;

	const left = margins.left;
	const mWidth = margins.left + margins.right;
	const mHeight = margins.top + margins.bottom;
	const top = margins.top;
	
	const width = props.dimensions.width;
	const height = props.dimensions.height;
	const boundsWidth = width - mWidth;
	const boundsHeight = height - mHeight;
	const scaleFnStr: ScaleKey = scaleref.keyvalue as ScaleKey;
	
	const [wDat, _wLen] = [data.idxs, data.idxs.length];
	const { hArr } = data.dataRefs.map((e,i) => {
			return { hlen: Math.max(...e), hArr: e, hIdx: i } as HDatKind; 
		}).reduce((p: HDatKind, c: HDatKind, _, _a) =>  {
			if(p.hlen > c.hlen) {
				return { hlen: p.hlen, hArr: p.hArr, hIdx: p.hIdx } as HDatKind;
			} else {
				return { hlen: c.hlen, hArr: c.hArr, hIdx: c.hIdx} as HDatKind;
			}
		});

	let hDat = hArr;
	if(keyref.keyvalue !== 'ALL') {
		const akey = keyref.keyvalue as keyof DataAggrMap;
		if(akey) {
			hDat = data.aggrMap[akey];
		}
	}
	const [xMin, xMax] = d3.extent(wDat, (d: DataAggrIdentifier) => d.mxid);	
	const xScale = d3.scaleLinear()
		.domain([xMin || 0, xMax || 0])
		.range([0, boundsWidth]);

	let [yMin, yMax] = d3.extent(hDat, (d: number) => d);
	if(keyref.keyvalue === 'ALL') {
		if(scaleFnStr === 'Log') {
			yMin = 1; // NOTE: Below is weird, so fix up if needed
			yMax = gMaxY;
		} else {

			yMin = 0;
		}
	} else {
		if(scaleFnStr === 'Linear') {
			yMin = 0;
		} else {
			yMin = 1;
		}
	}

	const scaleFn = scaleFnStr === RunChartConstants.Scale.Linear ?
		d3.scaleLinear : d3.scaleLog;
	const yScale = scaleFn()
		.domain([yMin || 0, yMax || 0])
		.range([boundsHeight, 0])

	useEffect(() => {

		const chartRes = d3.select(chartRef.current);	
		chartRes.selectAll("*")
			.remove();
		const xAxisGen = d3.axisBottom(xScale);

		chartRes.attr(RunChartAttributes.Width, width)
			.attr(RunChartAttributes.Height, height)
			.append(RunChartSVGGroup)
				.attr(RunChartAttributes.Transform,
					Util.Style.CSSTranslate(0,boundsHeight))
			.call(xAxisGen);
				

		const yAxisGen = d3.axisLeft(yScale);
		chartRes
			.append(RunChartSVGGroup)
			.call(yAxisGen);

				

	}, [xScale, yScale, height]);
	
	const keyrefUpdate = (key: string) => {
		setKeyRef({ keyvalue: key });
		setEnableSet(ChartOptionPairs.map((_) => true));
	}
	const scalerefUpdate = (key: string) => {
		setScaleRef({ keyvalue: key });
	}

	const cacheRefUpdate = (key: string) => {
		setCacheRef({ keyvalue: key });
		setEnableSet(ChartOptionPairs.map((_) => true));
	}
	const circs = data.dataRefs.map((d, idx) => { 
		//if(keyref.keyvalue === 'All' || akey === data.aggrMap[) {
		//	return GenerateNodes(idx, data, xScale, yScale, selKey, lineCol[idx], bmap)
		if(enableSet[idx]) {

			const refKey = keyref.keyvalue === RunChartAll ?
				keyset[idx] : keyref.keyvalue;
			const akey = refKey as keyof DataAggrMap;
			if(keyref.keyvalue === RunChartAll || d === data.aggrMap[akey]) { 	
			   return GenerateNodes(idx, data, xScale, yScale, scaleFnStr, akey, nCols[idx], bmap)
			} else {
				return <></>
			}
		}
	});
	const lines =
	data.dataRefs.map((d, idx) => {
		if(enableSet[idx]) {
			const key = `lin_${idx}`;
			const refKey = keyref.keyvalue === RunChartAll ? keyset[idx] : keyref.keyvalue;
			const akey = refKey as keyof DataAggrMap;
			if(keyref.keyvalue === RunChartAll || d === data.aggrMap[akey]) { 	
				return GenerateLine(data, xScale, yScale, akey, nLins[idx], key, idx);
			} else {
				return <></>
			}
		}
	});
	

	let legndNames = [];
	let colorsIncluded = LineColorList;
	let setEnableProxy: (d: boolean[]) => void = setEnableSet; 
		
	if(keyref.keyvalue === RunChartAll) {
		legndNames = ChartOptionPairs.slice(1).map((pair) => {
			return pair.display;
		});
	} else {
		colorsIncluded = [];
		legndNames = ChartOptionPairs.slice(1).filter((pair, idx) => {

			const res = keyref.keyvalue === pair.value;
			if(res) { colorsIncluded.push(LineColorList[idx]) };
			return res;
		}).map((p) => p.display);

		setEnableProxy = noop;

	}
	const legendBro = GenerateLegend(legndNames,
		colorsIncluded,
		enableSet,
		setEnableProxy);

	const cacheOpts = [
		RunChartCacheOptions.CacheIncluded, 
		RunChartCacheOptions.CacheDisabled
	];
	const scaleOpts = [
		RunChartScaleOptions.ScaleLinear,
		RunChartScaleOptions.ScaleLog
	];
	return (
		<div className={style.graphContainer}>
			<div className={style.cgvisTab}>
			<ChartSelector optPairs={ChartOptionPairs} 
				currentKeyRef={keyref}
				keyRefUpdate={keyrefUpdate}/>
			<CacheSelector optPairs={cacheOpts} 
				currentKeyRef={cacheref}
				keyRefUpdate={cacheRefUpdate}/>
			<ScaleSelector optPairs={scaleOpts}
				currentKeyRef={scaleref}
				keyRefUpdate={scalerefUpdate} />
		
			</div>

			<div>
			<svg width={width} height={height}>
			<g
				width={boundsWidth}
				height={boundsHeight}
				transform={Util.Style.CSSTranslate(left, top)}
				>
				{lines}	
			</g>
			<g
				width={boundsWidth}
				height={boundsHeight}
				ref={chartRef}
				transform={Util.Style.CSSTranslate(left, top)}
				>
			</g>
			<g
				width={boundsWidth}
				height={boundsHeight}	
				transform={Util.Style.CSSTranslate(left, top)}
				>
				{circs}
			</g>
			</svg>
			{legendBro}

			</div>
			<div className={style.nodesComponent}>
			</div>

		</div>
	)
}
