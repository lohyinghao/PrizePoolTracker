(function () {
    'use strict';

    angular.module('FPL', [
        // Angular modules
        "ui.router",
        // Custom modules
        "common.services"
        // 3rd Party Modules

    ]);

    angular
        .module('FPL')
        .config(configConfig)

    configConfig.$inject = ["$stateProvider",
                            "$urlRouterProvider"];

    function configConfig($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state("home",{
                url: "/",
                templateUrl: "app/table/table.html",
                controller: "TableController as vm"
            })
    }

}());