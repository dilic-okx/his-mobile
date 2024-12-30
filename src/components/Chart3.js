/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import React from 'react'
import { View, Text } from 'react-native'
import palette from '../theme/palette'
import { roundNone, roundLevel, roundOneDecimal, formatNumber } from '../lib/calculations'
import BigNumber from 'bignumber.js'
import { isIphone5 } from './../theme/variables/platform'

export default class Chart3 extends React.Component {
	render() {
		let { width2, id, totalArchived, width, chart, screenHome} = this.props
		let widthSecondRes = roundOneDecimal(new BigNumber(width2))

		let percent = formatNumber(widthSecondRes)

		const rectangleShapeView = {
			width: '100%',
			height: 25,
			top: 15,
			backgroundColor: width === 1 ? palette.chartActiveColor : palette.chartInactiveColor
		}

		const rectangleShapeView1 = {
			width: '100%',
			top: 25,
			height: 25,
			backgroundColor: palette.chartInactiveColor
		}
		const rectangleShapeView2 = {
			width: widthSecondRes + '%',
			height: 25,
			backgroundColor: palette.chartActiveColor
		}
		const rectangleShapeView3 = {
			height: 25,
			backgroundColor: 'transparent',
			bottom: chart !== 1 ? 25 : 10,
			alignItems: 'center',
			justifyContent: 'center'
		}

		return (
			<View style={{flexDirection: 'column', flex: 1, justifyContent: 'flex-start', marginHorizontal: 5}}>
				{chart === 1 ? <View style={rectangleShapeView}/> : <View style={rectangleShapeView1}/>}
				{chart === 1 ? <View></View> : <View style={rectangleShapeView2}/>}
				<View style={rectangleShapeView3}>
					<Text style={{color: '#fff'}}>A{id}</Text>
				</View>
				{chart === 1 ? <View></View> :
					<View style={{bottom: 23, alignItems: 'center'}}>
						<Text style={{color: '#fff', fontSize: isIphone5() ? 8 : 10}}>{percent + '%'}</Text>
					</View>
				}
			</View>
		)
	}
}


