import { StyleSheet } from 'react-native'
import palette from '../../theme/palette'

const styles = StyleSheet.create({
	mainView: {
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomColor: palette.chartScatterColor,
		borderBottomWidth: StyleSheet.hairlineWidth,
		marginHorizontal: 20,
		height: 190
	},
	loginView: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		height: 370,
		paddingHorizontal: 10,
		paddingVertical: 10,
		marginHorizontal: 20
	},
	checkboxView: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	buttonContainer: {
		borderWidth: 0.1,
		borderRadius: 5,
		width: 100,
		height: 40,
		justifyContent: 'center',
		backgroundColor: palette.loginButton
	},
	secondButtonContainer: {
		borderWidth: 0.1,
		borderRadius: 5,
		width: 80,
		height: 30,
		justifyContent: 'center',
		backgroundColor: palette.loginButtonSecond
	},
	footerView: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 80
	}
})

export default styles
