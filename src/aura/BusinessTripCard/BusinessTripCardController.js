({
	doInit: function(component, event, helper) {
		let rides = component.get("v.businessTrip.Rides__r");
		if (rides && rides.length && rides.length > 1) {
			component.set("v.countHidedRides", rides.length - 1);
		}
	},

	navigateToSObject: function(component, event, helper) {
		let sObjectId = event.srcElement.dataset.id;
		helper.navigateToSObject(component, sObjectId, "chatter");
	},

	detailButtonClickHandler: function(component, event, helper) {
		let businessTripId = component.get("v.businessTrip.Id");
		helper.createCustomModalBusinessTripPreview(component, businessTripId, false);
	},

	dropDownButtonMenuHandler: function(component, event, helper) {
		const selectedMenu = event.detail.menuItem.get("v.value");
		const businessTripId = component.get("v.businessTrip.Id");
		switch(selectedMenu) {
			case "Edit": {
				helper.createCustomModalBusinessTripPreview(component, businessTripId, true);
			} break;
			case "Delete": {
				helper.deleteBusinessTripWithConfirmation(component, businessTripId);
			} break;
			case "ViewBusinessTripInSP": {
				helper.navigateToSObject(component, businessTripId, "detail");
			} break;
			case "ViewRidesInSP": {
				helper.navigateToRelatedList(component, businessTripId, "Rides__r");
			} break;
			case "AddRide": {
				helper.createRideInModal(component, businessTripId);
			} break;
			default: {
				console.warn("Action in not implemented: " + selectedMenu);
			} break;
		}
	}
});