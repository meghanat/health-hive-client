var clientApp=angular.module('clientApp',[])
clientApp.controller("clientController",function ($scope,$http){
	
	$scope.username="";
	$scope.password="";
	$scope.database_name="";
	$scope.getcredentials=true;
	$scope.selectTables=false;
	$scope.selectColumns=false;
	$scope.tableNames=[]
	$scope.selectedColumns={}
	$scope.credentialsSubmit=function(){

	data={
			"username":$scope.username,
			"password":$scope.password,
			"database":$scope.database
		}
	console.log(data)
	var res=$http.post("/connect",data).then(function(data){
		console.log(data)
		$scope.getcredentials=false;
		

		for (var i in data.data){
			row=data.data[i]
			tablename=row[Object.keys(row)[0]]
			console.log(tablename)
			$scope.tableNames.push(tablename)
		}
		$scope.selectTables=true;
		console.log(data["data"])
		console.log($scope.tableNames)
		
	})

}

$scope.tablesSubmit=function(){

	$scope.selectedTables = [];
	$('input:checked').each(function() {
    $scope.selectedTables.push($(this).attr('name'));
    
});
	$http.post("/columns",$scope.selectedTables).then(function(data){
		$scope.columns_in_tables=data.data
		console.log($scope.columns_in_tables)
		$scope.selectTables=false;
		$scope.selectColumns=true;

	})
}

$scope.columnsSubmit=function(){
	$scope.selectedColumns
	$("#selectColumns input:checked").each(function(){
		tableName=$(this).attr("name")
		value=$(this).attr("value")
		if(tableName in $scope.selectedColumns){

			$scope.selectedColumns[tableName].push(value)
		}
		else{
			$scope.selectedColumns[tableName]=[]
			$scope.selectedColumns[tableName].push(value)
		}

	})
	console.log($scope.selectedColumns)
}
})