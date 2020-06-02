({
	fetchBusinessTrips: function(component) {
		let searchStatuses = component.get("v.searchStatuses");
		let searchTypes = component.get("v.searchTypes");
		let fetchBusinessTripsAction = component.get("c.fetchBusinessTrips");
		fetchBusinessTripsAction.setParams({
			searchStatuses: searchStatuses && searchStatuses.length ? searchStatuses : [],
			searchTypes: searchTypes && searchTypes.length ? searchTypes : []
		});
		fetchBusinessTripsAction.setCallback(this, function(response) {
			let state = response.getState();
			if (state === "SUCCESS") {
				component.set("v.businessTrips", response.getReturnValue());
			} else if (state === "INCOMPLETE") {
				this.safeFireToast($A.get("$Label.c.BT_MSG_Request_Incomplete_Header"), "info",
					$A.get("$Label.c.BT_MSG_Request_Incomplete_Body"));
			} else {
				let errors = response.getError();
				console.error(JSON.parse(JSON.stringify(errors)));
				let errorMessage = this.safeGetResponseError(response.getError());
				this.safeFireToast("Error", "error", errorMessage);
			}
			component.set("v.isLoaded", false);
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
			errorMessage += "Unknown error";
		}
		return errorMessage;
	}
});