import React from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { VictoryTheme, VictoryChart, VictoryAxis, VictoryLine, VictoryScatter, LineSegment } from 'victory-native'
import palette from '../theme/palette'
import TendencyLine from './TendencyLine'
import { isIPhoneXrSize } from './../theme/variables/platform'
import { isDefined } from '../lib/utils'

export default class Chart2 extends React.Component {
	constructor (props) {
		super(props)
		const { height, width } = Dimensions.get('window')
		this.state = {
			width,
			height
		}
	}

	// componentDidMount(){
	// 	Dimensions.addEventListener('change', () => {
	// 		const { height, width } = Dimensions.get('window')
	// 		this.setState({
	// 			width,
	// 			height
	// 		})
	// 	})
	// }

	// componentWillUnmount(){
	// 	Dimensions.removeEventListener('change')
	// }

	render() {
		let { data, x, y, labels, theme, scale, height, chartLabel, screen,
			axisStyle, lineStyle, scatterStyle, gridStyle } = this.props

		const xKey = x || 'x'
		const yKey = y || 'y'

		scale = scale || { x: 'linear', y: 'linear' }
		theme = theme || VictoryTheme.material
		height = height || 200
		axisStyle = axisStyle || {
			ticks: { stroke: 'transparent' },
			tickLabels: { fill: '#fff' },
			axis: { stroke: 'transparent' },
			grid: { stroke: 'transparent'}
		}
		lineStyle = lineStyle || {
			data: { stroke: palette.chartLineColor }
		}
		scatterStyle = scatterStyle || {
			data: { fill: palette.chartScatterColor },
			labels: { fill: palette.chartLineColor, fontSize: 12 }
		}

		gridStyle = gridStyle || {
			strokeWidth: StyleSheet.hairlineWidth,
			stroke: (t) => {
				return t < data.length ? '#fff' : 'transparent'
			}
		}
		let domain = []
		let domainData = []
		if (data.length > 0) {
			domainData = data.find(d => isDefined(d.domain))
			domain = [domainData.domain.min, domainData.domain.max]
		}

		const hasData = domainData && Object.keys(domainData).length > 0
		const offsetTopVals = height - height / 5
		const offsetTopTendency = height - height /25
		const chartPadding = isIPhoneXrSize() ? 40 : 50
		const offsetX = hasData ? (this.state.width - (this.state.width < this.state.height ? chartPadding : 0)) /data.length /2 : null
		return (
			<View pointerEvents="none" >
				{ hasData ? domainData[xKey] ?
					<VictoryChart
						theme={ theme }
						axisComponent={ null }
						width={ this.state.width }
						domainPadding={{x: 0 , y: [2, 70]}}
						height={ height }
						viewBox="0 0 100% auto">
						<VictoryAxis
							offsetY={ offsetTopVals }
							style={ axisStyle }
							gridComponent={<LineSegment type="grid" style={{ ...gridStyle, transform: { translateX: offsetX }}}/>}/>
						<VictoryLine style={ lineStyle }
							domain={{ y: domain }}
							scale={ scale }
							data={ data }
							x={ xKey } y={ yKey }/>
						<VictoryScatter style={ scatterStyle }
							domain={{ y: domain }}
							scale={ scale }
							data={ data }
							label={ data.map((y) => {
								if (y.level === null) {
									return 'No Data'
								} else {
									return y.label
								}
							}) }
							x={ xKey } y={ yKey }
						/>
						{ screen !== 'Flows' ?
							<VictoryScatter
								label={ data.map((y) => {
									if (y.level === null) {
										return 'No Data'
									} else {
										return y.label
									}
								}) }
								domain={{ y: domain }}
								scale={ scale }
								data={ data.map((item, i) => ({ x: i * 2 * offsetX, y: offsetTopTendency, previous: i > 0 ? data[i-1][yKey] : null, current: item[yKey]}))}
								dataComponent={<TendencyLine chartLabel={chartLabel} height={ height }/>}
							/> : null }
					</VictoryChart>
					: domainData[xKey] ?
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
