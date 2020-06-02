// noinspection JSUnusedGlobalSymbols
({
	doInit: function(component, event, helper) {
		component.set("v.isDisplaySpinner", true);
		helper.initializeRisesDataTableColumns(component);
		helper.retrieveValidPickListValuesStatus(component);
		helper.retrieveValidPickListValuesTypeOfTrip(component);
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
		$A.get("e.force:refreshView").fire();
	},

	rideDataTablesHandleSave: function(component, event, helper) {
		let savedRecordsData = event.getParam("draftValues");
		helper.rideDataTablesHandleSave(component, savedRecordsData);
	},

	rideDataTablesCancelSave: function(component, event, helper) {
		component.set("v.validationError", ""); // clear validation errors
	},

	addRideButtonClickHandler: function(component, event, helper) {
		let businessTripId = component.get("v.recordId");
		let createRecordEvent = $A.get("e.force:createRecord");
		createRecordEvent.setParams({
			"entityApiName": "Ride__c",
			"defaultFieldValues": { "Business_Trip__c": businessTripId }
		});
		createRecordEvent.fire();
	}
});