import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import { Header, Left, Right, Icon } from 'native-base'

import navService from '../lib/nav-service'
import Logo from '../assets/react-native-svg/logo.js'
import palette from '../theme/palette'

const rootScreens = ['Home','Dashboard','Flow','Level','Set1','Set2']
const labels = {
	Home: null,
	Dashboard: null,
	Flow: 'Protok',
	Level: 'Nivoi',
	Set1: 'Đerdap 1',
	Set2: 'Đerdap 2',
	Settings: 'Podešavanja'
}

export default class CustomHeader extends React.Component {
	render() {
		const { hideLogo, currentScreen } = this.props
		const showBack = currentScreen && rootScreens.indexOf(currentScreen) === -1
		return !currentScreen || currentScreen === 'Login' ? <Header style={{height: 0}}/> :
			<Header style={ Platform.OS === 'ios' ? styles.headerIOS : styles.header}>
				<Left style={{ flex: 1 }}>
					{ !hideLogo && !showBack ?
						<View>
							<TouchableOpacity style={ styles.row } onPress={() => { navService.navigate('Home')}}>
								<Logo style={ styles.logo } width={ 28 } height={ 24 }/>
								<Text style={[ styles.colorWhite, styles.textShadow, styles.logoLabel ]}>HIS ĐERDAP 2018</Text>
							</TouchableOpacity>
						</View>
						:
						showBack ?
							<View style={ styles.row }>
								<TouchableOpacity onPress={() => { navService.goBack()}}>
									<Icon style={{ ...styles.backButtonIcon, color: palette.headerIconColor }} name="arrow-back"/>
								</TouchableOpacity>
								<Text style={[ styles.colorWhite, styles.textShadow, styles.uppercase ]}>{ labels[currentScreen] }</Text>
							</View>
							: null }
				</Left>
				<Right style={{ flex: 1 }}>
					{ !currentScreen || rootScreens.indexOf(currentScreen) !== -1 ?
						<TouchableOpacity onPress={() => { navService.navigate('Settings')}}>
							<Icon name="settings" active={ true } style={{ color: palette.headerIconColor }}/>
						</TouchableOpacity>
						: null }
				</Right>
			</Header>
	}
}

const styles = StyleSheet.create({
	header: {
		flexBasis: 30,
		backgroundColor: palette.gradient[0],
		elevation: 0,
		color: '#fff'
	},
	headerIOS: {
		height: 50,
		backgroundColor: palette.gradient[0],
		elevation: 0,
		color: '#fff'
	},
	logo: {
		marginRight: 8
	},
	logoLabel: {
		fontSize: 10,
		fontWeight: 'bold'
	},
	backButtonIcon: {
		marginLeft: 0,
		marginRight: 12,
		paddingHorizontal: 0
	},
	row: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end'
	},
	colorWhite: {
		color: '#fff'
	},
	textShadow: {
		textShadowColor: 'rgba(0, 0, 0, 0.99)',
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 5
	},
	uppercase: {
		textTransform: 'uppercase'
	}
})
