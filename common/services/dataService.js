(function() {
    'use strict';

    angular
        .module('common.services')
        .factory('dataService', dataService);

    dataService.$inject = ['$resource','playerService'];
    function dataService($resource,playerService) {

        function callPlayerUrl(playerId){
            return $resource(playerService.getPlayerUrl(playerId));
        }

        function callGWUrl(playerId){
            return $resource(playerService.getPlayersGWUrl(playerId));
        }

        return {
            callPlayerUrl: callPlayerUrl,
            callGWUrl: callGWUrl
        }

    }
})();