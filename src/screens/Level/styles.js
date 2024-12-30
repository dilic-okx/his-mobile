import { StyleSheet } from 'react-native'
import palette from '../../theme/palette'

const styles = StyleSheet.create({
	pickerView: {
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	levelView: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomColor: palette.chartScatterColor,
		borderBottomWidth: StyleSheet.hairlineWidth,
		flex: 1,
		marginHorizontal: 20,
		paddingVertical: 10
	},
	levelText: {
		color: '#fff', 
		alignSelf: 'center', 
		marginTop: 10
	},
	oneHourText: {
		color: '#fff', 
		fontSize: 22, 
		marginTop: 2,
		marginLeft: 30
	}
})

export default styles
