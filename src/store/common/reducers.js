import { SET_STORE_PROPERTY, SET_SCREEN_PROPERTY, SPINNER, SCREEN_VALUE, LEVELS, CHANGE_SETTINGS_PROP } from './constants'
import { getPreselectedPlant } from '../../lib/utils'

let initialState = {
	home1: {
		name: 'Home 1',
		sumPowerPlantLastHour: 0,
		infoPowerPlantLastHour: [],
		level_0: {previous: null, current: null},
		level_1: {previous: null, current: null},
		level_2: {previous: null, current: null},
		level_3: {previous: null, current: null},
		sumFlow1: 0,
		sumFlow2: 0,
		plannedProduction: 0,
		sumAgregatInProduction: [],
		totalAchivedProduction: 0,
		chartPowerPlants: [],
		levelChart2: [],
		levelChart3: [],
		levelsDailyValue: [],
		lastRefresh: null
	},
	home2: {
		name: 'Home 2',
		sumPowerPlantLastHour: 0,
		infoPowerPlantLastHour: [],
		level_0: {previous: null, current: null},
		level_1: {previous: null, current: null},
		level_2: {previous: null, current: null},
		level_3: {previous: null, current: null},
		sumFlow1: 0,
		sumFlow2: 0,
		plannedProduction: 0,
		sumAgregatInProduction: [],
		totalAchivedProduction: 0,
		chartPowerPlants: [],
		levelChart2: [],
		levelChart3: [],
		levelsDailyValue: [],
		lastRefresh: null
	},
	set1: {
		hourlySetsData: [],
		isActiveSetsData: [],
		dailySetsData: [],
		summaryProduction: 0,
		activePower_1: 0,
		activePower_2: 0,
		leakagePlantSRB: 0,
		leakagePlantROM: 0,
		summaryLeakage: 0,
		overflowDamLeakage: 0,
		hydroPlantLeakage: 0,
		leakageOverflowDamROM: 0,
		leakageOverflowDamSRB: 0,
		percentLeakeageOverflowDam: 0,
		percentLeakeageHydroPlant: 0
	},
	set2: {
		hourlySetsData: [],
		isActiveSetsData: [],
		dailySetsData: [],
		summaryProduction: 0,
		activePower_1: 0,
		activePower_2: 0,
		leakagePlantSRB: 0,
		leakagePlantROM: 0,
		summaryLeakage: 0,
		overflowDamLeakage: 0,
		hydroPlantLeakage: 0,
		leakageOverflowDamROM: 0,
		leakageOverflowDamSRB: 0,
		percentLeakeageOverflowDam: 0,
		percentLeakeageHydroPlant: 0
	},
	loading: false,
	screen: getPreselectedPlant(),
	sumFlow3: 0,
	flow_0: {previous: null, current: null, name: ''},
	flow_1: {previous: null, current: null, name: ''},
	flow_2: {previous: null, current: null, name: ''},
	flow_3: {previous: null, current: null, name: ''},
	previousLevels: null,
	levels: {},
	sumCurrentFlow: {previous: null, current: null},
	pickedValue: {},
	thirdChart: {},
	pieChart: {},
	secondChartFlow: {},
	secondChartFlowSum: {},
	settings: {
		notifications: [
			{id: 0, topics: ['NeraViolation'], label: 'Narušavanje ograničenja na profilu ušća Nere', checked: true, type: 'ALERTS'},
			{id: 1, topics: ['HEPSDj1Violation'], label: 'Narušavanje ograničenja na HEPS Đerdap 1', checked: false, type: 'ALERTS'},
			{id: 2, topics: ['HEPSDj2Violation'], label: 'Narušavanje ograničenja na HEPS Đerdap 2', checked: false, type: 'ALERTS'},
			{id: 3, topics: ['KladovoViolation'], label: 'Narušavanje ograničenja na profilu Kladovo', checked: false, type: 'ALERTS'},
			{id: 4, topics: ['100production'], label: 'Ostvarenost plana proizvodnje na HE Đerdap 1', checked: true, type: 'NOTIFICATIONS'},
			{id: 5, defaultValue: 50, value: 50, topics: ['20production', '40production', '50production','60production', '80production'], label: 'Plan proizvodnje na HE Đerdap 1 prevazilazi ', checked: false, type: 'NOTIFICATIONS'},
			{id: 6, defaultValue: 8000, value: 8000, topics: ['5000Inflow', '6000Inflow', '7000Inflow', '8000Inflow', '9000Inflow', '10000Inflow'], label: 'Dotok u akumulaciju Đerdap 1 prevazilazi vrednost ', checked: false, type: 'NOTIFICATIONS'},
			{id: 7, defaultValue: '69,10', value: '69,10', topics: ['NeraBelow'], label: 'Nivo na Neri', checked: false, type: 'NOTIFICATIONS'},
			{id: 8, topics: ['Overflow'], label: 'Početak i kraj prelivanja', checked: true, type: 'NOTIFICATIONS'}
		],
		autoRefresh: {
			selectedValue: 5,
			times: [
				{id: 0, label: '5 min', time: 5},
				{id: 1, label: '15 min', time: 15},
				{id: 2, label: '30 min', time: 30},
				{id: 3, label: '1 sat', time: 60},
				{id: 4, label: '3 sata', time: 180},
				{id: 5, label: '6 sati', time: 360},
				{id: 6, label: '12 sati', time: 720},
				{id: 7, label: '24 sata', time: 1440}
			]
		}
	},
	error: null,
	username: '',
	password: '',
	checked: false,
	autoRefreshTimer: null,
	sets: null
}

export default (state = initialState, action) => {
	switch (action.type) {
	case SET_STORE_PROPERTY:
		const { key, value } = action
		if (!key || !action) { return { ...state } }
		return { ...state, [key]: value}
	case SPINNER:
		return {...state, loading: action.flag}
	case SCREEN_VALUE:
		return {...state, screen: action.params}
	case LEVELS:
		const newLevels = {...state.levels}
		newLevels[action.key] = action.value
		return {...state, levels: newLevels }
	case CHANGE_SETTINGS_PROP:
		return {...state, settings: {
			...state.settings,
			[action.key]: action.value
		}}
	case SET_SCREEN_PROPERTY:
		return {...state, [action.screen]: {
			...state[action.screen],
			[action.key]: action.value
		}}
	default:
		return state
	}
}

// function _log(action, state) {
// 	if (!Config.DEBUGLOG) return
// 	let css = 'color: #DBC144'
// 	if (action.type.indexOf('_RESULT') >= 0) {
// 	  css = 'color: green'
// 	} else if (action.type.indexOf('_ERROR') >= 0) {
// 	  css = 'color: red'
// 	}
// 	console.log('>>>>>>> %c' + action.type + '  ---', css)
// 	console.log('params: ', action.params)
// 	console.log('state: ', state)
// 	console.log('------------')
// }
