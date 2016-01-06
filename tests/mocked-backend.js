exports.httpBackendMock = function() {
    var mock = document.createElement('script');
    mock.src='tests/angular-mocks.js';
    document.getElementsByTagName('head')[0].appendChild(mock);

    angular.module('httpBackendMock', ['SPA', 'ngMockE2E'])
    
    .run(function($httpBackend) {
        console.log('HTTP backend mock');
        //Authentication API
        $httpBackend.whenPOST(/auth.php/).respond(function(method, url, data) {
            var res = {};//It should show Invalid credentials
            if (angular.fromJson(data).password !== 'wrong') {
                res = {'token': url, 'environments': []}
            }
            return [200, angular.toJson(res), {}];
        });
        $httpBackend.whenPOST(/\/auth/).passThrough();

        //GET for ALL
        $httpBackend.whenGET(/.*/).passThrough();
    });
}