/**
 * ===============[ TABLE OF CONTENTS ]===============
 * 1. Functions
 *   1.1 
 ******************************************************/
/* ===============[ Libraries ]========================*/
var PrettyTable = require("cli-table2");
var colors = require("colors");

/* ===============[ 1. FUNCTIONS ]====================*/
let Func = {
  // Loop through an array of objects
  loopArrayObject: function (resultsArray) {
    var top_row = [];
    var rows = [];

    for (var i = 0; i < resultsArray.length; i++) {
      var cells = [];

      for (var property in resultsArray[i]) {
        if (resultsArray[i].hasOwnProperty(property)) {
          if (top_row === undefined || top_row.length < Object.keys(resultsArray[i]).length) {
            top_row.push(property.red);
          }
          cells.push(resultsArray[i][property].toString().green);
        }
      }

      rows.push(cells);
    }

    var Table = new PrettyTable({
      head: top_row,
    });

    for (var r = 0; r < rows.length; r++) {
      Table.push(rows[r]);
    }

    console.log(Table.toString());
  },

  // Loop through an object
  loopObject: function (resultsObject) {
    var top_row = [];
    var rows = [];
    var cells = [];

    for (var property in resultsObject) {

      if (resultsObject.hasOwnProperty(property)) {
        if (top_row === undefined || top_row.length < Object.keys(resultsObject).length) {
          top_row.push(property.red);
        }
        cells.push(resultsObject[property].toString().green);
      }
    }

    rows.push(cells);

    var Table = new PrettyTable({
      head: top_row,
    });

    for (var r = 0; r < rows.length; r++) {
      Table.push(rows[r]);
    }

    console.log(Table.toString());
    return;
  },

}

module.exports = Func;