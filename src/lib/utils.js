import { config } from '../store/common/sagas'
import BigNumber from './BigNumber'
import { roundNone, zero } from './calculations'

const noValue = -9999

export const getConfigByKey = key => {
	const res = Object.keys(config).find((item) => item === key)
	return res && config[res] ? config[res] : {}
}

export const getPreselectedPlant = () => {
	return Object.keys(config).find((item) => config[item].preselected)
}


export const chunkArray = (myArray, chunk_size) => {
	var index = 0
	var arrayLength = myArray.length
	var tempArray = []

	for (index = 0; index < arrayLength; index += chunk_size) {
		let myChunk = myArray.slice(index, index+chunk_size)
		// Do something if you want with the group
		tempArray.push(myChunk)
	}

	return tempArray
}

export const isDefined = item => item !== null && item !== undefined

export const changeNotification = (notifications, notificationId, key, value, forcedChecked) => {
	// check for key
	return notifications.map(i => {
		if (i.id === notificationId) {
			const newChecked = forcedChecked ? true : !key ? !i.checked : i.checked
			return { ...i, checked: newChecked, [key]: value }
		} else {
			return i
		}
	})
}

export const changeNotificationProperties = (notifications, notificationId, obj = {}) => {
	return notifications.map(i => {
		if (i.id === notificationId) {
			return { ...i, ...obj }
		} else {
			return i
		}
	})
}

export const checkValue = (value) => value !== noValue ? value : 0

export const minDomain = (data) => {
	return Math.min(...data.map((d) => roundNone(new BigNumber(d.minYAxis))))
}

export const maxDomain = (data) => {
	let sum = zero()
	data.map((y, i) => {
		sum = sum.plus(new BigNumber(y.maxYAxis))
	})
	return roundNone(sum).toNumber()
}


export const findData = (ids, data) => ids.map((id) => data.find((item) => item.data.ID === id))
// export const minDependent = (data, key) => {
// 	// return Math.min(...data.map((d) => d[key]))
// }

// export const maxDependent = (data, key) => {
// 	// return Math.max(...data.map((d) => d[key]))
// }

// export const domainRange = (min, max) => {
// 	const range = (max - min)/5
// 	return {
// 		min: min - range,
// 		max: max + range
// 	}
// }
