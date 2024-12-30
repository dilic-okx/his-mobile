import { StyleSheet } from 'react-native'
import palette from '../../theme/palette'

const styles = StyleSheet.create({
	dateText: {
		color: '#fff',
		marginTop: 10
	},
	sets: {
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	setView: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomColor: palette.chartScatterColor,
		borderBottomWidth: StyleSheet.hairlineWidth,
		flex: 1,
		marginLeft: 20,
		marginRight: 20,
		paddingVertical: 10
	}
})

export default styles
