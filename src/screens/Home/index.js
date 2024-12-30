import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert, BackHandler } from 'react-native'
import { Icon, Picker } from 'native-base'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { config } from '../../store/common/sagas'
import Firebase, { RemoteMessage } from 'react-native-firebase'
import Layout from '../../components/Layout'
import Scatter from '../../components/Scatter'
import Chart1 from '../../components/Chart1'
import Chart2 from '../../components/Chart2'
import Chart3 from '../../components/Chart3'
import ProgressBar from '../../components/ProgressBar'
import { getActivePowerData, screenValue, logout, getSettings, autoRefreshTimer } from '../../store/actions'
import palette from '../../theme/palette'
import styles from './styles'
import { formatNumber } from '../../lib/calculations'
import { getConfigByKey, getPreselectedPlant, chunkArray } from '../../lib/utils'

class Home extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			sets: null,
			page: true
		}
	}
	static navigationOptions = {
		title: 'Welcome'
	}

	componentDidMount () {
		this.props.getSettings()
		Firebase.messaging().hasPermission().
			then(enabled => {
				if (enabled) {
					console.log('User has permissions:', enabled)
					// user has permissions
					this.setListener()
				}
			})
		this.props.getActivePowerData()
	}

	componentWillUnmount() {
		this.setListener()
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.screen === 'home1' || nextProps.screen === 'home2') {
			if (!nextProps[nextProps.screen].lastRefresh) {
				this.props.getActivePowerData()
			}
			return true
		} else {
			return false
		}
	}

	setListener = () => {
		Firebase.notifications().onNotification((notification) => {
			Alert.alert(
				notification.title,
				notification._android._notification._android._notification._body,
				[{
					text: 'OK',
					onPress: () => {
						console.log('OK Pressed')
					}
				}],
				{ cancelable: false }
			)
		})
	}

	handleRefresh = () => {
		this.props.autoRefreshTimer()
	}

	handleScreen = (value) => {
		if (value === 'home1') {
			this.setState({page: true})
		} else {
			this.setState({page: false})
		}

		this.props.screenValue(value)
		if (this.props.home1) {
			if (!this.props.home1.lastRefresh) {
				this.props.getActivePowerData()
			}
		}


		if (this.props.home2) {
			if (!this.props.home2.lastRefresh) {
				this.props.getActivePowerData()
			}
		}
	}

	levelChart = () => {
		const { navigate } = this.props.navigation
		const screen = this.props.screen
		let data = []
		if (this.props.sets && this.props.sets.level) {
			data = this.props.sets.level.map((item, index, array) => {
				const flowArr = this.props.sets.flow1.map(item => this.props[screen][item.name])
				return (
					<View key={index} style={[styles.levelChartView, { borderRightColor: palette.chartScatterColor, borderRightWidth: array.length - 1 !== index ? StyleSheet.hairlineWidth : 0 }]}>
						<TouchableOpacity onPress={() => this.state.page ? array.length - 1 !== index ? navigate('Flow') : navigate('Set1') : navigate('Set2')}>
							<Text style={[styles.levelChartText, !index ? { marginLeft: 20 } : {}]}>{item.label} {flowArr[index]} m³/s</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => navigate('Level')}>
							<View style={{ flexDirection: 'row', justifyContent: 'flex-start'}}>
								{item.items.map((itm, idx) => {
									return (
										<View key={index + '_' + idx} style={{ flexDirection: 'row' }}>
											<Scatter
												data={this.props[screen][itm.place]}
											/>
											<View style={{ flexDirection: 'column' }}>
												<Text style={{ color: '#fff' }}>{itm.name}</Text>
												<Text style={{ color: '#fff' }}>{this.props[screen][itm.place].current}</Text>
											</View>
										</View>
									)
								})}
							</View>
						</TouchableOpacity>
					</View>
				)
			})
		}
		return data
	}

    levelsValues = () => {
    	const homeArr = this.props[this.props.screen]

    	let size = Object.keys(homeArr.levelsDailyValue).length
    	let deltaData = Object.keys(homeArr.levelsDailyValue).map((key, i) => {
    		return (
    			<View key={i} style={[ styles.deltaRivers, { borderRightColor: palette.chartScatterColor, borderRightWidth: size-1 !== i ? StyleSheet.hairlineWidth : 0 }]}>
    				<Text style={{color: '#fff'}}>{key}</Text>
    				<Text style={{color: '#fff'}}>{formatNumber(homeArr.levelsDailyValue[key])} mnm</Text>
    			</View>
    		)
    	})
    	return deltaData

    }

    render() {
			const homeArr = this.props[this.props.screen]
    	const chunks = chunkArray(homeArr.infoPowerPlantLastHour, this.props.sets.activePowerChunkSize)
    	const chunks1 = chunkArray(homeArr.sumAgregatInProduction, this.props.sets.activePowerChunkSize)
    	const { navigate } = this.props.navigation
    	return (
    		<Layout>
    			<View style={styles.view}>
    				<View style={styles.innerView}>
    					<Text style={{ color: '#fff', marginRight: 7 }}>Ažurirano&nbsp;{homeArr.lastRefresh}</Text>
    					<TouchableOpacity onPress={this.handleRefresh}>
    						<Icon name="md-refresh" />
    					</TouchableOpacity>
    				</View>
    			</View>
    			<View style={styles.view}>
    				<View style={styles.innerView}>
    					<Icon
    						type="EvilIcons"
    						name="location"
    						size={20}
    						style={{ color: '#fff' }}
    					/>
    					{
    						Platform.OS === 'ios' ?
    							<Picker
    								mode="dropdown"
    								selectedValue={this.props.screen}
    								style={{ width: 150 }}
    								textStyle={{ color: '#fff', flex: 1 }}
    								iosIcon={<Icon name="arrow-down" style={{ color: '#fff' }} />}
    								onValueChange={this.handleScreen.bind(this)}>
    								{this.props.sets.picker.map ((data, index) => {
    									return <Picker.Item key={index} label={data.label} value={data.name} />
    								})}
    							</Picker>
    							:
    							<View style={{ width: 130 }}>
    								<Picker
    									mode="dropdown"
    									selectedValue={this.props.screen}
    									style={{ color: '#fff' }}
    									textStyle={{ color: '#fff', flex: 1 }}
    									iosIcon={<Icon name="arrow-down" style={{ color: '#fff' }} />}
    									onValueChange={this.handleScreen.bind(this)}>
    									{this.props.sets.picker.map ((data, index) => {
    										return <Picker.Item key={index} label={data.label} value={data.name} />
    									})}
    								</Picker>
    							</View>
    					}
    				</View>
    			</View>
    			<View style={styles.view}>
    				<TouchableOpacity
    					onPress={() => this.state.page ? navigate('Set1') : navigate('Set2')}
    				>
    					<View style={[styles.innerView, { marginTop: 20 }]}>
    						<Icon
    							type="MaterialCommunityIcons"
    							name="flash"
    							color={palette.chartInactiveColor}
    						/>
    						<Text
    							style={{ color: '#fff' }}>
    							{homeArr.sumPowerPlantLastHour} &nbsp; MW
    						</Text>
    					</View>
    					{chunks.map((chunk, index) => {
    						return (
    							<View key={index} style={[styles.innerView, styles.chunkView]}>
    								{chunk.map((data, i, array) => {
    									return (
    										<Chart3
    											key={i}
    											screenHome={this.props.screen}
    											width={data}
    											chart={1}
    											id={index * this.props.sets.activePowerChunkSize + i + 1}
    										/>
    									)
    								})}
    							</View>
    						)
    					})}
    				</TouchableOpacity>
    				<View style={[styles.innerView, { marginVertical: 10}]}>
    					{this.levelChart()}
    				</View>
    			</View>
    			<View style={styles.view}>
    				<Text style={styles.homeTextEnergy}>ENERGETSKI DAN</Text>
    				<TouchableOpacity onPress={() => this.state.page ? navigate('Set1') : navigate('Set2')} >
    					<View style={[styles.innerView, { marginVertical: 5 }]}>
    						<Icon
    							type="MaterialCommunityIcons"
    							name="flash"
    							size={20}
    							color={palette.chartInactiveColor}
    							style={{ marginRight: 5, alignSelf: 'center' }}
    						/>
    						{this.state.page ?
    							<Text
    								style={styles.MWhText}>
    								{homeArr.totalAchivedProduction}/{homeArr.plannedProduction} &nbsp;MWh
    							</Text> :
    							<Text
    								style={styles.MWhText}>
    								{homeArr.totalAchivedProduction} &nbsp;MWh
    							</Text>
    						}
    					</View>
    					{this.state.page ?
    						<ProgressBar
    							planned={homeArr.plannedProduction}
    							archived={homeArr.totalAchivedProduction}/>
    					: <View></View>}
    					{chunks1.map((chunk, index)=> {
    						return (
    							<View key={index} style={[styles.innerView, styles.chunkView]}>
    								{chunk.map((data, i, array)=> {
    									return (
    										<Chart3
    											key={i}
    											screenHome={this.props.screen}
    											width2={data}
    											totalArchived = {homeArr.totalAchivedProduction}
    											id = {index * this.props.sets.activePowerChunkSize + i + 1}
    										/>
    									)
    								})}
    							</View>
    						)
    					})}
    				</TouchableOpacity>
    				<Text style={styles.homeText}>{this.state.page ? 'Profil ušće Nere' : 'Profil Kladovo'}</Text>
    				<TouchableOpacity onPress={() => navigate('Level')}>
    					<View style={styles.innerView}>
    						{this.levelsValues()}
    					</View>
    				</TouchableOpacity>
    			</View>
    			<View style={styles.view}>
    				<Text style={styles.homeText}>{this.state.page ? 'Rad hidroelektrane Đerdap 1' : 'Rad hidroelektrane Đerdap 2'}</Text>
    				<Text style={[styles.homeText, {fontSize: 12}]}>Proizvodnja – MWh</Text>
    				<Text style={[styles.homeText, {fontSize: 12, color: palette.chartLineColor, marginTop: 5}]}>Proticaj – m³/s</Text>
    				<TouchableOpacity onPress={() => this.state.page ? navigate('Set1') : navigate('Set2')}>
    					<View style={styles.innerView}>
    						<Chart1
    							data={ homeArr.chartPowerPlants }
    							domainPadding={ 20 }
    							scale={{ x: 'time', y: 'linear' }}
    							height={ 200 }
    							labels1={(d) => d.level}
    							labels2={(d) => d.mwh}
    							x="time" y1="level" y2="mwh"
    						/>
    					</View>
    				</TouchableOpacity>
    			</View>
    			<View style={[styles.view, {borderBottomColor: 'transparent'}]}>
    				<Text style={styles.homeText}>{this.state.page ? 'Nivoi gornje vode Đerdap 1' : 'Nivoi gornje vode Đerdap 2'}</Text>
    				<Text style={[styles.homeText, {fontSize: 12, color: palette.chartLineColor, marginTop: 5}]}>Nivo - mnm</Text>
    				<TouchableOpacity onPress={() => navigate('Level', {selectedData: this.state.page ? 11 : 21})}>
    					<View style={[styles.innerView, {height: 120}]}>
    						<Chart2
    							data={ homeArr.levelChart3 }
    							// scale={{ x: 'time', y: 'linear' }}
    							height={ 200 }
    							x="time" y="level"
    						/>
    					</View>
    				</TouchableOpacity>
    				<Text style={styles.homeText}>{this.state.page ? 'Nivoi na ušću Nere' : 'Nivoi na Kladovu'}</Text>
    				<Text style={[styles.homeText, {fontSize: 12, color: palette.chartLineColor, marginTop: 5}]}>Nivo - mnm</Text>
    				<TouchableOpacity onPress={() => navigate('Level', {selectedData: this.state.page ? 1 : 15})}>
    					<View style={[styles.innerView, {height: 120}]}>
    						<Chart2
    							data={ homeArr.levelChart2 }
    							// scale={{ x: 'time', y: 'linear' }}
    							height={ 200 }
    							x="time" y="level"
    						/>
    					</View>
    				</TouchableOpacity>
    			</View>
    		</Layout>
    	)
    }
}

export default connect((state) => {
	const sets = getConfigByKey(state.common.screen)
	let screenName = null
	let homeRes = null
	if (sets.label !== 'home1' && sets.label !== 'home2') {
		return null
	} else {
		screenName = sets.label
		homeRes = {...state.common[screenName]}
	}
	const {
		levelChart2,
		levelChart3,
		chartPowerPlants,
		levelsDailyValue
	} = state.common[screenName]

	return {
		...state.common,
		sets,
		[screenName]: {
			...homeRes,
			chartPowerPlants: chartPowerPlants ? chartPowerPlants : [{}],
			levelChart2: levelChart2 ? levelChart2 : [{}],
			levelChart3: levelChart3 ? levelChart3 : [{}],
			levelsDailyValue: levelsDailyValue ? levelsDailyValue : [{}]
		}
	}
}, (dispatch) => {
	const actions = { getActivePowerData, screenValue, logout, getSettings, autoRefreshTimer }
	return bindActionCreators(actions, dispatch)
})(Home)
