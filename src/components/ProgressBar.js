/* eslint-disable no-console */
/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import palette from '../theme/palette'
import { roundNone } from '../lib/calculations'
import BigNumber from 'bignumber.js'
import { isIPhoneXrSize, isIphone5 } from '../theme/variables/platform'

export default class ProgressBar extends React.Component {
	render() {
		let {planned, archived, chart, total, value1, value2} = this.props
		let width = archived*100/parseFloat(planned)

		let width2 = value1*100/total
		let width3 = value2*100/total
		let newWidth = roundNone(new BigNumber(width)).toNumber()
		let newWidth2 = roundNone(new BigNumber(width2)).toNumber()
		let newWidth3 = roundNone(new BigNumber(width3)).toNumber()
		const rectangleShapeView = {
			width: chart === 1 ? newWidth2 + '%' : chart === 2 ? newWidth3 + '%' : newWidth + '%',
			height: 17,
			backgroundColor: chart === 1 ? '#55c5d0' : chart === 2 ? '#d2e288': '#fff',
			justifyContent: 'flex-end',
			flexDirection: 'row'
		}

		const rectangleShapeInnerView = {
			flex: 1,
			height: 17,
			borderColor: '#fff',
			alignItems: 'center',
			borderWidth: StyleSheet.hairlineWidth,
			flexDirection: 'row'
		}

		return (
			<View>
				{chart === 1 || chart === 2 ?
					<View style={styles.ProgressBarSetsView}>
						<View style={rectangleShapeView}>
							<Text style={{color: '#fff'}}>{chart === 1 ? newWidth2 ? newWidth2 + '%' : null : newWidth3 ? newWidth3 + '%' : null}</Text>
						</View>
					</View>
					:
					newWidth >= 75 ?
						<View style={[styles.ProgressBarView, {position: 'relative'}]}>
							<View style={[rectangleShapeView, {alignItems: 'center', justifyContent: 'center', maxWidth: '100%', width: newWidth + '%'}]}>
								<Text style={{color: '#000'}}>{newWidth ? newWidth + '%' : null}</Text>
							</View>
							<View style={[rectangleShapeInnerView, {}]}/>
						</View>
						:
						<View style={styles.ProgressBarView}>
							<View style={rectangleShapeView}/>
							<View style={rectangleShapeInnerView}>
								<Text style={{color: '#fff', marginLeft: 3}}>{newWidth ? newWidth + '%' : null}</Text>
							</View>
						</View>
				}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	ProgressBarView: {
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: isIPhoneXrSize() ? 120 : isIphone5() ? 75 : 100,
		marginBottom: 15
	},
	ProgressBarSetsView: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		marginVertical: 3
	}
})
