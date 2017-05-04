const express = require('express')
var bodyParser = require('body-parser');
var path = require('path');
var mysql = require('mysql');
var connection = ""
var fileUpload = require('express-fileupload');
var csv = require('express-csv');
const fs = require('fs');

var uuid=require("node-uuid")


var csv = require('csv-stream')
var spawn = require('child_process').spawn

const app = express()


app.use(express.static('public'))
app.use(bodyParser());
app.use(fileUpload());

app.get('/', function(req, res) {
    res.sendfile(path.join(__dirname, 'public', 'metadataGeneration.html'));
})

app.post('/connect', function(req, res) {
    console.log(req.body)
    var username = req.body.username;
    var password = req.body.password;
    var database = req.body.database;
    var host=req.body.host;


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
            console.log('Error while performing Query.');
    });

});

app.post("/exportCSV", function(req, res) {

    connection = mysql.createConnection({
        host: 'localhost',
        user: "root",
        password: "",
        database: "somedb"
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
            res.csv(rows);
        }
    })

});

app.get("/exportCDA", function(req, res) {

    res.sendfile(path.join(__dirname, 'public', 'exportToCDA.html'));

})



app.post("/exportCDA", function(req, res) {

    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    csvFiles = req.files.csvFiles;
    no_files = csvFiles.length
    metadata = JSON.parse(req.files.metadata.data);

    no_files = csvFiles.length

    id=[]
    path="cdaExport/output"+uuid.v4();
    fs.mkdir(path,0777,function(err){

        if(err)
            res.send(err)

        for (var file in csvFiles) {

            data=csvFiles[file].data.toString()
            tablename=csvFiles[file].filename
            meta=metadata[tableName]
            data=data.split(/\r?\n/)
            header=[]
            for(var row in data){
                if(row==0){
                    header=data[row]
                }

            }
            
            
            console.log(data.length)
        }


    })

});

app.post('/columns', function(req, res) {
    var selectedTables = req.body;
    var columns_in_tables = {}
    var count = 0
    console.log("lenght:", selectedTables.length)
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

});


app.listen(3000);