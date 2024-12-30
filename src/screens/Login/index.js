import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, Text, Image, TextInput, TouchableOpacity, BackHandler} from 'react-native'
import { CheckBox } from 'native-base'
import { login } from '../../store/actions'
import styles from './styles'
import Layout from '../../components/Layout'
import auth from '../../lib/auth'
import { NavigationActions, StackActions } from 'react-navigation'
import {setLocalStorage, getLocalStorage, removeItem } from '../../lib/storage'
import { isDefined } from '../../lib/utils'

class Login extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			username: '',
			password: '',
			userError: '',
			passwordError: '',
			checked: false
		}
	}

	componentDidMount () {
		getLocalStorage('loginPageData').then( (loginPageData) => {
			this.setState(loginPageData)
		})
		const { navigate } = this.props.navigation
		auth.loggedIn().then(res => {
			if (res) {
				navigate('Home')
			}
		})
	}

	resetStack = () => {
		this.props.
			navigation.
			dispatch(StackActions.reset({
				index: 0,
				actions: [
					NavigationActions.navigate({
						routeName: 'Login'
						// params: { someParams: 'parameters goes here...' }
					})
				]
			}))
	}

	handleLogin = () => {
		this.props.login(this.state.username, this.state.password)

		if (this.state.checked === false) {
			getLocalStorage('loginPageData').then( (loginPageData) => {
				if (isDefined(loginPageData)) {
					removeItem('loginPageData')
				}
			})
			this.setState({username: '', password: ''})
			this.resetStack()
		} else if (this.state.checked === true) {
			getLocalStorage('loginPageData').then( (loginPageData) => {
				if (!isDefined(loginPageData)) {
					setLocalStorage('loginPageData', this.state).then(() => {
						this.resetStack()
					})
				}
			})
		}
	}

	handleExit = () => {
		BackHandler.exitApp()
	}

	render() {
		return (
			<Layout>
				<View style={{flex: 1, flexDirection: 'column', justifyContent: 'space-between'}}>
					<View style={styles.mainView}>
						<Text style={{color: '#fff'}}>HIDROINFORMACIONI SISTEM</Text>
						<Text style={{color: '#fff', fontSize: 18}}>ĐERDAP 2018</Text>
						<Image style={{resizeMode: 'contain', width: 100, height: 100}} source={require('../../assets/images/logo.png')} />
					</View>
					<View style={[styles.loginView, {}]}>
						<Text style={{color: '#fff', alignSelf: 'center', fontSize: 26}}>PRIJAVA</Text>
						<TextInput
							style={{borderWidth: 0.3, borderColor: '#fff', padding: 10, color: '#fff'}}
							placeholder="korisničko ime"
							placeholderTextColor={'#B3B3B3'}
							autoCapitalize="none"
							autoCorrect={false}
							value={this.state.username}
							onChangeText={(value) => {this.setState({ username: value })}}
						/>
						<TextInput
							style={{borderWidth: 0.3, borderColor: '#fff', padding: 10, color: '#fff'}}
							placeholder="lozinka"
							placeholderTextColor={'#B3B3B3'}
							autoCapitalize="none"
							autoCorrect={false}
							secureTextEntry={true}
							value={this.state.password}
							onChangeText={(value) => {this.setState({ password: value })}}
						/>
						<View style={styles.checkboxView}>
							<CheckBox
								checked={this.state.checked}
								onPress={() => this.setState({checked: !this.state.checked})}
							/>
							<Text style={{color: '#fff', marginLeft: 20}}>Zapamti korisnika</Text>
						</View>
						<View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
							<TouchableOpacity onPress={() => {this.handleLogin()}} style={styles.buttonContainer}>
								<Text style={{textAlign: 'center', fontSize: 12, color: '#fff', backgroundColor: 'rgba(0,0,0,0)'}}>PRIJAVA</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => {this.handleExit()}} style={styles.buttonContainer}>
								<Text style={{textAlign: 'center', fontSize: 12, color: '#fff', backgroundColor: 'rgba(0,0,0,0)'}}>ODUSTANI</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View style={styles.footerView}>
						<Image style={{resizeMode: 'contain', width: 30, height: 30}} source={require('../../assets/images/logoBottom.png')} />
						<Text style={{color: '#fff', alignSelf: 'center', fontSize: 9}}>Pristup alatu je zaštićen. Za privilegije, obratite se administratorima.</Text>
					</View>
				</View>
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
	const actions = { login }
	return bindActionCreators(actions, dispatch)
})(Login)
