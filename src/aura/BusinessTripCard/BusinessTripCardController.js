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
		var strAccId = component.get("v.businessTrip.Id");
		console.log('Account Id ====>'+strAccId);
		$A.createComponent("c:BusinessTripPreview",
			{recordId : strAccId},
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
		var strAccId = component.get("v.businessTrip.Id");
		console.log('Account Id ====>'+strAccId);
		$A.createComponent("c:BusinessTripPreview",
			{recordId : strAccId, isEditableMode : true},
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
			case "Edit": {		var strAccId = component.get("v.businessTrip.Id");
				console.log('Account Id ====>'+strAccId);
				$A.createComponent("c:BusinessTripPreview",
					{recordId : strAccId, isEditableMode : true},
					function(result, status) {
						if (status === "SUCCESS") {
							component.find('overlayLibDemo').showCustomModal({
								header: "Business Trip",
								body: result,
								showCloseButton: true,
								cssClass: "mymodal",
							})
						}
					});} break;
		}
	}
});