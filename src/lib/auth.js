import api from './api'
import { setLocalStorage, getLocalStorage, removeItem} from './storage'

const auth = {
	/**
	 * Logs a user in, returning a promise with `true` when done
	 * @param { string } username The username of the user
	 * @param { string } password The password of the user
	 */
	login: async (username, password) => {
		const loggedIn = await auth.loggedIn()

		if (loggedIn) {
			return true
		}
		const res = await api.login(username, password)

		if (!res) {
			//store error
			return false
		}

		await setLocalStorage('token', res)
		return true
	},
	/**
	* Logs the current user out
	*/
	logout: async () => {
		await removeItem('token')
		//navTo.login
	},
	/**
	* Checks if a user is logged in
	*/
	loggedIn: async () => {
		return !!await getLocalStorage('token')
	}
	/**
	* Registers a user and then logs them in
	* @param { string } username The username of the user
	* @param { string } password The password of the user
	*/
	// register (data) {
	// 	return api.register(data)
	// 		.then((registeredPerson) => {
	// 			return auth.login(data.username, data.password)
	// 		})
	// },
	// onChange: () => {},
	// getUser: async () => {
	// 	const loggedIn = await auth.loggedIn()
	// 	const user = await getLocalStorage('user')
	// 	return loggedIn ? JSON.parse(user) : null
	// }
}

export default auth
