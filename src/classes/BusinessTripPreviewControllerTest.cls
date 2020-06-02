@IsTest
public with sharing class BusinessTripPreviewControllerTest {

	@TestSetup
	private static void testSetupHandler() {
		Business_Trip__c businessTrip = new Business_Trip__c();
		insert businessTrip;
		insert new Ride__c(Business_Trip__c = businessTrip.Id, Status__c = 'Assigned', Type_Of_Trip__c = 'By train');
	}

	@IsTest
	static void testRetrieveRides() {
		Ride__c ride = [ SELECT Business_Trip__c FROM Ride__c WHERE Business_Trip__c != NULL LIMIT 1 ];
		System.assertEquals(false, BusinessTripPreviewController.retrieveRides(ride.Business_Trip__c).isEmpty());
	}

	@IsTest
	static void testUpdateRides() {
		List<Ride__c> ridesToUpdate = new List<Ride__c>();
		for (Ride__c ride : [ SELECT Status__c FROM Ride__c WHERE Status__c != 'Canceled' ]) {
			ride.Status__c = 'Canceled';
			ridesToUpdate.add(ride);
		}
		BusinessTripPreviewController.updateRides(ridesToUpdate);
		System.assertNotEquals(0, [ SELECT COUNT() FROM Ride__c WHERE Status__c = 'Canceled' ]);
	}

	@IsTest
	static void testFetchBusinessTripRidesStatuses() {
		System.assertEquals(false, BusinessTripPreviewController.fetchBusinessTripRidesStatuses().isEmpty());
	}

	@IsTest
	static void testFetchBusinessTripRidesTripTypes() {
		System.assertEquals(false, BusinessTripPreviewController.fetchBusinessTripRidesTripTypes().isEmpty());
	}
}