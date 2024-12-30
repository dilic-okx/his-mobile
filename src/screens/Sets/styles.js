import { StyleSheet } from 'react-native'
import palette from '../../theme/palette'

const styles = StyleSheet.create({
	dateText: {
		color: '#fff',
		marginTop: 10
	},
	circle: {
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginHorizontal: 20,
		paddingBottom: 15
	},
	circleInnerView: {
		flex: 2,
		flexDirection: 'row'
	},
	setView: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomColor: palette.chartScatterColor,
		borderBottomWidth: StyleSheet.hairlineWidth,
		flex: 1,
		marginHorizontal: 20,
		paddingVertical: 10
	},
	productionView: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
		marginLeft: 20,
		marginRight: 20,
		paddingVertical: 10
	},
	colorText: {
		color:	'#fff'
	},
	powerPlantsView: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 10
	},
	powerPlantsInnerView: {
		flexDirection: 'column',
		flex: 1,
		alignItems: 'flex-start'
	},
	powerPlantsText: {
		color: '#fff',
		fontSize: 15
	},
	progressBarView: {
		flexDirection: 'column',
		flex: 1
	},
	sumView: {
		flex: 1,
		flexDirection: 'column',
		alignItems: 'center',
		marginBottom: 10
	},
	detailsCircleView: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'space-between'
	},
	detailsCircleInnerView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 10
	},
	detailsCircleSubInnerView: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-start'
	},
	detailsMainText: {
		fontSize: 9,
		color: '#fff',
		alignSelf: 'center',
		marginTop: 5
	},
	detailsSubText: {
		fontSize: 9,
		color: '#fff'
	}
})

export default styles
