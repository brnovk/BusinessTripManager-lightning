# BusinessTripManager (Lightning)

Small app "Business Trip Manager" for Salesforce, on Lightning.

###  Quick start:  

1. On org: go to **Setup** -> **Domain Management** -> **My Domain** -> **Register Domain**  
2. On the command line: `sfdx force:auth:web:login` -> **login in target org**.  
3. On the command line: `sfdx force:mdapi:deploy -d c:\BusinessTripManager-lightning\src -u your@orglogin.com --testlevel RunAllTestsInOrg`.  
![Deploy SFDX](screenshots/deploy-sfdx.png)  
![Deployment result](screenshots/deployment-result.png)  
4. On org: **Setup** -> **Profiles** -> **System Administrator** -> **Edit** -> **Tab Settings** -> **Custom Tab Settings** -> **[Business Trip Manager]** -> **Default On**  
5. On org: **Setup** -> **Profiles** -> **System Administrator** -> **Field-Level Security** -> **Custom Field-Level Security** -> **[Business Trip]** -> **add edit access for custom fields**  
![Profile FLS Business Trip object](screenshots/profile-fls-business-trip.png)  
6. On org: **Setup** -> **Profiles** -> **System Administrator** -> **Field-Level Security** -> **Custom Field-Level Security** -> **[Ride]** -> **add edit access for custom fields**  
![Profile FLS Ride object](screenshots/profile-fls-ride.png)  
7. On org: **Switch to Lightning Experience**  
8. On org: **Go to App Launcher** -> **All Items** -> **[Business Trip Manager]**  
![Tab in App Launcher](screenshots/tab-in-app-launcher.png)  
  
###  Data-model:  

Just 2 custom objects:
![Data-model](screenshots/data-model.png)


###  Screenshots of the application:

![Tab main window](screenshots/main-window.png)  

![Preview modal](screenshots/preview-modal.png)  

![Edit modal](screenshots/edit-modal.png)  

![Search result](screenshots/search-result.png)  

![Add business trip](screenshots/add-business-trip.png)  

![Add ride](screenshots/add-ride.png)  

![Custom labels](screenshots/custom-labels.png)  

![Narrow view main window](screenshots/narrow-view-list.png)  
