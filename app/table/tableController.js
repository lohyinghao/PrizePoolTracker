(function() {
    'use strict';

    angular
        .module('FPL')
        .controller('TableController', TableController);

    TableController.$inject = ['playerService','dataService','$scope'];
    function TableController(playerService,dataService,$scope) {
        var vm = this;
        vm.title = "FPL Showdown";
        vm.teamnames = {};
        vm.scores = {};
        vm.scores['Total'] = {};
        vm.playersList = playerService.getPlayersId();

        activate();

        ////////////////

        function activate() {
            getGameweek();

            
        }

        // Function to get teamnames
        function getTeamnames(){
            for(let i = 0; i < vm.playersList.length; i++){
                dataService.callPlayerUrl(vm.playersList[i]).get(
                    function(data){
                        vm.teamnames[vm.playersList[i]] = data.entry.name;
                        vm.scores['Total'][data.entry.name] = 0;
                    })
            }
        }

        // function to get no of gameweek aka rows
        function getGameweek(){
            dataService.callPlayerUrl(vm.playersList[0]).get().$promise.then(
                function(data){
                    vm.gameweek = data.entry.current_event;
                    getTeamnames();
                    getScores(vm.gameweek);
                }
            )
        }

        function getScores(gameweeks) {
            

            for (let i = 1; i <= gameweeks; i++) {
                vm.scores[i] = {};
                var promises = [];
                for (let x = 0; x < vm.playersList.length; x++) {
                    var promise = dataService.callGWUrl(vm.playersList[x]).get({ gameweek: i }).$promise;
                    promises.push(promise);
                }
                Promise.all(promises).then(function (data) {
                    let scoringArr = [];
                    let tempTeamname = []
                    for(let j = 0; j < data.length; j++){
                        let teamname = vm.teamnames[data[j].entry_history.entry];
                        tempTeamname.push(teamname);
                        let effectiveScore = data[j].entry_history.points - data[j].entry_history.event_transfers_cost;
                        scoringArr.push(effectiveScore);
                    }

                    let ranks = calculateContribution(scoringArr);
                    for(let k=0; k<ranks.length; k++){
                        let teamname = tempTeamname[k];
                        vm.scores[i][teamname] = ranks[k];
                        // if(i == 1){
                        //     vm.scores['total'][teamname] = ranks[k];
                        // } else{
                        vm.scores['Total'][teamname] += ranks[k];
                    }
                    $scope.$apply()

                });
            }            
        }

        function calculateContribution(arr){
            let sorted = arr.slice().sort(function(a,b){return b-a})
            let ranks = arr.slice().map(function(v){ return sorted.indexOf(v)+1 });
            return paymentcalculator(ranks);
        }

        function paymentcalculator(arr){
            let unique = arr.filter( onlyUnique );
            let output = new Array(arr.length);
            if (unique.length == arr.length){
                for(let i=0; i<arr.length; i++){
                    if(arr[i] == 1){ output[i] = 0 };
                    if(arr[i] == 2){ output[i] = 1 };
                    if(arr[i] == 3){ output[i] = 2 };
                    if(arr[i] == 4){ output[i] = 4 };
                }
            };
            if (unique.length == 1){
                for(let i=0; i<arr.length; i++){ output[i] = 4 };
            };
            if(unique.length == 2){
                let noOfDuplicate = countDuplicates(arr);
                // 2 pairs of duplicates
                // 2 * 2 way tie
                if (noOfDuplicate == 2){
                    for(let i=0; i<arr.length; i++){
                        if(arr[i] == 1){ output[i] = 2 };
                        if(arr[i] == 3){ output[i] = 4 };
                    }
                };
                // not 2 pairs of duplicate, then either [1,1,1,4] or [1,2,2,2]
                if (noOfDuplicate == 1){
                    //3 way tied in first place
                    if(Math.max(...arr) == 4){
                        for(let i=0; i<arr.length; i++){
                            if(arr[i] == 1){ output[i] = 2 };
                            if(arr[i] == 4){ output[i] = 4 };
                        }
                    }
                    //3 way tied in last place
                    if(Math.max(...arr) == 2){
                        for(let i=0; i<arr.length; i++){
                            if(arr[i] == 1){ output[i] = 0 };
                            if(arr[i] == 2){ output[i] = 4 };
                        }
                    }
                };

            };
            if(unique.length == 3){
                let duplicatedArr = find_duplicate_in_array(arr);
                //one way tie at 1st place
                if(duplicatedArr[0] == 1){
                    for(let i=0; i<arr.length; i++){
                        if(arr[i] == 1){ output[i] = 1 };
                        if(arr[i] == 3){ output[i] = 2 };
                        if(arr[i] == 4){ output[i] = 4 };
                    }
                }
                //one way tie at 2nd place
                if(duplicatedArr[0] == 2){
                    for(let i=0; i<arr.length; i++){
                        if(arr[i] == 1){ output[i] = 0 };
                        if(arr[i] == 2){ output[i] = 2 };
                        if(arr[i] == 4){ output[i] = 4 };
                    }
                }
                //one way tie at 3rd place
                if(duplicatedArr[0] == 3){
                    for(let i=0; i<arr.length; i++){
                        if(arr[i] == 1){ output[i] = 0 };
                        if(arr[i] == 2){ output[i] = 1 };
                        if(arr[i] == 3){ output[i] = 4 };
                    }
                }
            };
            return output;
        }

        function onlyUnique(value, index, self) { 
            return self.indexOf(value) === index;
        }

        function countDuplicates(original) {
            let counts = {},
              duplicate = 0;
            original.forEach(function(x) {
              counts[x] = (counts[x] || 0) + 1;
            });
            for (var key in counts) {
              if (counts.hasOwnProperty(key)) {
                counts[key] > 1 ? duplicate++ : duplicate;
              }
            }
            return duplicate;
          }

        function find_duplicate_in_array(arr) {
            let object = {};
            let result = [];

            arr.forEach(function (item) {
                if (!object[item])
                    object[item] = 0;
                object[item] += 1;
            })

            for (var prop in object) {
                if (object[prop] >= 2) {
                    result.push(prop);
                }
            }
            return result;
        }
    }
})();