import React from 'react'
import { View, Text, Platform } from 'react-native'
import { Picker, Icon } from 'native-base'
import Layout from '../../components/Layout'
import styles from './styles'
import moment from '../../lib/moment'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getLevelsData, screenValue, getLevelsById } from '../../store/actions'
import Chart2 from '../../components/Chart2'
import Chart7 from '../../components/Chart7'
import Scatter from '../../components/Scatter'
import { formatNumber } from '../../lib/calculations'
import palette from '../../theme/palette'
import { getConfigByKey } from '../../lib/utils'

class Level extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			levelValue: '',
			checkNav: false
		}
	}

	static navigationOptions = {
		title: 'Level'
	}

	componentWillMount () {
		const willFocusSubscription = this.props.navigation.addListener(
			'willFocus',
			payload => {
				if (this.props.navigation.state.params) {
					if (this.props.navigation.state.params.selectedData) {
						const id = this.props.navigation.state.params.selectedData
						if (this.state.levelValue !== id.toString()) {
							this.setState({levelValue: id.toString(), checkNav: true})
							this.props.getLevelsById(id)
						}
					}
				} else {
					this.props.screenValue('levels')
					this.props.getLevelsData()
				}
			}
		)
	}

	componentWillUnmount() {
		willFocusSubscription.remove()
		willBlurSubscription.remove()
	}

	componentDidUpdate(prevProps){
		const prevKeys = Object.keys(prevProps.levels)
		const keys = Object.keys(this.props.levels)
		if (!this.state.checkNav) {
			if (prevKeys.length !== keys.length){
				this.setState({
					levelValue: keys[0]
				})
			}
		}
	}

	handleLevels = (value) => {
		this.setState({levelValue: value})
		this.props.getLevelsById(value)
	}

	handleChart = (keyLabel) => {
		let res = Object.keys(this.props.levels).map((key, index) => {
			if (keyLabel !== 'sixDayData') {
				return (
					<Chart2
						key={index}
						data={ this.props.levels[key][keyLabel] }
						chartLabel={keyLabel}
						x="time" y="level"
					/>
				)
			} else {
				return (
					<Chart7
						key={index}
						data={ this.props.levels[key][keyLabel] }
						x="x" y="y"
					/>
				)
			}


		})
		return res
	}

	render() {
		const { navigate } = this.props.navigation
		let date = moment().format('dddd, DD MMMM, hh:mm')
		return (
			<Layout>
				<View style={styles.levelView}>
					<Text style={{color: '#fff'}}>Kote Dunava</Text>
				</View>
				<View style={styles.levelView}>
					<Text style={{color: '#fff'}}>{date}</Text>
					<View style={styles.pickerView}>
						<Icon
							type="EvilIcons"
							name="location"
							size={ 20 }
							style={{color: '#fff'}}
						/>
						{
							Platform.OS === 'ios' ?
								<Picker
									mode="dropdown"
									selectedValue={this.state.levelValue}
									style={{ width: 150}}
									textStyle={{ color: '#fff' , flex: 1}}
									iosIcon={<Icon name="arrow-down" style={{color: '#fff'}} />}
									onValueChange={this.handleLevels.bind(this)}>
									{Object.keys(this.props.levels).map((key, index) => {
										const name = this.props.levels[key].name || 'no name'
										return <Picker.Item key={index} label={name} value={key} />
									})}
								</Picker>
								:
								<View style={{ width: 210 }}>
									<Picker
										mode="dropdown"
										selectedValue={this.state.levelValue}
										style={{ color: '#fff'}}
										textStyle={{ color: '#fff' , flex: 1}}
										iosIcon={<Icon name="arrow-down" style={{color: '#fff'}} />}
										onValueChange={this.handleLevels.bind(this)}>
										{Object.keys(this.props.sets).map((key, index) => {
											const name = this.props.sets[key].name || 'no name'
											return <Picker.Item key={index} label={name} value={key}/>
										})}
									</Picker>
								</View>
						}
					</View>
					{Object.keys(this.props.levels).map((key, index) => {
						return (
							<View key={index} style={{marginVertical: 20, flexDirection: 'row'}}>
								<View style={{marginTop: 5}}>
									<Scatter
										data={{current: this.props.levels[key].oneHourData, previous: this.props.previousLevels}}
										screen={this.props.screen}
									/>
								</View>
								<Text key={index} style={styles.oneHourText}>{formatNumber(this.props.levels[key].oneHourData)} mnm</Text>
							</View>
						)
					})}
				</View>
				<Text style={styles.levelText}>Časovni podaci</Text>
				<Text style={[styles.levelText, {fontSize: 12, color: palette.chartLineColor, marginTop: 5}]}>Nivo - mnm</Text>
				<View style={[styles.levelView, {height: 120}]}>
					{this.handleChart('sixHourData')}
				</View>
				<Text style={styles.levelText}>Dnevni podaci</Text>
				<Text style={[styles.levelText, {fontSize: 12, color: '#fff', marginTop: 5}]}>Nivo - mnm (<Text style= {{color: palette.boxChart1}}>max</Text>, <Text style= {{color: palette.trendRise}}>sr</Text>, <Text style= {{color: '#fff'}}>min</Text>)</Text>
				<View style={[styles.levelView, {height: 200, borderBottomColor: 'transparent'}]}>
					{this.handleChart('sixDayData')}
				</View>
			</Layout>
		)
	}
}

export default connect((state) => {
	const sets = getConfigByKey('levels')

	const {
	} = state.common
	return {
		...state.common,
		sets
	}
}, (dispatch) => {
	const actions = { getLevelsData, screenValue, getLevelsById }
	return bindActionCreators(actions, dispatch)
})(Level)
