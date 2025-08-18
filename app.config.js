export default {
    android: {
        "googleServicesFile": process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
        "icon": "./assets/images/icon.png",
        "splash": {
            "image": "./assets/images/logo-500x500.png",
            "backgroundColor": "#121F12",
            "resizeMode": "contain"
        },
        "adaptiveIcon": {
            "foregroundImage": "./assets/images/icon.png",
            "backgroundColor": "#121F12"
        },
        "permissions": [
            "CAMERA",
            "android.permission.CAMERA",
            "android.permission.RECORD_AUDIO",
            "android.permission.MODIFY_AUDIO_SETTINGS",
            "android.permission.READ_EXTERNAL_STORAGE",
            "android.permission.WRITE_EXTERNAL_STORAGE"
        ],
        "package": "com.grimar.bloomer"
    },
    "expo": {
        "extra": {
            "eas": {
                "projectId": "2bfc8a05-b5b9-4856-ac69-2c6c766a2895"
            }
        }
    },
};