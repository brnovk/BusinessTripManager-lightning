({
	fetchBusinessTrips: function(component) {
		let searchStatuses = component.get("v.searchStatuses");
		let searchTypes = component.get("v.searchTypes");
		let fetchBusinessTripsAction = component.get("c.fetchBusinessTrips");
		fetchBusinessTripsAction.setParams({
			searchStatuses: searchStatuses && searchStatuses.length ? searchStatuses : [],
			searchTypes: searchTypes && searchTypes.length ? searchTypes : []
		});
		fetchBusinessTripsAction.setCallback(this,
			function (response) {
				let state = response.getState();
				if (state === "SUCCESS") {
					component.set("v.businessTrips", response.getReturnValue());
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
						toastEvent.setParams({ "title": "Search Error", "message": errorMessage, "type": "error" });
						toastEvent.fire();
					}
				}
			}
		);
		$A.enqueueAction(fetchBusinessTripsAction);
	}
});