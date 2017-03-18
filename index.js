const express = require('express')
var bodyParser = require('body-parser');
var path = require('path');
var mysql = require('mysql');
var connection=""

const app = express()
app.use(express.static('public'))
app.use(bodyParser());

app.get('/', function(req, res) {
    res.sendfile(path.join(__dirname, 'public', 'index.html'));
})

app.post('/connect', function(req, res) {
    console.log(req.body)
    var username = req.body.username;
    var password = req.body.password;
    var database = req.body.database;


    connection = mysql.createConnection({
        host: 'localhost',
        user: username,
        password: password,
        database: database
    });
    connection.connect();
    connection.query('show tables;', function(err, rows, fields) {
        if (!err)
            res.send(rows);
        else
            console.log('Error while performing Query.');
    });

});


app.post('/columns', function(req, res) {
    var selectedTables=req.body;
    var columns_in_tables={}
    var count=0
    console.log("lenght:",selectedTables.length)
    for(table in selectedTables){
    	console.log("i:",table,"name:",selectedTables[table])
    	tableName=selectedTables[table]
    	query="select column_name from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME='"+tableName+"';"
    	connection.query(query,function(err,rows,fields){

    		if(!err){
    			count+=1;
    			columns_in_tables[selectedTables[count-1]]=rows;

    			if(count==selectedTables.length){
    				console.log("i:",table)
    				res.send(columns_in_tables)
    			}
    		}
    			
    		else
    			console.log('Error while performing Query.');

    	})
    }
    
    

});


app.listen(3000);