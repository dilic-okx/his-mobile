import { StyleSheet } from 'react-native'
import palette from '../../theme/palette'

const styles = StyleSheet.create({
	dateText: {
		color: '#fff'
	},
	deltaRiversFlow: {
		flexDirection: 'row',
		justifyContent: 'center',
		flex: 1
	},

	flowView: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomColor: palette.chartScatterColor,
		borderBottomWidth: StyleSheet.hairlineWidth,
		flex: 1,
		marginLeft: 20,
		marginRight: 20,
		paddingVertical: 10
	},
	flowInnerView: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	flowRiverText: {
		color: '#fff',
		alignSelf: 'flex-start'
	}
})

export default styles
