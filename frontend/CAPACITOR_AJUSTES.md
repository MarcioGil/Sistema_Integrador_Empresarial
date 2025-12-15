# Splash screen e ícones para Capacitor/Android
# Coloque os arquivos em android/app/src/main/res/mipmap-*
# Exemplos: icon.png, splash.png

# Permissões básicas para AndroidManifest.xml
# Adicione dentro de <manifest>:
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

# WebView seguro (capacitor.config.ts ou capacitor.config.json)
# Adicione:
"server": {
  "cleartext": false,
  "androidScheme": "https"
}

# Para personalizar splash, use o plugin:
npm install @capacitor/splash-screen
# E configure em capacitor.config.ts/json

# Após ajustes, gere o bundle:
npm run build
npx cap copy
npx cap sync
npx cap open android
# No Android Studio, gere o Android App Bundle (AAB) para publicar na Play Store.
