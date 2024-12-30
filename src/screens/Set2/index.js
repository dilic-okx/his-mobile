import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getSetsData, screenValue } from '../../store/actions'
import Sets from '../Sets'
import { getConfigByKey } from '../../lib/utils'

class Set2 extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			setRes: null
		}
	}

	static navigationOptions = {
		title: 'Set2'
	}

	render() {
		return (
			<Sets setsData={this.props.sets} newScreen={this.props.sets.label}/>
		)
	}
}

export default connect((state) => {
	const sets = getConfigByKey('set2')
	const {
	} = state.common
	return {
		...state.common,
		sets
	}
}, (dispatch) => {
	const actions = { getSetsData, screenValue }
	return bindActionCreators(actions, dispatch)
})(Set2)
