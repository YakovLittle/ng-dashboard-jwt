// spec.js
describe('Login page', function() {
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

  	var switchDebugMode = function() {//Switch from <backend-host> to localhost
  		browser.executeScript("angular.element('*[ng-app]').injector().get('BackendAPI').switchDebugMode();");
  	}

	beforeEach(function() {
		browser.get('#/login');
		//checkAlert();
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

		loginB.click();

		browser.executeScript(getLocaleMsg('invalidCredentials'))
		.then(function(res) {//get localized message
		   expect(msgT.getText()).toEqual(res);
		});
	});

	it('should show Unavailable Server', function() {
		emailT.sendKeys("test@email");
		pwT.sendKeys("ok");

		//Switch Debug Mode
		switchDebugMode();

		loginB.click();

		browser.executeScript(getLocaleMsg('unavailableServer'))
		.then(function(res) {//get localized message
		   expect(msgT.getText()).toEqual(res);
		});
	});

	it('should open Home page', function() {
		emailT.sendKeys("test@email");
		pwT.sendKeys("ok");

		loginB.click();

		browser.executeScript(getLocaleMsg('dashboard'))
		.then(function(res) {//get localized message
		   expect(msgT.getText()).toEqual(res);
		});
	});
});