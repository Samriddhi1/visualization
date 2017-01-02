var Cloudant = require('cloudant');
var db = null;
var initialize = function(config, callback) {
    console.log("**** Initializing cloudant database");
    console.log(JSON.stringify(config))
    db = Cloudant(config.url).db;
    db.create(config.db, function(err, status, data) {
        if (err && err.error != "file_exists") {
            console.log("Error creating Database" + JSON.stringify(err));
            throw err;
        } else {
            db = db.use(config.db);
            var index=[];
            db.index(function(er, result) {
                if (er) {
                    console.log("Error fetching indexes" + JSON.stringify(er));
                    throw er;
                }
                console.log('The cloudant database has %d indexes', result.indexes.length);
                for (var i = 0; i < result.indexes.length; i++) {
                    index.push(result.indexes[i].name);
                   }
                if(index.indexOf('DataObject.Build_details.job_name') == -1){
                    db.index({ name: 'DataObject.Build_details.job_name', type: 'json', index: { fields: ['DataObject.Build_details.job_name'] } });
                    }
                  if(index.indexOf('tool_name') == -1){
                    db.index({ name: 'tool_name', type: 'json', index: { fields: ['tool_name'] } });
                    }
                    if(index.indexOf('start_date') == -1){
                    db.index({ name: 'start_date', type: 'json', index: { fields: ['start_date'] } });
                    }
                    if(index.indexOf('end_date') == -1){
                    db.index({ name: 'end_date', type: 'json', index: { fields: ['end_date'] } });
                    }
                    if(index.indexOf('DataObject.Build_details.build_count') == -1){
                    db.index({ name: 'DataObject.Build_details.build_count', type: 'json', index: { fields: ['DataObject.Build_details.build_count'] } });
                    }
                });
            }
        });
    }

var getJobs=function(callback){console.log("insde get Jobs")

     var selector = {
        "selector": {
            "_id": {
            "$gt": 0
            }
        },
        "fields": [
            "DataObject.Build_details.job_name",
            "Tool_Name",
            "Project_Name"
        ],

    }

    console.log(selector)
    db.find(selector, callback);
    // db.list({'include_docs':true}, callback);
};

var getJira=function(callback){console.log("insde get Jobs")


     var selector = {
                "selector": {
                    "Tool_Name": {
                    "$eq": "Jira"
                    }
                },
                "fields": [
                    "Jira_Project_Name"
                ],
                "sort": [
                    {
                    "_id": "asc"
                    }
                ]
            }

    console.log(selector)
    db.find({
                "selector": {
                    "Tool_Name": {
                    "$eq": "Jira"
                    }
                },
                "fields": [
                    "Jira_Project_Name"
                ],
                "sort": [
                    {
                    "_id": "asc"
                    }
                ]
            }, callback);
    // db.list({'include_docs':true}, callback);
};


var getJobsdetails=function(jobname,callback){
    console.log("insde get Jobsname "+jobname)

     var selector={
            "selector": {
                "DataObject.Build_details.job_name": {
                "$eq": jobname
                }
            },
            "fields": [
                "Tool_Name",
                "start_date",
                "end_date",
                "DataObject.Build_details.build_count",
                "project_ID"
            ],
            "sort": [
                {
                "_id": "asc"
                }
            ]
            }

    console.log(selector)
    db.find(selector, callback);
    // db.list({'include_docs':true}, callback);
};


var getJiradetails=function(JiraJobname,callback){
    console.log("insde get Jobsname "+JiraJobname)

     var selector={
            "selector": {
                "Jira_Project_Name": {
                "$eq": JiraJobname
                }
            },
            "fields": [
                "Tool_Name",
                "Timestamp",
                "Issues_Count",
                "DataObject"
            ],
            "sort": [
                {
                "_id": "asc"
                }
            ]
            }

    console.log(selector)
    db.find(selector, callback);
    // db.list({'include_docs':true}, callback);
};


var getSonardetails=function(SonarQubeJobname,callback){
    console.log("insde get Jobsname "+SonarQubeJobname)

     var selector={
            "selector": {
                "Project_Name": {
                "$eq": SonarQubeJobname
                }
            },
            "fields": [
                "Tool_Name",
                "DataObject"
                
            ],
            "sort": [
                {
                "_id": "asc"
                }
            ]
            }

    console.log(selector)
    db.find(selector, callback);
    // db.list({'include_docs':true}, callback);
};




var getGitLabdetails = function(GitLabJobname,callback){

     console.log("insde get Jobsname "+GitLabJobname)

     var selector={
            "selector": {
                "Project_Name": {
                "$eq": GitLabJobname
                }
            },
            "fields": [
                "Tool_Name",
                "DataObject"
                
            ],
            "sort": [
                {
                "_id": "asc"
                }
            ]
            }

    console.log(selector)
    db.find(selector, callback);
    // db.list({'include_docs':true}, callback);
};






exports.initialize = initialize;
exports.getJobs = getJobs;
exports.getJobsdetails = getJobsdetails;
exports.getJira = getJira;
exports.getJiradetails = getJiradetails;
exports.getSonardetails = getSonardetails;
exports.getGitLabdetails = getGitLabdetails;



