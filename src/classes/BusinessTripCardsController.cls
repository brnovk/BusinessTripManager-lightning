public with sharing class BusinessTripCardsController {

	@AuraEnabled
	public static List<Business_Trip__c> fetchBusinessTrips(List<String> searchStatuses, List<String> searchTypes) {
		BusinessTripUtilities.checkReadObjectAccess(SObjectType.Business_Trip__c);
		BusinessTripUtilities.checkReadObjectAccess(SObjectType.Ride__c);
		BusinessTripUtilities.checkReadFieldsAccess(new List<DescribeFieldResult> {
			SObjectType.Business_Trip__c.fields.Target__c,
			SObjectType.Ride__c.fields.Start_Time__c,
			SObjectType.Ride__c.fields.End_Time__c,
			SObjectType.Ride__c.fields.Status__c,
			SObjectType.Ride__c.fields.Ticket_Number__c,
			SObjectType.Ride__c.fields.Type_Of_Trip__c
		});
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
		BusinessTripUtilities.checkDeleteObjectAccess(SObjectType.Business_Trip__c);
		BusinessTripUtilities.checkDeleteObjectAccess(SObjectType.Ride__c);
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