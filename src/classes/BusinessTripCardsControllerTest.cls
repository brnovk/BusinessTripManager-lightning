@IsTest
public with sharing class BusinessTripCardsControllerTest {

	@TestSetup
	private static void testSetupHandler() {
		Business_Trip__c businessTrip = new Business_Trip__c();
		insert businessTrip;
		insert new Ride__c(Business_Trip__c = businessTrip.Id, Status__c = 'Assigned', Type_Of_Trip__c = 'By train');
	}

	@IsTest
	static void testFetchBusinessTrips() {
		final List<String> EMPTY_LIST = new List<String>();
		final List<String> STATUS_LIST = new List<String> { 'Assigned' };
		final List<String> TYPE_LIST = new List<String> { 'By train' };
		System.assertEquals(false, BusinessTripCardsController.fetchBusinessTrips(EMPTY_LIST, EMPTY_LIST).isEmpty());
		System.assertEquals(false, BusinessTripCardsController.fetchBusinessTrips(STATUS_LIST, EMPTY_LIST).isEmpty());
		System.assertEquals(false, BusinessTripCardsController.fetchBusinessTrips(EMPTY_LIST, TYPE_LIST).isEmpty());
		System.assertEquals(false, BusinessTripCardsController.fetchBusinessTrips(STATUS_LIST, TYPE_LIST).isEmpty());
	}

	@IsTest
	static void testDeleteBusinessTripWithRides() {
		Business_Trip__c businessTrip = [SELECT Id FROM Business_Trip__c LIMIT 1];
		BusinessTripCardsController.deleteBusinessTripWithRides(businessTrip.Id);
		System.assertEquals(0, [SELECT COUNT() FROM Business_Trip__c WHERE Id =: businessTrip.Id]);
	}
}