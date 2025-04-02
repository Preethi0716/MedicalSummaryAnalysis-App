module.exports={
    "project":{
        "ios":{
            "sourceDir": "../ios"
        },
        "android":{
            "sourceDir": "../android"
        },
    },
    dependencies: {
        'llama.rn': {
          platforms: {
            android: null, // disable Android autolinking if needed
            ios: null // disable iOS autolinking if needed
          }
        },
        'react-native-transformers': {
          platforms: {
            android: {
              packageImportPath: 'import com.reactnativetransformers.TransformersPackage;',
              packageInstance: 'new TransformersPackage()'
            },
          }
        }
    },
    assets : ['./assets/fonts']
};