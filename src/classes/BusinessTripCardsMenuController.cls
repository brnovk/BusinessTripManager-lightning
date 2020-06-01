public with sharing class BusinessTripCardsMenuController {

	@AuraEnabled
	public static List<PickListEntryWrapper> fetchBusinessTripRidesStatuses() {
		return getPicklistWrappers(Ride__c.Status__c.getDescribe());
	}

	@AuraEnabled
	public static List<PickListEntryWrapper> fetchBusinessTripRidesTripTypes() {
		return getPicklistWrappers(Ride__c.Type_Of_Trip__c.getDescribe());
	}

	@TestVisible
	private static List<PickListEntryWrapper> getPicklistWrappers(DescribeFieldResult describeFieldResult) {
		List<PickListEntryWrapper> PickListEntryWrappers = new List<PickListEntryWrapper>();
		for (PicklistEntry picklistEntry : describeFieldResult.getPicklistValues()) {
			PickListEntryWrapper PickListEntryWrapper = new PickListEntryWrapper(picklistEntry);
			PickListEntryWrappers.add(PickListEntryWrapper);
		}
		return PickListEntryWrappers;
	}

	public class PickListEntryWrapper {
		@AuraEnabled
		public String label { get; set; }
		@AuraEnabled
		public String value { get; set; }
		@AuraEnabled
		public Boolean isActive { get; set; }
		public PickListEntryWrapper(PicklistEntry picklistEntry) {
			label = picklistEntry.getLabel();
			value = picklistEntry.getValue();
			isActive = picklistEntry.isActive();
		}
	}
}