import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import palette from '../../theme/palette'
import Layout from '../../components/Layout'
import PieChart from '../../components/PieChart'
import Chart2 from '../../components/Chart2'
import Chart5 from '../../components/Chart5'
import { getFlowsData, screenValue } from '../../store/actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styles from './styles'
import moment from '../../lib/moment'
import Scatter from '../../components/Scatter'
import { getConfigByKey } from '../../lib/utils'

class Flow extends React.Component {
	static navigationOptions = {
		title: 'Flow'
	}

	componentDidMount () {
		this.props.screenValue('flows')
		this.props.getFlowsData()
	}

	handleFlows = () => {
		let data = []
		if (this.props.sets) {
			data = this.props.sets.pickedFlows.map((item, index, array) => {
				return (
					<View key={index} style={{flex: 1, flexDirection: 'row', justifyContent: 'center', borderRightColor: palette.chartScatterColor, borderRightWidth: array.length-1 !== index ? StyleSheet.hairlineWidth : 0}}>
						<Scatter
							data={this.props[item.label]}
						/>
						<View style={{flexDirection: 'column', marginLeft: 5}}>
							<Text style={styles.flowRiverText}>{this.props[item.label].name}</Text>
							<Text style={styles.flowRiverText}>{this.props[item.label].current}</Text>
						</View>
					</View>
				)

			})
		}
		return data
	}
	render() {
		let date = moment().format('dddd, DD MMMM, hh:mm')
		const { screen } = this.props
		return (
			<Layout { ...this.props }>
				<View style={styles.flowView}>
					<Text style={{ color: '#fff'}}>Ukupan dotok u akumulaciju</Text>
				</View>
				<View style={styles.flowView}>
					<Text style={[styles.dateText, {fontSize: 10}]}>{date}</Text>
					<View style={{flexDirection: 'row', marginTop: 10 }}>
						<Text style={[styles.dateText, {marginRight: 5}]}>Ukupan dotok: {this.props.sumCurrentFlow.current} m³/s</Text>
						<Scatter
							data={this.props.sumCurrentFlow}
						/>
					</View>
					<PieChart
						data = {this.props.pieChart}
					/>
					<View style={styles.deltaRiversFlow}>
						{this.handleFlows()}
					</View>
				</View>
				{/* <View style={styles.flowView}>
					<Text style={{color: '#fff'}}>Časovni podaci</Text>
					<Chart5
						height={250}
						data={this.props.secondChartFlow}
						labelsData={this.props.secondChartFlowSum}
					/>
				</View> */}
				<View style={[styles.flowView, {borderBottomColor: 'transparent'}]}>
					<Text style={{color: '#fff'}}>Dnevni podaci</Text>
					<Text style={{fontSize: 12, color: palette.chartLineColor, marginTop: 5}}>Proticaj – m³/s</Text>
					<View style={[styles.flowInnerView, {height: 120}]}>
						<Chart2
							data={ this.props.thirdChart }
							screen={'Flows'}
							height={ 200 }
							x="time" y="level"
						/>
					</View>
				</View>
			</Layout>
		)
	}
}

export default connect((state) => {
	const sets = getConfigByKey('flows')
	const {
	} = state.common
	return {
		...state.common,
		sets
	}
}, (dispatch) => {
	const actions = { getFlowsData, screenValue }
	return bindActionCreators(actions, dispatch)
})(Flow)
