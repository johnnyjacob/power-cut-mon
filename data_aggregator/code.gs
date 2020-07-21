function doGet(e) { 
  Logger.log( JSON.stringify(e) );  // view parameters
  var result = 'Ok'; // assume success
  if (e.parameter == 'undefined') {
    result = 'No Parameters';
  } else {
    var sheet_id = 'SPREADSHEETIDHERE';       // Spreadsheet ID
    var sheet = SpreadsheetApp.openById(sheet_id).getSheetByName("rawdata");
    var lastRow = sheet.getLastRow();

    Logger.log ("Last Row : " + lastRow);
    
    var newRow = 0;
    if ( lastRow == 0) {
      var rowData = [];
      //First entry in the sheet
      rowData[0] = rowData[1] = new Date();
      rowData[2] = 'ON';
      rowData[3] = 0;
      newRow = lastRow + 1;
      var newRange = sheet.getRange(newRow, 1, 1, rowData.length);
      newRange.setValues([rowData]);
    } else {
      // Entry exists. So use the previous values.
      var lastRange = sheet.getRange(lastRow, 1, 1, 4);
      var lastValues = lastRange.getValues();
      var previousEndTime = lastValues[1];
      var pingInterval = new Date() - previousEndTime;
      Logger.log ("Ping Interval : " + pingInterval);

      if ((pingInterval) > 60000) { //If it is > 60 seconds
        Logger.log ('Ping interval is greater. So Power Cut !!');
        var rowOneData = [];
        // Creating a new row and mark powercut        
        rowOneData[0] = previousEndTime;
        rowOneData[1] = new Date();
        rowOneData[2] = "OFF";
        rowOneData[3] = (rowOneData[1] - rowOneData[0])/ 1000;
        Logger.log(JSON.stringify(rowOneData));
        // Add row one data into the sheet
        newRow = lastRow + 1;
        var newRange = sheet.getRange(newRow, 1, 1, rowOneData.length);
        newRange.setValues([rowOneData]);

        // Creating a new row for 'ON'
        var rowTwoData = [];
        rowTwoData[0] = rowTwoData[1] = rowOneData[1];
        rowTwoData[2] = "ON";
        rowTwoData[3] = 0;
        Logger.log(JSON.stringify(rowTwoData));
        //Add row two data into the sheet
        newRow = lastRow + 2;
        var newRange = sheet.getRange(newRow, 1, 1, rowTwoData.length);
        newRange.setValues([rowTwoData]);
        
      } else { //Delta is within tollerance. Update end time only.
        lastValues[0][1] = new Date(); //New EndTime.
        lastValues[0][3] = (lastValues[0][1] - lastValues[0][0])/1000;
        lastRange.setValues(lastValues);
      }
    }  
  }
  // Return result of operation
  return ContentService.createTextOutput(result);
}

/**
* Remove leading and trailing single or double quotes
*/
function stripQuotes( value ) {
  return value.replace(/^["']|['"]$/g, "");
}
