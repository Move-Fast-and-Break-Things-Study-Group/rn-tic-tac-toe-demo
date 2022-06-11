import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import GameScreen from './screens/GameScreen';
import WelcomeScreen, { GameMode } from './screens/WelcomeScreen';

export default function App() {
  const [gameMode, setGameMode] = useState<GameMode>();

  let currentScreen;
  if (gameMode) {
    currentScreen = <GameScreen mode={gameMode} />;
  } else {
    currentScreen = <WelcomeScreen onPressStart={setGameMode} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {currentScreen}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
