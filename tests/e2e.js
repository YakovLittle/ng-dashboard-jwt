// conf.js
exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	baseUrl: 'http://localhost:8080',
	framework: 'jasmine',
	chromeOnly: true,
	suites: {
	    login: 'e2e/*spec.js'
  	}
}