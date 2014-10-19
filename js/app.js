
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
    $routeProvider.when('/review', {templateUrl: "review.html", controller: 'ReviewController'});
});

app.run(function ($rootScope, $location, localStorageService) {

    // register listener to watch route changes
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if ($rootScope.github == null) {
            // no logged user, we should be going to #login
            if (next.templateUrl != "login.html") {
                // not going to #login, we should redirect now
                $location.path("/login");
            }
            return;
        }
    });

    if (!$rootScope.review) {
        var review = localStorageService.get('review');
        if (!review) {
            localStorageService.set('review', []);
            review = [];
        }
        $rootScope.review = review;
    }
})

app.
        /**
         * Main controller
         * 
         * 
         */
        controller('MainController', function ($rootScope, $scope, localStorageService)
        {
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
                $scope.$apply(function () {
                    $scope.events = events;
                });
            });
        })

        /**
         * Login view
         * 
         * 
         */
        .controller('LoginController', function ($rootScope, $scope, localStorageService)
        {
            $scope.update = function (user) {
                localStorageService.set("oauthToken", user.token);
                $rootScope.github = new Octokit({token: localStorageService.get("oauthToken")});
            };
        })

        /**
         * Own starred repos.
         * 
         */
        .controller('StarredController', function ($rootScope, $scope)
        {
            $rootScope.user.getStars().then(function (starred) {
                $scope.$apply(function () {
                    $scope.starred = starred;
                });
            });
        })

        /**
         * Other user starred repos.
         * 
         */
        .controller('StarredByController', function ($rootScope, $scope, $routeParams) {
            var user = $rootScope.github.getUser($routeParams.login);
            user.getStarred().then(function (starred, user) {
                $scope.$apply(function () {
                    $scope.starred = starred;
                    $scope.login = $routeParams.login;
                });
            });
        })
        
        /**
         * Repos to review
         * 
         */
       .controller('ReviewController', function ($scope, localStorageService) {
           $scope.review = localStorageService.get('review');
       })
;

/**
 * Users that the current user follows.
 * 
 */
app.controller('FollowingController', function ($rootScope, $scope) {
    $rootScope.user.getFollowing().then(function (users) {
        $scope.$apply(function () {
            $scope.following = users;
        });
    });
});

/**
 * Display a repo.
 */
app.controller('RepoController', function ($rootScope, $scope, $routeParams, localStorageService) {
    $rootScope.github.getRepo($routeParams.author, $routeParams.name).getInfo().then(
            function (repo) {
                $scope.$apply(function () {
                    $scope.repo = repo;
                });
            }
    );
    
    $scope.review = function (repo) {
        var review = localStorageService.get('review');
        var index = review.indexOf(repo.full_name);
        $scope.listed = index !== -1;
        if (!$scope.listed) {
            review.push(repo.full_name);
        } else {
            review.splice(index, 1);
        }
        
        $scope.listed = index !== -1;
        localStorageService.set('review', review);
    };
});

app.directive('reviewrepo', function () {
        
    return {
        replace: 'true',
        scope: true,
        template: '<a class="btn btn-default btn-block" ng-click="review(repo)"><i class="fa fa-flag"></i><span ng-if="listed == true">Remove from review list</span><span ng-if="listed != true"> Review later</span></a>'
    };
});