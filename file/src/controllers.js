(function (ng, _, undefined){
  var
  mainJSON,
  jobs = [],
  selected = {},
  lastPage = '/#/',

  /**
   * the function to define a new job which adds a single job name to the jobs array
   * @param {String} jobName name of the added job
   */
  addJob = function(jobName){
    jobs.push({name:jobName, selected: false});
    for (var i in labels) {
      labels[i].jobs.push({job: jobName, isLabeled: false});
    }
    UIOption.newJob = '';
  },

  /**
   * the function to delete a job
   * @param  {String} job the deleted job
   */
  deleteJob = function(job){
    if (confirm ("Are you sure you want to delete "+job+"?")) {
      for (var i in jobs) {
        if (jobs[i] == job) {
          for (var j in labels) {
            labels[j].jobs.splice(i,1);
          }
          jobs.splice(i,1);
          return;
        }
      }
    }
  },

  labels = [],

  addLabel = function(labelName){
    var newLabelObject = {};
    newLabelObject.name = labelName;
    newLabelObject.jobs = [];
    newLabelObject.selected = false;
    for (var i=0; i<jobs.length; i++) {
      newLabelObject.jobs.push({job: jobs[i].name, isLabeled: false});
    }
    labels.push(newLabelObject);
    UIOption.newLabel = '';
  },

  /**
   * the function to delete a label
   * @param  {Object} label the deletes label
   */
  deleteLabel = function(label){
    if (confirm ("Are you sure you want to delete "+label.name+"?")){
      for (var i in labels) {
        if (labels[i] == label) {
          labels.splice(i,1);
          return;
        }
      }
    }
  },

  /**
   * the function to send the two arrays 'jobs' and 'labels' to console as a log
   */
  createLog = function() {
    console.log(JSON.stringify(jobs));
    console.log(JSON.stringify(labels));
  },

  /**
   * the function whick is run when clicking on a job
   * @param  {Object} job the clicked job
   */
  selectJob = function(job) {
    for (i=0; i<jobs.length; i++) {
      jobs[i].selected = false;
    }
    for (i=0; i<labels.length; i++) {
      labels[i].selected = false;
    }
    if (selected.job == job) {
      selected = {};
    } else {
      selected.job = job;
      job.selected = true;
      for (i=0; i<jobs.length; i++) {
        if (jobs[i] == job) {
          selected.id = i;
        }
      }
      for (var i=0; i<labels.length; i++) {
        if (labels[i].jobs[selected.id].isLabeled) {
          labels[i].selected = true;
        }
        else {
          labels[i].selected = false;
        }
      }
    }
    
  },

  /**
   * the function to assign a job to a label
   */
  selectLabel = function(label) {
    label.jobs[selected.id].isLabeled = !label.jobs[selected.id].isLabeled;
    for (var i=0; i<labels.length; i++) {
      if (labels[i].jobs[selected.id].isLabeled) {
        labels[i].selected = true;
      }
      else {
        labels[i].selected = false;
      }
    }
  },

  /**
   * the function to export the data for Gephi as a table
   */
  generateResault = function(){
    var tempJobs = JSON.parse(JSON.stringify(jobs));
    for (var i=0; i<tempJobs.length; i++) {
      tempJobs[i].id = i+1;
    }
    for (i=0; i<labels.length; i++) {
      for (var j=0; j<tempJobs.length; j++) {
        if (labels[i].jobs[j].isLabeled) {
          for (var k=j+1; k<tempJobs.length; k++) {
            if (labels[i].jobs[k].isLabeled) {
              console.log(tempJobs[k].id);
              tableData.push([tempJobs[j].name, tempJobs[k].name, labels[i].name]);
            }
          }
        }
      }
    }
    console.log(tableData);
    window.location = '/#/tabularResult';
  },
  UIOption = {
  newJob: '',
  newLabel: ''
  },

  tableData = [],


  /**
   * the controller for the main page
   * @param  {angular injection} $scope the scope
   */
  mainController = function($scope, $resource){
    $scope.common = commonScope.common;
    $scope.common.postpone = function () {
      $resource('/postpone').get();
    };
    $scope.common.getPermission = function (hash) {
      $resource('/restricted', {hash: hash}).get().$promise.then(function(data) {
        var log = '';
        for (var i in data) {
          if (typeof (data[i]) == 'string') {
            log += data[i];
          }
        }
        switch (log) {
          case 'public':
            console.log('public');
            lastPage = '/'+hash;
            window.location = '/#/login';
          break;
          case 'restricted':
            console.log('restricted');
            console.log(lastPage);
            window.location = lastPage;
          break;
          case 'permitted':
            console.log('permitted');
            if (hash != '#/login') {lastPage = '/'+hash;}
          break;
        }
      });
    };
    _.extend($scope, {
      jobs: jobs,
      labels: labels,
      UIOption: UIOption,
      addJob: addJob,
      addLabel: addLabel,
      deleteJob: deleteJob,
      deleteLabel: deleteLabel,
      createLog: createLog,
      selectJob: selectJob,
      selectLabel: selectLabel,
      genres: generateResault
    });
    mainJSON = $resource('src/main.json');
    mainJSON.get(function(data){
      $scope.jobs = data.jobs;
      $scope.labels = data.labels;
      jobs = $scope.jobs;
      labels = $scope.labels;
    });
  },

  /**
   * the controller for the main page
   * @param  {angular injection} $scope the scope
   */
  tableController = function($scope){
    _.extend($scope, {
      tableData: tableData
    });
  },

  /**
   * the controller to login page
   * @param  {angular injection} $scope [description]
   */
  loginController = function($scope, $resource) {
    $scope.common = commonScope.common;
    $scope.post = function (username, password) {
      var resource = $resource('/login',{}, {save: {method: 'POST'}});
      results = resource.save({username: username, password: password});
      results.$promise.then(function(data){
        var log = '';
        for (var i in data) {
          if (typeof (data[i]) == 'string') {
            log += data[i];
          }
        }
        switch (log) {
          case 'login successful':
            console.log('login successful');
            console.log(lastPage);
            window.location = lastPage;
          break;
          case 'password incorrect':
            $scope.password = '';
            console.log('password incorrect');
          break;
          case 'no such user':
            $scope.username = '';
            $scope.password = '';
            console.log('no such user');
          break;
        }
      });
    };
  },

  /**
   * the function to control main user page when logged in
   * @param  {Object} $scope    angular injection
   * @param  {Object} $resource angular injection
   */
  pvuserController = function ($scope, $resource) {

  },

  /**
   * the function to control a private examl=ple page
   */
  pvexampleController = function ($scope, $resource) {
  
  },

  /**
   * app initializer
   * @return {[type]} [description]
   */
  init = function(){
    ng
      .module('main', ['ngResource'])
      .controller('mainControl', ['$scope', '$resource', mainController])
      .controller('tableControl', ['$scope', tableController])
      .controller('loginControl', ['$scope', '$resource', loginController])
      .controller('pvuserControl', ['$scope', '$resource', pvuserController])
      .controller('pvexampleControl', ['$scope', '$resource', pvexampleController]);
  }
  ;
  return {init: init};
})(window.angular, window._).init();
