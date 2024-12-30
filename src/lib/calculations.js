import BigNumber from './BigNumber'
export const zero = () => new BigNumber(0)
export const negativeOne = new BigNumber(-1)
export const positiveOne = new BigNumber(1)
export const one = new BigNumber(1)
export const six = new BigNumber(6)
export const ten = new BigNumber(10)
export const hundred = new BigNumber(100)

export const sum = (values) => {
	return values.reduce( (total, value) => {
		if (!value) {
			return total
		}
		return total.plus(value)
	}, zero() )
}

export const roundFlow = (value) => {
	// if (value !== BigNumber) {
	// 	value = new BigNumber(value)
	// }
	if (value < one) {
		value = value.decimalPlaces(3)
	} else if (value >= one && value < ten) {
		value = value.decimalPlaces(2)
	} else if (value >= ten && value < hundred) {
		value = value.decimalPlaces(1)
	} else {
		value = value.decimalPlaces(0, 1)
	}
	return value
}


export const roundOneDecimal = (value) => {
	return value = value.decimalPlaces(1)
}

export const roundLevel = (value) => {
	return value = value.decimalPlaces(2)
}


export const roundNone = (value) => {
	return value = value.decimalPlaces(0, 1)
}


export const formatNumber = (value) => {
	return value = value.toString().replace(/[.]/, ',')
}
