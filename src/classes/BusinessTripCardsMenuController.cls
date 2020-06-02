public with sharing class BusinessTripCardsMenuController {

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