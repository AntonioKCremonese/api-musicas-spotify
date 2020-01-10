module.exports.convertKelvinToCelsius = function (kelvin) {
	if (kelvin < (0)) {
		return 'below absolute zero (0 K)';
	} else {
		return (kelvin-273.15);
	}
}