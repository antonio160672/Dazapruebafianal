import {StyleSheet} from 'react-native'
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

export default StyleSheet.create({
    appButtonContainer: {
    elevation: 8,
    backgroundColor: "#6DB2F5",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: 230,
    alignSelf: 'center',
  },
  appButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase", 
    textAlignVertical: "center",
    textAlign: 'center'
  },
  engine: {
      position: 'absolute',
      right: 0,
  },
  body: {
      backgroundColor: Colors.white,
  },
  sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
  },
  sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: Colors.black,
  },
  sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
      color: Colors.dark,
  },
  highlight: {
      fontWeight: '700',
  },
  footer: {
      color: Colors.dark,
      fontSize: 12,
      fontWeight: '600',
      padding: 4,
      paddingRight: 12,
      textAlign: 'right',
  },
  input: {
    margin: 15,
    height: 40,
    borderColor: '#57B1D4',
    borderWidth: 1
  }
});  