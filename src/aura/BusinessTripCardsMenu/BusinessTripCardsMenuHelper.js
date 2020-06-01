({
	fetchBusinessTripRidesStatuses: function(component) {
		this.retrievePickListValues(component, "c.fetchBusinessTripRidesStatuses", "v.businessTripRidesStatuses");
	},

	fetchBusinessTripRidesTripTypes: function(component) {
		this.retrievePickListValues(component, "c.fetchBusinessTripRidesTripTypes", "v.businessTripRidesTripTypes");
	},

	fireSearchEvent: function(component) {
		let eventParams = {};
		const selectedStatus = component.find("selectStatusInputId").get("v.value");
		if (selectedStatus) { // set search parameter "Status" (if exists)
			eventParams.searchStatuses = [ selectedStatus ];
		}
		const selectedType = component.find("selectTypeInputId").get("v.value");
		if (selectedType) { // set search parameter "Type" (if exists)
			eventParams.searchTypes = [ selectedType ];
		}
		const businessTripSearchEvent = $A.get("e.c:BusinessTripSearchEvent");
		businessTripSearchEvent.setParams(eventParams);
		businessTripSearchEvent.fire();
	},

	retrievePickListValues: function(component, controllerMethod, componentAttribute) {
		let fetchBusinessTripsAction = component.get(controllerMethod);
		fetchBusinessTripsAction.setCallback(this,
			function (response) {
				const state = response.getState();
				if (state === "SUCCESS") {
					component.set(componentAttribute, response.getReturnValue());
				} else if (state === "ERROR") {
					let errors = response.getError();
					let errorMessage = (errors && errors[0] && errors[0].message)
						? "Error message: " + errors[0].message
						: "Unknown error";
					let toastEvent = $A.get("e.force:showToast");
					if (!toastEvent) {
						let WARNING_MESSAGE = "Platform is not supported \"showToast\" event";
						console.error(WARNING_MESSAGE);
						console.error(errorMessage);
						alert(errorMessage);
					} else {
						console.error(errorMessage);
						toastEvent.setParams({
							"title": "Picklist Initialize Error", "message": errorMessage, "type": "error"
						});
						toastEvent.fire();
					}
				}
			}
		);
		$A.enqueueAction(fetchBusinessTripsAction);
	}
});