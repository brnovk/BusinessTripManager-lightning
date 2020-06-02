@IsTest
public with sharing class BusinessTripCardsMenuControllerTest {

	@IsTest
	static void testFetchBusinessTripRidesStatuses() {
		System.assertEquals(false, BusinessTripCardsMenuController.fetchBusinessTripRidesStatuses().isEmpty());
	}

	@IsTest
	static void testFetchBusinessTripRidesTripTypes() {
		System.assertEquals(false, BusinessTripCardsMenuController.fetchBusinessTripRidesTripTypes().isEmpty());
	}
}