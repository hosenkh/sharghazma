(function (ng) {
  var
  mainJSON,
  jobs = [],
  selected = {},

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
  
  init = function () {
    ng
    .module ('mainControlInject', [])
    .factory('addJob', addJob)
    .factory('deleteJob')
    .factory('addLabel', addLabel)
    .factory('deleteLabel', deleteLabel)
    .factory('createLog', createLog)
    .factory('selectJob', selectJob)
    .factory('selectLabel', selectLabel)
    .factory('generateResault', generateResault)
    .value('mainJSON', mainJSON)
    .value('jobs', jobs)
    .value('labels', labels)
    .value('selected', selected)
    .value('UIOption', UIOption);
  };
  return {init: init};
})(window.angular).init();