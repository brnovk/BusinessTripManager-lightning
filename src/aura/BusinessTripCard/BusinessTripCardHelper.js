({
	navigateToSObject: function(component, sObjectId, slideDevName) {
		let navigateToSObjectEvent = $A.get("e.force:navigateToSObject");
		navigateToSObjectEvent.setParams({ "recordId": sObjectId, "slideDevName": slideDevName });
		navigateToSObjectEvent.fire();
	},

	navigateToRelatedList: function(component, parentRecordId, relatedListName) {
		let navigateToRelatedListEvent = $A.get("e.force:navigateToRelatedList");
		navigateToRelatedListEvent.setParams({ "relatedListId": relatedListName, "parentRecordId": parentRecordId });
		navigateToRelatedListEvent.fire();
	},

	createRideInModal: function(component, parentRecordId) {
		let createRecordEvent = $A.get("e.force:createRecord");
		createRecordEvent.setParams({
			"entityApiName": "Ride__c",
			"defaultFieldValues": { "Business_Trip__c": parentRecordId }
		});
		createRecordEvent.fire();
	},

	createCustomModalBusinessTripPreview: function(component, businessTripId, isEditableMode) {
		$A.createComponent("c:BusinessTripPreview", { recordId : businessTripId, isEditableMode : isEditableMode },
			function(result, status) {
				if (status === "SUCCESS") {
					component.find("overlayLib").showCustomModal({
						header: "Business Trip",
						body: result,
						showCloseButton: true
					})
				}
			}
		);
	},

	deleteBusinessTripWithConfirmation: function (component, businessTripId) {
		if (confirm($A.get("$Label.c.BT_MSG_Delete_Confirmation"))) {
			let action = component.get("c.deleteBusinessTripWithRides");
			action.setParams({ "businessTripId": businessTripId });
			action.setCallback(this, function(response) {
				let state = response.getState();
				if (state === "SUCCESS") {
					$A.get("e.force:refreshView").fire();
					this.safeFireToast("Record Delete", "success", "Business Trip Deleted");
				} else if (state === "INCOMPLETE") {
					this.safeFireToast($A.get("$Label.c.BT_MSG_Request_Incomplete_Header"), "info",
						$A.get("$Label.c.BT_MSG_Request_Incomplete_Body"));
				} else {
					let errors = response.getError();
					console.error(JSON.parse(JSON.stringify(errors)));
					let errorMessage = this.safeGetResponseError(response.getError());
					this.safeFireToast("Error", "error", errorMessage);
				}
			});
			$A.enqueueAction(action);
		}
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