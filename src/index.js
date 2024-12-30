import React from 'react'
import { createStackNavigator, createBottomTabNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation'
import { View, Text, StyleSheet, Platform, Image } from 'react-native'
import { Root, Icon } from 'native-base'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import navService from './lib/nav-service'
import Spinner from './components/Spinner'
import Header from './components/Header'
import Home from './screens/Home'
import Flow from './screens/Flow'
import Level from './screens/Level'
import Set1 from './screens/Set1'
import Set2 from './screens/Set2'
import Settings from './screens/Settings'
import palette from './theme/palette'
import { login, autoRefreshTimer } from './store/actions'
import Login from './screens/Login'
import { isIPhoneXrSize, isIPhoneXSize, isIphone5 } from './theme/variables/platform'
import BackgroundTimer from 'react-native-background-timer'

const styles = StyleSheet.create({
	footerTabBar: {
		backgroundColor: palette.gradient[1],
		borderTopWidth: 1,
		borderTopColor: 'rgba(255,255,255,0.5)',
		padding: 3,
		paddingLeft: 0
	},
	footerTab: {
		flex: 1,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.5)',
		marginLeft: 3,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	footerTabIOS: {
		flex: 5,
		borderWidth: 1,
		borderColor: 'rgba(255,255,255,0.5)',
		marginLeft: 3,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		width: isIPhoneXrSize() ? 80 : isIPhoneXSize() ? 70 : isIphone5() ? 60 : 70
	},
	footerTabIcon: {
		marginRight: 2
	},
	footerTabLabel: {
		fontSize: isIphone5() ? 9 : 11
	}
})

const FooterTab = (props) => {
	const { focused, tintColor, label, icon } = props
	let isFocused = focused && [null,undefined].indexOf(navService.getCurrent()) === -1
	return (
		<View style={ Platform.OS == 'ios' ? styles.footerTabIOS : styles.footerTab }>
			{icon !== 'speedometer' ?
				<Icon name={ icon } size={isIphone5() ? 7 : 10} style={{ ...styles.footerTabIcon, color: isFocused ? tintColor : palette.chartInactiveColor }}/>
				:
				<Image source={require('../src/assets/images/level.png')} style={{ ...styles.footerTabIcon,height: 22, width: 25, tintColor: isFocused ? tintColor : palette.chartInactiveColor}}/>
			}
			<Text style={{ ...styles.footerTabLabel, color: isFocused ? tintColor : palette.footerIconTextColor }}>{ label }</Text>
		</View>
	)
}

const FooterStack = createBottomTabNavigator({
	Home: {
		screen: Home,
		navigationOptions: {
			tabBarLabel: (props) =>
				<FooterTab { ...props } icon="home"/>
		}
	},
	Flow: {
		screen: Flow,
		navigationOptions: {
			tabBarLabel: (props) =>
				<FooterTab { ...props } icon="water" label="Dotok"/>
		}
	},
	Level: {
		screen: Level,
		navigationOptions: {
			tabBarLabel: (props) =>
				<FooterTab { ...props } icon="speedometer" label="Nivoi"/>
		}
	},
	Set1: {
		screen: Set1,
		navigationOptions: {
			tabBarLabel: (props) =>
				<FooterTab { ...props } icon="flash" label="Đerdap 1"/>
		}
	},
	Set2: {
		screen: Set2,
		navigationOptions: {
			tabBarLabel: (props) =>
				<FooterTab { ...props } icon="flash" label="Đerdap 2"/>
		}
	}
},{
	tabBarOptions: {
		resetOnBlur: true,
		showIcon: false,
		activeTintColor: palette.footerIconActiveColor,
		inactiveTintColor: palette.footerIconTextColor,
		style: styles.footerTabBar
	}
})

const Navigator = createStackNavigator({
	Login: { screen: Login },
	FooterStack: { screen: FooterStack },
	Settings: { screen: Settings }
},
{
	headerMode: 'none',
	transparentCard: true
})

// icon color in header #79a0a4

const AppContainer = createAppContainer(Navigator)

class Main extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			currentScreen: null
		}
		this.onNav = this.onNav.bind(this)
	}

	static getDerivedStateFromProps(props, state) {
		let newTimer = props.settings.autoRefresh.selectedValue
		let timerId = null
		if (newTimer !== state.timer) {
			if (state.timerId) {
				BackgroundTimer.clearInterval(state.timerId)
			}

			timerId = BackgroundTimer.setInterval(() => {
				props.autoRefreshTimer()
			},newTimer * 60000)
			return {timer: newTimer, timerId: timerId}
		} else if (!state.timerId) {
			timerId = BackgroundTimer.setInterval(() => {
				props.autoRefreshTimer()
			},newTimer * 60000)
			return {timerId: timerId}
		}
		return null
	}
	componentDidMount () {

	}

	getCurrentScreen (navState){
		if (!navState) {
			return null
		}
		const route = navState.routes[navState.index]
		if (route.routes) {
			return this.getCurrentScreen(route)
		}
		return route.routeName
	}

	onNav (prevState, currentState){
		this.setState({
			currentScreen: this.getCurrentScreen(currentState)
		})
	}

	render (){
		return (
			<Root>
				<Header currentScreen={ this.state.currentScreen }/>
				<AppContainer
					onNavigationStateChange={ this.onNav }
					ref={(navRef) => {
						navService.setTopLevelNavigator(navRef)
					}}/>
				{ this.props.loading ? <Spinner/> : null }
			</Root>
		)
	}
}

export default connect((state) => {
	const { loading } = state.common
	return {
		...state.common,
		loading
	}
}, (dispatch) => {
	const actions = { login, autoRefreshTimer }
	return bindActionCreators(actions, dispatch)
})(Main)

//export default createAppContainer(Navigator)
/*
const htmlContent = `
<html>
	<head>
		<style type="text/css">
			body {
				background-color: #999;
			}
			h1 {
				color: green;
			}
			.pera {
				color: red
			}
		</style>
	</head>
	<body>
		<h1>Label</h1>
		<p class="pera">Paragraph...</p>
	</body>
</html>
`

export default class App extends React.Component {
	render() {
		return (
			<View style={ styles.container }>
				<View style={ styles.header }><Text>hdr</Text></View>
				<ScrollView style={ styles.content }>
					<Text>cont</Text>
					<FlatList
						data={[
							{key: 'Devin'},
							{key: 'Jackson'},
							{key: 'James'},
							{key: 'Joel'},
							{key: 'John'},
							{key: 'Jillian'},
							{key: 'Jimmy'},
							{key: 'Julie'},
						]}
						renderItem={({ item }) => <Text style={styles.listItem}>{item.key}</Text>}/>
					<Text>---</Text>
					<SectionList
						sections={[
							{title: 'D', data: ['Devin']},
							{title: 'J', data: ['Jackson', 'James', 'Jillian', 'Jimmy', 'Joel', 'John', 'Julie']},
						]}
						renderItem={({ item }) => <Text style={ styles.listItem }>{ item }</Text>}
						renderSectionHeader={({ section }) => <Text style={ styles.listSectionHeader }>{ section.title }</Text>}
						keyExtractor={(item, index) => index}/>
				</ScrollView>
				<View style={ styles.footer }><Text style={{ textAlign: 'center' }}>ftr</Text></View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'stretch',
		backgroundColor: '#000'
	},
	header: {
		flexBasis: 20,
		backgroundColor: '#f00'
	},
	content: {
		flexGrow: 1,
		flexShrink: 1,
		flexBasis: 'auto',
		padding: 16,
		backgroundColor: '#fdd'
	},
	footer: {
		flexBasis: 20,
		backgroundColor: '#0f0',
		textAlign: 'center',
		color: '#333333'
	},
	listSectionHeader: {
		fontSize: 18,
		fontWeight: 'bold'
	},
	listItem: {
		color: '#222'
	}
})
*/
//const styles = StyleSheet.create({...palette, ...layout})

