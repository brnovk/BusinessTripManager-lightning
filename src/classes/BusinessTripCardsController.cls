public with sharing class BusinessTripCardsController {

	public static String MsgNotAllowedReadingObject = 'You do not have read access to the object: ';
	public static String MsgNotAllowedDeleteObject = 'You do not have access to delete the object: ';
	// You do not have access to delete the object: xxx

	@AuraEnabled
	public static List<Business_Trip__c> fetchBusinessTrips(List<String> searchStatuses, List<String> searchTypes) {
		if (!SObjectType.Business_Trip__c.isAccessible()) {
			NoAccessException accessException = new NoAccessException();
			accessException.setMessage(MsgNotAllowedReadingObject + SObjectType.Business_Trip__c.getName());
			throw accessException;
		}
		if (!SObjectType.Ride__c.isAccessible()) {
			NoAccessException accessException = new NoAccessException();
			accessException.setMessage(MsgNotAllowedReadingObject + SObjectType.Ride__c.getName());
			throw accessException;
		}
		Boolean isExistsStatuses = searchStatuses != null && !searchStatuses.isEmpty();
		Boolean isExistsTypes = searchTypes != null && !searchTypes.isEmpty();
		String query = '' +
			'SELECT Name, Employee__r.Name, Target__c, ( ' +
				'SELECT Start_Time__c, End_Time__c, Status__c, Ticket_Number__c, Type_Of_Trip__c ' +
				'FROM Rides__r ' +
				'ORDER BY Start_Time__c ASC ' +
			') ' +
			'FROM Business_Trip__c ';
		if (isExistsStatuses && !isExistsTypes) {
			query += 'WHERE Id IN ( SELECT Business_Trip__c FROM Ride__c WHERE Status__c IN: searchStatuses ) ';
		} else if (!isExistsStatuses && isExistsTypes) {
			query += 'WHERE Id IN ( SELECT Business_Trip__c FROM Ride__c WHERE Type_Of_Trip__c IN: searchTypes ) ';
		} else if (isExistsStatuses && isExistsTypes) {
			query += 'WHERE Id IN ( SELECT Business_Trip__c FROM Ride__c WHERE Status__c IN: searchStatuses ' +
				'AND Type_Of_Trip__c IN: searchTypes ) ';
		}
		return Database.query(query);
	}

	@AuraEnabled
	public static void deleteBusinessTripWithRides(Id businessTripId) {
		if (!SObjectType.Business_Trip__c.isDeletable()) {
			NoAccessException accessException = new NoAccessException();
			accessException.setMessage(MsgNotAllowedDeleteObject + SObjectType.Business_Trip__c.getName());
			throw accessException;
		}
		if (!SObjectType.Ride__c.isDeletable()) {
			NoAccessException accessException = new NoAccessException();
			accessException.setMessage(MsgNotAllowedDeleteObject + SObjectType.Ride__c.getName());
			throw accessException;
		}
		List<Ride__c> rides = [ SELECT Id FROM Ride__c WHERE Business_Trip__c =: businessTripId ];
		List<Business_Trip__c> businessTrips = [ SELECT Id FROM Business_Trip__c WHERE Id =: businessTripId ];
		if (!rides.isEmpty()) {
			delete rides;
		}
		if (!businessTrips.isEmpty()) {
			delete businessTrips;
		}
	}
}