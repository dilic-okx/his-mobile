import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import { Line } from 'react-native-svg'
import { VictoryLabel, VictoryChart, VictoryAxis, LineSegment, Point, VictoryBoxPlot } from 'victory-native'
import palette from '../theme/palette'
import { isIPhoneXrSize } from './../theme/variables/platform'

const DotComponent = (props) => {
	let x, y, line, size
	if (props.majorWhisker){
		x = props.majorWhisker.x1 + 15
		y = props.majorWhisker.y2
		size = 3
	} else {
		// median
		x = props.x1 + 25
		y = props.y1
		size = 5
		const { x1, x2, scale } = props
		const lineX = Math.round((x1 + x2) / 2)
		line = { x: lineX, y1: scale.y(props.datum._min), y2: scale.y(props.datum._max) + 1 }
	}
	return (
		<>
		{ line ?
			<Line x1={ line.x + 15} y1={ line.y1 } x2={ line.x + 15} y2={ line.y2 + 3 } stroke="#fff" strokeWidth={ 1 }/>
			: null }
			<Point { ...props } size={ size } x={ x } y={ y }/>
		</>
	)
}
const labelFontSize = 11

export default class Chart7 extends React.Component {
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

	render() {
		let { height, data, axisStyle, gridStyle } = this.props
		height = height || 220
		axisStyle = axisStyle || {
			ticks: { stroke: 'transparent' },
			tickLabels: { fill: '#fff' },
			axis: { stroke: 'transparent' },
			grid: { stroke: 'transparent'}
		}
		gridStyle = gridStyle || {
			strokeWidth: StyleSheet.hairlineWidth,
			stroke: '#fff'
		}
		const domain = [data[0].domain.min, data[0].domain.max]

		const chartPadding = isIPhoneXrSize() ? 40 : 50
		const offsetTopVals = height - height / 6
		const offsetX = data.length > 0 ? (this.state.width - (this.state.width < this.state.height ? chartPadding : 0)) / data.length / 2 : null

		return (
			<View pointerEvents="none">
				<VictoryChart
					width={ this.state.width }
					height={ height }
					axisComponent={ null }
					domainPadding={{y: [0, 30]}}
					domain = {{y: domain}}
					viewBox="0 0 100% auto">
					<VictoryAxis
						style={ axisStyle }
						offsetY={ offsetTopVals }
						gridComponent={<LineSegment type="grid" style={{ ...gridStyle, transform: { translateX: offsetX }}}/>}/>
					<VictoryBoxPlot
						data = {data}
						minLabels = {data.map((item, index) => {
							return item.min
						})}
						medianLabels = {data.map((item, index) => {
							return item.median
						})}
						maxLabels = {data.map((item, index) => {
							return item.max
						})}
						minLabelComponent={ <VictoryLabel dx={ -20 }/> }
						medianLabelComponent={ <VictoryLabel dx={ -30 }/> }
						maxLabelComponent={ <VictoryLabel dx={ -20 }/> }
						medianComponent={ <DotComponent/> }
						minComponent={ <DotComponent/> }
						maxComponent={ <DotComponent/> }
						// domain = {{y: domain}}

						boxWidth={ 20 }
						whiskerWidth={ 3 }
						style={{
							q1: {
								fill: 'transparent'
							},
							q3: {
								fill: 'transparent'
							},
							min: {
								stroke: '#fff',
								fill: '#fff',
								strokeWidth: 3
							},
							minLabels: {
								fill: '#fff',
								fontSize: labelFontSize
							},
							median: {
								stroke: palette.trendRise,
								fill: palette.trendRise,
								strokeWidth: 3
							},
							medianLabels: {
								fill: palette.trendRise,
								fontSize: labelFontSize
							},
							max: {
								stroke: palette.boxChart1,
								fill: palette.boxChart1,
								strokeWidth: 3
							},
							maxLabels: {
								fill: palette.boxChart1,
								fontSize: labelFontSize
							}
						}}/>
				</VictoryChart>
			</View>
		)
	}
}
