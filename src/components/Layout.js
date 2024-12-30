import React from 'react'
import { StatusBar, ScrollView, StyleSheet } from 'react-native'
import { Container, Content } from 'native-base'
import LinearGradient from 'react-native-linear-gradient'

import palette from '../theme/palette'

export default class Layout extends React.Component {
	render() {
		return (
			<LinearGradient colors={ palette.gradient } style={ styles.gradient }>
				<Container style={ styles.container }>
					<StatusBar backgroundColor={ palette.gradient[0] } barStyle="light-content"/>
					<ScrollView>
						<Content>
							{ this.props.children }
						</Content>
					</ScrollView>
				</Container>
			</LinearGradient>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'transparent'
	},
	gradient: {
		flex: 1,
		width: '100%'
	},
	listSectionHeader: {
		fontSize: 18,
		fontWeight: 'bold'
	},
	listItem: {
		color: '#222'
	}
})
