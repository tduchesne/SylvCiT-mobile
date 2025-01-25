import { Platform } from 'react-native';

const CarteScreen = Platform.select({
  ios: () => require('./CarteScreen.native').default,
  android: () => require('./CarteScreen.native').default,
  web: () => require('./CarteScreen.web').default,
}) ?? (() => {
  console.error("Platform not supported for CarteScreen");
  return () => null; 
})();

export default CarteScreen;
