var app = angular.module('HubStalk', [
    "ngRoute",
    "LocalStorageModule",
    "ngTouch",
    "mobile-angular-ui"
]);

app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('hubStalk')
});



app.config(function ($routeProvider) {
    $routeProvider.when('/', {templateUrl: "home.html"});
    $routeProvider.when('/login', {templateUrl: "login.html", controller: "LoginController"});
    $routeProvider.when('/following', {templateUrl: "following.html", controller: 'FollowingController'});
    $routeProvider.when('/starred', {templateUrl: "starred.html", controller: 'StarredController'});
    $routeProvider.when('/starredby/:login', {templateUrl: "user-starred.html", controller: 'StarredByController'});
    $routeProvider.when('/repo/:author/:name', {templateUrl: "repo.html", controller: 'RepoController'});
});

app.run( function($rootScope, $location) {

    // register listener to watch route changes
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {
      if ( $rootScope.github == null ) {
        // no logged user, we should be going to #login
        if (next.templateUrl != "login.html" ) {
          // not going to #login, we should redirect now
          $location.path( "/login" );
        }
      }         
    });
 })

app.controller('MainController', function ($rootScope, $scope, localStorageService) {

    $rootScope.$on("$routeChangeStart", function () {
        $rootScope.loading = true;
    });

    $rootScope.$on("$routeChangeSuccess", function () {
        $rootScope.loading = false;
    });
    
    if (localStorageService.get("oauthToken"))
    {
        $rootScope.github = new Octokit({token: localStorageService.get("oauthToken")});
    } else {
      return;  
    }

    $rootScope.user = $rootScope.github.getUser();

    $rootScope.user.getReceivedEvents().then(function (events) {
        $scope.events = events;
    });

    
});

/**
 * Login view
 */
app.controller('LoginController', function ($rootScope, $scope, localStorageService) {
    $scope.update = function(user) {
        localStorageService.set("oauthToken", user.token);
        $rootScope.github = new Octokit({token: localStorageService.get("oauthToken")});
    };
});

/**
 * Own starred repos.
 * 
 */
app.controller('StarredController', function ($rootScope, $scope) {
    $rootScope.user.getStars().then(function (starred) {$scope.starred = starred;});
});

/**
 * Other user starred repos.
 * 
 */
app.controller('StarredByController', function ($rootScope, $scope, $routeParams) {
    var user = $rootScope.github.getUser($routeParams.login);
    user.getStarred().then(function (starred, user) {$scope.starred = starred; $scope.login = $routeParams.login;});
});

/**
 * Users that the current user follows.
 * 
 */
app.controller('FollowingController', function ($rootScope, $scope) {
    $rootScope.user.getFollowing().then(function (users) {$scope.following = users;});
});


app.controller('RepoController', function ($rootScope, $scope, $routeParams) {

    $rootScope.github.getRepo($routeParams.author, $routeParams.name).getInfo().then(
            function(repo){$scope.repo = repo;}
    );
});

