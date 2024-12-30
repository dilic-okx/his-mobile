import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import { VictoryPie } from 'victory-native'
import palette from '../theme/palette'

export default class PieChart extends React.Component {
	constructor (props) {
		super(props)
		const { height, width } = Dimensions.get('window')
		this.state = {
			width,
			height
		}
	}

	render() {
		let { data } = this.props
		return (
			<View pointerEvents="none">
				<VictoryPie
					data={Object.keys(data).map((keys, i) => {
						return {x: data[keys].x, y: data[keys].y}
					})}
					colorScale={[palette.chartSecondary1, palette.chartActiveColor,  palette.chartBarColor, palette.chartSecondary4, palette.chartLineColor ]}
					height={200}
					style={{ labels: { fill: '#fff', fontSize: 10}}}
				/>
			</View>
		)
	}
}
