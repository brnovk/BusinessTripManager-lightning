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
		fetchBusinessTripsAction.setCallback(this, function (response) {
			let state = response.getState();
			if (state === "SUCCESS") {
				component.set(componentAttribute, response.getReturnValue());
			} else if (state === "INCOMPLETE") {
				this.safeFireToast(
					$A.get("$Label.c.BT_MSG_Request_Incomplete_Header"),
					"info",
					$A.get("$Label.c.BT_MSG_Request_Incomplete_Body")
				);
			} else {
				let errors = response.getError();
				console.error(JSON.parse(JSON.stringify(errors)));
				let errorMessage = this.safeGetResponseError(response.getError());
				this.safeFireToast("Picklist Initialize Error", "error", errorMessage);
			}
		});
		$A.enqueueAction(fetchBusinessTripsAction);
	},

	safeFireToast: function (title, type, message) {
		let toastEvent = $A.get("e.force:showToast");
		if (!toastEvent) {
			console.warn($A.get("$Label.c.BT_MSG_Not_Support_Toast_Event"));
			if (type === "error") {
				console.error(message);
			} else {
				console.log(message);
			}
			alert(message);
		} else {
			if (type === "error") {
				console.error(message);
			} else {
				console.log(message);
			}
			toastEvent.setParams({ "title": title, "message": message, "type": type });
			toastEvent.fire();
		}
	},

	safeGetResponseError: function (errors) {
		let errorMessage = "";
		if (errors) {
			for (let i = 0; i < errors.length; i++) {
				let error = errors[i];
				// Page errors
				for (let j = 0; error.pageErrors && j < error.pageErrors.length; j++) {
					errorMessage += (errorMessage.length > 0 ? "\n" : "");
					errorMessage += error.pageErrors[j].statusCode ? error.pageErrors[j].statusCode + " : " : "";
					errorMessage += error.pageErrors[j].message;
				}
				// Field error (for example DmlException)
				if (error.fieldErrors) {
					Object.keys(error.fieldErrors).forEach(function(field) {
						error.fieldErrors[field].forEach(function(fieldError) {
							errorMessage = (errorMessage.length > 0 ? "\n" : "") + fieldError.message;
						});
					});
				}
				// Error "duplicateResults" (I could not reproduce this, just output object via JSON.stringify)
				if (error.duplicateResults && error.duplicateResults.length) {
					for (let j = 0; j < error.duplicateResults.length; j++) {
						errorMessage += (errorMessage.length > 0 ? "\n" : "");
						errorMessage += JSON.stringify(error.duplicateResults[j]);
					}
				}
				// Other exceptions
				if (error.message) {
					errorMessage += (errorMessage.length > 0 ? "\n" : "") + error.message;
				}
			}
		} else {
			errorMessage += $A.get("$Label.c.BT_MSG_Unknown_Error");
		}
		return errorMessage;
	}
});