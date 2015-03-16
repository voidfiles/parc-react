import $ from 'jquery';
import moment from 'moment';
import {ApiClient, client} from './client';

var currentState = {
	lastSync: null,
};

// Locking
var syncing = false;
var reservedLastSyncTime = null;

// LowTech so we have a sync API for now
var persistState = function () {
	localStorage.__syncState = JSON.stringify(currentState);
};

var updateState = function (newState, persist) {
	currentState = $.extend({}, currentState, newState);
	if (persist) {
		persistState();
	}
};

var restoreState = function () {
	var storedState = localStorage.__syncState && JSON.parse(localStorage.__syncState) || {};
	updateState(storedState);
};

var setLastSyncTime = function (time) {
	time = time || moment.utc().format();
	updateState({
		lastSync: time,
	}, true);
};

class SyncManager {
  sync () {
  	if (syncing) {
  		return;
  	}
  	syncing = true;
 	var reservedLastSyncTime = currentState.lastSync;
 	var getAllArticles = client.getAllArticles(50, reservedLastSyncTime);

 	setLastSyncTime();

 	getAllArticles.fail(function () {
 		// Rollback sync time in the case of a failed sync
 		setLastSyncTime(reservedLastSyncTime);
 	}).always(function () {
 		// Always clear the syncing lock
 		syncing = false;
 	});

 	return getAllArticles;
  }

  hasSynced () {
  	return typeof(currentState.lastSync) !== "null";
  }

  isSyncing () {
  	return syncing;
  }

  lastSyncTime () {
  	return currentState.lastSync;
  }
}


// Always restoreState;
restoreState();

// Effectivley create a singleton
var syncManager = new SyncManager();

export default syncManager;
