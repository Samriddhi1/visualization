
'use strict';

var currTask = 0;
var details;
var dataSonar=[];
var dataJira=[];
var dataGit=[];
var jobnameSonar;
var jobnameJira;
var jobnameGitlab;

// title div with label and button
var mainDiv = d3.select("body").append("div");
mainDiv.style("margin-top","5%")
var AnotherDiv1 = mainDiv.append("div")
var header = AnotherDiv1.append("div").attr("class", "well1");
header.append("h3").text("Please select SonarQube Jobs").style("margin-left","7px").style("padding-top","17px");
AnotherDiv1.style("float","left")
var taskLabel = header.append("label")



//data=['Bajaj-BajajFinServ','groovy_ishu','BAT-Project_BAT']

var selectSonar = header.append("select")
   .attr('class','select')
   .attr('id','jobnameSonar')
    .style("margin-bottom", "20px")
    .style("text-align", "left")
    .style("margin-left","9px")
    .on('change',function() {
      d3.select("#svg1").remove();
     // d3.select("body").append("svg").attr("width", 600).attr("height", 300).attr("id","svg1");
     AnotherDiv1.append("svg").attr("width", "600").attr("height", "300").attr("id","svg1");
      jobnameSonar=$("#jobnameSonar").val();

       //getDetails();
        getDetailsForSonarQube()
        //getDetailsForJira()
       console.log("U choose the job "+$("#jobnameSonar").val())
    });


var AnotherDiv2 = mainDiv.append("div")
var header1 = AnotherDiv2.append("div").attr("class", "well1");

header1.append("h3").text("Please select Jira  Jobs").style("margin-left","7px").style("padding-top","17px");
AnotherDiv2.style("float","right")

var taskLabel = header1.append("label")

//data=['Bajaj-BajajFinServ','groovy_ishu','BAT-Project_BAT']

var selectJira = header1.append("select")
   .attr('class','select')
   .attr('id','jobnameJira')
    .style("margin-bottom", "20px")
    .style("width", "70%")
    .style("text-align", "left")
    .style("margin-left","9px")
    .on('change',function() {
      d3.select("#svg2").remove();
      //d3.select("body").append("svg").attr("width", 960).attr("height", 500).attr("id","svg2");
      AnotherDiv2.append("svg").attr("width", "600").attr("height", "300").attr("id","svg2");
        jobnameJira=$("#jobnameJira").val();
        getDetailsForJira();
    }); 


var AnotherDiv3 = mainDiv.append("div")
var header2 = AnotherDiv3.append("div").attr("class", "well1");

header2.append("h3").text("Please select GitLab  Jobs").style("margin-left","7px").style("padding-top","17px");
AnotherDiv3.style("clear","both").style("padding-top","10px")
var taskLabel = header2.append("label")


//data=['Bajaj-BajajFinServ','groovy_ishu','BAT-Project_BAT']

var selectGit = header2.append("select")
   .attr('class','select')
   .attr('id','jobnameGitlab')
    .style("margin-bottom", "20px")
    .style("width", "70%")
    .style("text-align", "left")
    .style("margin-left","9px")
    .on('change',function() {
      d3.select("#svg3").remove();
    //  d3.select("body").append("svg").attr("width", 960).attr("height", 500).attr("id","svg3");
    AnotherDiv3.append("svg").attr("width", "600").attr("height", "300").attr("id","svg3");
        jobnameGitlab=$("#jobnameGitlab").val();
        getDetailsForGitLab();
    }); 


 $.ajax({
        type: 'GET',
        url: "/cloudantcall",
        cache: false,
        contentType: 'application/json; charset=utf-8',
        timeout: 10000,
        async: true,
        dataType: "json",
        success: function(json) {

     console.log(JSON.stringify(json));
     getJiraJobs();
        details=json;
        dataSonar.push("Please select a job")
        json.docs.forEach(function(element) {console.log(JSON.stringify(element));
            if(element){
                if(element.Tool_Name){
                    if(element.Project_Name){
                        if (element.Tool_Name=="SonarQube"){
                            dataSonar.push(element.Project_Name);
                        }
                        
                    }
                }
            }
        }, this);

            console.log(json);
            var options = selectSonar
                .selectAll('option')
                .data(dataSonar).enter()
                .append('option')
                .text(function (d) { return d; });

        },error: function(status, err) {console.log(err)
            // $('#containerLoading').hide();
            console.log('Error getting the data');
            //TODO:100 update UI in case of an error status

        }

    });

function getJiraJobs(){
 $.ajax({
        type: 'GET',
        url: "/cloudantcallForJiraJobs",
        cache: false,
        contentType: 'application/json; charset=utf-8',
        timeout: 10000,
        async: true,
        dataType: "json",
        success: function(json) {

     console.log(JSON.stringify(json));
        details=json;
        dataJira.push("Please select a job")
        json.docs.forEach(function(element) {console.log(JSON.stringify(element));
            getGitLabJobs()
            if(element){
                if(element.Jira_Project_Name){
                        dataJira.push(element.Jira_Project_Name);
                }
            }

        }, this);

            console.log(json);
            var options = selectJira
                .selectAll('option')
                .data(dataJira).enter()
                .append('option')
                .text(function (d) { return d; });

        },error: function(status, err) {console.log(err)
            // $('#containerLoading').hide();
            console.log('Error getting the data');
            //TODO:100 update UI in case of an error status

        }

    });

}


function getGitLabJobs(){
 $.ajax({
        type: 'GET',
        url: "/cloudantcall",
        cache: false,
        contentType: 'application/json; charset=utf-8',
        timeout: 10000,
        async: true,
        dataType: "json",
        success: function(json) {

     console.log(JSON.stringify(json));
        details=json;
        dataGit=[];
        dataGit.push("Please select a job")
        json.docs.forEach(function(element) {console.log(JSON.stringify(element));
            if(element){
                if(element.Tool_Name){
                    if(element.Tool_Name=="GitLab"){
                        if(element.Project_Name){
                                dataGit.push(element.Project_Name);
                        }
                    }
                }
            }

        }, this);

            console.log(json);
            var options = selectGit
                .selectAll('option')
                .data(dataGit).enter()
                .append('option')
                .text(function (d) { return d; });

        },error: function(status, err) {console.log(err)
            // $('#containerLoading').hide();
            console.log('Error getting the data');
            //TODO:100 update UI in case of an error status

        }

    });

}


var getDetails=function(){


        $.ajax({
        type: 'GET',
        url: "/cloudantcallforid?jobname="+jobname,
        cache: false,
        contentType: 'application/json; charset=utf-8',
        timeout: 10000,
        async: true,
        dataType: "json",
        success: function(json) {

     console.log(JSON.stringify(json));
        details=json;
        setTimeout(setgraph,1000);
        },error: function(status, err) {
            // $('#containerLoading').hide();
            console.log('Error getting the data');
            //TODO:100 update UI in case of an error status

        }

    });
}



function getDetailsForJira(){


        $.ajax({
        type: 'GET',
        url: "/cloudantcallforidJira?JiraJobname="+jobnameJira,
        cache: false,
        contentType: 'application/json; charset=utf-8',
        timeout: 10000,
        async: true,
        dataType: "json",
        success: function(json) {

     console.log(JSON.stringify(json));
        details=json;
        setTimeout(setgraph("#svg2"),10000);

        },error: function(status, err) { console.log(JSON.stringify(err));
            // $('#containerLoading').hide();
            console.log('Error getting the data');
            //TODO:100 update UI in case of an error status

        }

    });
}


function getDetailsForSonarQube(){

  $.ajax({
        type: 'GET',
        url: "/cloudantcallforidSonarQube?SonarJobname="+jobnameSonar,
        cache: false,
        contentType: 'application/json; charset=utf-8',
        timeout: 10000,
        async: true,
        dataType: "json",
        success: function(json) {

     console.log(JSON.stringify(json));
        // details=json;
         setTimeout(setgraph("#svg1"),10000);

        },error: function(status, err) {
            // $('#containerLoading').hide();
            console.log('Error getting the data');
            //TODO:100 update UI in case of an error status

        }

    });

}

function getDetailsForGitLab(){

  $.ajax({
        type: 'GET',
        url: "/cloudantcallforidGitLab?GitLabJobname="+jobnameGitlab,
        cache: false,
        contentType: 'application/json; charset=utf-8',
        timeout: 10000,
        async: true,
        dataType: "json",
        success: function(json) {

     console.log(JSON.stringify(json));
        // details=json;
         setTimeout(setgraph("#svg3"),10000);

        },error: function(status, err) {
            // $('#containerLoading').hide();
            console.log('Error getting the data');
            //TODO:100 update UI in case of an error status

        }

    });

}

// function setgraph(id){
// console.log("inside graph "+id)
// var svg = d3.select(id),
//     margin = {top: 20, right: 80, bottom: 30, left: 50},
//     width = svg.attr("width") - margin.left - margin.right,
//     height = svg.attr("height") - margin.top - margin.bottom,
//     g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var parseTime = d3.timeParse("%Y%m%d");

// var x = d3.scaleTime().range([0, width]),
//     y = d3.scaleLinear().range([height, 0]),
//     z = d3.scaleOrdinal(d3.schemeCategory10);

// var line = d3.line()
//     .curve(d3.curveBasis)
//     .x(function(d) { return x(d.date); })
//     .y(function(d) { return y(d.temperature); });

// d3.tsv("./data.tsv", type, function(error, data) {
//   if (error) throw error;

//   var cities = data.columns.slice(1).map(function(id) {
//     return {
//       id: id,
//       values: data.map(function(d) {
//         console.log(JSON.stringify(d));
//         console.log(JSON.stringify({date: d.date, temperature: d[id]}))
//         return {date: d.date, temperature: d[id]};
//       })
//     };
//   });

//   x.domain(d3.extent(data, function(d) { return d.date; }));

//   y.domain([
//     d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.temperature; }); }),
//     d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.temperature; }); })
//   ]);

//   z.domain(cities.map(function(c) { return c.id; }));

//   g.append("g")
//       .attr("class", "axis axis--x")
//       .attr("transform", "translate(0," + height + ")")
//       .call(d3.axisBottom(x));

//   g.append("g")
//       .attr("class", "axis axis--y")
//       .call(d3.axisLeft(y))
//     .append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 6)
//       .attr("dy", "0.71em")
//       .attr("fill", "#000")
//       .text("Builds");

//   var city = g.selectAll(".city")
//     .data(cities)
//     .enter().append("g")
//       .attr("class", "city");

//   city.append("path")
//       .attr("class", "line")
//       .attr("d", function(d) { return line(d.values); })
//       .style("stroke", function(d) { return z(d.id); });

//   city.append("text")
//       .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
//       .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
//       .attr("x", 3)
//       .attr("dy", "0.35em")
//       .style("font", "10px sans-serif")
//       .text(function(d) { return d.id; });
// });

// function type(d, _, columns) {
//   d.date = parseTime(d.date);
//   for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
//   return d;
// }

// }




function setgraph(id){

//     var svg = d3.select(id),
//     margin = {top: 20, right: 20, bottom: 30, left: 40},
//     width = +svg.attr("width") - margin.left - margin.right,
//     height = +svg.attr("height") - margin.top - margin.bottom;

//    var parseTime = d3.timeParse("%Y%m%d");

//    var x = d3.scaleTime().range([0, width]),
//     y = d3.scaleLinear().range([height, 0])

// var g = svg.append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// d3.tsv("data.tsv", function(d) {
//   d.No_Of_Violations = +d.No_Of_Violations;
//   console.log(JSON.stringify(d));
//   return d;
// }, function(error, data) {
//   if (error) throw error;

//   x.domain(data.map(function(d) { return d.date; }));
//   y.domain([0, d3.max(data, function(d) { return d.No_Of_Violations; })]);

//  g.append("g")
//       .attr("class", "axis axis--x")
//       .attr("transform", "translate(0," + height + ")")
//       .call(d3.axisBottom(x));

//   g.append("g")
//       .attr("class", "axis axis--y")
//       .call(d3.axisLeft(y))
//     .append("text")
//       .attr("transform", "rotate(-90)")
//       .attr("y", 6)
//       .attr("dy", "0.71em")
//       .attr("fill", "#000")
//       .text("Builds");

//   g.selectAll(".bar")
//     .data(data)
//     .enter().append("rect")
//       .attr("class", "bar")
//       .attr("x", function(d) { return x(d.date); })
//       .attr("y", function(d) { return y(d.No_Of_Violations); })
//       .attr("width", x.bandwidth())
//       .attr("height", function(d) { return height - y(d.No_Of_Violations); });
// });

var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// Parse the date / time
var	parseDate = d3.timeParse("%Y-%m");

var x = d3.scaleBand().rangeRound([0, width]).paddingInner(0.05);

var y = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom(x)
    .tickFormat(d3.timeFormat("%Y-%m-%d"));

var yAxis = d3.axisLeft(y)
    .ticks(10);

var parseTime = d3.timeParse("%Y%m%d");

var svg = d3.select(id)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data.csv", function(error, data) {

    data.forEach(function(d) {console.log(d.date)
        d.date = parseTime(d.date);
        d.value = +d.value;
        console.log(d)
    });
	
  x.domain(data.map(function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.20em")
      .attr("transform", "rotate(-90)" );

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Value ($)");

  svg.selectAll("bar")
      .data(data)
    .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", function(d) { return x(d.date); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });

});


}