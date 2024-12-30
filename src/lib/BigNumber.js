import BigNumber from 'bignumber.js'
// import BigNumber from "./bignumber.mjs"
const bigNumberConfig = {
	FORMAT: {
		decimalSeparator: ',',
		// groupSeparator: '.',
		groupSize: 3,
		secondaryGroupSize: 0,
		fractionGroupSeparator: '\xA0', // non-breaking space
		fractionGroupSize: 0
	}
}
BigNumber.config(bigNumberConfig)
export default BigNumber
