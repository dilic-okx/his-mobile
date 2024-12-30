import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import AnimatedProgressWheel from 'react-native-progress-wheel'
import palette from '../theme/palette'

const CircularProgress = ({ percent, color }) => {
	return (
		<View style={styles.container}>
			<View style={{ position: 'absolute', transform: [{rotateZ: '-90deg'}] }}>
				<AnimatedProgressWheel
					size={ 60 }
					width={ 10 }
					color={ color }
					progress={ percent }
					backgroundColor={ palette.chartScatterColor }/>
			</View>
			<Text style={ styles.display }>{ percent }%</Text>
		</View>
	)
}


const styles = StyleSheet.create({
	container: {
		width: 60,
		height: 60,
		borderRadius: 30,
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
		backgroundColor: 'white'
	},
	display: {
		fontSize: 15
	}
})

export default CircularProgress
