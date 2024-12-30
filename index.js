// GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest


import React from 'react'
import { AppRegistry } from 'react-native'
import { StyleProvider } from 'native-base'
import SplashScreen from 'react-native-splash-screen'
import App from './src'
import getTheme from './src/theme/components'
import commonColor from './src/theme/variables/commonColor'
import { name as appName } from './app.json'
import { Provider} from 'react-redux'
import store from './src/store'
import firebase from './src/lib/firebase'
import Firebase from 'react-native-firebase'
import auth from './src/lib/auth'
import navService from './src/lib/nav-service'

class StyledApp extends React.Component {
	componentDidMount() {
		auth.loggedIn().then(res => {
			if (res) {
				navService.navigate('Home')
			}
			SplashScreen.hide()
		})
	}

	render() {
		return (
			<Provider store={store}>
				<StyleProvider style={ getTheme(commonColor)}>
					<App/>
				</StyleProvider>
			</Provider>
		)
	}
}

export const channel = new Firebase.notifications.Android.Channel('his-djerdap', 'HIS Djerdap Channel', Firebase.notifications.Android.Importance.Max)
				.setDescription('HIS Djerdap Channel')
// Create the channel
Firebase.notifications().android.createChannel(channel)

AppRegistry.registerComponent(appName, () => StyledApp)
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => firebase)
