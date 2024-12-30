import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import { VictoryTheme, VictoryAxis, VictoryBar, VictoryLine, VictoryScatter, VictoryLabel } from 'victory-native'
import palette from '../theme/palette'
import Svg from 'react-native-svg'
import moment from '../lib/moment'
import { isDefined } from '../lib/utils'
const labelFontSize = 11
const axisFontSize = 11

export default class Chart1 extends React.Component {
	constructor (props) {
		super(props)
		const { height, width } = Dimensions.get('window')
		this.state = {
			width,
			height
		}
	}

	componentDidMount(){
		Dimensions.addEventListener('change', () => {
			const { height, width } = Dimensions.get('window')
			this.setState({
				width,
				height
			})
		})

	}

	componentWillUnmount(){
		Dimensions.removeEventListener('change')
	}

	render() {
		let {  data, x, y, y1, y2, labels, labels1, labels2,
			theme, domainPadding, scale, scale1, scale2, height, barRatio,
			axisStyle, barStyle, lineStyle, scatterStyle, sets } = this.props

		let time = data.map((i,j) => {
			return moment(i._time)
		})

		let minTime = moment.min(time)
		let maxTime = moment.max(time)

		if (!y1){
			y1 = y
			labels1 = labels
		}
		const xKey = x || 'x'
		const y1Key = y1
		const y2Key = y2 || 'y2'

		scale1 = scale1 || scale || { x: 'linear', y: 'linear' }
		scale2 = scale2 || scale1
		theme = theme || VictoryTheme.material
		barRatio = barRatio || 0.8
		height = height || 200
		axisStyle = axisStyle || {
			ticks: { stroke: '#fff' },
			tickLabels: { fill: '#fff' },
			axis: { stroke: '#fff' },
			grid: { stroke: 'transparent' }
		}
		barStyle = barStyle || {
			data: { fill: palette.chartBarColor },
			labels: { fill: '#fff', fontSize: labelFontSize }
		}
		lineStyle = lineStyle || {
			data: { stroke: palette.chartLineColor }
		}
		scatterStyle = scatterStyle || {
			data: { fill: palette.chartScatterColor },
			labels: { fill: palette.chartLineColor, fontSize: labelFontSize }
		}

		const { width } = this.state
		let domainBar = []
		let domainLine = []
		let domainBarData = data.find(d => isDefined(d.domainBar) && (d.level || d.mwh))

		if (domainBarData) {
			if (domainBarData.domainBar) {
				domainBar = [domainBarData.domainBar.min, domainBarData.domainBar.max]
			}
		}

		let domainLineData = data.find(d => isDefined(d.domainLine) && (d.level || d.mwh))

		if (domainLineData) {
			if (domainLineData.domainLine) {
				domainLine = [domainLineData.domainLine.min, domainLineData.domainLine.max]
			}
		}

		return (
			<View pointerEvents="none">
				{ domainBarData ? domainBarData[xKey] ?
					<Svg width={ width } height={ height }>
						<VictoryAxis
							width={ width }
							height={ height }
							style={{
								ticks: { stroke: '#fff' },
								tickLabels: { fill: '#fff', fontSize: axisFontSize },
								axis: { stroke: '#fff' },
								grid: { stroke: 'transparent' }
							}}
							crossAxis
							standalone={ false }
							scale = {sets ? scale2 : scale1}
							tickFormat={(t) => {
								if (sets) {
									return moment(t).format('ddd.[\n] DD.MM.')
								} else {
									return moment(t).format('HH:mm')
								}
							}}
							domain={[minTime,maxTime]}
						/>
						<VictoryAxis
							width={ width }
							height={ height }
							style={{
								ticks: { stroke: 'transparent' },
								tickLabels: { fill: 'transparent' },
								axis: { stroke: 'transparent' },
								grid: { stroke: 'transparent' }
							}}
							//offsetX={ -50 }// <-- hide
							dependentAxis
							scale = {scale}

							standalone={ false }
							domain={domainBar}/>
						{ domainBarData[y2Key] ?
							<VictoryBar
								width={ width }
								height={ height }
								style={ barStyle }
								standalone={ false }
								domain={{ x: [1,6], y: domainBar}}
								scale={ scale2 }
								barRatio={ barRatio }
								domainPadding={ domainPadding || 0 }
								data={ data }
								labels={ data.map((y) => {
									if (y.mwh === null) {
										return 'No Data'
									} else {
										return y.mwh
									}
								})}
								labelComponent={<VictoryLabel dy={ 5 } y={145}/>}
								x={ xKey } y={ y2Key }/>
							: null }
						{domainBarData[y1Key] ?
							<>
						<VictoryAxis
							width={ width }
							height={ height }
							scale = {scale}

							style={{
								ticks: { stroke: 'transparent' },
								tickLabels: { fill: 'transparent' },
								axis: { stroke: 'transparent' },
								grid: { stroke: 'transparent' }
							}}
							dependentAxis
							standalone={ false }
							domain={domainLine}/>
						<VictoryLine
							width={ width }
							height={ height }
							style={ lineStyle }
							standalone={ false }
							domain={{x: [1,6], y: domainLine}}
							scale={ scale1 }
							data={ data }
							x={ xKey } y={ y1Key }/>
						<VictoryScatter
							width={ width }
							height={ height }
							style={ scatterStyle }
							domain={{ x: [1,6], y: domainLine}}
							scale={ scale1 }
							standalone={ false }
							data={ data }
							labels={ data.map((d) => {
								if (d.level === null) {
									return ''
								} else {
									return d.level
								}
							})}
							labelComponent={<VictoryLabel dy={ 1 }/>}
							x={ xKey } y={ y1Key }/>
							</> : null }
					</Svg>
					: domainBarData[xKey] ?
						<Text>Y axis key missing!</Text>
						:
						<Text>X axis key missing!</Text>
					:
					<Text>No Data!</Text>
				}
			</View>
		)
	}
}
