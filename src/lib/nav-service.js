import { NavigationActions } from 'react-navigation'

let _navigator

function setTopLevelNavigator(navigatorRef) {
	_navigator = navigatorRef
}

function navigate(routeName, params) {
	_navigator.dispatch(
		NavigationActions.navigate({
			routeName,
			params
		})
	)
}

function goBack(key) {
	_navigator.dispatch(
		NavigationActions.back({
			key
		})
	)
}

function getCurrent() {
	if (!_navigator){
		return
	}
	if (!_navigator._navigation || !_navigator._navigation.state){
		return
	}
	const navState = _navigator._navigation.state
	let route = navState.routes[navState.index]
	while (route.routes) {
		route = route.routes[route.index]
	}
	return route.routeName
}

// add other navigation functions that you need and export them

export default {
	navigate,
	setTopLevelNavigator,
	goBack,
	getCurrent
}
