import React from 'react'
import { Platform } from 'react-native'
import { Text as SVGText } from 'react-native-svg'
import palette from '../theme/palette'
import { isIphone5 } from '../theme/variables/platform'

export default class ScatterTendencyLine extends React.Component {
	render () {
		const { height, datum, screen } = this.props
		const { x, previous, current } = datum
		const mark = previous && current && previous > current ? { color: palette.footerIconActiveColor, char: '▼' } : previous && current && previous < current ? { color: palette.chartSecondary3, char: '▲' } : { color: palette.chartSecondary1, char: '●' }
		return (
			screen === 'levels' ?
				<SVGText x={ x - 1 } y={ Platform.OS === 'ios' ? height - 30 : height - 31 } style={{ fill: mark.color, fontSize: Platform.OS === 'ios' ? 25 : 20 }}>{ mark.char }</SVGText>
				:
				<SVGText x={ isIphone5() ? x + 2 : x + 5 } y={ Platform.OS === 'ios' ? height - 37 : height - 36 } style={{ fill: mark.color, fontSize: 12 }}>{ mark.char }</SVGText>

		)
	}
}
