/* eslint-disable no-unused-vars */
import React from 'react'
import { View, Text, Dimensions } from 'react-native'
import { VictoryScatter } from 'victory-native'
import palette from '../theme/palette'

export default class Chart4 extends React.Component {
	constructor (props) {
		super(props)
		const { height, width } = Dimensions.get('window')
		this.state = {
			width,
			height
		}
	}

	render() {

		return (
			<View pointerEvents="none" style={{marginLeft: '5%', marginRight: '5%'}}>
				<VictoryScatter
					symbol="triangleDown"
					size={10}
					// data={data}
				/>
			</View>
		)
	}
}
