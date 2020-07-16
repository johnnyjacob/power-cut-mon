google.charts.load('current', {
    'packages': ['timeline']
});
google.charts.setOnLoadCallback(drawChart);


function fetchData(sheet_id){
    var dataTable = new google.visualization.DataTable();
    //return datatable
}

function drawChart() {
    var container = document.getElementById('timeline');
    var chart = new google.visualization.Timeline(container);
    var dataTable = new google.visualization.DataTable();
    var on_color = '#0F9D58';
    var off_color = '#de5246';
    dataTable.addColumn({type: 'string', id: 'Day'});
    dataTable.addColumn({type: 'string', id: 'Power'});
    dataTable.addColumn({type: 'string', id: 'style', role: 'style' });
    dataTable.addColumn({type: 'date', id: 'Start'});
    dataTable.addColumn({type: 'date', id: 'End'});

    Papa.parse("http://localhost:1337/data.csv", { 
        download: true,
        header: true,
        delimiter: ",",
        step: function(row) {
            //console.log(row.data);
            var start = new Date (Date.parse(row.data['start']));
            var end = new Date (Date.parse(row.data['end']));

            var momentStart = moment(start);
            var momentEnd = moment(end);

            if (momentStart.isSame(momentEnd, 'days')) {
                var startTime = new Date (0,0,0, start.getHours(), start.getMinutes(), start.getSeconds());
                var endTime = new Date (0,0,0, end.getHours(), end.getMinutes(), end.getSeconds());
                if (row.data['state'].localeCompare ('OFF')) {
                    dataTable.addRow([momentStart.format('ll'), row.data['state'],'#0F9D58', startTime, endTime]);
                } else {
                    dataTable.addRow([momentStart.format('ll'), row.data['state'],'#DE5246', startTime, endTime]);
                }
            } else {
                while (!momentStart.isSame(momentEnd, 'days')) {
                    var startTime = new Date (0,0,0, start.getHours(), start.getMinutes(), start.getSeconds());
                    var endTime = new Date (0,0,0, 23,59, 59);
                    if (row.data['state'].localeCompare ('OFF')) {
                        dataTable.addRow([momentStart.format('ll'), row.data['state'],'#0F9D58', startTime, endTime]);
                    } else {
                        dataTable.addRow([momentStart.format('ll'), row.data['state'],'#DE5246', startTime, endTime]);
                    }
                    momentStart = momentStart.add(1, 'd').startOf('day');
                    start = momentStart.toDate();
                }
                var startTime = new Date (0,0,0, 0, 0, 1);
                var endTime = new Date (0,0,0, end.getHours(), end.getMinutes(), end.getSeconds());
                if (row.data['state'].localeCompare ('OFF')) {
                    dataTable.addRow([momentStart.format('ll'), row.data['state'],'#0F9D58', startTime, endTime]);
                } else {
                    dataTable.addRow([momentStart.format('ll'), row.data['state'],'#DE5246', startTime, endTime]);
                }

                console.log ("Not same day..");
            }

        },
	    complete: function(results) {
            console.log(results);
            console.log ("Total Items in DataTable : ", dataTable.getNumberOfRows());
            var options = {
                timeline: {
                    showRowLabels: true,
                    colorByRowLabel: true,
                    avoidOverlappingGridLines: true,
                    groupByRowLabel: true
                },
            };
        
            chart.draw(dataTable, options);
	    }
    });
    console.log ("Total Items Outside: ", dataTable.getNumberOfRows());

    // dataTable.addRows([
    //     ['Monday', 'ON ', '#0F9D58', new Date(Date.parse('5/3/2020 12:27:50')), new Date(Date.parse('5/3/2020 13:44:49'))],
    //     ['Monday', 'OFF', '#DB4437', new Date(Date.parse('5/3/2020 13:44:49')), new Date(Date.parse('5/3/2020 13:48:18'))],
    //     ['Monday', 'ON ', '#0F9D58', new Date(Date.parse('5/3/2020 13:48:18')), new Date(Date.parse('5/3/2020 15:09:03'))],
    //     ['Monday', 'OFF', '#DB4437', new Date(Date.parse('5/3/2020 15:09:03')), new Date(Date.parse('5/3/2020 15:14:13'))],
    //     ['Monday', 'ON ', '#0F9D58', new Date(Date.parse('5/3/2020 15:14:13')), new Date(Date.parse('5/3/2020 17:13:45'))],
    //     ['Monday', 'OFF', '#DB4437', new Date(Date.parse('5/3/2020 17:13:45')), new Date(Date.parse('5/3/2020 17:18:55'))],
    //     ['Monday', 'ON ', '#0F9D58', new Date(Date.parse('5/3/2020 17:18:55')), new Date(Date.parse('5/3/2020 18:30:44'))],
    //     ['Monday', 'OFF', '#DB4437', new Date(Date.parse('5/3/2020 18:30:44')), new Date(Date.parse('5/3/2020 18:36:51'))],
    //     ['Monday', 'ON ', '#0F9D58', new Date(Date.parse('5/3/2020 18:36:51')), new Date(Date.parse('5/3/2020 20:24:24'))],
    //     ['Monday', 'OFF', '#DB4437', new Date(Date.parse('5/3/2020 20:24:24')), new Date(Date.parse('5/3/2020 20:29:34'))],
    //     ['Monday', 'ON ', '#0F9D58', new Date(Date.parse('5/3/2020 20:29:34')), new Date(Date.parse('5/4/2020 0:14:08'))],
    //     ['Tuesday', 'OFF', '#DB4437', new Date(Date.parse('5/4/2020 0:14:08')), new Date(Date.parse('5/4/2020 0:19:1'))],
    //     ['Tuesday', 'ON ', '#0F9D58', new Date(Date.parse('5/4/2020 0:19:18')), new Date(Date.parse('5/4/2020 7:04:0'))],
    // ]);


    var options = {
        timeline: {
            showRowLabels: true,
            colorByRowLabel: true,
            avoidOverlappingGridLines: true,
            groupByRowLabel: true
        },
    };

    chart.draw(dataTable, options);
}