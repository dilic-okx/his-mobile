import React from 'react'
import { Text as SVGText } from 'react-native-svg'
import palette from '../theme/palette'
import { isIphone5 } from '../theme/variables/platform'

export default class TendencyLine extends React.Component {
	render () {
		const { height, datum, chartLabel } = this.props
		const { x, previous, current } = datum
		const mark = previous && current && previous > current ? { color: palette.trendFall, char: '▼' } : previous && current && previous < current ? { color: palette.trendRise, char: '▲' } : { color: palette.trendLevel, char: '●' }
		return (
			<SVGText x={ isIphone5() ? x + 42 : mark.char === '●' ? x + 46.5 : x + 43.5} y={ chartLabel === 'sixDayData' ? height - 110 : height - 120 } style={{ fill: mark.color, fontSize: 15 }}>{ mark.char }</SVGText>
		)
	}
}
