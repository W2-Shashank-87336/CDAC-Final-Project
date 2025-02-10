import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeTokens = async (token, refreshToken) => {
  await AsyncStorage.multiSet([
    ['authToken', token],
    ['refreshToken', refreshToken]
  ]);
};

export const getAuthToken = async () => {
  return await AsyncStorage.getItem('authToken');
};

export const refreshAuthToken = async () => {
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  try {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    await storeTokens(response.data.token, refreshToken);
    return response.data.token;
  } catch (error) {
    await clearTokens();
    throw error;
  }
};

export const clearTokens = async () => {
  await AsyncStorage.multiRemove(['authToken', 'refreshToken', 'user']);
};