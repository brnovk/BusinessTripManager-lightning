({
	initializeRisesDataTableColumns: function(component) {
		let isEditableMode = component.get("v.isEditableMode");
		component.set('v.risesDataTableColumns', [{
			label: 'Start Time', fieldName: 'Start_Time__c', type: 'date', wrapText: true, editable: isEditableMode,
				typeAttributes: { year: "numeric", day: "2-digit", month: "long", hour: "2-digit", minute:"2-digit" }
		}, {
			label: 'End Time', fieldName: 'End_Time__c', type: 'date', wrapText: true, editable: isEditableMode,
				typeAttributes: { year: "numeric", day: "2-digit", month: "long", hour: "2-digit", minute:"2-digit" }
		}, {
			label: 'Status', fieldName: 'Status__c', type: 'text', wrapText: true, editable: isEditableMode
		}, {
			label: '№ ticket', fieldName: 'Ticket_Number__c', type: 'text', wrapText: true, editable: isEditableMode
		}, {
			label: 'Type Of Trip', fieldName: 'Type_Of_Trip__c', type: 'text', wrapText: true, editable: isEditableMode
		}]);
	},

	retrieveValidPickListValuesStatus: function(component) { // retrieve valid Status__c values
		let fetchBusinessTripsAction = component.get("c.fetchBusinessTripRidesStatuses");
		fetchBusinessTripsAction.setCallback(this, function(response) {
			let state = response.getState();
			if (state === "SUCCESS") {
				let value = component.get("v.validationPickListValuesMap");
				value['Status__c'] = response.getReturnValue();
				component.set("v.validationPickListValuesMap", value);
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
		$A.enqueueAction(fetchBusinessTripsAction);
	},

	retrieveValidPickListValuesTypeOfTrip: function(component) { // retrieve valid Type_Of_Trip__c values
		let fetchBusinessTripsAction = component.get("c.fetchBusinessTripRidesTripTypes");
		fetchBusinessTripsAction.setCallback(this, function(response) {
			let state = response.getState();
			if (state === "SUCCESS") {
				let value = component.get("v.validationPickListValuesMap");
				value['Type_Of_Trip__c'] = response.getReturnValue();
				component.set("v.validationPickListValuesMap", value);
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
		$A.enqueueAction(fetchBusinessTripsAction);
	},

	retrieveRides: function(component) {
		let businessTripId = component.get("v.recordId");
		let fetchRidesAction = component.get("c.retrieveRides");
		fetchRidesAction.setParams({ businessTripId: businessTripId });
		fetchRidesAction.setCallback(this, function(response) {
			let state = response.getState();
			if (state === "SUCCESS") {
				component.set("v.rides", response.getReturnValue());
			} else if (state === "INCOMPLETE") {
				this.safeFireToast($A.get("$Label.c.BT_MSG_Request_Incomplete_Header"), "info",
					$A.get("$Label.c.BT_MSG_Request_Incomplete_Body"));
			} else {
				let errors = response.getError();
				console.error(JSON.parse(JSON.stringify(errors)));
				let errorMessage = this.safeGetResponseError(response.getError());
				this.safeFireToast("Error", "error", errorMessage);
			}
			component.set("v.isDisplaySpinner", false);
		});
		$A.enqueueAction(fetchRidesAction);
	},

	rideDataTablesHandleSave: function(component, savedRecordsData) {
		let self = this;
		component.set("v.validationError", ""); // clear validation errors
		let validationErrorMessage = this.validationRideDataTablesValues(component, savedRecordsData);
		if (validationErrorMessage) {
			component.set("v.validationError", validationErrorMessage);
			return;
		}

		let totalRecordEdited = savedRecordsData.length;
		let action = component.get("c.updateRides");
		action.setParams({ "rides": savedRecordsData });
		action.setCallback(this, function(response) {
			let state = response.getState();
			if (state === "SUCCESS") {
				$A.get("e.force:refreshView").fire();
				self.safeFireToast("Record Update", "success", totalRecordEdited + " Rides Records Updated");
			} else if (state === "INCOMPLETE") {
				self.safeFireToast($A.get("$Label.c.BT_MSG_Request_Incomplete_Header"), "info",
					$A.get("$Label.c.BT_MSG_Request_Incomplete_Body"));
			} else {
				let errors = response.getError();
				console.error(JSON.parse(JSON.stringify(errors)));
				let errorMessage = this.safeGetResponseError(response.getError());
				self.safeFireToast("Error", "error", errorMessage);
			}
		});
		$A.enqueueAction(action);
	},

	validationRideDataTablesValues: function(component, savedRecordsData) {
		let validationErrorMessage = "";
		let validationPickListValuesMap = component.get("v.validationPickListValuesMap");
		for (let fieldForValidation in validationPickListValuesMap) {
			if (!validationPickListValuesMap.hasOwnProperty(fieldForValidation)) {
				continue;
			}
			for (let i = 0; i < savedRecordsData.length; i++) {
				let savedRecordRow = savedRecordsData[i];
				for (let fieldForSave in savedRecordRow) {
					let isValid = false;
					if (!savedRecordRow.hasOwnProperty(fieldForSave) || fieldForSave !== fieldForValidation) {
						isValid = true;
						continue;
					}
					let savedValue = savedRecordRow[fieldForSave];
					let validValues = validationPickListValuesMap[fieldForValidation];
					for (let j = 0; j < validValues.length; j++) {
						let validValue = validValues[j];
						if (savedValue.trim() === validValue.value) {
							isValid = true;
							break;
						}
					}
					if (!isValid) {
						let allowedValues = "";
						for (let j = 0; j < validValues.length; j++) {
							allowedValues += '"' + validValues[j].value + '"';
							if (j + 1 !== validValues.length) {
								allowedValues += ', ';
							} else {
								allowedValues += '. ';
							}
						}
						validationErrorMessage += '\nValue "' + savedValue + '" is invalid for this field. ' +
							'Allowed values ​​are ' + allowedValues;
					}
				}
			}
		}
		return validationErrorMessage;
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