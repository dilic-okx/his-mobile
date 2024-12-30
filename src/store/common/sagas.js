import {
	LOGIN,
	LOGOUT,
	GET_ACTIVE_POWER_DATA,
	GET_LEVELS_DATA,
	GET_FLOWS_DATA,
	GET_SETS_DATA,
	SET_STORE_PROPERTY,
	SET_SCREEN_PROPERTY,
	GET_SETTINGS,
	CHANGE_SETTINGS,
	CHANGE_SETTINGS_PROP,
	CHANGE_FIREBASE_SUBSCRIPTION,
	AUTO_REFRESH_TIMER,
	CHANGE_AUTO_REFRESH,
	GET_LEVELS_BY_ID } from './constants'
import { take, call, put, all, select } from 'redux-saga/effects'
import api from '../../lib/api'
import moment from '../../lib/moment'
import BigNumber from '../../lib/BigNumber'
import { sum, roundFlow, roundLevel, zero, formatNumber, roundNone } from '../../lib/calculations'
import {setLocalStorage, getLocalStorage } from '../../lib/storage'
import Firebase from 'react-native-firebase'
import { checkValue, isDefined, minDomain, maxDomain, findData } from '../../lib/utils'
import auth from '../../lib/auth'
import navService from '../../lib/nav-service'

const { log } = console
const numOfElements = 6
const storageTimeOut = 60 * 60 * 1000
let completeDataArr = null
const noData = -9999

export const config = {
	initRoutes: [
		'homePlant1','homePlant2', 'plant1', 'plant2', 'level', 'flow'
	],
	home1:
		{
			id: 1,
			label: 'home1',
			name: 'Đerdap 1',
			picker: [
				{
					label: 'Đerdap 1',
					name: 'home1'
				},
				{
					label: 'Đerdap 2',
					name: 'home2'
				}
			],
			preselected: true,
			numOfElements: 6,
			activePowerChunkSize: 6, //Define number of columns in row for Chart3
			flow1: [
				{
					name: 'sumFlow1'
				},
				{
					name: 'sumFlow2'
				}
			],
			level: [
				{
					label: 'Dotok:',
					items: [
						{
							label: 'level1',
							name: 'Pančevo',
							place: 'level_0'
						},
						{
							label: 'level1',
							name: 'Ušće Nere',
							place: 'level_1'
						}
					]
				},
				{
					label: 'Isticanje:',
					items: [
						{
							label: 'level1',
							name: 'NGV Đ1',
							place: 'level_2'
						},
						{
							label: 'level1',
							name: 'NDV Đ1',
							place: 'level_3'
						}
					]
				}
			],
			flowLabel: 'Dotok'
		},
	home2:
		{
			id: 2,
			label: 'home2',
			name: 'Đerdap 2',
			picker: [
				{
					label: 'Đerdap 1',
					name: 'home1'
				},
				{
					label: 'Đerdap 2',
					name: 'home2'
				}
			],
			preselected: false,
			numOfElements: 10,
			activePowerChunkSize: 5, //Define number of columns in row for Chart3
			flow1: [
				{
					name: 'sumFlow1'
				},
				{
					name: 'sumFlow2'
				}
			],
			level: [
				{
					label: 'Isticanje Đ1:',
					items: [
						{
							label: 'level2',
							name: 'Kladovo',
							place: 'level_0'
						},
						{
							label: 'level2',
							name: 'Kosno grlo',
							place: 'level_1'
						}
					]
				},
				{
					label: 'Isticanje Đ2:',
					items: [
						{
							label: 'level2',
							name: 'NGV Đ2',
							place: 'level_2'
						},
						{
							label: 'level2',
							name: 'NDV Đ2',
							place: 'level_3'
						}
					]
				}
			],
			flowLabel: 'Isticanje '
		},
	levels: [
		{
			name: 'Pančevo',
			apiIdHour: 27,
			apiIdDay: 123
		},
		{
			name: 'Ušće Nere',
			apiIdHour: 28,
			apiIdDay: 124
		},
		{
			name: 'Bazjaš',
			apiIdHour: 57,
			apiIdDay: 153
		},
		{
			name: 'Golubac',
			apiIdHour: 63,
			apiIdDay: 159
		},
		{
			name: 'Moldava',
			apiIdHour: 64,
			apiIdDay: 160
		},
		{
			name: 'Dobra',
			apiIdHour: 60,
			apiIdDay: 156
		},
		{
			name: 'Drenkova',
			apiIdHour: 61,
			apiIdDay: 157
		},
		{
			name: 'Donji Milanovac',
			apiIdHour: 56,
			apiIdDay: 152
		},
		{
			name: 'Svinjica',
			apiIdHour: 62,
			apiIdDay: 158
		},
		{
			name: 'Dubova',
			apiIdHour: 66,
			apiIdDay: 162
		},
		{
			name: 'Oršava',
			apiIdHour: 68,
			apiIdDay: 164
		},
		{
			name: 'NGV Đerdap 1',
			apiIdHour: 29,
			apiIdDay: 125
		},
		{
			name: 'NDV Đerdap 1',
			apiIdHour: 30,
			apiIdDay: 126
		},
		{
			name: 'NGV Portile de Fier 1',
			apiIdHour: 69,
			apiIdDay: 165
		},
		{
			name: 'NDV Portile de Fier 1',
			apiIdHour: 70,
			apiIdDay: 166
		},
		{
			name: 'Kladovo',
			apiIdHour: 52,
			apiIdDay: 148
		},
		{
			name: 'Turn Severin',
			apiIdHour: 58,
			apiIdDay: 154
		},
		{
			name: 'Slatina',
			apiIdHour: 65,
			apiIdDay: 161
		},
		{
			name: 'Brza Palanka',
			apiIdHour: 59,
			apiIdDay: 155
		},
		{
			name: 'NGV Gogoš',
			apiIdHour: 75,
			apiIdDay: 171
		},
		{
			name: 'NDV Gogoš',
			apiIdHour: 76,
			apiIdDay: 172
		},
		{
			name: 'NGV Đerdap 2 OE',
			apiIdHour: 54,
			apiIdDay: 150
		},
		{
			name: 'NDV Đerdap 2 OE',
			apiIdHour: 55,
			apiIdDay: 151
		},
		{
			name: 'NGV Đerdap 2 DE',
			apiIdHour: 71,
			apiIdDay: 167
		},
		{
			name: 'NDV Đerdap 2 DE',
			apiIdHour: 72,
			apiIdDay: 168
		},
		{
			name: 'NGV Portile de Fier 2',
			apiIdHour: 73,
			apiIdDay: 169
		},
		{
			name: 'NDV Portile de Fier 2',
			apiIdHour: 74,
			apiIdDay: 170
		},
		{
			name: 'Kosno grlo',
			apiIdHour: 53,
			apiIdDay: 149
		},
		{
			name: 'Pristol',
			apiIdHour: 67,
			apiIdDay: 163
		}
	],
	flows: {
		label: 'flows',
		numOfElements: 6,
		flow: [19, 20, 21, 22, 23, 24, 25, 26],
		pickedFlows: [
			{
				name: 'Dunav',
				label: 'flow_0',
				apiId: 19
			},
			{
				name: 'Sava',
				label: 'flow_1',
				apiId: 23
			},
			{
				name: 'Tisa',
				label: 'flow_2',
				apiId: 20
			},
			{
				name: 'V.Morava',
				label: 'flow_3',
				apiId: 24
			}
		], //ids must be picked from flows.flow
		secondPickedFlows: [
			{
				name: 'Male Pritoke',
				label: 'flow_4',
				apiId: [21, 22, 25, 26]
			}
		],
		flowDaily: [115, 116, 117, 118, 119, 120, 121, 122]
	},
	set1: {
		label: 'set1',
		powerPlantMainName: 'Hidroelektrana Đerdap 1',
		powerPlantName: 'Đerdap 1',
		secondPowerPlantName: 'Portile de Fier 1',
		labelHourly: 'Časovni podaci - HE Đerdap 1',
		secondLabelHourly: 'Časovni podaci - HE Portile de Fier 1',
		labelDaily: 'Dnevni podaci - HE Đerdap 1',
		secondLabelDaily: 'Dnevni podaci - HE Portile de Fier 1',
		preselected: true,
		activePower: [
			{
				name: 'Đerdap 1',
				powerPlant: 'activePower_1',
				powerPlantDaily: 'activePowerDaily',
				apiIdHour: [1, 2, 3, 4, 5, 6],
				apiIdDaily: [97, 98, 99, 100, 101, 102]
			},
			{
				name: 'Portile de Fier 1',
				powerPlant: 'activePower_2',
				powerPlantDaily: 'activePowerDaily',
				apiIdHour: [77, 78, 79, 80, 81, 82],
				apiIdDaily: [173, 174, 175, 176, 177, 178]
			}
		],
		flow: [
			{
				label: 'averagePowerPlantFlow',
				apiIdHour: [7, 8, 9, 10, 11, 12],
				apiIdDaily: [103, 104, 105, 106, 107, 108]
			},
			{
				label: 'averageSecondPowerPlantFlow',
				apiIdHour: [13, 14, 15, 16, 17, 18],
				apiIdDaily: [109, 110, 111, 112, 113, 114]
			}
		]
	},
	set2: {
		label: 'set2',
		powerPlantMainName: 'Hidroelektrana Đerdap 2',
		powerPlantName: 'Đerdap 2',
		secondPowerPlantName: 'Portile de Fier 2',
		labelHourly: 'Časovni podaci - HE Đerdap 2',
		secondLabelHourly: 'Časovni podaci - HE Portile de Fier 2',
		labelDaily: 'Dnevni podaci - HE Đerdap 2',
		secondLabelDaily: 'Dnevni podaci - HE Portile de Fier 2',
		preselected: false,
		activePower: [
			{
				name: 'Đerdap 2',
				powerPlant: 'activePower_1',
				apiIdHour: [32, 33, 34, 35, 36, 37, 38, 39, 40, 41],
				apiIdDaily: [128, 129, 130, 131, 132, 133, 134, 135, 136, 137]
			},
			{
				name: 'Portile de Fier 2',
				powerPlant: 'activePower_2',
				apiIdHour: [83, 84, 85, 86, 87, 88, 89, 90, 91, 92],
				apiIdDaily: [179, 180, 181, 182, 183, 184, 185, 186, 187, 188]
			}
		],
		flow: [
			{
				name: 'Đerdap 2',
				label: 'averagePowerPlantFlow',
				apiIdHour: [ 42, 43, 44, 45, 46, 47, 48, 49, 50, 51 ],
				apiIdDaily: [ 138, 139, 140, 141, 142, 143, 144, 145, 146, 147 ]
			},
			{
				label: 'averageSecondPowerPlantFlow'
			}
		]
	}
}

export const loginFlow = function* (action) {
	while (true) {
		const { username, password } = yield take ( LOGIN )
		yield put({type: SET_STORE_PROPERTY, key: 'loading', value: true })
		const loggedIn = yield call(auth.login, username, password)
		const state = yield select()
		if (loggedIn) {
			yield put({type: SET_STORE_PROPERTY, key: 'loading', value: true })
			yield put({type: GET_ACTIVE_POWER_DATA})
		}
	}
}

export const logoutFlow = function* (action) {
	while (true) {
		yield take ( LOGOUT )
		yield call(auth.logout)
		yield call(api.logout)
		navService.navigate('Login')
	}
}

export const getData = function* (action) {
	const state = yield select()

	completeDataArr = !state.common.allData ? yield all(config.initRoutes.map((i, index) => call(api[i]))) : state.common.allData
	if (!state.common.allData) {
		yield put({type: SET_STORE_PROPERTY, key: 'loading', value: true })
		yield put({type: SET_STORE_PROPERTY, key: 'allData', value: completeDataArr })
	}
}

export const levelChart = function* ({place , res, label}, screenNewParam) {
	const state = yield select()
	const screenParam = screenNewParam ? screenNewParam : state.common.screen
	let dataRes = res
	let levelChart1LastHour = formatNumber(new BigNumber(dataRes).toFixed(2))
	let now = moment()
	const storage = yield call(getLocalStorage, label)
	if (!isDefined(storage)) {
		yield call(setLocalStorage, label, {...storage,[place]: {previous: null, current: null, time: now }})
	} else if (isDefined(storage)) {
		if (!isDefined(storage[place])) {
			yield call(setLocalStorage, label, {...storage,[place]: {previous: null, current: null, time: now }})
		}
	}
	const storageLevel = yield call(getLocalStorage, label)

	if (storageLevel[place].current === null) {
		const value = {...state.common[screenParam][place], current: levelChart1LastHour}
		yield call(setLocalStorage, label, {...storageLevel, [place]: {previous: null, current: levelChart1LastHour, time: now }})
		yield put({type: SET_SCREEN_PROPERTY, screen: screenParam, key: place, value})
	}	else {
		if (now.diff(storageLevel[place].time) > storageTimeOut) {
			const value = {previous: storageLevel[place].current, current: levelChart1LastHour}
			yield call(setLocalStorage, label, {...storageLevel, [place]: {previous: storageLevel[place].current, current: levelChart1LastHour, time: now }} )
			yield put({type: SET_SCREEN_PROPERTY, screen: screenParam, key: place, value: {
				...state.common[screenParam][place], previous: value.previous, current: value.current }
			})
		} else {
			yield put({type: SET_SCREEN_PROPERTY, screen: screenParam, key: place, value: {
				...state.common[screenParam][place], previous: storageLevel[place].previous, current: storageLevel[place].current }
			})
		}
	}
}

export const sumFlow = function* (name , res, screenParam ) {
	const state = yield select()

	let sumFlowArr = new BigNumber(res)

	let sumCurrentRes = roundFlow(sumFlowArr).toNumber()
	yield put({type: SET_SCREEN_PROPERTY, screen: screenParam ? screenParam : state.common.screen, key: name, value: sumCurrentRes })
}

export const hourDataSets = function* (powerPlant, setsData, optionScreen) {
	const state = yield select()
	const screen = optionScreen ? optionScreen : state.common.screen

	let sumDailyValue = roundFlow(new BigNumber(setsData.SummaryProduction)).toNumber()

	let activePower_1 = roundFlow(new BigNumber(setsData.ProductionDjerdap)).toNumber()
	let activePower_2 = roundFlow(new BigNumber(setsData.ProductionPortileDeFier)).toNumber()

	yield put({type: SET_SCREEN_PROPERTY, screen: screen, key: 'summaryProduction', value: sumDailyValue })
	yield put({type: SET_SCREEN_PROPERTY, screen: screen, key: 'activePower_1', value: activePower_1 })
	yield put({type: SET_SCREEN_PROPERTY, screen: screen, key: 'activePower_2', value: activePower_2 })
	///////////////////////////////// Domain Min and Max - Start here ////////////////////////////////
	let minRes = null
	let maxRes = null
	let chartSeriesData= null
	if (powerPlant === 'activePower_1') {
		minRes = new BigNumber(setsData.Charts[0].chartMin)
		maxRes = new BigNumber(setsData.Charts[0].chartMax)
		chartSeriesData = setsData.Charts[0].chartSeries[1].Data
	} else if (powerPlant === 'activePower_2'){
		minRes = new BigNumber(setsData.Charts[1].chartMin)
		maxRes = new BigNumber(setsData.Charts[1].chartMax)
		chartSeriesData = setsData.Charts[1].chartSeries[1].Data
	}

	let domainRes = { min: roundNone(minRes).toNumber(), max: roundNone(maxRes).toNumber()}
	///////////////////////////////// Domain Min and Max - Start here ////////////////////////////////
	///////////////////////////////// Last Six Hour - Start here ////////////////////////////////
	let newData = chartSeriesData.map((data, index) => {
		return {
			time: data.LocalDateTime,
			value: data.DataValue === noData ? null : roundFlow(new BigNumber(data.DataValue))
		}
	})

	let sumActive = Object.keys(newData).map((key) => { //for chart 1
		return {
			domainBar: domainRes,
			_time: newData[key].time,
			time: moment(newData[key].time).format('HH:mm'),
			_mwh: newData[key].value,
			mwh: newData[key].value === null ? null : newData[key].value.toNumber()
		}
	})
	return sumActive
	///////////////////////////////// Last Six Hour - End here ////////////////////////////////
}

export const dailyDataSets = function (powerPlant, apiIdDaily, setsData) {
	let data = null
	if (powerPlant === 'activePower_1') {
		data = setsData.Charts[2]
	} else if (powerPlant === 'activePower_2') {
		data = setsData.Charts[3]
	}
	let dataCharts = data.chartSeries[1].Data

	const domainDailyRes = { min: roundNone(new BigNumber(data.chartMin)).toNumber(), max: roundNone(new BigNumber(data.chartMax)).toNumber()}
	let dataChartsRes = dataCharts.map((data, index) => {
		return {
			time: data.LocalDateTime,
			value: data.DataValue === noData ? null : roundFlow(new BigNumber(data.DataValue))
		}
	})
	let sumActiveDaily = Array(apiIdDaily.length).fill({})
	sumActiveDaily = Object.keys(dataChartsRes).map((key) => { //for chart 1
		return {
			domainBar: domainDailyRes,
			_time: dataChartsRes[key].time,
			time: moment(dataChartsRes[key].time).format('ddd.[\n] DD.MM.'),
			_mwh: dataChartsRes[key].value,
			mwh: dataChartsRes[key].value.toNumber()
		}
	})
	return sumActiveDaily
}

export const averageHourlyValuesSets = function* (label, apiIdHour, setsData, optionScreen) {
	const state = yield select()
	const screen = optionScreen ? optionScreen : state.common.screen
	if (apiIdHour) {
		yield put({type: SET_SCREEN_PROPERTY, screen: screen, key: 'summaryLeakage', value: roundNone(new BigNumber(setsData.SummaryLeakage)).toNumber()})
		yield put({type: SET_SCREEN_PROPERTY, screen: screen, key: 'hydroPlantLeakage', value: roundNone(new BigNumber(setsData.HydroPlantLeakage)).toNumber()})
		yield put({type: SET_SCREEN_PROPERTY, screen: screen, key: 'leakagePlantSRB', value: roundNone(new BigNumber(setsData.LeakagePlantSRB)).toNumber()})
		yield put({type: SET_SCREEN_PROPERTY, screen: screen, key: 'leakagePlantROM', value: roundNone(new BigNumber(setsData.LeakagePlantROM)).toNumber()})
		yield put({type: SET_SCREEN_PROPERTY, screen: screen, key: 'overflowDamLeakage', value: roundNone(new BigNumber(setsData.OverflowDamLeakage)).toNumber()})
		yield put({type: SET_SCREEN_PROPERTY, screen: screen, key: 'leakageOverflowDamROM', value: roundNone(new BigNumber(setsData.LeakageOverflowDamROM)).toNumber()})
		yield put({type: SET_SCREEN_PROPERTY, screen: screen, key: 'leakageOverflowDamSRB', value: roundNone(new BigNumber(setsData.LeakageOverflowDamSRB)).toNumber()})

		let flowData = label === 'averagePowerPlantFlow' ? setsData.Charts[0] : setsData.Charts[1]
		let flowDataCharts = flowData.chartSeries[0].Data
		const domainAverageRes = { min: roundNone(new BigNumber(flowData.secondaryChartMin)).toNumber(), max: roundNone(new BigNumber(flowData.secondaryChartMax)).toNumber()}

		let levelData = flowDataCharts.map((data, index) => {
			return {
				_level: data.DataValue === noData ? null : new BigNumber(data.DataValue)
			}
		})

		let sumActive = Array(numOfElements).fill({})

		sumActive = Object.keys(levelData).map((key) => {
			return {
				domainLine: domainAverageRes,
				_level: levelData[key]._level,
				level: levelData[key]._level === null ? null : roundFlow(levelData[key]._level).toNumber()
			}
		})
		return sumActive
	}
}

export const averageDailyValuesSets = function (label, apiIdHour, apiIdDaily, setsData, setsData1, optionScreen) {
	let data = null
	if (label === 'averagePowerPlantFlow') {
		data = setsData1.Charts[2]
	} else if (label === 'averageSecondPowerPlantFlow') {
		data = setsData1.Charts[3]
	}
	let dataCharts = data.chartSeries[0].Data
	if (apiIdDaily) {
		const domainAverageDailyRes = { min: roundNone(new BigNumber(data.secondaryChartMin)).toNumber(), max: roundNone(new BigNumber(data.secondaryChartMax)).toNumber()}
		let flowData = dataCharts.map((data, index) => {
			return {
				_level: new BigNumber(data.DataValue)
			}
		})

		let sumActive = Array(numOfElements).fill({})
		sumActive = Object.keys(flowData).map((key) => {
			return {
				domainLine: domainAverageDailyRes,
				_level: flowData[key]._level,
				level: flowData[key]._level === noData ? null : roundFlow(flowData[key]._level).toNumber()
			}
		})
		return sumActive
	}
}

export const isActiveSets = function* (apiIdHour, powerPlant, setsData, optionScreen) {
	const state = yield select()

	let isActiveDataNew = null
	if (powerPlant === 'activePower_1') {
		isActiveDataNew = setsData.AggregatesWorkDjerdap
	} else if (powerPlant === 'activePower_2') {
		isActiveDataNew = setsData.AggregatesWorkPortile
	}
	let orgData = isActiveDataNew.map((data, index) => {
		return data.map((ind, j) => {
			return {
				x: moment(ind.time).format('HH:mm'),
				y: 1,
				_y: ind.work,
				label: ind.name
			}
		})
	})
	return orgData
}

export const powerPlantsDataAction = function* (options) {
	yield put({type: SET_STORE_PROPERTY, key: 'loading', value: options.screen ? options.loading : true })
	const state = yield select()
	let data = {}
	let data1 = {}
	Object.keys(config).forEach((key, index) => {
		if (options.screen) {
			if (key === options.screen) {
				data = config[key]
			}
		} else {
			if (key === state.common.screen) {
				data = config[key]
			}
		}
	})
	let screen = options.screen ? options.screen : state.common.screen
	if (screen === 'home1') {
		data1 = state.common.allData[0].data
	} else if (screen === 'home2'){

		data1 = state.common.allData[1].data
	}
	BigNumber.set({FORMAT: data1.format})

	///////// Sum Active Power Power Plants 1 Last hour - Start here ///////
	let total1 = new BigNumber(data1.CurrentPower)
	let total = roundFlow(total1).toNumber()
	yield put({type: SET_SCREEN_PROPERTY, screen: screen, key: 'sumPowerPlantLastHour', value: total })
	yield put({type: SET_STORE_PROPERTY, key: '_sumPowerPlantLastHour', value: total1 })
	/////////Sum Active Power - Power Plants 1 Last hour - End here ////////

	///////// Active Info Power Plants 1 Last hour - Start here ////////
	yield put({type: SET_SCREEN_PROPERTY, screen: screen, key: 'infoPowerPlantLastHour', value: data1.AggregatesWork })
	///////// Active Info Power Plants 1 Last hour - End here ////////

	///////// Levels Chart1 - Start here////////
	let levelArr = []
	let newRes = []
	if (screen === 'home1') {
		newRes = [
			{res: data1.Pancevo},
			{res: data1.NeraConfluence},
			{res: data1.NGV},
			{res: data1.NDV}
		]
	} else if (screen === 'home2') {
		newRes = [
			{res: data1.Kladovo},
			{res: data1.KosnoGrlo},
			{res: data1.NGV},
			{res: data1.NDV}
		]
	}
	yield all(data.level.map((dataPlace) =>
		dataPlace.items.map((data) => {
			levelArr.push({...data})
		})
	))
	let newLevelArr = levelArr.map((data, index) => {
		return Object.keys(newRes[index]).map((key) => {
			return {
				label: data.label,
				place: data.place,
				name: data.name,
				res: newRes[index][key]
			}
		})
	})
	for (let i = 0; i < newLevelArr.length; i++) {
		const dataPlace = newLevelArr[i][0]
		yield call(levelChart, dataPlace, options.screen)
	}
	///////// Levels Chart1 - End here////////

	///////// Sum Flow Chart 1 last hour- Start here ////////
	let newFlow = [
		{name: 'sumFlow1', res: data1.Inflow},
		{name: 'sumFlow2', res: data1.Leakage}
	]
	yield all(newFlow.map((flow) =>
		call(sumFlow, flow.name, flow.res, options.screen)
	))
	///////// Sum Flow Chart 1 last hour- End here ////////

	///////// Planned production Power Plants - Start here - Fix data/////////
	let plannedProduction = roundNone(new BigNumber(data1.PlanProduction)).toNumber()
	yield put({type: SET_SCREEN_PROPERTY, screen: screen, key: 'plannedProduction', value: plannedProduction })
	///////// Planned production Power Plants - End here/////////
	///////// Sum Active Power Last 6 hours Power Plants - Start here /////////
	let productionArr = data1.Charts[1].chartSeries[1].Data
	let productionMin = new BigNumber(data1.Charts[1].chartMin)
	let productionMax = new BigNumber(data1.Charts[1].chartMax)
	const domainActiveRes = { min: roundNone(productionMin).toNumber(), max: roundNone(productionMax).toNumber()}

	let sumActive = Array(data.numOfElements).fill({})
	let sumActiveAgr = {}
	sumActive.forEach((_, i) => {
		productionArr.forEach((element, index, array) => {
			if (!sumActiveAgr[index]) {
				sumActiveAgr[index] = {
					time: null, value: 0
				}

				sumActiveAgr[index].value += element.DataValue
				if (!sumActiveAgr[index].time){
					sumActiveAgr[index].time = element.LocalDateTime
				}
			}
		})
	})
	sumActive = Object.keys(sumActiveAgr).map((key) => { //for chart 1
		return {
			_time: sumActiveAgr[key].time,
			time: moment(sumActiveAgr[key].time).format('HH:mm'),
			_mwh: roundFlow(new BigNumber(sumActiveAgr[key].value)),
			mwh: sumActiveAgr[key].value === noData ? null : roundFlow(new BigNumber(sumActiveAgr[key].value)).toNumber()
		}
	})
	/////////Sum Active Power Last 6 hours Power Plants - End here /////////
	/////////Sum Active Power From 06:00 hours Power Plants - Start here /////////
	let _sumAll = new BigNumber(data1.SummaryProduction)
	let sumAll = roundFlow(_sumAll).toNumber()
	yield put({type: SET_SCREEN_PROPERTY, screen: screen, key: 'sumAgregatInProduction', value: data1.PercentsByAggregate })
	yield put({type: SET_SCREEN_PROPERTY, screen: screen, key: 'totalAchivedProduction', value: sumAll })
	/////////Sum Active Power From 06:00 6 hours Power Plants - End here /////////
	///////// Chart 1 Flows Power Plants Last 6 hours- Start here /////////

	let flowArr = data1.Charts[1].chartSeries[0].Data
	let flowMin = new BigNumber(data1.Charts[1].secondaryChartMin)
	let flowMax = new BigNumber(data1.Charts[1].secondaryChartMax)
	let domainFlowRes = { min: roundNone(flowMin).toNumber(), max: roundNone(flowMax).toNumber()} // treba da se ubaci min i max iz json fajla kada ubace
	let sumAverage = Array(data.numOfElements).fill({})
	let sumFlowAgr = {}
	sumAverage.forEach((_, i) => {
		flowArr.forEach((element, index, array) => {
			if (index > array.length - 7) {
				if (!sumFlowAgr[index]){
					sumFlowAgr[index] = {
						level: 0
					}
				}
				sumFlowAgr[index].level = element.DataValue
			}
		})
	})
	sumAverage = Object.keys(sumFlowAgr).map((key) => {
		return {
			_level: roundFlow(new BigNumber(sumFlowAgr[key].level)),
			level: sumFlowAgr[key].level === noData ? null : roundFlow(new BigNumber(sumFlowAgr[key].level)).toNumber()
		}
	})
	let newMergedSum = sumActive.map((i, index)	=> ( {
		domainBar: domainActiveRes,
		domainLine: domainFlowRes,
		...i,
		...sumAverage[index]
	}))
	yield put({type: SET_SCREEN_PROPERTY, screen: screen, key: 'chartPowerPlants', value: newMergedSum })
	///////// Chart 1 Flows Power Plants Last 6 hours - End here /////////

	/////// Chart 2 Levels Last 6 hours - Start here /////////
	let neraChart = data1.Charts[0]

	let neraMin = new BigNumber(data1.Charts[0].chartMin)
	let neraMax = new BigNumber(data1.Charts[0].chartMax)
	const domainLevelsRes = { min: roundLevel(neraMin).toNumber(), max: roundLevel(neraMax).toNumber()}

	let arrLastSix = neraChart.chartSeries.map((data) => {
		return data.Data
	})

	let lastSixHour = Array(data.numOfElements).fill({})
	let lastSixAgr = {}
	lastSixHour.forEach((_, i) => {
		arrLastSix[0].map((element, index, array) => {
			if (!lastSixAgr[index]){
				lastSixAgr[index] = {
					time: null, level: zero()
				}

				lastSixAgr[index].level = element.DataValue
				if (!lastSixAgr[index].time){
					lastSixAgr[index].time = element.LocalDateTime
				}
			}
		})
	})

	lastSixHour = Object.keys(lastSixAgr).map((key) => {
		return {
			domain: domainLevelsRes,
			_time: lastSixAgr[key].time,
			time: moment(lastSixAgr[key].time).format('HH:mm'),
			_level: roundLevel(new BigNumber(lastSixAgr[key].level)),
			level: lastSixAgr[key].level === noData ? null : roundLevel(new BigNumber(lastSixAgr[key].level)).toNumber(),
			label: formatNumber(roundLevel(new BigNumber(lastSixAgr[key].level)).toFixed(2))
		}
	})
	yield put({type: SET_SCREEN_PROPERTY, screen: screen, key: 'levelChart2', value: lastSixHour })
	///////// Chart 2 Levels Last 6 hours - End here /////////

	/////// Chart 3 Levels Last 6 hours - Start here /////////
	let upperWatersChart = data1.Charts[2]

	let upperWatersMin = new BigNumber(data1.Charts[2].chartMin)
	let upperWatersMax = new BigNumber(data1.Charts[2].chartMax)

	const domainUpperWaters = { min: roundLevel(upperWatersMin).toNumber(), max: roundLevel(upperWatersMax).toNumber()}
	let arrLastSixUpperWaters = upperWatersChart.chartSeries.map((data) => {
		return data.Data
	})

	let lastSixHourUpperWaters = Array(data.numOfElements).fill({})
	let lastSixAgrUpperWaters = {}
	lastSixHourUpperWaters.forEach((_, i) => {
		arrLastSixUpperWaters[0].map((element, index, array) => {
			if (!lastSixAgrUpperWaters[index]){
				lastSixAgrUpperWaters[index] = {
					time: null, level: zero()
				}

				lastSixAgrUpperWaters[index].level = element.DataValue
				if (!lastSixAgrUpperWaters[index].time){
					lastSixAgrUpperWaters[index].time = element.LocalDateTime
				}
			}
		})
	})

	lastSixHourUpperWaters = Object.keys(lastSixAgrUpperWaters).map((key) => {
		return {
			domain: domainUpperWaters,
			_time: lastSixAgrUpperWaters[key].time,
			time: moment(lastSixAgrUpperWaters[key].time).format('HH:mm'),
			_level: roundLevel(new BigNumber(lastSixAgrUpperWaters[key].level)),
			level: lastSixAgrUpperWaters[key].level === noData ? null : roundLevel(new BigNumber(lastSixAgrUpperWaters[key].level)).toNumber(),
			label: formatNumber(roundLevel(new BigNumber(lastSixAgrUpperWaters[key].level)).toFixed(2))
		}
	})
	yield put({type: SET_SCREEN_PROPERTY, screen: screen, key: 'levelChart3', value: lastSixHourUpperWaters })
	///////// Chart 3 Levels Last 6 hours - End here /////////

	/////////Levels min, max, avg From 06:00 hours - Start here /////////
	let levelsDailyValue = {}
	if (screen === 'home1') {
		levelsDailyValue = {
			min: new BigNumber(data1.MinLevelNera).toFixed(2),
			sr: new BigNumber(data1.AvgLevelNera).toFixed(2),
			max: new BigNumber(data1.MaxLevelNera).toFixed(2)
		}
	} else if (screen === 'home2') {
		levelsDailyValue = {
			min: new BigNumber(data1.MinLevelKladovo).toFixed(2),
			sr: new BigNumber(data1.AvgLevelKladovo).toFixed(2),
			max: new BigNumber(data1.MaxLevelKladovo).toFixed(2)
		}
	}
	yield put({type: SET_SCREEN_PROPERTY, screen: screen, key: 'levelsDailyValue', value: levelsDailyValue })
	/////////Levels min, max, avg  From 06:00 hours Power Plants - End here /////////

	let refreshDate = moment().format('DD/MM HH:mm')
	yield put({type: SET_SCREEN_PROPERTY, screen: screen, key: 'lastRefresh', value: refreshDate })
	navService.navigate('Home')
	yield put({type: SET_STORE_PROPERTY, key: 'loading', value: false })
}

export const powerPlantsData = function* () {
	while (true) {
		const action = yield take (GET_ACTIVE_POWER_DATA)
		yield call (getData)
		yield call (powerPlantsDataAction, action)
	}
}

export const levelsData = function* () {
	while (true) {
		const action = yield take (GET_LEVELS_DATA)
		yield call (levelsDataAction, action)
	}
}

export const levelsDataAction = function* (options) {
	yield put({type: SET_STORE_PROPERTY, key: 'loading', value: options.screen ? options.loading : true })
	const state = yield select()
	let data = {}
	let data1 = options.data ? options.data : state.common.allData[4].data
	Object.keys(config).forEach((key, index) => {
		if (options.screen) {
			if (key === options.screen) {
				data = config[key]
			}
		} else {
			if (key === state.common.screen) {
				data = config[key]
			}
		}
	})
	BigNumber.set({FORMAT: data1.format})

	let currentValue = data1.CurrentValue.toFixed(2)
	let oneHourChart = data1.Charts[0].chartSeries[0].Data
	let dailyChart = data1.Charts[1].chartSeries[0].Data
	let domainLevelsHourRes = {
		min: roundLevel(new BigNumber(data1.Charts[0].chartMin)).toNumber(),
		max: roundLevel(new BigNumber(data1.Charts[0].chartMax)).toNumber()
	}

	let domainLevelsDayRes = {
		min: roundLevel(new BigNumber(data1.Charts[1].chartMin)).toNumber(),
		max: roundLevel(new BigNumber(data1.Charts[1].chartMax)).toNumber()
	}

	let minData = data1.Charts[1].chartSeries[1].Data

	let middleData = data1.Charts[1].chartSeries[0].Data
	let maxData = data1.Charts[1].chartSeries[2].Data

	let chartData = Array(6).fill({})

	let newData = chartData.map((data, index) => {
		return {
			x: moment(minData[index].LocalDateTime).format('ddd.[\n] DD.MM.'),
			min: formatNumber(new BigNumber(minData[index].DataValue).toFixed(2)),
			median: formatNumber(new BigNumber(middleData[index].DataValue).toFixed(2)),
			max: formatNumber(new BigNumber(maxData[index].DataValue).toFixed(2)),
			y: [roundLevel(new BigNumber(minData[index].DataValue)).toNumber(),roundLevel(new BigNumber(middleData[index].DataValue)).toNumber(),roundLevel(new BigNumber(maxData[index].DataValue)).toNumber()],
			domain: domainLevelsDayRes
			// labels: [formatNumber(new BigNumber(minData[index].DataValue).toFixed(2)), formatNumber(new BigNumber(middleData[index].DataValue).toFixed(2)), formatNumber(new BigNumber(maxData[index].DataValue).toFixed(2))]
		}
	})
	let levelArr = {
		name: options.name ? options.name : config.levels[0].name,
		oneHourData: currentValue,
		sixHourData: oneHourChart.map((data) => ({domain: domainLevelsHourRes, level: data.DataValue === noData ? null : new BigNumber(data.DataValue), label: formatNumber(new BigNumber(data.DataValue).toFixed(2)), time: moment(data.LocalDateTime).format('HH:mm')})),
		sixDayData: newData
	}
	let resObjNew = 	{
		[levelArr.name]: levelArr
	}
	let previousLevelsObjNew =
	{
		[levelArr.name]: 0
	}
	const levelStorage = yield call(getLocalStorage, levelArr.name)
	let now = moment()

	if (!isDefined(levelStorage)) {
		yield call (setLocalStorage, levelArr.name, {previous: null, current: null, time: now})
	}

	const checkLevelStorage = yield call(getLocalStorage, levelArr.name)
	if (checkLevelStorage.previous === null) {
		yield call (setLocalStorage, levelArr.name, {previous: previousLevelsObjNew[levelArr.name], current: resObjNew[levelArr.name].oneHourData, time: now})
		yield put({type: SET_STORE_PROPERTY, key: 'previousLevels', value: previousLevelsObjNew[levelArr.name]})
		yield put({type: SET_STORE_PROPERTY, key: 'levels', value: resObjNew })
	} else {
		if (now.diff(checkLevelStorage.time) > storageTimeOut) {
			yield call (setLocalStorage, levelArr.name, {previous: checkLevelStorage.current, current: resObjNew[levelArr.name].oneHourData, time: now})
			yield put({type: SET_STORE_PROPERTY, key: 'previousLevels', value: checkLevelStorage.current})
			yield put({type: SET_STORE_PROPERTY, key: 'levels', value: resObjNew})
		} else {
			yield put({type: SET_STORE_PROPERTY, key: 'previousLevels', value: checkLevelStorage.previous})
			yield put({type: SET_STORE_PROPERTY, key: 'levels', value: resObjNew})
		}
	}
	yield put({type: SET_STORE_PROPERTY, key: 'loading', value: false })
}

export const flowsDataAction = function* (options) {
	yield put({type: SET_STORE_PROPERTY, key: 'loading', value: options.screen ? options.loading : true })
	const state = yield select()
	let flowData = state.common.allData[5]
	BigNumber.set({FORMAT: flowData.data.format})
	///////////////////Sum Flows - Start Here ///////////////////////////////////////
	let _sumCurrent = new BigNumber(flowData.data.TotalFlow)

	let sumCurrentRes = roundFlow(_sumCurrent).toNumber()
	const storageFlow = yield call(getLocalStorage, 'sumCurrentFlows')
	let now = moment()
	if (!isDefined(storageFlow)) {
		yield call(setLocalStorage, 'sumCurrentFlows', {previous: null, current: null, time: now})
	}

	const checkstorageFlow = yield call(getLocalStorage, 'sumCurrentFlows')
	if (checkstorageFlow.current === null) {
		yield call(setLocalStorage, 'sumCurrentFlows', {previous: null, current: sumCurrentRes, time: now})
		yield put({type: SET_STORE_PROPERTY, key: 'sumCurrentFlow', value: {...state.common.sumCurrentFlow, current: sumCurrentRes} })
	} else {
		if (now.diff(checkstorageFlow.time) > storageTimeOut) {
			yield call(setLocalStorage, 'sumCurrentFlows', {previous: storageFlow.current, current: sumCurrentRes, time: now})
			yield put({type: SET_STORE_PROPERTY, key: 'sumCurrentFlow', value: {
				...state.common.sumCurrentFlow, previous: storageFlow.current, current: sumCurrentRes }
			})
		} else {
			yield put({type: SET_STORE_PROPERTY, key: 'sumCurrentFlow', value: {
				...state.common.sumCurrentFlow, previous: checkstorageFlow.previous, current: checkstorageFlow.current }
			})
		}
	}

	///////////////////Sum Flows - End Here ///////////////////////////////////////

	///////////////////Picked Flows - Start Here ///////////////////////////////////////
	const pickedFlowsRes = [
		{CurrentValueDunav: flowData.data.CurrentValueDunav},
		{CurrentValueSava: flowData.data.CurrentValueSava},
		{CurrentValueTisa: flowData.data.CurrentValueTisa},
		{CurrentValueMorava: flowData.data.CurrentValueMorava}
	]
	const flowResNew = config.flows.pickedFlows.map((data, ind) => {
		return Object.keys(pickedFlowsRes[ind]).map((key) => {
			return {
				dataValue: roundFlow(new BigNumber(pickedFlowsRes[ind][key])).toNumber(),
				...data
			}
		})
	})
	for (let index = 0; index < flowResNew.length; index++) {
		for (let ind = 0; ind < flowResNew[index].length; ind++) {
			const element = flowResNew[index][ind]
			let storage = yield call(getLocalStorage, element.label)
			let now = moment()
			if (!isDefined(storage)) {
				yield call(setLocalStorage, element.label, {previous: null, current: null, time: now } )
			}
			let storageFlow = yield call(getLocalStorage, element.label)
			if (storageFlow.current === null) {
				const value = {...state.common[element.label], previous: null, current: element.dataValue, name: element.name}
				yield call(setLocalStorage, element.label, {previous: null, current: element.dataValue, time: now })
				yield put({type: SET_STORE_PROPERTY, key: element.label, value})
			} else {
				if (now.diff(storageFlow.time) > storageTimeOut) {
					const value = {...state.common[element.label], previous: storageFlow.current, current: element.dataValue, name: element.name }
					yield call(setLocalStorage, element.label, {previous: storageFlow.current, current: element.dataValue, time: now})
					yield put({type: SET_STORE_PROPERTY, key: element.label, value})
				} else {
					const value = {...state.common[element.label], previous: storageFlow.previous, current: storageFlow.current, name: element.name }
					yield put({type: SET_STORE_PROPERTY, key: element.label, value})
				}
			}
		}
	}
	///////////////////Picked Flows - End Here ///////////////////////////////////////
	///////////////////Pie Chart - Start Here ///////////////////////////////////////
	let pieFlowRes = [
		{ dataValue: roundLevel(new BigNumber(flowData.data.PercentOfParticipationDunav)).toNumber()},
		{ dataValue: roundLevel(new BigNumber(flowData.data.PercentOfParticipationSava)).toNumber()},
		{ dataValue: roundLevel(new BigNumber(flowData.data.PercentOfParticipationTisa)).toNumber()},
		{ dataValue: roundLevel(new BigNumber(flowData.data.PercentOfParticipationMorava)).toNumber()}
	]
	let pieRest = config.flows.secondPickedFlows.map((data) => {
		return {
			name: data.name,
			dataValue: roundLevel(new BigNumber(flowData.data.PercentOfParticipationRest)).toNumber()
		}
	})

	let pieFlowResNew = pieFlowRes.map((data, index) => {
		return {
			...config.flows.pickedFlows[index],
			...data
		}
	})
	pieFlowResNew.splice(1, 0, pieRest[0])

	let pieChartResNew = pieFlowResNew.map((data, index) => {
		return {
			dataValue: roundLevel(new BigNumber(data.dataValue)).toFormat(),
			name: data.name,
			x: data.name + ' ' + roundLevel(new BigNumber(data.dataValue)).toFormat() + '%',
			y: data.dataValue
		}
	})
	yield put({type: SET_STORE_PROPERTY, key: 'pieChart', value: pieChartResNew})
	///////////////////Pie Chart - End Here ///////////////////////////////////////

	/////////////////////////Second Chart - Start here //////////////////////////////////
	// let sumResNew = flowData.data.SumPerHours.Data
	let secondChartsData = flowData.data.Charts[0]
	let secondChartSeriesData = secondChartsData.chartSeries

	let domainFlowRes = { min: roundNone(new BigNumber(secondChartsData.chartMin)).toNumber(), max: roundNone(new BigNumber(secondChartsData.chartMax)).toNumber()}

	let secondFlowAgr = secondChartSeriesData.map((data, index) => {
		return data.Data.map((i, y) => {
			return {
				_x: i.LocalDateTime,
				_y: checkValue(i.DataValue) > 0 ? new BigNumber(i.DataValue) : zero()
			}

		})
	})

	// let sumRes = sumResNew.map((data, index) => {
	// 	return {
	// 		domain: domainFlowRes,
	// 		_y: new BigNumber(data.DataValue),
	// 		y: roundFlow(new BigNumber(data.DataValue)).toNumber()
	// 	}
	// })

	let secondRes = secondFlowAgr.map((data, index) => {
		return data.map((ind) => {
			return {
				domain: domainFlowRes,
				...ind,
				x: moment(ind._x).format('HH:mm'),
				y: roundFlow(ind._y).toNumber()
			}
		})
	})
	// yield put({type: SET_STORE_PROPERTY, key: 'secondChartFlowSum', value: sumRes})
	yield put({type: SET_STORE_PROPERTY, key: 'secondChartFlow', value: secondRes})
	/////////////////////////Second Chart - End here //////////////////////////////////

	/////////////////////////Third Chart - Start here //////////////////////////////////
	let thirdChartsData = flowData.data.Charts[0]
	let thirdChartsSeriesData = thirdChartsData.chartSeries[0].Data

	let thirdFlowRes = thirdChartsSeriesData.map((data, index) => {
		return {
			_level: data.DataValue === noData ? null : new BigNumber(data.DataValue),
			time: moment(data.LocalDateTime).format('ddd.[\n] DD.MM.')
		}
	})
	let domainFlowDailyRes = { min: roundNone(new BigNumber(thirdChartsData.chartMin)).toNumber(), max: roundNone(new BigNumber(thirdChartsData.chartMax)).toNumber()}
	thirdFlowRes = thirdFlowRes.map(i => ({...i,domain: domainFlowDailyRes, level: i._level === null ? null : roundFlow(i._level).toNumber(), label: formatNumber(roundFlow(i._level))}))

	yield put({type: SET_STORE_PROPERTY, key: 'thirdChart', value: thirdFlowRes})
	/////////////////////////Third Chart - End here //////////////////////////////////

	yield put({type: SET_STORE_PROPERTY, key: 'loading', value: false })
}

export const flowsData = function* () {
	while (true) {
		const action = yield take (GET_FLOWS_DATA)
		yield call (flowsDataAction, action)
	}
}

export const setsDataAction = function* (options) {
	yield put({type: SET_STORE_PROPERTY, key: 'loading', value: options.screen ? options.loading : true })
	const state = yield select()
	const screen = options.screen ? options.screen : state.common.screen
	let dataConfig = {}
	let data = {}
	if (screen === 'set1') {
		data = state.common.allData[2].data
	} else if (screen === 'set2'){
		data = state.common.allData[3].data
	}

	const setsData = data
	BigNumber.set({FORMAT: setsData.format})
	Object.keys(config).forEach((key, index) => {
		if (options.screen) {
			if (key === options.screen) {
				dataConfig = config[key]
			}
		} else {
			if (key === state.common.screen) {
				dataConfig = config[key]
			}
		}

	})
	/////////////// Production on Power Plants - Start here ////////////

	const activePowerLastSixHour = yield all(dataConfig.activePower.map((set) =>
		call(hourDataSets, set.powerPlant, setsData, options.screen)
	))
	/////////////// Production on Power Plants - End here ////////////
	/////////////// Average value for powerPlants last six hour - Start here ////////////
	const activePowerLastSixHourAverage = yield all(dataConfig.flow.map((set) =>
		call(averageHourlyValuesSets, set.label, set.apiIdHour, setsData, options.screen)
	))

	let hourlyData = activePowerLastSixHour.map((i, index)	=> { ///for chart 1 and 4
		if (activePowerLastSixHourAverage[index]) {
			return activePowerLastSixHourAverage[index].map((data, inx) => ({
				...i[inx],
				...data
			}))
		} else {
			return [...i]
		}
	})
	const isActiveData = yield all(dataConfig.activePower.map((set) =>
		call(isActiveSets, set.apiIdHour, set.powerPlant, setsData, options.screen)
	))

	const isActiveReverse= isActiveData.map((data, i) => { //for chart 2 and 5
		return JSON.parse(JSON.stringify(data)).reverse()
	})
	yield put({type: SET_SCREEN_PROPERTY, screen: screen, key: 'percentLeakeageOverflowDam', value: roundNone(new BigNumber(setsData.PercentLeakeageOverflowDam)).toNumber() })
	yield put({type: SET_SCREEN_PROPERTY, screen: screen, key: 'percentLeakeageHydroPlant', value: roundNone(new BigNumber(setsData.PercentLeakeageHydroPlant)).toNumber() })
	yield put({type: SET_SCREEN_PROPERTY, screen: screen, key: 'hourlySetsData', value: hourlyData })
	yield put({type: SET_SCREEN_PROPERTY, screen: screen, key: 'isActiveSetsData', value: isActiveReverse })
	/////////////// Average value for powerPlants last six hour - End here ////////////
	/////////////// Daily Data for Charts - Start here ////////////

	const activePowerLastSixDays = yield all(dataConfig.activePower.map((set) =>
		call(dailyDataSets, set.powerPlant, set.apiIdDaily, setsData)
	))
	const averageDataLastSixDays = yield all(dataConfig.flow.map((set) =>
		call(averageDailyValuesSets, set.label, set.apiIdHour, set.apiIdDaily, setsData, setsData, options.screen)
	))
	let dailyData = activePowerLastSixDays.map((ind, index)	=> { ///for chart 3 and 6
		if (averageDataLastSixDays[index]) {
			return averageDataLastSixDays[index].map((data, inx) => ({
				...ind[inx],
				...data
			}))
		} else {
			return [
				...ind
			]
		}
	})
	yield put({type: SET_SCREEN_PROPERTY, screen: screen, key: 'dailySetsData', value: dailyData })
	/////////////// Sum Daily Values for Chart - End here ////////////
	yield put({type: SET_STORE_PROPERTY, key: 'loading', value: false })
}

export const setsData = function* () {
	while (true) {
		const action = yield take (GET_SETS_DATA)
		yield call (setsDataAction, action)
	}
}

export const changeFirebaseSubscription = function* (){
	while (true) {
		const action = yield take(CHANGE_FIREBASE_SUBSCRIPTION)
		const { notification, oldNotification } = action

		const { checked, topics, value, id } = notification

		let topic = topics[0]
		if (value){
			switch (id) {
			case 5:
				topic = value + 'production'
				break
			case 6:
				topic = value + 'Inflow'
				break
			default:
			}
		}

		if (checked){
			console.log('subscribe', topic)
			Firebase.messaging().subscribeToTopic(topic)

			if (oldNotification){
				let oldTopic = oldNotification.topics[0]

				if (oldNotification.value){
					switch (id) {
					case 5:
						oldTopic = oldNotification.value + 'production'
						break
					case 6:
						oldTopic = oldNotification.value + 'Inflow'
						break
					default:
					}
				}
				console.log('unsubscribe', oldTopic)
				Firebase.messaging().unsubscribeFromTopic(oldTopic)
			}
		} else {
			console.log('unsubscribe', topic)
			Firebase.messaging().unsubscribeFromTopic(topic)
		}
	}
}

export const getSettings = function* () {
	while (true) {
		yield take(GET_SETTINGS)
		yield put({ type: SET_STORE_PROPERTY, key: 'loading', value: true })
		const storage = yield call(getLocalStorage, 'settings')
		const store = yield select()
		let settings = store.common.settings

		if (isDefined(storage) ) {
			yield put({ type: SET_STORE_PROPERTY, key: 'settings', value: { ...settings,...storage }})
			settings = storage
		} else {
			yield call(setLocalStorage, 'settings', settings)
			for (let i = 0; i < settings.notifications.length; i++) {
				const notification = settings.notifications[i]
				yield put({type: CHANGE_FIREBASE_SUBSCRIPTION, notification})
			}
		}

		yield put({ type: SET_STORE_PROPERTY, key: 'loading', value: false })
	}
}

export const changeSettings = function* () {
	while (true) {
		const action = yield take(CHANGE_SETTINGS)
		// yield put({type: SET_STORE_PROPERTY, key: 'loading', value: true })
		// const store = yield (select())
		// let settings = store.common.settings
		const {key, value} = action

		yield put({ type: CHANGE_SETTINGS_PROP, key, value })
		const store = yield select()
		const newSettings = store.common.settings
		yield call(setLocalStorage, 'settings', newSettings)
		// yield put({type: SET_STORE_PROPERTY, key: 'loading', value: false })
	}
}

export const autoRefreshTimer = function* () {
	while (true) {
		yield take (AUTO_REFRESH_TIMER)
		yield call (powerPlantsDataAction, {screen: 'home1', loading: false})
		yield call (powerPlantsDataAction, {screen: 'home2', loading: false})
		yield call (flowsDataAction, {screen: 'flows', loading: false})
		yield call (levelsDataAction, {screen: 'levels', loading: false})
		yield call (setsDataAction, {screen: 'set1', loading: false})
		yield call (setsDataAction, {screen: 'set2', loading: false})
	}
}

export const changeAutoRefresh = function* () {
	while (true) {
		const action = yield take (CHANGE_AUTO_REFRESH)
		const { key, time } = action

		const getItems = state => state.common.settings.autoRefresh
		const state = yield select(getItems)
		const value = {
			...state,
			'selectedValue': time
		}

		yield put({ type: CHANGE_SETTINGS, key , value })
	}
}

export const levelsDataChange = function* () {
	while (true) {
		const action = yield take (GET_LEVELS_BY_ID)
		let dataRes = config.levels[action.params]

		let apiIdHour = dataRes.apiIdHour
		let apiIdDay = dataRes.apiIdDay
		let data = yield call(api.level, apiIdHour,apiIdDay)
		let levelData = data.data
		yield call (levelsDataAction, {name: dataRes.name, data: levelData})
	}
}
