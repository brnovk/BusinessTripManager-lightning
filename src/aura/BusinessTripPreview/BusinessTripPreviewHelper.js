({
	initializeRisesDataTableColumns: function(component) {
		let isEditableMode = component.get("v.isEditableMode");
		component.set('v.risesDataTableColumns', [
			{ label: 'Start Time', fieldName: 'Start_Time__c', type: 'date', wrapText: true, editable: isEditableMode, typeAttributes: {
				year: "numeric", day: "2-digit", month: "long", hour: "2-digit", minute:"2-digit"
			}},
			{ label: 'End Time', fieldName: 'End_Time__c', type: 'date', wrapText: true, editable: isEditableMode, typeAttributes: {
				year: "numeric", day: "2-digit", month: "long", hour: "2-digit", minute:"2-digit"
			}},
			{ label: 'Status', fieldName: 'Status__c', type: 'text', wrapText: true, editable: isEditableMode },
			{ label: '№ ticket', fieldName: 'Ticket_Number__c', type: 'text', wrapText: true, editable: isEditableMode },
			{ label: 'Type Of Trip', fieldName: 'Type_Of_Trip__c', type: 'text', wrapText: true, editable: isEditableMode }
		]);
	},

	retrieveValidPickListValuesStatus: function(component) { // retrieve valid Status__c values
		let fetchBusinessTripsAction = component.get("c.fetchBusinessTripRidesStatuses");
		fetchBusinessTripsAction.setCallback(this,
			function (response) {
				const state = response.getState();
				if (state === "SUCCESS") {
					let value = component.get("v.validationPickListValuesMap");
					value['Status__c'] = response.getReturnValue();
					component.set("v.validationPickListValuesMap", value);
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
	},

	retrieveValidPickListValuesTypeOfTrip: function(component) { // retrieve valid Type_Of_Trip__c values
		let fetchBusinessTripsAction = component.get("c.fetchBusinessTripRidesTripTypes");
		fetchBusinessTripsAction.setCallback(this,
			function (response) {
				const state = response.getState();
				if (state === "SUCCESS") {
					let value = component.get("v.validationPickListValuesMap");
					value['Type_Of_Trip__c'] = response.getReturnValue();
					component.set("v.validationPickListValuesMap", value);
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
	},

	retrieveRides: function (component) {
		let businessTripId = component.get("v.recordId");
		let fetchRidesAction = component.get("c.retrieveRides");
		fetchRidesAction.setParams({
			businessTripId: businessTripId
		});
		fetchRidesAction.setCallback(this,
			function (response) {
				let state = response.getState();
				if (state === "SUCCESS") {
					// console.log(JSON.parse(JSON.stringify(response.getReturnValue())));
					component.set("v.rides", response.getReturnValue());
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
		$A.enqueueAction(fetchRidesAction);
	}
});