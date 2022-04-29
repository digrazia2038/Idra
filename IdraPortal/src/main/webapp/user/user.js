/*******************************************************************************
 * Idra - Open Data Federation Platform
 *  Copyright (C) 2020 Engineering Ingegneria Informatica S.p.A.
 *  
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *  
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/

 angular.module("IdraPlatform").controller('FavoritesCtrl',["$scope",'md5',"$http",'$filter','config','$rootScope','dialogs','$modal','$window',function($scope,md5,$http,$filter,config,$rootScope,dialogs,$modal,$window){

    var req = {
            method: 'POST',
            url: config.SERVICES_BASE_URL+config.STORE_PREFERENCES_SERVICE,
            headers: {
                'Content-Type': 'application/json'
            }};

    
    $scope.users=[];

    $scope.dateFormat="MM/dd/yyyy";

    $scope.names=[];
    $scope.emails=[];
    $rootScope.startSpin();
    $http(req).then(function(value){
        console.log("Success");
        $scope.users=value.data.users;			
        $scope.displayedCollection = [].concat($scope.users); 	
        console.log(value.data.users);
        for(i=0; i<$scope.users.length; i++){
                                        
            $scope.names.push($scope.users[i].username);
            $scope.emails.push($scope.users[i].email);
        }
        $rootScope.stopSpin();

    }, function(){
        $rootScope.stopSpin();
        console.log("SERVICE UNAVAILABLE");
    });

    $scope.itemsByPage=10;

    $scope.toDate = function(value){
        var date = new Date(value);
        return date.getMonth() + '/' + date.getDate() + '/' +  date.getFullYear();
    }
    
    $scope.checkEmail = function(data) {
        
        for(i=0; i<$scope.emails.length; i++){
            if(data==$scope.emails[i]){
                return "Email already exists";
            }
        }
        
//			var reg = /^(ftp|http|https):\/\/[^ "]+$/;
//			
//			if(!reg.test(data)){
//				return "Insert a valid url";
//			} 
        
    };

    $scope.deleteUser = function(usr) {
        
        
        var dlg = dialogs.confirm("Delete user "+usr.username+"?","Are you sure you want to remove this user?");
        
        dlg.result.then(function(btn){	
        
        $rootScope.startSpin();
        var index = $scope.users.indexOf(usr);
        if (index !== -1) {
            $scope.users.splice(index, 1);
        }

        var req = {
                method: 'POST',
                url: config.SERVICES_BASE_URL+config.GET_USERS_SERVICE+"/"+usr.id.toString()+config.DELETE_ONE_USER_SERVICE,
                headers: {
                    'Content-Type': 'application/json'
                }};

        // console.log(urls);

        $http(req).then(function(value){
            console.log("Success");
            $rootScope.stopSpin();
            $rootScope.showAlert('success',"User deleted!");	        	
        }, function(value){
            console.log(value);
            $rootScope.stopSpin();
            $rootScope.showAlert('danger',value.data.userMessage);
        });

        },function(btn){
            return;
        });
        
    };
    
    

    
    $scope.open = function (index) {

        console.log(index);
        
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: 'myModalContent.html',
          controller: 'ModalCtrl',
          size: 'md',
          resolve: {
            user: function () {
              return $scope.users[index];
            }
          }
        });
    }
    
    $scope.addUser = function() {	    	
        //$rootScope.closeAlert();
        $window.location.assign('#/addAccounts');
    };

    
}]);