(function (ng){
  var
  /**
   * routing config
   * @param  {angular injection} routeProvider [description]
   */
  configurater = function(routeProvider){
    routeProvider
      .when('/set', {
        templateUrl: 'restricted/main.html',
        controller: 'mainControl'
      })
      .when('/tabularResult', {
        templateUrl: 'restricted/table.html',
        controller: 'tableControl'
      })
      .when('/login', {
        templateUrl: 'restricted/login.html',
        controller: 'loginControl'
      })
      .when('/user', {
        templateUrl: '/restricted/pvuser.html',
        controller: 'pvuserControl'
      })
      .when('/example', {
        templateUrl: '/restricted/pvexample.html',
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