@IsTest
public with sharing class BusinessTripUtilitiesTest {

	@IsTest
	static void testCheckReadAccess() {
		BusinessTripUtilities.isTestAccessLogic = true;
		Boolean isExceptionThrown = false;
		try {
			BusinessTripUtilities.checkReadAccess(SObjectType.Ride__c);
		} catch (NoAccessException ex) {
			isExceptionThrown = true;
		}
		System.assertEquals(true, isExceptionThrown);
	}

	@IsTest
	static void testCheckUpdateAccess() {
		BusinessTripUtilities.isTestAccessLogic = true;
		Boolean isExceptionThrown = false;
		try {
			BusinessTripUtilities.checkUpdateAccess(SObjectType.Ride__c);
		} catch (NoAccessException ex) {
			isExceptionThrown = true;
		}
		System.assertEquals(true, isExceptionThrown);
	}

	@IsTest
	static void testCheckDeleteAccess() {
		BusinessTripUtilities.isTestAccessLogic = true;
		Boolean isExceptionThrown = false;
		try {
			BusinessTripUtilities.checkDeleteAccess(SObjectType.Ride__c);
		} catch (NoAccessException ex) {
			isExceptionThrown = true;
		}
		System.assertEquals(true, isExceptionThrown);
	}
}