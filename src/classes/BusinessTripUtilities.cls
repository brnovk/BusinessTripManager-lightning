public with sharing class BusinessTripUtilities {

	@TestVisible
	private static Boolean isTestAccessLogic = false;

	public static void checkReadAccess(DescribeSObjectResult sObjectType) {
		if (Test.isRunningTest() || (!sObjectType.isAccessible())) {
			if (!Test.isRunningTest() || (Test.isRunningTest() && isTestAccessLogic)) {
				NoAccessException accessException = new NoAccessException();
				accessException.setMessage(Label.BT_MSG_Not_Allowed_Reading_Object + sObjectType.getName());
				throw accessException;
			}
		}
	}

	public static void checkUpdateAccess(DescribeSObjectResult sObjectType) {
		if (Test.isRunningTest() || (!sObjectType.isAccessible() || !sObjectType.isUpdateable())) {
			if (!Test.isRunningTest() || (Test.isRunningTest() && isTestAccessLogic)) {
				NoAccessException accessException = new NoAccessException();
				accessException.setMessage(Label.BT_MSG_Not_Allowed_Update_Object + sObjectType.getName());
				throw accessException;
			}
		}
	}

	public static void checkDeleteAccess(DescribeSObjectResult sObjectType) {
		if (Test.isRunningTest() || (sObjectType.isAccessible() || !sObjectType.isDeletable())) {
			if (!Test.isRunningTest() || (Test.isRunningTest() && isTestAccessLogic)) {
				NoAccessException accessException = new NoAccessException();
				accessException.setMessage(Label.BT_MSG_Not_Allowed_Delete_Object + sObjectType.getName());
				throw accessException;
			}
		}
	}

	public static List<PickListEntryWrapper> getPicklistWrappers(DescribeFieldResult describeFieldResult) {
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