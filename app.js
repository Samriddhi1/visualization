/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var cloudantclient = require('./cloudantclient');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

var TSV = require('tsv');
var json2csv = require('json2csv')
var config = require('./config.json');
var JiraModule = require('./JiraModule.js');
var gitLabModule = require('./gitLabModule.js');
var sonarQubeModule = require('./sonarQubeModule.js');
//var CSV = new Parser(",", { header: false })
var fs = require('fs');

var configure=function(){

        var url = config.cludanturl
        var db = config.cloudantDB;
        console.log(url);
        console.log(db);
        cloudantclient.initialize({
            url: url,
            db: db
        }, function() {
            console.log('Cloudant database initialized');
        });
}

configure();

app.get('/cloudantcall', function(req, res) {
    //debugger;
    cloudantclient.getJobs(function(err, data, result) {
        console.log(data);
        if (data && data.docs) {
            res.json('200', data)
        }
    });
})

app.get('/cloudantcallForJiraJobs', function(req, res) {
    //debugger;
    JiraModule.getJiraJobs(function(data){
        res.status('200').json(data)
    });
})



app.get('/cloudantcallforidJira', function(req,res) {

     JiraModule.getJiraDetails(req,res,function(){
        res.status('200').json({})
    })
    
  });


app.get('/cloudantcallforidGitLab', function(req, res) {

         gitLabModule.getGitLabDetails(req,res,function(){
            res.status('200').json({})
        })
  });


app.get('/cloudantcallforidSonarQube', function(req, res) {
      sonarQubeModule.getSonarQubeDetails(req,res,function(){
            res.status('200').json({})
        })
})

app.get('/cloudantcallforid', function(req, res) {
    //debugger;
    //data.docs[0].DataObject.Build_details.build_count
    console.log(req.query.jobname)
    cloudantclient.getJobsdetails(req.query.jobname,function(err, data, result) {
        console.log(data);
        if (data && data.docs) {
            if(data.docs[0].tool_name=="Jenkins"){
              dateToBeConverted=data.docs[0].start_date.replace(/-/g,'');
              var tsvfiledata=TSV.stringify([
                  {date:dateToBeConverted,jenkins:10},
                  {date:20161022,jenkins:15},
                  {date:20161122,jenkins:18},
                  {date:20161222,jenkins:22}

                ]);
                fs.writeFile('./public/data.tsv',tsvfiledata, function(err) {
                    console.log(tsvfiledata);
                   if (err) throw err;
                   console.log('file saved');

               });

            }

            res.json('200', data)
        }
    });
})
