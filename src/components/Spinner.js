import React, { Component } from 'react'
import { View, ActivityIndicator, Platform } from 'react-native'

export default class Spinner extends Component {
	render() {
		return (
			<View
				style={{
					position: 'absolute',
					left: 0,
					top: 0,
					right: 0,
					bottom: 0,
					alignItems: 'center',
					justifyContent: 'center',
					backgroundColor: 'rgba(0,0,0,0.7)'
				}}>
				<ActivityIndicator size={ Platform.OS == 'ios' ? 1 : 40 }/>
			</View>
		)
	}
}
