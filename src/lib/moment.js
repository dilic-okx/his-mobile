import moment from 'moment'
require('moment/locale/sr')
moment.updateLocale('sr', {
	weekdays: [
		'Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota'
	],
	weekdaysShort: [
		'Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub'
	],
	months: [
		'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
		'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'
	],
	monthsShort: [
		'Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun',
		'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'
	]
})
export default moment
