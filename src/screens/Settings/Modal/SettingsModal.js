import React from 'react'
import { Text, View, Modal, Dimensions, TouchableOpacity, TextInput } from 'react-native'
import BackgroundTimer from 'react-native-background-timer'
import CustomMarker from '../../../components/CustomMarker'
import styles from './../styles'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { changeNotification, changeNotificationProperties } from '../../../lib/utils'
import { Icon, Picker } from 'native-base'

const { height, width } = Dimensions.get('window')

class SettingsModal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedTime: null,
			sliderValue: null,
			inputValue: null
		}
	}

	componentDidMount() {
		const value = this.props.notification.value
		this.setState({
			sliderValue: value,
			inputValue: value
		})

	}

	componentDidUpdate(prevProps) {
		const value = this.props.notification.value
		if (value !== prevProps.notification.value) {
			this.setState({
				sliderValue: value,
				inputValue: value
			})
		}
	}

	onSliderValueChange = (values) => {
		this.setState({ sliderValue: values[0] })
	}

	onPickerValueChange(value) {
		this.setState({ selectedTime: value })
	}

	parseTopics (array) {
		return array.map(i => parseInt(i.match(/\d/g).join(''), 10))
	}

	save () {
		const { notification, notifications, changeFirebaseSubscription, changeSettings, setModalVisible } = this.props
		const { selectedTime, sliderValue, inputValue } = this.state
		const value = notification.id === 7 ? inputValue : sliderValue
		const oldNotification = changeNotification(notifications, notification.id,)
		let updatedNotifications= changeNotification(notifications, notification.id, 'value', value, true)
		if (selectedTime && selectedTime !== -1) {
			const timerId = BackgroundTimer.setTimeout(() => {
				const { timerId, defaultValue } = notifications[notification.id]
				BackgroundTimer.clearTimeout(timerId)
				// unsubscribe from  Topic
				updatedNotifications= changeNotificationProperties(updatedNotifications, notification.id, { timerId: null, checked: false })
				changeFirebaseSubscription(updatedNotifications.find(i => i.id === notification.id), oldNotification.find(i => i.id === notification.id))
				//subscribe to old Topic
				updatedNotifications= changeNotificationProperties(updatedNotifications, notification.id, { value: defaultValue, checked: true })
				changeFirebaseSubscription(updatedNotifications.find(i => i.id === notification.id), oldNotification.find(i => i.id === notification.id))
				changeSettings('notifications', updatedNotifications)
			}, selectedTime * 60000)
			updatedNotifications= changeNotification(updatedNotifications, notification.id, 'timerId', timerId)
		}
		if (selectedTime === -1){
			updatedNotifications= changeNotificationProperties(notifications, notification.id, { value: value, defaultValue: value })
		}
		updatedNotifications= changeNotification(updatedNotifications, notification.id, 'checked', true, true)
		changeFirebaseSubscription(updatedNotifications.find(i => i.id === notification.id), oldNotification.find(i => i.id === notification.id))
		changeSettings('notifications', updatedNotifications)
		setModalVisible(-1)
	}

	render() {
		const { notification } = this.props
		const { selectedTime, sliderValue, inputValue } = this.state
		return (
			<View>
				<Modal
					animationType={'slide'}
					transparent={true}
					visible={this.props.modalVisible !== -1}
					closeOnClick={true}
					onRequestClose={() => { this.props.setModalVisible(-1) }}>
					<View style={[styles.sliderPopup, { marginTop: height / 2 - 130 }]}>
						{notification && notification.id && [5, 6].includes(notification.id)
							?
							<View style={{ height: 100, paddingLeft: 20, justifyContent: 'center' }}>
								{notification && notification.value ?
									<MultiSlider
										values={[sliderValue]}
										onValuesChange={this.onSliderValueChange}
										optionsArray={this.parseTopics(notification.topics)}
										snapped={true}
										allowOverlap={true}
										selectedStyle={{
											backgroundColor: 'yellow'
										}}
										unselectedStyle={{
											backgroundColor: 'silver'
										}}
										sliderLength={width - 110}
										customMarker={() => <CustomMarker value={sliderValue} />}
									/>
									:
									null
								}
							</View>
							:
							<View style={styles.inputView}>
								<TextInput
									keyboardType='numeric'
									maxLength={5}
									value={inputValue}
									onChangeText={(value) => this.setState({ inputValue: value})}
									style={{ height: 60, fontSize: 30, color: '#fff' }}
								/>
							</View>
						}
						<View style={{ paddingHorizontal: 4 }}>
							<Picker
								mode="dropdown"
								iosIcon={<Icon name="arrow-down" />}
								style={{ color: '#fff' }}
								selectedValue={selectedTime}
								onValueChange={this.onPickerValueChange.bind(this)}
							>
								<Picker.Item label="Vremensko trajanje podešavanja" value={null} />
								<Picker.Item label="5 Minuta" value={5} />
								<Picker.Item label="10 Minuta" value={10} />
								<Picker.Item label="15 Minuta" value={15} />
								<Picker.Item label="Zauvek" value={-1} />
							</Picker>
						</View>
						<View style={styles.buttonsView}>
							<TouchableOpacity style={{ flex: 1 }} onPress={() => this.save()}>
								<Text style={styles.buttonModal}>Prihvati</Text>
							</TouchableOpacity>
							<View style={{ borderWidth: 0.5, borderColor: 'grey', height: 50 }}></View>
							<TouchableOpacity style={{ flex: 1 }} onPress={() => { this.props.setModalVisible(-1) }}>
								<Text style={styles.buttonModal}>Odustani</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			</View>
		)
	}
}

export default SettingsModal
