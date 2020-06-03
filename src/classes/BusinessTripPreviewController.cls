public with sharing class BusinessTripPreviewController {

	@AuraEnabled
	public static List<Ride__c> retrieveRides(Id businessTripId) {
		BusinessTripUtilities.checkReadObjectAccess(SObjectType.Ride__c);
		BusinessTripUtilities.checkReadFieldsAccess(new List<DescribeFieldResult> {
			SObjectType.Ride__c.fields.Start_Time__c,
			SObjectType.Ride__c.fields.End_Time__c,
			SObjectType.Ride__c.fields.Status__c,
			SObjectType.Ride__c.fields.Ticket_Number__c,
			SObjectType.Ride__c.fields.Type_Of_Trip__c
		});
		return [
			SELECT Start_Time__c, End_Time__c, Status__c, Ticket_Number__c, Type_Of_Trip__c
			FROM Ride__c
			WHERE Business_Trip__c =: businessTripId
		];
	}

	@AuraEnabled
	public static void updateRides(List<Ride__c> rides) {
		BusinessTripUtilities.checkUpdateObjectAccess(SObjectType.Ride__c);
		BusinessTripUtilities.checkWriteFieldsAccess(new List<DescribeFieldResult> {
			SObjectType.Ride__c.fields.Business_Trip__c,
			SObjectType.Ride__c.fields.Start_Time__c,
			SObjectType.Ride__c.fields.End_Time__c,
			SObjectType.Ride__c.fields.Status__c,
			SObjectType.Ride__c.fields.Ticket_Number__c,
			SObjectType.Ride__c.fields.Type_Of_Trip__c
		});
		update rides;
	}

	@AuraEnabled
	public static List<BusinessTripUtilities.PickListEntryWrapper> fetchBusinessTripRidesStatuses() {
		BusinessTripUtilities.checkReadObjectAccess(SObjectType.Ride__c);
		return BusinessTripUtilities.getPicklistWrappers(Ride__c.Status__c.getDescribe());
	}

	@AuraEnabled
	public static List<BusinessTripUtilities.PickListEntryWrapper> fetchBusinessTripRidesTripTypes() {
		BusinessTripUtilities.checkReadObjectAccess(SObjectType.Ride__c);
		return BusinessTripUtilities.getPicklistWrappers(Ride__c.Type_Of_Trip__c.getDescribe());
	}
}