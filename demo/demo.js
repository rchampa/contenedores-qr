
function $_GET(q,s) {
    s = (s) ? s : window.location.search;
    var re = new RegExp('&amp;'+q+'=([^&amp;]*)','i');
    return (s=s.replace(/^\?/,'&amp;').match(re)) ?s=s[1] :s='';
}

var app = angular.module('MobileAngularUiExamples', [
  "ngRoute",
  "ngTouch",
  "mobile-angular-ui"
]);

app.directive('alert', function () {
  return {
    restrict:'EA',
    templateUrl:'template/alert/alert.html',
    transclude:true,
    replace:true,
    scope: {
      type: '=',
      close: '&'
    },
    link: function(scope, iElement, iAttrs, controller) {
      scope.closeable = "close" in iAttrs;
    }
  };
});

app.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/',          {templateUrl: "home.html"});
 
});


app.controller('MainController',function($rootScope, $scope,$http){

  $rootScope.$on("$routeChangeStart", function(){
    $rootScope.loading = true;
  });

  $rootScope.$on("$routeChangeSuccess", function(){
    $rootScope.loading = false;
  });

  //alerts: success, warning, danger
  $scope.alerts = [];

  $scope.addAlert = function() {
    $scope.alerts.push({msg: "Another alert!", show: true});
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

  $scope.invoice = {payed: true};
  $scope.invoice.id = $_GET('id');


  $scope.prepareFile = function(files) {
    var fd = new FormData();
    $scope.file_data = files[0];
  }

  //$scope.nombre = "Pues un nombre más :D";
  $scope.sendMail = function() {

      var uploadUrl = "../sender.php";

      var fd = new FormData();
      fd.append('id', this.invoice.id);
      fd.append('from', "algun@remitente.com");
      fd.append('to', "Jorgetvgarcia@hotmail.com");
      fd.append('latitude', this.invoice.latitude);
      fd.append('longitude', this.invoice.longitude);
      fd.append('attached_image', $scope.file_data);
      fd.append('description',this.invoice.description);
      $rootScope.loading = true;
      $http({
              method  : 'POST',
              url     : uploadUrl,
              //data    : $.param({'id':my_id}),  // pass in data as strings
              data    : fd,
              withCredentials: true,
              transformRequest: angular.identity,
              headers : {'Content-Type': undefined}  // set the headers so angular passing info as form data (not request payload)
          })
          .success(function(data) {
              //alert(data.msg);
              if(data.msg=="success"){
                $scope.alerts.push({type: 'success', msg: "Correo enviado.", show: true});
              }
              else{
                $scope.alerts.push({type: 'danger', msg: "Ha ocurrido un error.", show: true});
              }
              $rootScope.loading = false;
          });

      
  };


  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
      $scope.$apply(function(){
        //$scope.position = position;
        $scope.invoice.latitude = position['coords']['latitude'];
        $scope.invoice.longitude = position['coords']['longitude'];

        var MAPS_ENDPOINT = 'http://maps.google.com/maps/api/geocode/json?latlng={POSITION}&sensor=false';
        
        function urlForLatLng(lat, lng) {
          return MAPS_ENDPOINT.replace('{POSITION}', lat + ',' + lng);
        }

        function getAddress(lat, lng) {
          //var deferred = $q.defer();
          var url = urlForLatLng(lat, lng);

          $http.get(url).success(function(response) {
          
            $scope.invoice.address = response.results[0].formatted_address;

          });
          //.error(deferred.reject);

          //return deferred.promise;
        }

        getAddress(position['coords']['latitude'], position['coords']['longitude']);

      });
    });
  }
  
  //for example IE, Chrome, Firefox, Safari
  $scope.userAgent =  navigator.userAgent;
  

});