var json2csv = require('json2csv')
var fs = require('fs');
var cloudantclient = require('./cloudantclient');

var getJiraJobs = function(callback){

    cloudantclient.getJira(function(err, data, result) {
        console.log(data);
        if (data && data.docs) {
            //res.status('200').json(data)
            callback(data);
        }
    });
}




var getJiraDetails = function(req,res,callback){

    var resultDate = {};
    var finalresult = [];
    var datesCompare = [];
 cloudantclient.getJiradetails(req.query.JiraJobname,function(err, data, result) {
       console.log(JSON.stringify(data));
        if (data && data.docs) {
            if(data.docs[0].Tool_Name=="Jira"){
              for(var d in data.docs){
                    for(var dt in data.docs[d].DataObject){
                        // console.log(JSON.stringify(data[d].DataObject[dt]));
                        dateToBeCompared=data.docs[d].DataObject[dt].Jira_Issue_Updated.split("T")[0].replace(/-/g,'');
                        resultDate[dateToBeCompared] = resultDate[dateToBeCompared] ? resultDate[dateToBeCompared] + 1 : 1;
                    }
            }
            var thirtydays = new Date();
            thirtydays.setDate(thirtydays.getDate()-100);
            var pdd = thirtydays.getDate();
            var pmm = thirtydays.getMonth()+1;
            var pyyyy = thirtydays.getFullYear();
            if(pdd<10){
                    pdd='0'+pdd
                } 
                if(pmm<10){
                    pmm='0'+pmm
                } 
             thirtydays = pyyyy.toString()+pmm.toString()+pdd.toString();
              finalresult.push({'date': thirtydays, 'value':0});
            for(var r in resultDate){
                    finalresult.push({'date':r, 'value':resultDate[r]});
                }
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth()+1; //January is 0!

                var yyyy = today.getFullYear();
                if(dd<10){
                    dd='0'+dd
                } 
                if(mm<10){
                    mm='0'+mm
                } 
                var today = yyyy.toString()+mm.toString()+dd.toString();
                finalresult.push({'date':today, 'value':'0'});


                var fields = ['date','value']
                var tsvfiledata=json2csv({data:finalresult,fields:fields,quotes:'',includeEmptyRows:false })
                fs.writeFile('./public/data.csv',tsvfiledata, function(err) {
                    console.log(tsvfiledata);
                   if (err) throw err;
                   console.log('file saved');
                   callback();
                   //res.status(200).json({});
               });
                console.log(finalresult);
            }
            
       }
    });
}


exports.getJiraJobs = getJiraJobs;
exports.getJiraDetails = getJiraDetails;