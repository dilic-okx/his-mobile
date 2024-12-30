import React from 'react'
import { connect } from 'react-redux'
import { getSettings, changeSettings, logout, changeFirebaseSubscription, changeAutoRefresh } from '../../store/actions'
import { bindActionCreators } from 'redux'
import { Text, View, TouchableOpacity } from 'react-native'
import Layout from '../../components/Layout'
import SettingsModal from './Modal/SettingsModal'
import { changeNotification } from '../../lib/utils'
import CheckBox from 'react-native-check-box'
import styles from './styles'
import palette from '../../theme/palette'
import { Icon, Picker } from 'native-base'

class Settings extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			modalVisible: -1,
			notification: null,
			allowPopUp: true,
			selectedTime: null
		}
	}

	static navigationOptions = {
		title: 'Podešavanja'
	}

	setModalVisible(id) {
		const notification = this.props.settings.notifications.find(i => i.id === id)
		this.setState({ modalVisible: id, notification }, () => {
			// In order to unmount popUp on ok/cancel action
			this.handleAllowPopUp(false)
			setTimeout(()=> {
				this.handleAllowPopUp(true)
			}, 100)
		})
	}

	componentWillReceiveProps(nextProps) {
		const notification = nextProps.settings.notifications.find(i => this.state.notification && i.id === this.state.notification.id)
		if (this.state.notification && notification.value !== this.state.notification.value) {
			this.setState({
				notification: { ...this.state.notification, value: notification.value }
			})
		}
	}

	handleAllowPopUp(flag) {
		this.setState({
			allowPopUp: flag
		})
	}

	formatLabel = (item) => {
		if (!item) {
			return <Text></Text>
		}
		switch (item.id) {
		case 5:
			return <Text onPress={() => {
				// if (item.checked) {
				// 	null
				// } else {
				this.setModalVisible(item.id)
				// }
			}} style={{ color: palette.chartLineColor }}>{item.value + ' %'}</Text>
		case 6:
			return <Text onPress={() => {
				// if (item.checked) {
				// 	null
				// } else {
				this.setModalVisible(item.id)
				// }
			}}
			style={{ color: palette.chartLineColor }}>{item.value + ' m³/s'}</Text>
		case 7:
			return <Text
				onPress={() => {
					// if (item.checked) {
					// 	null
					// } else {
					this.setModalVisible(item.id)
					// }
				}}
				style={{ color: palette.chartLineColor }}>{item.value.replace(/[\.]+/g, ',') + ' mnm'}</Text>
		default:
			return <Text></Text>
		}
	}

	onPickerValueChange = (time) => {
		this.props.changeAutoRefresh('autoRefresh', time)
	}


	render() {
		const { settings } = this.props
		return (
			<Layout {...this.props} showBack={true}>
				<View style={styles.settings}>
					<View style={{ marginBottom: 20 }}>
						<Text style={{ color: '#fff' }}>UPOZORENJA</Text>
						{settings.notifications.filter(i => i.type === 'ALERTS').map((item, index) =>
							<View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
								<CheckBox
									key={index}
									style={{ paddingVertical: 10 }}
									onClick={() => {
										const updatedNotifications = changeNotification(settings.notifications, item.id)
										this.props.changeSettings('notifications', updatedNotifications)
										this.props.changeFirebaseSubscription(updatedNotifications.find(i => i.id === item.id))
									}}
									isChecked={item.checked}
									checkBoxColor={'#fff'}
									uncheckedCheckBoxColor={'#fff'}
								/>
								<Text style={styles.checkBoxText}>{item.label}</Text>
							</View>
						)
						}
					</View>
					<View>
						<Text style={{ color: '#fff' }}>OBAVEŠTENJA</Text>
						{settings.notifications.filter(i => i.type === 'NOTIFICATIONS').map((item, index) =>
							<View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
								<CheckBox
									key={index}
									style={{ paddingVertical: 10 }}
									onClick={() => {
										const updatedNotifications = changeNotification(settings.notifications, item.id)
										this.props.changeSettings('notifications', updatedNotifications)
										this.props.changeFirebaseSubscription(updatedNotifications.find(i => i.id === item.id))
									}}
									isChecked={item.checked}
									checkBoxColor={'#fff'}
									uncheckedCheckBoxColor={'#fff'}
								/>
								<Text style={styles.checkBoxText}>{item.label} {this.formatLabel(item)}</Text>
							</View>
						)
						}
					</View>
					{this.state.notification && this.state.allowPopUp ?
						<SettingsModal
							notifications={settings.notifications}
							notification={this.state.notification}
							modalVisible={this.state.modalVisible}
							changeSettings={this.props.changeSettings}
							setModalVisible={this.setModalVisible.bind(this)}
							changeFirebaseSubscription={this.props.changeFirebaseSubscription}
						/>
						:
						null
					}
					<View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
						<Icon style={{ paddingHorizontal: 2 }} name="md-refresh" />
						<Text style={styles.checkBoxText}>Automatski refresh {}</Text>
						<Picker
							mode="dropdown"
							iosIcon={<Icon name="arrow-down" />}
							style={{ color: '#fff' }}
							selectedValue={settings.autoRefresh.selectedValue}
							onValueChange={this.onPickerValueChange.bind(this)}
						>
							{settings.autoRefresh.times.map((data, i) => {
								return 	<Picker.Item key={i} label={data.label} value={data.time}/>
							})}
						</Picker>
					</View>
					<View style={{alignItems: 'center'}}>
						<TouchableOpacity onPress={this.props.logout} style={styles.logout}>
							<Icon
								type="AntDesign"
								name="logout"
								style={{color: '#fff'}}
							/>
							<Text style={{color: '#fff', marginLeft: 8}}>Odjavi se</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Layout>
		)
	}
}

export default connect((state) => {
	const {
		settings
	} = state.common
	return {
		...state.common,
		settings
	}
}, (dispatch) => {
	const actions = { logout, getSettings, changeSettings, changeFirebaseSubscription, changeAutoRefresh }
	return bindActionCreators(actions, dispatch)
})(Settings)
