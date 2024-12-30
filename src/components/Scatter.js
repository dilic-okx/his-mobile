import React from 'react'
import { View, Dimensions } from 'react-native'
import { VictoryScatter } from 'victory-native'
import ScatterTendencyLine from './ScatterTendencyLine'

export default class Scatter extends React.Component {
	constructor (props) {
		super(props)
		const { height, width } = Dimensions.get('window')
		this.state = {
			width,
			height
		}
	}

	render() {
		let { data, domain, height, screen} = this.props
		let dataRes = []
		dataRes.push(data)

		domain = domain || {}
		height = height || 50
		return (
			<View pointerEvents="none" style={{paddingHorizontal: 2}}>
				<VictoryScatter
					width={15}
					height={25}
					data={dataRes.map((item, i) => ({ x: i * 2 , y: 1, previous: item.previous, current: item.current}))}
					dataComponent={<ScatterTendencyLine screen={screen} height={height}/>}
				/>
			</View>
		)
	}
}
