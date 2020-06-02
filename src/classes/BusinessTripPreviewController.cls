public with sharing class BusinessTripPreviewController {

	@AuraEnabled
	public static List<Ride__c> retrieveRides(Id businessTripId) {
		BusinessTripUtilities.checkReadAccess(SObjectType.Ride__c);
		return [
			SELECT Start_Time__c, End_Time__c, Status__c, Ticket_Number__c, Type_Of_Trip__c
			FROM Ride__c
			WHERE Business_Trip__c =: businessTripId
		];
	}

	@AuraEnabled
	public static void updateRides(List<Ride__c> rides) {
		BusinessTripUtilities.checkUpdateAccess(SObjectType.Ride__c);
		update rides;
	}

	@AuraEnabled
	public static List<BusinessTripUtilities.PickListEntryWrapper> fetchBusinessTripRidesStatuses() {
		BusinessTripUtilities.checkReadAccess(SObjectType.Ride__c);
		return BusinessTripUtilities.getPicklistWrappers(Ride__c.Status__c.getDescribe());
	}

	@AuraEnabled
	public static List<BusinessTripUtilities.PickListEntryWrapper> fetchBusinessTripRidesTripTypes() {
		BusinessTripUtilities.checkReadAccess(SObjectType.Ride__c);
		return BusinessTripUtilities.getPicklistWrappers(Ride__c.Type_Of_Trip__c.getDescribe());
	}
}