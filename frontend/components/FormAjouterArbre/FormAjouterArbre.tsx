import { Platform } from 'react-native';

const FormAjoutArbre = Platform.select({
  ios: () => require('./FormAjouterArbre.native').default,
  android: () => require('./FormAjouterArbre.native').default,
  web: () => require('./FormAjouterArbre.web').default,
}) ?? (() => {
  console.error("Platform not supported for FormAjoutArbre");
  return () => null; 
})();

export default FormAjoutArbre;
