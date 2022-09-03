import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { QueryClient, QueryClientProvider } from 'react-query';
import GameScreen from './screens/GameScreen';
import { NETWORK_GAME_QUERY_CACHE_KEY } from './screens/GameScreen/players/onNetworkPlayer';
import WelcomeScreen, { GameMode } from './screens/WelcomeScreen';

const queryClient = new QueryClient();

export default function App() {
  const [gameMode, setGameMode] = useState<GameMode>();

  let currentScreen;
  if (gameMode) {
    queryClient.invalidateQueries(NETWORK_GAME_QUERY_CACHE_KEY);
    currentScreen = <GameScreen mode={gameMode} />;
  } else {
    currentScreen = <WelcomeScreen onPressStart={setGameMode} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        {currentScreen}
      </View>
    </QueryClientProvider>
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
