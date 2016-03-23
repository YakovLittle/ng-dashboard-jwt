// spec.js
describe('Login page', function() {
	var mockModule = require('../mocked-backend');
	var emailT = element(by.model('vm.email'));
  	var pwT = element(by.model('vm.pw'));
  	var loginB = element(by.id('bALogin'));
  	var msgT = element(by.binding('vm.msg'));

  	var checkAlert = function() {//For close popup
  		browser.switchTo().alert().then(
		    function (alert) { alert.accept(); },
		    function (err) { }
		);
  	}

  	var getLocaleMsg = function(key) {//For execute Script
  		return "var filter = angular.element('*[ng-app]').injector().get('$filter'); return filter('i18n')('" + key +"');"
  	}

  	var switchDebugMode = function(mode) {//Switch from <backend-host> to localhost
  		browser.executeScript("angular.element('*[ng-app]').injector().get('BackendAPI').switchDebugMode("+ mode +");");
  	}

	beforeEach(function() {
		browser.addMockModule('httpBackendMock', mockModule.httpBackendMock);
		browser.get('#/login');
		//checkAlert();
		browser.executeScript("window.performance.mark('start');");
	});

	afterEach(function() {
		browser.executeScript("window.performance.mark('end'); window.performance.measure('test', 'start', 'end');");
		browser.executeScript("return window.performance.getEntriesByType('measure');")
		.then(function(res) {
			console.log(res);
		});
	});

	it('should show Validation error', function() {
		emailT.sendKeys("wrong@");		

		loginB.click();

		browser.executeScript(getLocaleMsg('requiredFields'))
		.then(function(res) {//get localized message
		   expect(msgT.getText()).toEqual(res);
		});
	});

	it('should show Invalid credentials', function() {
		emailT.sendKeys("test@email");
		pwT.sendKeys("wrong");

		switchDebugMode(1);//debug mode: ON

		loginB.click();

		browser.executeScript(getLocaleMsg('invalidCredentials'))
		.then(function(res) {//get localized message
		   expect(msgT.getText()).toEqual(res);
		});
	});

	it('should show Unavailable Server', function() {
		emailT.sendKeys("test@email");
		pwT.sendKeys("ok");

		switchDebugMode(0);//debug mode: OFF

		loginB.click();

		browser.executeScript(getLocaleMsg('unavailableServer'))
		.then(function(res) {//get localized message
		   expect(msgT.getText()).toEqual(res);
		});
	});

	it('should open Home page', function() {
		emailT.sendKeys("test@email");
		pwT.sendKeys("ok");

		switchDebugMode(1);//debug mode: ON

		loginB.click();

		browser.executeScript(getLocaleMsg('dashboard'))
		.then(function(res) {//get localized message
			//browser.pause();
			expect(msgT.getText()).toEqual(res);
		});
	});
});