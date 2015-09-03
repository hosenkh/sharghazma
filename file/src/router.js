(function (ng){
  var
  /**
   * routing config
   * @param  {angular injection} routeProvider [description]
   */
  configurater = function(routeProvider){
    routeProvider
      .when('/set', {
        templateUrl: 'partials/main.html',
        controller: 'mainControl'
      })
      .when('/tabularResult', {
        templateUrl: 'partials/table.html',
        controller: 'tableControl'
      })
      .when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'loginControl'
      })
      .when('/user', {
        templateUrl: '/partials/pvuser.html',
        controller: 'pvuserControl'
      })
      .when('/example', {
        templateUrl: '/partials/pvexample.html',
        controller: 'pvexampleControl'
      })
      .otherwise({
        redirectTo: '/set'
      });
  },

  /**
   * routing initializer
   */
  init = function(){
    ng
      .module('router',['main','ngRoute'])
      .config(['$routeProvider', configurater]);
  }
  ;
  return {init: init};
})(window.angular).init();