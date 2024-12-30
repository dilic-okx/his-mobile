import { createStore ,applyMiddleware ,compose } from 'redux'
import axios from 'axios'
import { offline } from '@redux-offline/redux-offline'
import offlineConfig from '@redux-offline/redux-offline/lib/defaults'
import createSagaMiddleware from 'redux-saga'
import reducers from './reducers'
import rootSaga from './sagas'
import { composeWithDevTools } from 'redux-devtools-extension'

const { log } = console

const reduxOfflineConfig = {
	...offlineConfig,
	detectNetwork: callback => {
		setInterval(async () => {
			try {
				await axios.head('google-public-dns-a.google.com')// otkud fetch? -> fetch('google-public-dns-a.google.com', { method: 'HEAD' })
				log('++++++++ 11111111 ==========')
				callback({
					online: true
				})
			} catch (e) {
				log('++++++++ 22222222222 ==========')
				callback({
					online: false
				})
			}
		}, 2000)
	}
}
const sagaMiddleware = createSagaMiddleware()

const store = createStore(reducers, composeWithDevTools(applyMiddleware(sagaMiddleware), /*offline({reduxOfflineConfig})*/))

sagaMiddleware.run(rootSaga)

export default store
