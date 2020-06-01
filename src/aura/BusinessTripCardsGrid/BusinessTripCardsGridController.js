({
	doInit: function (component, event, helper) {
		helper.fetchBusinessTrips(component);
	},

	businessTripSearchEventHandler: function(component, event, helper) {
		let eventParams = event.getParams();
		component.set("v.searchStatuses", eventParams.searchStatuses ? eventParams.searchStatuses : []);
		component.set("v.searchTypes", eventParams.searchTypes ? eventParams.searchTypes : []);
		helper.fetchBusinessTrips(component);
	}
});