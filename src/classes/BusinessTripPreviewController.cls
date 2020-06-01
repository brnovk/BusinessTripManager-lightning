public with sharing class BusinessTripPreviewController {

	public static String MsgNotAllowedReadingObject = 'You do not have read access to the object: ';

	@AuraEnabled
	public static List<Ride__c> retrieveRides(Id businessTripId) {
		if (!SObjectType.Ride__c.isAccessible()) {
			NoAccessException accessException = new NoAccessException();
			accessException.setMessage(MsgNotAllowedReadingObject + SObjectType.Ride__c.getName());
			throw accessException;
		}
		return [
			SELECT Start_Time__c, End_Time__c, Status__c, Ticket_Number__c, Type_Of_Trip__c
			FROM Ride__c
			WHERE Business_Trip__c =: businessTripId
		];
	}

	@AuraEnabled
	public static void updateRides(List<Ride__c> rides) {
		if (!SObjectType.Ride__c.isAccessible() || !SObjectType.Ride__c.isUpdateable()) {
			NoAccessException accessException = new NoAccessException();
			accessException.setMessage('You do not have write access to the object: ' + SObjectType.Ride__c.getName());
			throw accessException;
		}
		update rides;
	}
}