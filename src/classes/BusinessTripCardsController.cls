public with sharing class BusinessTripCardsController {

	public static String MsgNotAllowedReadingObject = 'You do not have read access to the object: ';

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
}