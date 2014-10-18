var app = angular.module('HubStalk', [
    "ngRoute",
    "ngTouch",
    "mobile-angular-ui"
]);

var gh = new Octokit({
    token: ""
});

app.config(function ($routeProvider) {
    $routeProvider.when('/', {templateUrl: "home.html"});
    $routeProvider.when('/following', {templateUrl: "following.html", controller: 'FollowingController'});
    $routeProvider.when('/starred', {templateUrl: "starred.html", controller: 'StarredController'});
    $routeProvider.when('/starredby/:login', {templateUrl: "user-starred.html", controller: 'StarredByController'});
    $routeProvider.when('/repo/:author/:name', {templateUrl: "repo.html"});
});

app.controller('MainController', function ($rootScope, $scope) {

    $rootScope.$on("$routeChangeStart", function () {
        $rootScope.loading = true;
    });

    $rootScope.$on("$routeChangeSuccess", function () {
        $rootScope.loading = false;
    });

    $rootScope.user = gh.getUser();

    $rootScope.user.getReceivedEvents().then(function (events) {
        $scope.events = events;
    });

    
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
    var user = gh.getUser($routeParams.login);
    user.getStarred().then(function (starred, user) {$scope.starred = starred; $scope.user = user;});
})

/**
 * Users that the current user follows.
 * 
 */
app.controller('FollowingController', function ($rootScope, $scope) {
    $rootScope.user.getFollowing().then(function (users) {$scope.following = users;});
});


app.controller('RepoController', function ($rootScope, $scope) {

    $scope.repo = gh.getRepo()
});

