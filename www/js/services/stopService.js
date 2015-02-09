app.factory("StopService", function($http, localStorageService){
  var warnings;
  return {
    get : function(){
      return {
        all : function(){
          return localStorageService.get('stops');
        },
        near : function(position){
          return $http.get("http://varnatraffic.com/Ajax/FindNearestStations?lat=" + position.lat + "&lon=" + position.lon + "&range=2000");
        },
        devices : function(stopId){
          return $http.get("http://varnatraffic.com/Ajax/FindStationDevices?stationId=" + stopId);
        },
        saved: function(callback){
          return localStorageService.get('savedStops') || [];
        },
        warnings: function(){
          return $http.get("https://varnabus-web-scrapping.herokuapp.com/api/warning/");
        }
      }
    },
    isSaved: function(id){
      var favStops = localStorageService.get('savedStops') || [];
      for(i in favStops){
        if(favStops[i].id === id){
          return true;
        }
      }
      return false;
    },
    saveStop: function(stop){
      var favStops = localStorageService.get('savedStops') || [];
      favStops.push(stop);
      localStorageService.set('savedStops', JSON.stringify(favStops));
      return true;
    },
    saveStops: function(stops){
      localStorageService.set('savedStops', JSON.stringify(stops));
      return true;
    },
    deleteStop: function(id){
      var savedStops = localStorageService.get('savedStops');
      for(index in savedStops){
        if(savedStops[index].id === id){
          savedStops.splice(index, 1);
        }
      }
      localStorageService.set('savedStops', JSON.stringify(savedStops));
    },
    pushWarnings: function(data){
      warnings = data;
    },
    getWarnings: function(){
      return warnings;
      console.log(warnings);
    },
    getWarning: function(id){
      if(typeof warnings !== 'undefined'){
        return warnings[id];
      } else {
        return 0;
      }
    },
    warning : true
  }
});
