mysql = require('mysql');
__ = require('underscore');

errorThrower = function (err) {
  if (err) {console.log(err);}
};

conditionStringGenerator = function (importedCondition, conditions) {
  var
  conditionKeys = __.keys(conditions),
  conditionString = '';
  if (importedCondition) {
    conditionString += importedCondition;
    if (conditionKeys.length) {
      conditionString += ' AND';
    }
  }
  for (var i=0; i<conditionKeys.length; i++) {
    conditionString += ' `'+ conditionKeys[i] + '` = "'+ conditions[conditionKeys[i]]+'" ';
    if (conditionKeys[i+1]) {
      conditionString += ' AND ';
    }
  }
  return conditionString || 1;
};

levelSelector = function (table, importedCondition ,conditions, exportFields, exportFunction) {
  connection.query(
    'SELECT '+ exportFields.join() + ' FROM '+ table + ' WHERE '+ conditionStringGenerator(importedCondition, conditions),
    function (err, results) {
      errorThrower(err);
      if (results) {
        exportFunction(results);
      }
    }
  );
};

dbStart = function () {
  connection = mysql.createConnection({user: 'root', password: ''});
  connection.connect();
  connection.query('USE test');
};

dbEnd = function () {
  connection.end();
};

/**
 * the function to check if a user has a particular permission
 * @param  {String} username the session saved in client's browser
 * @param  {String} command  the work to be done. possible commands are
 * select, insert, update, delete, updateBulk, insertBulk, download, show
 * @param  {String} content  name of the table, partial or link to check permission
 */
dbCheckPermission = function (username, command, content, exportFunction) {
  var
  finalPermission = {
    permission: false,
    information: ''
  },
  selectionArray = [
    {
      table: "users",
      conditions: {
        Username: username
      },
      exportFields: ["ID"]
    },
    {
      table: "user_permissions",
      conditions: {},
      importedCondition: "UserId",
      exportFields: ["PermissionId"]
    },
    {
      table: "permissions",
      importedCondition: "PermissionNameId",
      conditions: {
        Content: content,
        Command: command
      },
      exportFields: ["ID", "Information"]
    }
  ];
  dbStart();
  selector(selectionArray, function (results) {
    if (results[0].ID){
      finalPermission.permission = true;
      finalPermission.information = results[0].Information;
    }
    exportFunction(finalPermission);
  });
};

/**
 * the function which performs selections
 * @param  {Array} selectionArray information used to make a selection. structure is: 
 * [
    {
      "table" : "table1",
      "condition": {
        "col1" : "val1",
        "col2" : "val2"
      },
      "exportFields" : ["col3"],
    },
    {
      "table" : "table2",
      "importedCondition": "col3",
      "condition" : {
        "col2" : "val3",
        "col3" : "val4"
      },
      "exportFields": ["col5", "col6"]
    }
  ]
 * @param  {function} resultFunction the function performed on results
 */
selector = function (selectionArray, resultFunction) {
  var
  finalResults = [],
  importedConditionString = '',
  i = 0,
  tempFunction = function() {levelSelector(selectionArray[i].table, importedConditionString, selectionArray[i].conditions, selectionArray[i].exportFields, function(results){
    if (selectionArray[i+1]) {
      for (var j in results) {
        finalResults.push(results[j][selectionArray[i].exportFields]);
      }
      if (finalResults.length == 1) {
        conjunction = '=';
        cp ='';
      } else {
        conjunction = 'IN (';
        cp = ')';
      }
      importedConditionString = '`'+selectionArray[i+1].importedCondition+'` '+conjunction+finalResults.join()+cp;
      i++;
      tempFunction();
    } else {
      resultFunction(results);
    }
  });};
  tempFunction();
};

/**
 * the function to insert 1 row in a table
 * @param  {String} table           the table to be inserted in
 * @param  {Object} insertionObject has two prototypes: keys which is names of columns and values which is th data
 */
insertor = function (table ,insertionObject) {
  connection.query(
    'INSERT INTO '+table+ '('+insertionObject.keys.join()+') VALUES ('+insertionObject.values.join()+')',
    errorThrower(err)
  );
};

/**
 * the function to update 1 row in a table or update a table by a formula
 * @param  {String} table        the table to be updated
 * @param  {String} IDs          IDs separated by ,
 * @param  {String} updateString structure: `col1`=val1, `col2`=val2 ...
 */
updator = function (table, IDs, updateString) {
  connection.query(
    'UPDATE '+table+ 'SET '+updateString+ 'WHERE `ID` IN ('+IDs+')',
    errorThrower(err)
  );
};

/**
 * the function to delete records in a table
 * @param  {String} table name of the table
 * @param  {String} IDs   IDs separated by ,
 */
deletor = function (table, IDs) {
  connection.query(
    'DELETE FROM '+table+'WHERE `ID` IN'+IDs,
    errorThrower(err)
  );
};

/**
 * the function to insert many rows into a table
 * @param  {String} table   the table to be inserted in
 * @param  {Object} dataObj has to prototypes columns (an array) and data (an array of arrays)
 */
insertBulk = function (table, dataObj) {
  var dataString = '';
  for (var i in dataObj.data) {
    dataString += '('+ dataObj.data[i].join()+'),';
  }
  dataString.slice(0,-1);
  connection.query(
    'INSERT INTO '+table+ ' ('+dataObj.columns.join()+') VALUES '+dataString,
    errorThrower(err)
  );
};

/**
 * the function to perform bulk update in a table
 * @param  {String} table   name of the table to be updated
 * @param  {Array} IDArray array of IDs of rows to be updated
 * @param  {Object} dataObj has two prototypes columns (an array) and data (an array of arrays)
 */
updateBulk = function (table, IDArray, dataObj) {
  for (var i in dataObj.data) {
    var dataString = '`';
    for (var j in dataObj.columns) {
      dataString += dataObj.columns[j]+'`='+dataObj.data[i][j]+',';
    }
    dataString.slice(0,-1);
    connection.query(
      'UPDATE '+table+ 'SET '+dataString+ 'WHERE `ID`='+IDArray[i],
      errorThrower(err)
    );
  }
};

/**
 * the incoming function from request handler to perform an action an db
 * @param  {String} username        the requesting user
 * @param  {Array} selectionArray for inserting, only containig the table name, for other commands containing the selection informaion
 * @param  {String} command         the action to perfor
 * @param  {Object} data            the data for inserting of updateStri
 * @param  {Function} resultFunction  the function to be done on results of selection (only in select queries)
 */
dbRequest = function (username, selectionArray, command, data, resultFunction) {
  dbStart();
  dbCheckPermission(username, command, ?);
  
  dbEnd();
};

exports.dbCheckPermission = dbCheckPermission;
exports.dbRequest = dbRequest;