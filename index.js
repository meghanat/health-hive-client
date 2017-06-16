const express = require('express')
var bodyParser = require('body-parser');
var path = require('path');
var mysql = require('mysql');
var connection = ""
var fileUpload = require('express-fileupload');
var csv = require('express-csv');
const fs = require('fs');
var pg=require("pg");
var uuid=require("node-uuid");


var csv = require('csv-stream')
var spawn = require('child_process').spawn

const app = express()

var dbms="";
var username="";
var password="";
var database="";
var host="";
var conString="";


app.use(express.static('public'))
app.use(bodyParser());
app.use(fileUpload());

app.get('/', function(req, res) {
    res.sendfile(path.join(__dirname, 'public', 'metadataGeneration.html'));
})

app.post('/connect', function(req, res) {
    console.log(req.body)
    username = req.body.username;
    password = req.body.password;
    database = req.body.database;
    host=req.body.host;
    dbms=req.body.dbms;

    if(dbms=="bahmni")
    {
        connection = mysql.createConnection({
            host: host,
            user: username,
            password: password,
            database: openmrs
        });

        connection.connect();
        console.log("")
    }

    else if(dbms=="mysql")
    {
        connection = mysql.createConnection({
            host: host,
            user: username,
            password: password,
            database: database
        });
        connection.connect();
        connection.query('show tables;', function(err, rows, fields) {
            if (!err)
                res.send(rows);
            else
                res.send('Error while performing Query.');
        });
    }
    else if(dbms=="postgres"){

        conString = "pg://"+username+"@"+host+":5432/"+database;
        connection = new pg.Client(conString);
        connection.connect();
        connection.query("select tablename from pg_catalog.pg_tables where schemaname='public'",function(err,result){

            if(err){
                console.log(err)
                res.send("Error while performing Query")
            }
            else{
                rows=[]
                for(var i=0;i<result.rows.length;i++){
                    console.log(result.rows[i].tablename)
                    rows.push(result.rows[i].tablename)
                }
                res.send(rows)
            }
        });

    }

});

app.post("/exportCSV", function(req, res) {

    if(dbms=="mysql"){
        connection = mysql.createConnection({
            host: host,
            user: username,
            password: password,
            database:database
        });
        connection.connect();
        var query = req.body.query;
        console.log(query)

        connection.query(query, function(err, rows, fields) {
            if (!err) {
                console.log("fetched")
                var headers = {};
                for (key in rows[0]) {
                    headers[key] = key;
                }
                rows.unshift(headers);
                console.log(rows)
                res.csv(rows);
            }
        })
    }
    else if(dbms=="postgres"){

        connection = new pg.Client(conString);
        connection.connect();
        var query = req.body.query;
        connection.query(query, function(err, result) {
            if (!err) {
                console.log("fetched")
                var headers = {};
                for (key in result.rows[0]) {
                    headers[key] = key;
                }
                result.rows.unshift(headers);
                res.csv(result.rows);
            }
        })

        }
        
});


app.post('/columns', function(req, res) {
    var selectedTables = req.body;
    var columns_in_tables = {}
    var count = 0
    console.log("length:", selectedTables.length)

    if(dbms=="mysql"){
        for (table in selectedTables) {
            console.log("i:", table, "name:", selectedTables[table])
            tableName = selectedTables[table]
            query = "select column_name from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME='" + tableName + "';"
            connection.query(query, function(err, rows, fields) {

                if (!err) {
                    count += 1;
                    columns_in_tables[selectedTables[count - 1]] = rows;

                    if (count == selectedTables.length) {
                        console.log("i:", table)
                        res.send(columns_in_tables)
                    }
                } else
                    console.log('Error while performing Query.');

            })
        }
    }
    else if(dbms=="postgres"){

        connection = new pg.Client(conString);
        connection.connect();
        for (table in selectedTables) {
            console.log("i:", table, "name:", selectedTables[table])
            tableName = selectedTables[table]
            
            connection.query("select column_name from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME='" + tableName + "';",function(err,result){
              // client.query("select column_name from INFORMATION_SCHEMA.COLUMNS where TABLE_NAME='limb_data';",function(err,result){
            if(err){
                console.log(err)
                res.send("Error while performing Query")
            }
            else{
                
                count += 1;
                var columns=[]
                for(var i=0;i<result.rows.length;i++){
                    columns.push(result.rows[i])
                }
                    columns_in_tables[selectedTables[count - 1]] = columns;

                    if (count == selectedTables.length) {
                        console.log("i:", table)
                        res.send(columns_in_tables)
                    }
            }
        });
        }
        
    }
});


app.listen(3000);