
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../api/baseURL';
import { setUser, clearUser } from '../redux/userReducer';

import { CommonActions } from '@react-navigation/native';

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity, Modal, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

  


const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const storedUser = useSelector((state) => state.user.user);
  const [profile, setProfile] = useState(storedUser || null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await client.get('/profile');
        setProfile(response.data);
        setFullName(response.data.fullName);
        setPhone(response.data.phone);
        dispatch(setUser(response.data));
      } catch (error) {
        console.error('Error fetching profile:', error);
        Alert.alert('Error', 'Failed to load profile.');
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const response = await client.patch('/profile', { fullName, phone });
      Alert.alert('Success', response.data.message);
      const updatedProfile = { ...profile, fullName, phone };
      setProfile(updatedProfile);
      dispatch(setUser(updatedProfile));
      setIsModalVisible(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.response?.data?.error || 'Failed to update profile');
    }
  };



  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      navigation.navigate('Login');

    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'An error occurred while logging out.');
    }
  };

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
    
  }
  const fullImageUrl = profile.profileImage && typeof profile.profileImage === 'string' && profile.profileImage.startsWith('http')
  ? profile.profileImage
  : `${BASE_URL}${profile.profileImage}`;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          {profile.profileImage ? (
            <Image 
              source={{ uri: fullImageUrl }} 
              style={styles.profileImage} 
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{profile.fullName?.charAt(0) || 'U'}</Text>
            </View>
          )}
          <TouchableOpacity 
            style={styles.editIcon}
            onPress={() => setIsModalVisible(true)}
          >
            <Icon name="edit" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{profile.fullName}</Text>
        <Text style={styles.role}>{profile.role}</Text>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.sectionHeader}>
          <Icon name="info" size={20} color="#6366F1" />
          <Text style={styles.sectionTitle}>Account Information</Text>
        </View>
        
        <DetailRow icon="email" label="Email" value={profile.email} />
        <DetailRow icon="phone" label="Phone" value={profile.phone || 'Not provided'} />
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryAction]}
          onPress={() => navigation.navigate('Orders')}
        >
          <Icon name="list-alt" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>My Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryAction]}
          onPress={handleLogout}
        >
          <Icon name="logout" size={20} color="#6366F1" />
          <Text style={[styles.actionButtonText, styles.secondaryActionText]}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Icon name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>
            
            <InputField 
              icon="person"
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="John Doe"
            />

            <InputField 
              icon="phone"
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="+1 234 567 890"
              keyboardType="phone-pad"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleUpdateProfile}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <Icon name={icon} size={20} color="#94A3B8" />
    <View style={styles.detailTextContainer}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const InputField = ({ icon, label, ...props }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputContainer}>
      <Icon name={icon} size={20} color="#94A3B8" style={styles.inputIcon} />
      <TextInput
        style={styles.modalInput}
        {...props}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F9',
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: '#E8EFF5',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 48,
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#6366F1',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 2,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginLeft: 8
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12
  },
  detailTextContainer: {
    marginLeft: 16,
    flex: 1
  },
  detailLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: 'Inter-Regular',
    marginBottom: 2
  },
  detailValue: {
    fontSize: 14,
    color: '#1F2937',
    fontFamily: 'Inter-Medium'
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    gap: 12
  },
  primaryAction: {
    backgroundColor: '#6366F1',
  },
  secondaryAction: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF'
  },
  secondaryActionText: {
    color: '#6366F1'
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12
  },
  modalInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    color: '#1F2937',
    fontFamily: 'Inter-Medium'
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F1F5F9',
  },
  saveButton: {
    backgroundColor: '#6366F1',
  },
  cancelButtonText: {
    color: '#64748B',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14
  }
});

export default ProfileScreen;