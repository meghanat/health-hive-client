var clientApp = angular.module('clientApp', [])
clientApp.controller("clientController", function($scope, $http) {
	$scope.username = "root";
	$scope.password = "";
	$scope.database= "somedb";
	$scope.dbms="mysql";
	$scope.host="localhost";
	$scope.getcredentials = false;
	$scope.selectTables = false;
	$scope.selectColumns = false;
	$scope.columnDetails = false;
	$scope.tableNames = []
	$scope.selectedColumns = {}
	$scope.metadata = {}
	$scope.organisation="";
	$scope.getOrg=true;

	$scope.submitOrg=function(){
		$scope.getOrg=false;
		$scope.getcredentials=true;

	}

	$scope.credentialsSubmit = function() {
		data = {
			"username": $scope.username,
			"password": $scope.password,
			"database": $scope.database,
			"host":$scope.host,
			"dbms":$scope.dbms
		}
		console.log(data)
		var res = $http.post("/connect", data).then(function(data) {
			console.log(data)
			$scope.getcredentials = false;
			if($scope.dbms=="mysql"){
			
				for (var i in data.data) {
					row = data.data[i]
					tablename = row[Object.keys(row)[0]]
					console.log(tablename)
					$scope.tableNames.push(tablename)
				}
			}
			else if($scope.dbms=="postgres"){

				$scope.tableNames=data["data"]

			}
			$scope.selectTables = true;
			
			console.log($scope.tableNames)
		})
	}
	$scope.tablesSubmit = function() {
		$scope.selectedTables = [];
		$('input:checked').each(function() {
			$scope.selectedTables.push($(this).attr('name'));
		});
		$http.post("/columns", $scope.selectedTables).then(function(data) {

			if($scope.dbms=="mysql"){
				$scope.columns_in_tables = data.data	
			}
			else if($scope.dbms=="postgres"){
				console.log(data.data)
				$scope.columns_in_tables = data.data	
			}
			console.log($scope.columns_in_tables)
			$scope.selectTables = false;
			$scope.selectColumns = true;
		})
	}
	$scope.columnsSubmit = function() {
		$scope.selectedColumns
		$("#selectColumns input:checked").each(function() {
			tableName = $(this).attr("name")
			value = $(this).attr("value")
			if (tableName in $scope.selectedColumns) {
				$scope.selectedColumns[tableName].push(value)
			} else {
				$scope.selectedColumns[tableName] = []
				$scope.selectedColumns[tableName].push(value)
			}
		})
		$scope.selectColumns = false;
		$scope.columnDetails = true;
		console.log($scope.selectedColumns)
	}
	$scope.metadataSubmit = function() {
		$("#columnDetails .table").each(function() {
			tableName = $(this).attr("id");
			$scope.metadata[tableName] = {}
			$(this).find(".column").each(function() {
				columnName = $(this).attr("name")
				$scope.metadata[tableName][columnName] = {}
				$scope.metadata[tableName][columnName]["is_encoded"] = $(this).find(".encoded").prop("checked")
				$scope.metadata[tableName][columnName]["is_patient_id"] = $(this).find(".patient_id").prop("checked")
				$scope.metadata[tableName][columnName]["description"] = $(this).find(".description").val()
				$scope.metadata[tableName][columnName]["columnValuesCodeSystem"] = $(this).find(".column-values-code-system").val()
				$scope.metadata[tableName][columnName]["columnNameCode"] = $(this).find(".column-name-code").val()
				$scope.metadata[tableName][columnName]["columnNameCodeSystem"] = $(this).find(".column-name-code-system").val()
			})
		})
		var metadata_file={};
		metadata_file.organisation=$scope.organisation;
		metadata_file.tables=[]

		for(table in $scope.metadata){

			table_entry={}
			table_entry.name=table;
			table_entry.filename=table+".csv"
			table_entry.columns=$scope.metadata[table]
			metadata_file.tables.push(table_entry);

		}

		console.log("metadata",metadata_file)
		var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(metadata_file,null,4));
		var dlAnchorElem = document.getElementById('downloadAnchorElem');
		dlAnchorElem.setAttribute("href", dataStr);
		dlAnchorElem.setAttribute("download", "metadata.json");
		dlAnchorElem.click();
		angular.forEach($scope.selectedColumns, function(columns,table) {
			console.log("table",table,"columns",columns)
			columns = columns.join(",")
			query = "select " + columns + " from " + table + ";"
			data = {
				"query": query
			}
			$http.post("/exportCSV", data).then(function(data) {
				var dataStr = "data:application/csv;charset=utf-8," + encodeURIComponent(data.data);
				dlAnchorElem.setAttribute("href", dataStr);
				dlAnchorElem.setAttribute("download", table + ".csv");
				dlAnchorElem.click();
			})
		});
	}
})