({
	doInit: function(component, event, helper) {
		helper.initializeRisesDataTableColumns(component);
		helper.retrieveRides(component);
	},

	businessTripEditFormHandleSubmit: function(component, event, helper) {
		component.find("businessTripEditFormId").submit();
	},

	businessTripEditFormHandleSuccess: function(component, event, helper) {
		let businessTripName = component.find("businessTripNameId").get("v.value");
		component.find("notificationsLibraryId").showToast({
			"variant": "success",
			"title": businessTripName,
			"message": "Business Trip updated successfully!!"
		});
		component.find("overlayLibraryId").notifyClose();
		$A.get('e.force:refreshView').fire();
	},
	rideDataTablesHandleSave: function(component, event, helper) {
		let savedRecordsData = event.getParam("draftValues");
		// TODO add validation of saved data (picklists)
		let totalRecordEdited = savedRecordsData.length;
		let action = component.get("c.updateRides");
		action.setParams({ "rides": savedRecordsData });
		action.setCallback(this, function(response) {
			let showToast = $A.get("e.force:showToast");
			let state = response.getState();
			if (state === "SUCCESS") {
				$A.get("e.force:refreshView").fire();
				showToast.setParams({
					"title" : "Record Update",
					"type": "success",
					"message" : totalRecordEdited + " Rides Records Updated"
				});
				showToast.fire();
			} else if (state === "INCOMPLETE") {
				showToast.setParams({
					"title" : "Server request not completed",
					"type": "info",
					"message" : "Server could not be reached. Check your internet connection."
				});
				showToast.fire();
			} else {
				let errors = response.getError();
				let errorMessage = "";
				console.error(JSON.parse(JSON.stringify(errors)));
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
				showToast.setParams({ "title": "Error", "type": "error", "message": errorMessage });
				showToast.fire();
			}
		});
		$A.enqueueAction(action);
	}
});