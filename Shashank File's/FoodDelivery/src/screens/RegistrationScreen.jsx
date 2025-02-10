import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import client from '../api/client';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
    const navigation = useNavigation();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [profileImage, setProfileImage] = useState(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const handleRegister = async () => {
        const role = 'CUSTOMER';
        if (!fullName || !email || !phone || !password || !role) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('password', password);
        formData.append('role', role);

        if (profileImage) {
            formData.append('profileImage', {
                uri: profileImage,
                name: 'profile.jpg',
                type: 'image/jpeg',
            });
        }

        try {
            const response = await client.post('/auth/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            Alert.alert('Success', response.data.message);
            navigation.navigate('Login');
        } catch (error) {
            console.error(error);
            Alert.alert('Registration Failed', error.response?.data?.error || 'An error occurred');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Join our food community</Text>
            </View>

            <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
                {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Icon name="add-a-photo" size={32} color="#6366F1" />
                    </View>
                )}
                <Text style={styles.avatarText}>Add Profile Photo</Text>
            </TouchableOpacity>

            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Icon name="person" size={20} color="#94A3B8" style={styles.icon} />
                    <TextInput
                        placeholder="Full Name"
                        placeholderTextColor="#94A3B8"
                        style={styles.input}
                        value={fullName}
                        onChangeText={setFullName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="email" size={20} color="#94A3B8" style={styles.icon} />
                    <TextInput
                        placeholder="Email Address"
                        placeholderTextColor="#94A3B8"
                        style={styles.input}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="phone" size={20} color="#94A3B8" style={styles.icon} />
                    <TextInput
                        placeholder="Phone Number"
                        placeholderTextColor="#94A3B8"
                        style={styles.input}
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="lock" size={20} color="#94A3B8" style={styles.icon} />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#94A3B8"
                        style={styles.input}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Create Account</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => navigation.navigate('Login')}
                    style={styles.loginLink}
                >
                    <Text style={styles.loginText}>
                        Already have an account?{' '}
                        <Text style={styles.loginHighlight}>Sign In</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F9',
        paddingHorizontal: 24,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 24,
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
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#E2E8F0',
    },
    avatarPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E2E8F0',
    },
    avatarText: {
        marginTop: 12,
        fontFamily: 'Inter-Medium',
        color: '#6366F1',
        fontSize: 14,
    },
    formContainer: {
        paddingBottom: 24,
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
        height: 56,
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontFamily: 'Inter-Regular',
        color: '#1F2937',
        fontSize: 14,
    },
    registerButton: {
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
    loginLink: {
        marginTop: 24,
        alignItems: 'center',
    },
    loginText: {
        fontFamily: 'Inter-Regular',
        color: '#64748B',
        fontSize: 14,
    },
    loginHighlight: {
        color: '#6366F1',
        fontFamily: 'Inter-SemiBold',
    },
});

export default RegisterScreen;