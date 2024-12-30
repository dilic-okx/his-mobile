import React from 'react'
import { View, Dimensions } from 'react-native'
import { VictoryLabel, VictoryChart, VictoryAxis, VictoryBar, VictoryLine, VictoryScatter, VictoryStack } from 'victory-native'
import palette from '../theme/palette'

const axisFontSize = 11

export default class Chart6 extends React.Component {
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
		let { data } = this.props
		return (
			<View pointerEvents="none">
				<VictoryChart
					height={data.length > 6 ? 280 : 200}
				>
					<VictoryStack
						style={{
							data: { stroke: '#fff', strokeWidth: 0.1}
						}}
					>
						{data.map((ind, index) => {
							return <VictoryBar
								data = {ind.map((j, i) => {
									return {
										x: j.x,
										y: j.y,
										value: j._y,
										label: j.label
									}
								})}
								key = {index}
								barWidth={30}
								labels={(d) => d.label}
								style={{
									labels: {
										fill: 'white',
										fontSize: 12
									},
									data: {
										fill: (d) => d.value > 0 ? palette.chartActiveColor : palette.chartInactiveColor
									}
								}}
								labelComponent={<VictoryLabel dy={25}/>}
							/>
						})}
					</VictoryStack>
					<VictoryAxis
						style={{
							ticks: { stroke: 'transparent' },
							tickLabels: { fill: '#fff', fontSize: axisFontSize },
							axis: { stroke: '#fff', width: 600 },
							grid: { stroke: 'transparent' }
						}}/>
				</VictoryChart>
			</View>
		)
	}
}
