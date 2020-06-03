@IsTest
public with sharing class BusinessTripUtilitiesTest {

	@IsTest
	static void testCheckReadAccess() {
		BusinessTripUtilities.isTestAccessLogic = true;
		Boolean isExceptionThrown = false;
		try {
			BusinessTripUtilities.checkReadObjectAccess(SObjectType.Ride__c);
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
			BusinessTripUtilities.checkUpdateObjectAccess(SObjectType.Ride__c);
		} catch (NoAccessException ex) {
			isExceptionThrown = true;
		}
		System.assertEquals(true, isExceptionThrown);
	}

	@IsTest
	static void testCheckDeleteObjectAccess() {
		BusinessTripUtilities.isTestAccessLogic = true;
		Boolean isExceptionThrown = false;
		try {
			BusinessTripUtilities.checkDeleteObjectAccess(SObjectType.Ride__c);
		} catch (NoAccessException ex) {
			isExceptionThrown = true;
		}
		System.assertEquals(true, isExceptionThrown);
	}
}