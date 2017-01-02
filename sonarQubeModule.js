var json2csv = require('json2csv')
var fs = require('fs');
var cloudantclient = require('./cloudantclient');

var getSonarQubeDetails = function(req,res,callback){

           //debugger;
    //data.docs[0].DataObject.Build_details.build_count
     var tsvarr=[];
    console.log(req.query.SonarJobname)
    cloudantclient.getSonardetails(req.query.SonarJobname,function(err, data, result) {
        console.log(data);
        if (data && data.docs) {
            if(data.docs[0].Tool_Name=="SonarQube"){
              if(data.docs[0].DataObject){
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
                tsvarr.push({'date': thirtydays,'value':0});
                for(i=0;i<=data.docs[0].DataObject.length;i++){
                   if(data.docs[0].DataObject[i]){
                      if(data.docs[0].DataObject[i].TimeStamp){ 
                          dateToBeConverted=data.docs[0].DataObject[i].TimeStamp.split(":")[0].split("T")[0].replace(/-/g,'');
                          temp={date:dateToBeConverted,value:data.docs[0].DataObject[i].No_Of_Violations}
                          tsvarr.push(temp);
                       } 
                    }
                }
              }
              console.log(JSON.stringify(tsvarr));
                var fields = ['date','value']
                var tsvfiledata=json2csv({data:tsvarr,fields:fields,quotes:'',includeEmptyRows:false })
                fs.writeFile('./public/data.csv',tsvfiledata, function(err) {
                    console.log(tsvfiledata);
                   if (err) throw err;
                   console.log('file saved');
                   callback()
                  // res.status(200).json(data)
               });

            }

           
        }
    });

}

exports.getSonarQubeDetails = getSonarQubeDetails;