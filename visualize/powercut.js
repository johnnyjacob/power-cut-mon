google.charts.load('current', {
    'packages': ['timeline']
});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
    var container = document.getElementById('timeline');
    var chart = new google.visualization.Timeline(container);
    var dataTable = new google.visualization.DataTable();

    dataTable.addColumn({type: 'string', id: 'Day'});
    dataTable.addColumn({type: 'string', id: 'Power'});
    dataTable.addColumn({type: 'string', id: 'style', role: 'style' });
    dataTable.addColumn({type: 'date', id: 'Start'});
    dataTable.addColumn({type: 'date', id: 'End'});

    var powerCutEvents = [];
    Papa.parse("http://localhost:1337/data.csv", { 
        download: true,
        header: true,
        delimiter: ",",
        step: function(row) {

            var start = new Date (Date.parse(row.data['start']));
            var end = new Date (Date.parse(row.data['end']));

            var momentStart = moment(start);
            var momentEnd = moment(end);

            if (momentStart.isSame(momentEnd, 'days')) {
                var startTime = new Date (0,0,0, start.getHours(), start.getMinutes(), start.getSeconds());
                var endTime = new Date (0,0,0, end.getHours(), end.getMinutes(), end.getSeconds());
                //Note : Issue with data - Sometimes there are entries with no interval. 
                if (endTime - startTime == 0)
                    return;
                if (row.data['state'].localeCompare ('OFF')) {
                    powerCutEvents.push ([momentStart.format('ll'), row.data['state'],'#0F9D58', startTime, endTime]);
                } else {
                    powerCutEvents.push ([momentStart.format('ll'), row.data['state'],'#DE5246', startTime, endTime]);
                }
            } else {
                while (!momentStart.isSame(momentEnd, 'days')) {
                    var startTime = new Date (0,0,0, start.getHours(), start.getMinutes(), start.getSeconds());
                    var endTime = new Date (0,0,0, 23,59, 59);
                    if (row.data['state'].localeCompare ('OFF')) {
                        powerCutEvents.push([momentStart.format('ll'), row.data['state'],'#0F9D58', startTime, endTime]);
                    } else {
                        powerCutEvents.push([momentStart.format('ll'), row.data['state'],'#DE5246', startTime, endTime]);
                    }
                    momentStart = momentStart.add(1, 'd').startOf('day');
                    start = momentStart.toDate();
                }
                var startTime = new Date (0,0,0, 0, 0, 1);
                var endTime = new Date (0,0,0, end.getHours(), end.getMinutes(), end.getSeconds());
                if (row.data['state'].localeCompare ('OFF')) {
                    powerCutEvents.push([momentStart.format('ll'), row.data['state'],'#0F9D58', startTime, endTime]);
                } else {
                    powerCutEvents.push([momentStart.format('ll'), row.data['state'],'#DE5246', startTime, endTime]);
                }
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
            powerCutEvents.reverse();
            dataTable.addRows(powerCutEvents);
            chart.draw(dataTable, options);
	    }
    });
}