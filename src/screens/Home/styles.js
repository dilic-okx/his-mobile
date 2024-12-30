import { StyleSheet } from 'react-native'
import palette from '../../theme/palette'

const styles = StyleSheet.create({
	view: {
		borderBottomColor: palette.chartScatterColor,
		borderBottomWidth: StyleSheet.hairlineWidth,
		flex: 1,
		marginHorizontal: 20
	},
	innerView: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	homeText: {
		color: '#fff',
		alignSelf: 'center',
		marginTop: 10
	},
	homeTextEnergy: {
		color: '#fff',
		fontSize: 10,
		marginTop: 5
	},
	levelChartView: {
		flexDirection: 'column',
		justifyContent: 'center',
		flex: 1,
		paddingBottom: 10,
		marginTop: 5
	},
	levelChartText: {
		color: '#fff',
		alignSelf: 'flex-start',
		marginBottom: 10,
		marginRight: 25,
		marginLeft: 5
	},
	chunkView: {
		height: 40,
		paddingHorizontal: 15
	},
	MWhText: {
		color: '#fff',
		fontSize: 20,
		alignSelf: 'center'
	},
	deltaRivers: {
		marginBottom: 10,
		marginTop: 5,
		flexDirection: 'column',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	}
})

export default styles
