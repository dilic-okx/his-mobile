import { fork, call, put, all } from 'redux-saga/effects'
import { levelsDataChange, loginFlow, powerPlantsData, levelsData, flowsData, setsData, logoutFlow, getSettings, changeSettings, changeFirebaseSubscription, autoRefreshTimer, changeAutoRefresh} from './common/sagas'
import {
	LOGOUT,
	SPINNER,
	SET_STORE_PROPERTY
} from './constants'

// Wrap forks with an Error handler
// Avoid putting try/catch in every saga in multiple files. This handler should process all errors
const wrap = function* (fn, args) {
	try {
		yield call(fn, ...args)
	}
	catch (e) {
		console.log('ERROR SAGA111111', e)

		console.log('ERROR SAGA', JSON.stringify(e, null, 4))
		const { response } = e
		if (response) {
			const { status, data } = response
			yield put({ type: SPINNER, flag: false })
			switch (status) {
			case 401:
				yield put({ type: LOGOUT })
				break
			case 400:
				yield put({ type: SET_STORE_PROPERTY, error: data.Message })
				break
			case 500:
				yield put({ type: SET_STORE_PROPERTY, error: data.Message })
				break
			default:
			}
		}
		//reactivate stoped saga
		yield fork(wrap, fn, args)
	}
}

const forkWithErrHandler = (fn, ...args) => fork(wrap, fn, args)

// The root saga is what we actually send to Redux's middleware. In here we fork
// each saga so that they are all "active" and listening.
// Sagas are fired once at the start of an app and can be thought of as processes running
// in the background, watching actions dispatched to the store.
const sagas = [
	autoRefreshTimer,
	loginFlow,
	powerPlantsData,
	levelsData,
	flowsData,
	setsData,
	logoutFlow,
	getSettings,
	changeSettings,
	changeFirebaseSubscription,
	changeAutoRefresh,
	levelsDataChange
].map(saga => {
	// add error handler to all sagas
	return forkWithErrHandler(saga)
})

const root = function* () {
	yield all( sagas )
}

export default root
