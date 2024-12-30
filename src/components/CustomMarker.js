import React from 'react'
import { View, Text, StyleSheet } from 'react-native'


export default class CustomMarker extends React.Component {
	render() {
		return (
			<View style={{ marginTop: 17 }}>
				<View style={styles.marker}></View>
				{this.props.value ?
					<Text style={{ alignSelf: 'center', color: '#fff', fontSize: 15 }}>{this.props.value}</Text>
					:
					null
				}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	marker: {
		height: 25,
		width: 25,
		borderRadius: 15,
		backgroundColor: 'yellow'
	}
})
