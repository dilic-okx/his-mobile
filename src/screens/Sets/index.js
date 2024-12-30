import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Layout from '../../components/Layout'
import moment from '../../lib/moment'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getSetsData, screenValue } from '../../store/actions'
import { getConfigByKey } from '../../lib/utils'
import styles from './styles'
import ProgressBar from '../../components/ProgressBar'
import CircularProgress from '../../components/CircularProgress'
import palette from '../../theme/palette'
import Chart1 from '../../components/Chart1'
import Chart6 from '../../components/Chart6'

class Sets extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
		}
	}

	static navigationOptions = {
		title: 'Sets'
	}

	static getDerivedStateFromProps(props, state) {
		if (props[props.newScreen].dailySetsData.length === 0) {
			props.screenValue(props.newScreen)
			props.getSetsData(props.newScreen)
		}
		return null
	}

	handleCharts = () => {
		let sets = this.props.setsData
		let { hourlySetsData, isActiveSetsData, dailySetsData} = this.props[sets.label]
		const len = hourlySetsData.length
		if (hourlySetsData.length > 0 && isActiveSetsData.length > 0 && dailySetsData.length > 0) {
			return	Array(len).fill(null).map((i, j, array) => {
				const hourlyData = hourlySetsData[j]
				const isActiveData = isActiveSetsData[j]
				const dailyData = dailySetsData[j]
				return 	(
					<View key={j}>
						<View style={{	marginLeft: 20, marginRight: 20, paddingVertical: 10, alignItems: 'center', borderBottomColor: palette.chartScatterColor, borderBottomWidth: StyleSheet.hairlineWidth}}>
							<Text style={{color: '#fff'}}>{j === 0 ? sets.labelHourly : sets.secondLabelHourly}</Text>
							<Text style={{fontSize: 12, color: '#fff', marginTop: 5}}>Proizvodnja – MWh</Text>
							<Text style={{fontSize: 12, color: palette.chartLineColor, marginTop: 5}}>Proticaj – m³/s</Text>
							<Chart1
								data={hourlyData}
								domainPadding={ 20 }
								scale={{ x: 'time', y: 'linear' }}
								height={ 200 }
								labels1={(d) => d.level}
								labels2={(d) => d.mwh}
								x="time" y1="level" y2="mwh"
							/>
							<Chart6
								data={isActiveData}
							/>
						</View>
						<View style={{ marginLeft: 20, marginRight: 20, paddingVertical: 10, alignItems: 'center', borderBottomColor: palette.chartScatterColor, borderBottomWidth: array.length-1 !== j ? StyleSheet.hairlineWidth : 0}}>
							<Text style={{color: '#fff'}}>{j === 0 ? sets.labelDaily : sets.secondLabelDaily}</Text>
							<Text style={{fontSize: 12, color: '#fff', marginTop: 5}}>Proizvodnja – MWh</Text>
							<Text style={{fontSize: 12, color: palette.chartLineColor, marginTop: 5}}>Proticaj – m³/s</Text>
							<Chart1
								data={dailyData}
								sets={true}
								domainPadding={ 20 }
								scale2={{ x: 'time', y: 'linear' }}
								height={ 200 }
								labels1={(d) => d.level}
								labels2={(d) => d.mwh}
								x="time" y1="level" y2="mwh"
							/>
						</View>
					</View>
				)
			})
		}
	}

	render() {
		let sets = this.props.setsData
		let {
			activePower_1,
			activePower_2,
			summaryProduction,
			hydroPlantLeakage,
			summaryLeakage,
			overflowDamLeakage,
			leakageOverflowDamSRB,
			leakageOverflowDamROM,
			leakagePlantROM,
			leakagePlantSRB,
			percentLeakeageOverflowDam,
			percentLeakeageHydroPlant
		} = this.props[sets.label]
		let date = moment().format('dddd, DD MMMM, hh:mm')
		return (
			<Layout>
				<View style={styles.setView}>
					<Text style={styles.colorText}>{sets.powerPlantMainName}</Text>
				</View>
				<View style={styles.productionView}>
					<Text style={styles.colorText}>{date}</Text>
					<Text style={[styles.colorText ,{ marginTop: 10 }]}>Proizvodnja</Text>
					<Text style={styles.colorText}>Ukupno: {summaryProduction} MWh</Text>
					<View style={styles.powerPlantsView}>
						<View style={styles.powerPlantsInnerView}>
							<Text style={[styles.powerPlantsText, {marginBottom: 5}]}>{sets.powerPlantName}</Text>
							<Text style={styles.powerPlantsText}>{sets.secondPowerPlantName}</Text>
						</View>
						<View style={styles.powerPlantsInnerView}>
							<Text style={[styles.powerPlantsText, {marginBottom: 5}]}>{activePower_1} MWh</Text>
							<Text style={styles.powerPlantsText}>{activePower_2} MWh</Text>
						</View>
						<View style={styles.progressBarView}>
							<ProgressBar
								chart = {1}
								total = {summaryProduction}
								value1 = {activePower_1}
							/>
							<ProgressBar
								chart = {2}
								total = {summaryProduction}
								value2 = {activePower_2}
							/>
						</View>
					</View>
				</View>
				<View style={styles.sumView}>
					<Text style={styles.powerPlantsText}>Isticanje</Text>
					<Text style={styles.colorText}>Ukupno: {summaryLeakage} m³/s</Text>
				</View>
				<View style={[styles.circle, { borderBottomColor: palette.chartScatterColor, borderBottomWidth: StyleSheet.hairlineWidth}]}>
					<View style={styles.circleInnerView}>
						<CircularProgress percent={percentLeakeageHydroPlant} color={ palette.chartLineColor }/>
						<View style={styles.detailsCircleView}>
							<Text style={styles.detailsMainText}>Hidroelektrane</Text>
							<View style={ styles.detailsCircleInnerView}>
								<View style={styles.detailsCircleSubInnerView}>
									<Text style={styles.detailsSubText}>Ukupno: </Text>
									<Text style={styles.detailsSubText}>SRB: </Text>
									<Text style={styles.detailsSubText}>ROM: </Text>
								</View>
								<View style={styles.detailsCircleSubInnerView}>
									<Text style={styles.detailsSubText}>{hydroPlantLeakage} m³/s</Text>
									<Text style={styles.detailsSubText}>{leakagePlantSRB} m³/s</Text>
									<Text style={styles.detailsSubText}>{leakagePlantROM} m³/s</Text>
								</View>
							</View>
						</View>
					</View>
					<View style={styles.circleInnerView}>
						<CircularProgress percent={percentLeakeageOverflowDam} color={ palette.chartSecondary4 }/>
						<View style={styles.detailsCircleView}>
							<Text style ={styles.detailsMainText}>Prelivna brana</Text>
							<View style={styles.detailsCircleInnerView}>
								<View style={styles.detailsCircleSubInnerView}>
									<Text style={styles.detailsSubText}>Ukupno: </Text>
									<Text style={styles.detailsSubText}>SRB: </Text>
									<Text style={styles.detailsSubText}>ROM: </Text>
								</View>
								<View style={styles.detailsCircleSubInnerView}>
									<Text style={styles.detailsSubText}>{overflowDamLeakage} m³/s</Text>
									<Text style={styles.detailsSubText}>{leakageOverflowDamSRB} m³/s</Text>
									<Text style={styles.detailsSubText}>{leakageOverflowDamROM} m³/s</Text>
								</View>
							</View>
						</View>
					</View>
				</View>
				{this.handleCharts()}
			</Layout>
		)
	}
}

export default connect((state) => {
	const {
	} = state.common
	return {
		...state.common
	}
}, (dispatch) => {
	const actions = { getSetsData, screenValue }
	return bindActionCreators(actions, dispatch)
})(Sets)
