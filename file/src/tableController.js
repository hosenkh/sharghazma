/**
   * the controller for the main page
   * @param  {angular injection} $scope the scope
   */
  tableController = function($scope){
    _.extend($scope, {
      tableData: tableData
    });
  },