public with sharing class BusinessTripUtilities {

	@TestVisible
	private static Boolean isTestAccessLogic = false;

	public static void checkReadObjectAccess(DescribeSObjectResult sObjectType) {
		if ((Test.isRunningTest() && isTestAccessLogic) || (!sObjectType.isAccessible())) {
			NoAccessException accessException = new NoAccessException();
			accessException.setMessage(Label.BT_MSG_Not_Allowed_Reading_Object + sObjectType.getName());
			throw accessException;
		}
	}

	public static void checkUpdateObjectAccess(DescribeSObjectResult sObjectType) {
		if ((Test.isRunningTest() && isTestAccessLogic) || (!sObjectType.isAccessible() || !sObjectType.isUpdateable())) {
			NoAccessException accessException = new NoAccessException();
			accessException.setMessage(Label.BT_MSG_Not_Allowed_Update_Object + sObjectType.getName());
			throw accessException;
		}
	}

	public static void checkDeleteObjectAccess(DescribeSObjectResult sObjectType) {
		if ((Test.isRunningTest() && isTestAccessLogic) || (!sObjectType.isAccessible() || !sObjectType.isDeletable())) {
			NoAccessException accessException = new NoAccessException();
			accessException.setMessage(Label.BT_MSG_Not_Allowed_Delete_Object + sObjectType.getName());
			throw accessException;
		}
	}

	public static void checkReadFieldsAccess(List<DescribeFieldResult> describeFieldResults) {
		if (describeFieldResults != null && !describeFieldResults.isEmpty()) {
			String errorMessage = '';
			for (DescribeFieldResult field : describeFieldResults) {
				if (!field.isAccessible()) {
					errorMessage += (String.isNotBlank(errorMessage) ? ', ' : ' ') + field.getName();
				}
			}
			if (String.isNotBlank(errorMessage)) {
				NoAccessException accessException = new NoAccessException();
				accessException.setMessage(Label.BT_MSG_Not_Allowed_Reading_Fields + errorMessage);
				throw accessException;
			}
		}
	}

	public static void checkWriteFieldsAccess(List<DescribeFieldResult> describeFieldResults) {
		if (describeFieldResults != null && !describeFieldResults.isEmpty()) {
			String errorMessage = '';
			for (DescribeFieldResult field : describeFieldResults) {
				if (!field.isUpdateable()) {
					errorMessage += (String.isNotBlank(errorMessage) ? ', ' : ' ') + field.getName();
				}
			}
			if (String.isNotBlank(errorMessage)) {
				NoAccessException accessException = new NoAccessException();
				accessException.setMessage(Label.BT_MSG_Not_Allowed_Writing_Fields + errorMessage);
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