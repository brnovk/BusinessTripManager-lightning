({
	doInit: function (component, event, helper) {
		// Initializing picklist for search (status/type)
		helper.fetchBusinessTripRidesStatuses(component);
		helper.fetchBusinessTripRidesTripTypes(component);
	},

	resetButtonClickHandler: function (component, event, helper) {
		component.find("selectStatusInputId").set("v.value", "");
		component.find("selectTypeInputId").set("v.value", "");
		helper.fireSearchEvent(component);
	},

	searchButtonClickHandler: function (component, event, helper) {
		helper.fireSearchEvent(component);
	},

	newButtonClickHandler: function (component, event, helper) {
		// TODO add handler here
		console.log('CALL newButtonClickHandler');
	}
});