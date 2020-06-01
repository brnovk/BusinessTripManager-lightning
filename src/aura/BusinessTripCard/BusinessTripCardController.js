({
	doInit: function(component, event, helper) {
		let rides = component.get("v.businessTrip.Rides__r");
		if (rides && rides.length && rides.length > 1) {
			component.set("v.countHidedRides", rides.length - 1);
		}
	},
	navigateToSObject: function(component, event, helper) {
		let sObjectId = event.srcElement.dataset.id;
		let navEvt = $A.get("e.force:navigateToSObject");
		navEvt.setParams({
			"recordId": sObjectId,
			"slideDevName": "chatter"
		});
		navEvt.fire();
	},
	handleShowModal: function(component, event, helper) {
		// var modalBody;
		// $A.createComponent("c:BusinessTripCard", {},
		// 	function(content, status) {
		// 		if (status === "SUCCESS") {
		// 			modalBody = content;
		// 			component.find('overlayLib').showCustomModal({
		// 				header: "Application Confirmation",
		// 				body: modalBody,
		// 				showCloseButton: true,
		// 				cssClass: "mymodal",
		// 				closeCallback: function() {
		// 					alert('You closed the alert!');
		// 				}
		// 			})
		// 		}
		// 	});
		let businessTripId = component.get("v.businessTrip.Id");
		console.log('Business Trip Id ====> ' + businessTripId);
		$A.createComponent("c:BusinessTripPreview",
			{ recordId : businessTripId },
			function(result, status) {
				if (status === "SUCCESS") {
					component.find('overlayLibDemo').showCustomModal({
						header: "Business Trip",
						body: result,
						showCloseButton: true,
						cssClass: "mymodal",
					})
				}
			});
	},
	handleShowModal2: function(component, event, helper) {
		console.log('some');
		// var modalBody;
		// $A.createComponent("c:BusinessTripCard", {},
		// 	function(content, status) {
		// 		if (status === "SUCCESS") {
		// 			modalBody = content;
		// 			component.find('overlayLib').showCustomModal({
		// 				header: "Application Confirmation",
		// 				body: modalBody,
		// 				showCloseButton: true,
		// 				cssClass: "mymodal",
		// 				closeCallback: function() {
		// 					alert('You closed the alert!');
		// 				}
		// 			})
		// 		}
		// 	});
		var businessTripId = component.get("v.businessTrip.Id");
		console.log('Business Trip Id ====> ' + businessTripId);
		$A.createComponent("c:BusinessTripPreview",
			{ recordId : businessTripId, isEditableMode : true },
			function(result, status) {
				if (status === "SUCCESS") {
					component.find('overlayLibDemo').showCustomModal({
						header: "Business Trip",
						body: result,
						showCloseButton: true,
						cssClass: "mymodal",
					})
				}
			});
	},
	buttonMenuSelectHandler: function(component, event, helper) {
		var selectedMenu = event.detail.menuItem.get("v.value");
		console.log('selectedMenu-' + selectedMenu);
		switch(selectedMenu) {
			case "Edit": {
				let businessTripId = component.get("v.businessTrip.Id");
				console.log('Business Trip Id ====> ' + businessTripId);
				$A.createComponent("c:BusinessTripPreview",
					{ recordId : businessTripId, isEditableMode : true },
					function(result, status) {
						if (status === "SUCCESS") {
							component.find('overlayLibDemo').showCustomModal({
								header: "Business Trip",
								body: result,
								showCloseButton: true,
								cssClass: "mymodal",
							})
						}
					});
			} break;
			case "Delete": {
				let businessTripId = component.get("v.businessTrip.Id");
				if (confirm('Are you sure you want to delete this item?')) {
					let action = component.get("c.deleteBusinessTripWithRides");
					action.setParams({ "businessTripId": businessTripId });
					action.setCallback(this, function(response) {
						let showToast = $A.get("e.force:showToast");
						let state = response.getState();
						if (state === "SUCCESS") {
							$A.get("e.force:refreshView").fire();
							showToast.setParams({
								"title" : "Record Delete",
								"type": "success",
								"message" : "Business Trip Deleted"
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
			} break;
			case "View Business Trip in standard page": {
				let sObjectId = component.get("v.businessTrip.Id");
				let navEvt = $A.get("e.force:navigateToSObject");
				navEvt.setParams({
					"recordId": sObjectId,
					"slideDevName": "detail"
				});
				navEvt.fire();
			} break;
			case "View Rides in standard page": {
				let businessTripId = component.get("v.businessTrip.Id");
				var relatedListEvent = $A.get("e.force:navigateToRelatedList");
				relatedListEvent.setParams({
					"relatedListId": "Rides__r",
					"parentRecordId": businessTripId
				});
				relatedListEvent.fire();
			} break;
			case "Add ride": {
				let businessTripId = component.get("v.businessTrip.Id");
				// TODO write jump to new Ride record modal
			} break;
		}
	}
});