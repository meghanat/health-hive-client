describe("App",function(){

	beforeEach(module('clientApp'));
	var $controller;

	  beforeEach(inject(function(_$controller_){
	    $controller = _$controller_;
	  }));

	it("default values defined", function(){

		var $scope = {};
		var controller = $controller('clientController', { $scope: $scope });
		expect($scope.username).toEqual("root");

		expect($scope.password).toEqual("");
		expect($scope.host).toEqual("localhost");

	})

	it("should connect to database",function(){
		var $scope = {};
		var controller = $controller('clientController', { $scope: $scope });

		$scope.username="root";
		$scope.database="test"

		$scope.credentialsSubmit();

		it("should fetch all table names",function(){

			console.log($scope.tableNames)
		})

	});

	it("should get column names",function(){
		var $scope = {};
		var controller = $controller('clientController', { $scope: $scope });
		$scope.tablesSubmit();

	});

	it("should submit selected column names",function(){
		var $scope = {};
		var controller = $controller('clientController', { $scope: $scope });
		$scope.columnsSubmit();

	});

	it("should submit metadata",function(){
		var $scope = {};
		var controller = $controller('clientController', { $scope: $scope });
		$scope.columnsSubmit();

	});
})