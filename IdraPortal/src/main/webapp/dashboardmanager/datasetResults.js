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
angular.module("IdraPlatform").controller('PreferredDatasetCtrl', ['$scope', '$rootScope', '$http', 'config', '$anchorScroll', '$location', '$window', 'DefaultParameter', function($scope, $rootScope, $http, config, $anchorScroll, $location, $window, DefaultParameter) {

	$rootScope.newPage = '';

	$scope.oneAtATime = false;
	$scope.isOpen = false;

	$scope.fillFoundDatasets = function() {
		console.log("called");
		$scope.getPreferredDataset().then(function(result) {
			for (let i = 0; i < result.data.length; i++) {
				console.log(result.data);
				console.log(result.data.length);
				console.log(result.data[i].datasetId);
				var datasetInfo = $scope.getDatasetInfo(result.data[i].datasetNodeId, result.data[i].datasetId);
				console.log(datasetInfo);
				datasetInfo.then(function(datasetDcatInfo) {
					console.log(datasetDcatInfo);
				});
			}
		});

	}

	$scope.getPreferredDataset = function() {
		var req = {
			method: 'GET',
			url: config.DASHBOARD_MANAGER_BASE_URL + config.USER_SERVICE_BASE_URL + config.PREFERRED + config.PREFERRED_LIST + "?username=" + $rootScope.loggedUsername,
			dataType: 'json',
			headers: {
				'Content-Type': 'application/json'
			}
		}
		return $http(req);
	}

	$scope.getDatasetInfo = function(datasetNodeId, datasetId) {
		var req = {
			method: 'GET',
			url: config.CLIENT_SERVICES_BASE_URL + config.CLIENT_CATALOGUES + "/" + datasetNodeId + config.CLIENT_DATASETS + "/" + datasetId,
			dataType: 'json',
			headers: {
				'Content-Type': 'application/json'
			},
			data: {
			}
		}
		return $http(req);
	}

	var x = $scope.fillFoundDatasets();

	$scope.openDatasetDetails = function(dataset) {
		dataset.nodeName = $scope.getRealName(dataset.nodeID);
		$rootScope.datasetDetail = dataset;
		$window.location.assign('./#/dataset/' + dataset.id);
	}

	$scope.gotoTop = function() {
		// set the location.hash to the id of
		// the element you wish to scroll to.
		$location.hash('content');
		// call $anchorScroll()
		$anchorScroll();
	};

	$scope.modifyId = function(id) {
		for (i = 0; i < $scope.visualDataset.dataset.length; i++) {
			if ($scope.visualDataset.dataset[i].id === id) {
				return "str" + i.toString();
			}
		}
	}
	
	$scope.goToAnchor = function(anchor) {
		if ($location.hash() !== anchor) {
			// set the $location.hash to `newHash` and
			// $anchorScroll will automatically scroll to it
			$location.hash(anchor);
		} else {
			// call $anchorScroll() explicitly,
			// since $location.hash hasn't changed
			$anchorScroll();
		}
	};
	
}]);
