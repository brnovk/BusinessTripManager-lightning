// noinspection JSUnusedGlobalSymbols
({
	doInit: function (component, event, helper) {
		component.set("v.isLoaded", true);
		helper.fetchBusinessTrips(component);
	},

	businessTripSearchEventHandler: function(component, event, helper) {
		component.set("v.isLoaded", true);
		let eventParams = event.getParams();
		component.set("v.searchStatuses", eventParams.searchStatuses ? eventParams.searchStatuses : []);
		component.set("v.searchTypes", eventParams.searchTypes ? eventParams.searchTypes : []);
		helper.fetchBusinessTrips(component);
	},

	addBusinessTripHandler: function (component, event, helper) {
		let createRecordEvent = $A.get("e.force:createRecord");
		createRecordEvent.setParams({ "entityApiName": "Business_Trip__c" });
		createRecordEvent.fire();
	}
});