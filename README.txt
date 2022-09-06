Some Notes:

a) Use yarn 
    - yarn (== npm install)
    - yarn android (== npm run android)
        - This will launch metro and emulator


b) ADB tools as installed in /Users/sonnywerghis/Library/Android/sdk/platform-tools/adb
    - adb logcat | grep FlashcardWidget
    - adb logcat -c (to clear logs)
    - adb logcat | grep -v RanchuHwc ( to tremove unwanted logs)
    - adb devices

c) To debug with actual phone
    - enable developer options and remote debugging on phone
    - "adb device" should now show the phone as a device
    - "yarn android" will now use this device to deply and debug the app

d) RN changes show up immediately without the need for redeployment. Java/Kotlin changes require rebuild and deployment

e) I use native code for the widget because RN does not support widgets

f) To create splash icons: 
    - Save png file in root folder
    - Run "npx react-native generate-bootsplash logo.png". This will create all necessary files

g) Launcher icons: 
    - Edited the splash icon online and made it smaller. Then copied into each of the android/app/src/res/midmap folders

h) Modified the widget to remove the up/down button. Instead a listener is atatched to the main text view, which will cause the widget to update when touched. 


