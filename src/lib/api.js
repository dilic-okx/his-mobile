import axios from 'axios'
import { setLocalStorage, getLocalStorage } from './storage'
// import { RotationGestureHandler } from 'react-native-gesture-handler'

const { log } = console

const endpoints = {
	// register: '/login/natural/register',
	login: '/HISDjerdap/MobileAPI/api/Account',
	home1: '/HISDjerdap/MobileAPI/api/Series/GetAllSeriesForHomeDjerdap1',
	home2: '/HISDjerdap/MobileAPI/api/Series/GetAllSeriesForHomeDjerdap2',
	plant1: '/HISDjerdap/MobileAPI/api/Series/GetAllSeriesForPlantDjerdap1',
	plant2: '/HISDjerdap/MobileAPI/api/Series/GetAllSeriesForPlantDjerdap2',
	level: '/HISDjerdap/MobileAPI/api/Series/GetSeriesDataForLevel',
	flow: '/HISDjerdap/MobileAPI/api/Series/GetSeriesDataForFlow',
	data: '/HISDjerdap/MobileAPI/api/Series/GetData/?id=',
	database: '/HISDjerdap/MobileAPI/api/SyncDatabase'
}
const baseApiURL = (()=> {
	try {
		const url = 'http://cloud.jcerni.co.rs:2445'
		return url
	} catch (e) {
		log('ReferenceError catched when running tests', e)
	}
})()

const createAxiosInstance = (token = null) => {
	const headers = !token ? {} : {
		Authorization: 'hissub ' + token
	}
	let instance = axios.create({
		headers,
		timeout: 30000,
		responseType: 'json'
	})
	instance.defaults.timeout = 30000
	return instance
}

// const getToken = () => {
// 	return localStorage.getItem('token')
// }

let axiosInstance = null
axiosInstance = createAxiosInstance()
getLocalStorage('token').then(res => {
	axiosInstance = createAxiosInstance(res)
})

const api = {
	login: (username, password) => {
		return axiosInstance.post(baseApiURL + endpoints.login, {
			username,
			password
		}).
			then(response => {
				const token = response.data
				return setLocalStorage('token', token).then(() => {
					axiosInstance = createAxiosInstance(token)
					return token
				}).catch((ee) => {
				})
			})
	},
	register: (data) => {
		return axiosInstance.post(baseApiURL + endpoints.register, {
			...data
		})
	},
	logout: () => {
		axiosInstance = createAxiosInstance()
	},
	homePlant1: () => {
		return axiosInstance.get(baseApiURL + endpoints.home1).then(response => {
			return response
		})
	},
	homePlant2: () => {
		return axiosInstance.get(baseApiURL + endpoints.home2).then(response => {
			return response
		})
	},
	plant1: () => {
		return axiosInstance.get(baseApiURL + endpoints.plant1).then(response => {
			return response
		})
	},
	plant2: () => {
		return axiosInstance.get(baseApiURL + endpoints.plant2).then(response => {
			return response
		})
	},
	level: (hourId = 27, dailyId = 123) => {
		return axiosInstance.get(baseApiURL + endpoints.level + '?idHour=' + hourId + '&idDay=' + dailyId).then(response => {
			return response
		})
	},
	flow: () => {
		return axiosInstance.get(baseApiURL + endpoints.flow).then(response => {
			return response
		})
	},
	powerPlants: (id) => {
		return axiosInstance.get(baseApiURL + endpoints.data + id).then(response => {
			return response
		})
	}
}

export default { ...api }
