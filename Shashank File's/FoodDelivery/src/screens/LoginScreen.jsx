// src/screens/LoginScreen.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import client from '../api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userReducer'; // Make sure you have this action defined
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';




const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);



  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      const response = await client.post('/auth/login', { email, password });
  
      // Store token and user data properly
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user)); // Fix: Stringify object
  
      // Dispatch the user data to Redux store
      dispatch(setUser(response.data.user));
  
      Alert.alert('Success', response.data.message);
      console.log('User Data:', response.data.user);
      console.log('Token:', response.data.token);
      
      navigation.navigate('MainTabs');
  
    } catch (error) {
      console.error(error);
      Alert.alert('Login Failed', error.response?.data?.error || 'An error occurred');
    }
  };
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ScrollView 
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
    <View style={styles.container}>
      {/* Placeholder for PNG image */}
      <View style={styles.imageContainer}>
        <Image 
source={require('../assets/food.png')}  // Adjust the path as needed
          style={styles.logo} 
          resizeMode="contain"
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.inputContainer}>
          <Icon name="email" size={20} color="#94A3B8" style={styles.icon} />
          <TextInput
            placeholder="Email address"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#94A3B8" style={styles.icon} />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#94A3B8"
            style={styles.input}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.passwordToggle}
          >
            <Icon 
              name={showPassword ? "visibility-off" : "visibility"} 
              size={20} 
              color="#94A3B8" 
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Register')}
          style={styles.registerLink}
        >
          <Text style={styles.registerText}>
            Don't have an account?{' '}
            <Text style={styles.registerHighlight}>Create Account</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F9',
  },
  imageContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio:3/4,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 32,





  },
  logo: {
    width: '100%',
    height: 180,
  },
  formContainer: {
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  passwordToggle: {
    padding: 8,
  },
  loginButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  registerLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  registerText: {
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  registerHighlight: {
    color: '#6366F1',
    fontFamily: 'Inter-SemiBold',
  },
});

export default LoginScreen;
