(function() {
    'use strict';

    angular
        .module('common.services')
        .factory('playerService', playerService);

    playerService.$inject = [];
    function playerService() {

        function getPlayersId() { 
            var playersList = ['871084','885009','858535','1356220'];
            return playersList;
        };

        function getPlayersGWUrl(playersId) {
            let corsUrl = "https://cors.io?";
            //let corsUrl = "";
            let base_link = "https://fantasy.premierleague.com/drf/entry/";
            let end_link = "/event/:gameweek/picks";
            
            return corsUrl.concat(base_link,playersId,end_link);

        };

        function getPlayerUrl(playerId){
            let corsUrl = "https://cors.io?";
            //let corsUrl = "";
            let base_link = "https://fantasy.premierleague.com/drf/entry/";
            let result = corsUrl.concat(base_link,playerId);
            return result;
        }


        return {
            getPlayersId: getPlayersId,
            getPlayersGWUrl: getPlayersGWUrl,
            getPlayerUrl: getPlayerUrl
        };


    }
})();