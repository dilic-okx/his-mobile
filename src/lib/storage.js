import { useAsyncStorage } from '@react-native-community/async-storage'
import AsyncStorage from '@react-native-community/async-storage'

const { log } = console

export const getLocalStorage = async (param) => {
	try {
		const { getItem } = useAsyncStorage(param)
		const value = await getItem()
		if (value !== null) {
			return JSON.parse(value)
		}
	} catch (error) {
		log('ASYNC_STORAGE_ERROR', error)
	}
}

export const setLocalStorage = async (key, value) => {
	if (value === undefined) {return}
	try {
		const { setItem } = useAsyncStorage(key)
		await setItem(JSON.stringify(value))
	} catch (error) {
		log('ASYNC_STORAGE_ERROR', error)
	}
}

export const removeItem = async (key) => {
	if (key === undefined) {return}
	try {
		await AsyncStorage.removeItem(key)
	} catch (error) {
		log('ASYNC_STORAGE_ERROR', error)
	}
}
