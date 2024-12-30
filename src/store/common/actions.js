import {
	LOGIN,
	LOGOUT,
	SET_STORE_PROPERTY,
	GET_ACTIVE_POWER_DATA,
	SCREEN_VALUE,
	SPINNER,
	GET_LEVELS_DATA,
	GET_FLOWS_DATA,
	GET_SETS_DATA,
	GET_SETTINGS,
	CHANGE_SETTINGS,
	CHANGE_FIREBASE_SUBSCRIPTION,
	AUTO_REFRESH_TIMER,
	CHANGE_AUTO_REFRESH,
	SET_SCREEN_PROPERTY,
	GET_LEVELS_BY_ID
} from './constants'

export function login(username, password) {
	return {
		type: LOGIN,
		username,
		password
	}
}

export function logout() {
	return {
		type: LOGOUT
	}
}

export function setStoreProperty(key, value) {
	return {
		type: SET_STORE_PROPERTY,
		key, value
	}
}

export function getActivePowerData() {
	return {
		type: GET_ACTIVE_POWER_DATA
	}
}

export function getLevelsData() {
	return {
		type: GET_LEVELS_DATA
	}
}

export function getFlowsData() {
	return {
		type: GET_FLOWS_DATA
	}
}

export function getSetsData() {
	return {
		type: GET_SETS_DATA
	}
}

export function spinner(flag) {
	return {
		type: SPINNER,
		flag
	}
}

export function screenValue(params) {
	return {
		type: SCREEN_VALUE,
		params
	}
}

export function getSettings() {
	return {
		type: GET_SETTINGS
	}
}

export function changeSettings(key, value) {
	return {
		type: CHANGE_SETTINGS,
		key,
		value
	}
}

export function changeFirebaseSubscription(notification, oldNotification) {
	return {
		type: CHANGE_FIREBASE_SUBSCRIPTION,
		notification,
		oldNotification
	}
}

export function autoRefreshTimer() {
	return {
		type: AUTO_REFRESH_TIMER
	}
}

export function changeAutoRefresh(key, time) {
	return {
		type: CHANGE_AUTO_REFRESH,
		key,
		time
	}
}

export function setScreenProperty(screen, key, value) {
	return {
		type: SET_SCREEN_PROPERTY,
		screen,
		key,
		value
	}
}

export function getLevelsById(params) {
	return {
		type: GET_LEVELS_BY_ID,
		params
	}
}
