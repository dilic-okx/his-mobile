import { StyleSheet } from 'react-native'
import palette from '../../theme/palette'

const styles = StyleSheet.create({
	settings: {
		flex: 1,
		paddingHorizontal: 40,
		paddingVertical: 20
	},
	checkBoxText: {
		marginLeft: 10,
		fontSize: 15,
		color: '#fff'
	},
	sliderPopup: {
		height: 200,
		backgroundColor: palette.gradient[0],
		flexDirection: 'column',
		justifyContent: 'space-between',
		borderRadius: 10,
		marginVertical: 5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 2,
		elevation: 2,
		marginHorizontal: 30,
		overflow: 'hidden'
	},
	buttonsView: {
		height: 50,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderTopColor: 'grey',
		borderTopWidth: 0.5
	},
	inputView: {
		marginHorizontal: 80,
		marginTop: 20,
		alignItems: 'center',
		justifyContent: 'center',
		borderBottomWidth: 1,
		borderBottomColor: 'grey'
	},
	buttonModal: {
		alignSelf: 'center',
		color: '#fff'
	},
	logout: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: 60, 
		width: 80
	}
})

export default styles
