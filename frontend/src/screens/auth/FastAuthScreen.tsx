import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  useTheme,
  ActivityIndicator,
  RadioButton,
  HelperText,
  SegmentedButtons,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { login, register, clearError } from '../../store/slices/authSlice';
import { LoginCredentials } from '../../types';

const { width } = Dimensions.get('window');

export default function FastAuthScreen() {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    ageRange: '16+' as '6-15' | '16+',
    role: 'student' as 'student' | 'professional'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) {
      dispatch(clearError());
    }
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }
    if (!formData.email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (authMode === 'register') {
      if (!formData.name.trim()) {
        Alert.alert('Error', 'Please enter your name');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return false;
      }
    }
    return true;
  };

  const handleAuth = async () => {
    if (!validateForm()) return;

    try {
      if (authMode === 'login') {
        await dispatch(login({
          email: formData.email,
          password: formData.password,
        })).unwrap();
      } else {
        await dispatch(register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          ageRange: formData.ageRange,
          role: formData.role
        })).unwrap();
      }
    } catch (error) {
      // Error is handled by the reducer
    }
  };

  const switchMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      ageRange: '16+' as '6-15' | '16+',
      role: 'student' as 'student' | 'professional'
    });
    dispatch(clearError());
  };


  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <Icon name="school" size={48} color="white" />
              <Text variant="headlineLarge" style={styles.title}>
                MINDORA HUB
              </Text>
              <Text variant="bodyLarge" style={styles.subtitle}>
                {authMode === 'login' ? 'Welcome back!' : 'Join our community'}
              </Text>
            </View>

            {/* Auth Mode Toggle */}
            <View style={styles.toggleContainer}>
              <SegmentedButtons
                value={authMode}
                onValueChange={setAuthMode}
                buttons={[
                  { value: 'login', label: 'Sign In', icon: 'login' },
                  { value: 'register', label: 'Sign Up', icon: 'account-plus' },
                ]}
                style={styles.segmentedButtons}
              />
            </View>


            {/* Main Form */}
            <Card style={styles.formCard}>
              <Card.Content>
                {error && (
                  <HelperText type="error" visible={true} style={styles.errorText}>
                    {error}
                  </HelperText>
                )}

                {authMode === 'register' && (
                  <TextInput
                    label="Full Name"
                    value={formData.name}
                    onChangeText={(value) => handleInputChange('name', value)}
                    mode="outlined"
                    style={styles.input}
                    left={<TextInput.Icon icon="account" />}
                  />
                )}

                <TextInput
                  label="Email"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                  left={<TextInput.Icon icon="email" />}
                />

                <TextInput
                  label="Password"
                  value={formData.password}
                  onChangeText={(value) => handleInputChange('password', value)}
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  left={<TextInput.Icon icon="lock" />}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? 'eye-off' : 'eye'}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />

                {authMode === 'register' && (
                  <>
                    <TextInput
                      label="Confirm Password"
                      value={formData.confirmPassword}
                      onChangeText={(value) => handleInputChange('confirmPassword', value)}
                      mode="outlined"
                      secureTextEntry={!showConfirmPassword}
                      style={styles.input}
                      left={<TextInput.Icon icon="lock" />}
                      right={
                        <TextInput.Icon
                          icon={showConfirmPassword ? 'eye-off' : 'eye'}
                          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                      }
                    />

                    <View style={styles.ageRangeSection}>
                      <Text variant="titleSmall" style={styles.ageRangeTitle}>
                        Select Your Age Group
                      </Text>
                      
                      <RadioButton.Group
                        onValueChange={(value) => handleInputChange('ageRange', value)}
                        value={formData.ageRange}
                      >
                        <View style={styles.radioOption}>
                          <RadioButton value="6-15" />
                          <Text variant="bodyMedium" style={styles.radioLabel}>
                            Children (6-15 years)
                          </Text>
                        </View>
                        
                        <View style={styles.radioOption}>
                          <RadioButton value="16+" />
                          <Text variant="bodyMedium" style={styles.radioLabel}>
                            Adults (16+ years)
                          </Text>
                        </View>
                      </RadioButton.Group>
                    </View>
                  </>
                )}

                <Button
                  mode="contained"
                  onPress={handleAuth}
                  disabled={isLoading}
                  style={styles.authButton}
                  contentStyle={styles.buttonContent}
                  icon={authMode === 'login' ? 'login' : 'account-plus'}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    authMode === 'login' ? 'Sign In' : 'Create Account'
                  )}
                </Button>

                <Button
                  mode="text"
                  onPress={switchMode}
                  style={styles.switchButton}
                  labelStyle={{ color: theme.colors.primary }}
                >
                  {authMode === 'login' 
                    ? "Don't have an account? Sign Up" 
                    : "Already have an account? Sign In"
                  }
                </Button>
              </Card.Content>
            </Card>

            {/* Features */}
            <Card style={styles.featuresCard}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.featuresTitle}>
                  Why Choose Our Platform?
                </Text>
                
                <View style={styles.featureItem}>
                  <Icon name="psychology" size={24} color={theme.colors.primary} />
                  <View style={styles.featureText}>
                    <Text variant="bodyMedium" style={styles.featureTitle}>
                      AI-Powered Learning
                    </Text>
                    <Text variant="bodySmall" style={styles.featureDescription}>
                      Personalized content and intelligent feedback
                    </Text>
                  </View>
                </View>

                <View style={styles.featureItem}>
                  <Icon name="school" size={24} color={theme.colors.primary} />
                  <View style={styles.featureText}>
                    <Text variant="bodyMedium" style={styles.featureTitle}>
                      Age-Appropriate Content
                    </Text>
                    <Text variant="bodySmall" style={styles.featureDescription}>
                      Tailored learning for all age groups
                    </Text>
                  </View>
                </View>

                <View style={styles.featureItem}>
                  <Icon name="trending-up" size={24} color={theme.colors.primary} />
                  <View style={styles.featureText}>
                    <Text variant="bodyMedium" style={styles.featureTitle}>
                      Track Progress
                    </Text>
                    <Text variant="bodySmall" style={styles.featureDescription}>
                      Monitor your learning journey
                    </Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 20,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 8,
  },
  toggleContainer: {
    marginBottom: 20,
  },
  segmentedButtons: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  formCard: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  errorText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  ageRangeSection: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.1)',
  },
  ageRangeTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 8,
  },
  radioLabel: {
    marginLeft: 12,
    flex: 1,
    fontWeight: '500',
    color: '#333',
  },
  authButton: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#667eea',
  },
  buttonContent: {
    paddingVertical: 12,
  },
  switchButton: {
    marginBottom: 8,
  },
  featuresCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  featuresTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    fontSize: 18,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    padding: 12,
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.1)',
  },
  featureText: {
    marginLeft: 16,
    flex: 1,
  },
  featureTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
    fontSize: 16,
  },
  featureDescription: {
    opacity: 0.8,
    color: '#666',
    fontSize: 14,
  },
});
