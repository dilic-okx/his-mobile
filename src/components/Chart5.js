/* eslint-disable no-unused-vars */
import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import { VictoryChart, VictoryAxis, VictoryBar, VictoryStack } from 'victory-native'
import palette from '../theme/palette'

const labelFontSize = 11
const axisFontSize = 11


export default class Chart5 extends React.Component {
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

	// componentWillUnmount(){
	// 	Dimensions.removeEventListener('change')
	// }

	render() {
		let { data, labelsData, height } = this.props

		let domainBar = []

		if (labelsData[0]) {
			domainBar = [labelsData[0].domain.min, labelsData[0].domain.max]
		}

		return (
			<View pointerEvents="none" >
				<VictoryChart
					domainPadding={{y: [10, 300]}}
					height={height}>
					<VictoryStack
						labels={Object.keys(labelsData).map((key) => {
							return labelsData[key].y + ' m³/s'
						})}
						style={{ labels: { fill: '#fff', fontSize: 10 }}}
						colorScale={[palette.chartSecondary1, palette.chartSecondary4, palette.chartBarColor, palette.chartLineColor, palette.chartActiveColor]}
					>
						{Object.keys(data).map((key, i) => {
							return <VictoryBar
								data = {Object.keys(data[key]).map((index) => {
									return {
										x: data[key][index].x,
										y: data[key][index].y
									}
								})}
								domain={{y: domainBar}}
								key = {i}
								barWidth={30}
							/>
						})}
					</VictoryStack>
					<VictoryAxis
						style={{
							ticks: { stroke: '#fff' },
							tickLabels: { fill: '#fff', fontSize: 12 },
							axis: { stroke: '#fff' },
							grid: { stroke: 'transparent' }
						}}
						// crossAxis
						// standalone={ false }
						// tickFormat={(t) => {
						// 	return moment(t).format('HH:mm')
						// }}
					/>
				</VictoryChart>
			</View>
		)
	}
}
