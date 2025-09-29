import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  ActivityIndicator,
  ProgressBar,
  Avatar,
  Chip,
  Surface,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchPracticeQuiz } from '../../store/slices/contentSlice';
import { ModuleType } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function AIModeScreen() {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  
  const { currentQuiz, isLoading } = useAppSelector((state) => state.content);
  const { user } = useAppSelector((state) => state.auth);
  
  const [selectedModuleType, setSelectedModuleType] = useState<ModuleType>('grammar');
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [refreshing, setRefreshing] = useState(false);
  const [aiTutorProgress, setAiTutorProgress] = useState(75);
  const [currentStreak, setCurrentStreak] = useState(12);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  const aiModules = [
    { 
      type: 'personalized-tutor', 
      label: 'AI Personal Tutor', 
      icon: 'psychology',
      description: 'Personalized lessons based on your progress',
      color: ['#667eea', '#764ba2'],
      features: ['Progress Tracking', 'Weak Area Focus', 'Custom Lessons'],
      gradient: ['#667eea', '#764ba2']
    },
    { 
      type: 'speaking-feedback', 
      label: 'Speaking Coach', 
      icon: 'mic',
      description: 'Real-time pronunciation & fluency feedback',
      color: ['#10b981', '#059669'],
      features: ['Accent Analysis', 'Fluency Check', 'Instant Feedback'],
      gradient: ['#10b981', '#059669']
    },
    { 
      type: 'career-scenarios', 
      label: 'Career Scenarios', 
      icon: 'work',
      description: 'Real-world job & business situations',
      color: ['#8b5cf6', '#7c3aed'],
      features: ['Job Interviews', 'Business Meetings', 'Presentations'],
      gradient: ['#8b5cf6', '#7c3aed']
    },
    { 
      type: 'communication', 
      label: 'Communication (Eng)', 
      icon: 'chat',
      description: 'Professional communication skills',
      color: ['#06b6d4', '#0891b2'],
      features: ['Email Writing', 'Phone Calls', 'Negotiations'],
      gradient: ['#06b6d4', '#0891b2']
    },
    { 
      type: 'ai-finance', 
      label: 'AI & Finance', 
      icon: 'account-balance',
      description: 'Financial English & AI tools',
      color: ['#ef4444', '#dc2626'],
      features: ['Financial Terms', 'AI Tools', 'Investment English'],
      gradient: ['#ef4444', '#dc2626']
    },
    { 
      type: 'soft-skills', 
      label: 'Soft Skills', 
      icon: 'psychology',
      description: 'Time management, interviews, emails',
      color: ['#84cc16', '#65a30d'],
      features: ['Time Management', 'Interview Prep', 'Email Etiquette'],
      gradient: ['#84cc16', '#65a30d']
    },
    { 
      type: 'brainstorming', 
      label: 'Brainstorming', 
      icon: 'lightbulb',
      description: 'Creative thinking & idea generation',
      color: ['#f97316', '#ea580c'],
      features: ['Idea Generation', 'Problem Solving', 'Innovation'],
      gradient: ['#f97316', '#ea580c']
    },
    { 
      type: 'math', 
      label: 'Math & Logic', 
      icon: 'calculate',
      description: 'Mathematical English & logical reasoning',
      color: ['#ec4899', '#db2777'],
      features: ['Math Vocabulary', 'Problem Solving', 'Data Analysis'],
      gradient: ['#ec4899', '#db2777']
    },
  ];

  useEffect(() => {
    // Animate screen entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleStartAIModule = async (moduleType: string) => {
    try {
      // Navigate to specific AI module
      switch (moduleType) {
        case 'personalized-tutor':
          navigation.navigate('AIPersonalTutor' as never);
          break;
        case 'speaking-feedback':
          navigation.navigate('SpeakingCoachPractice' as never);
          break;
        case 'career-scenarios':
          navigation.navigate('CareerScenarios' as never);
          break;
        case 'communication':
          navigation.navigate('CommunicationEnglish' as never);
          break;
        case 'ai-finance':
          navigation.navigate('AIFinance' as never);
          break;
        case 'soft-skills':
          navigation.navigate('SoftSkills' as never);
          break;
        case 'brainstorming':
          // Redirect to AI Personal Tutor for creative thinking
          navigation.navigate('AIPersonalTutor' as never);
          break;
        case 'math':
          // Redirect to AI Personal Tutor for logical reasoning
          navigation.navigate('AIPersonalTutor' as never);
          break;
        default:
          await dispatch(fetchPracticeQuiz({
            moduleType: selectedModuleType,
            difficulty: selectedDifficulty,
            limit: 10,
          })).unwrap();
          
          if (currentQuiz) {
            navigation.navigate('Quiz', { 
              quizId: currentQuiz._id,
              isPractice: true 
            });
          }
      }
    } catch (error) {
      console.error('Error starting AI module:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Refresh AI mode options
    setRefreshing(false);
  };

  const renderAIHeader = () => (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.header}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <View style={styles.aiBadge}>
            <MaterialIcons name="auto-awesome" size={20} color="white" />
            <Text style={styles.aiBadgeText}>AI POWERED</Text>
          </View>
          <Text style={styles.headerTitle}>AI Mode</Text>
          <Text style={styles.headerSubtitle}>Your personal English learning assistant</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            onPress={toggleTheme} 
            style={styles.themeToggle}
          >
            <MaterialIcons 
              name={isDarkMode ? "wb-sunny" : "nightlight-round"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );

  const renderAITutorProgress = () => (
    <Animated.View 
      style={[
        styles.animatedCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={5}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.tutorCardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Card.Content style={styles.tutorCardContent}>
            <View style={styles.tutorHeader}>
              <Avatar.Icon 
                size={64} 
                icon="psychology" 
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              />
              <View style={styles.tutorInfo}>
                <Text variant="titleLarge" style={{ fontWeight: 'bold', color: 'white' }}>
                  Your AI Tutor
                </Text>
                <Text variant="bodyMedium" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Personalized learning progress
                </Text>
              </View>
              <View style={styles.streakBadge}>
                <MaterialIcons name="local-fire-department" size={20} color="#f59e0b" />
                <Text style={styles.streakText}>{currentStreak}</Text>
              </View>
            </View>
            
            <View style={styles.progressSection}>
              <View style={styles.progressInfo}>
                <Text variant="bodyMedium" style={{ color: 'white' }}>
                  Learning Progress
                </Text>
                <Text variant="bodyMedium" style={{ fontWeight: 'bold', color: 'white' }}>
                  {aiTutorProgress}%
                </Text>
              </View>
              <ProgressBar 
                progress={aiTutorProgress / 100} 
                color="white"
                style={styles.progressBar}
              />
            </View>

            <View style={styles.weakAreas}>
              <Text variant="bodySmall" style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: 8 }}>
                Focus Areas:
              </Text>
              <View style={styles.weakAreaChips}>
                <Chip mode="outlined" compact style={styles.weakAreaChip}>
                  <Text style={{ color: 'white', fontSize: 12 }}>Pronunciation</Text>
                </Chip>
                <Chip mode="outlined" compact style={styles.weakAreaChip}>
                  <Text style={{ color: 'white', fontSize: 12 }}>Grammar</Text>
                </Chip>
                <Chip mode="outlined" compact style={styles.weakAreaChip}>
                  <Text style={{ color: 'white', fontSize: 12 }}>Vocabulary</Text>
                </Chip>
              </View>
            </View>
          </Card.Content>
        </LinearGradient>
      </Card>
    </Animated.View>
  );

  const renderAIModules = () => (
    <View style={styles.content}>
      <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
        AI Learning Modules
      </Text>
      <Text style={[styles.sectionSubtitle, { color: theme.colors.onSurfaceVariant }]}>
        Choose your AI-powered learning path
      </Text>
      
      {aiModules.map((module, index) => (
        <Animated.View
          key={module.type}
          style={[
            styles.skillCard,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: fadeAnim }
              ]
            }
          ]}
        >
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={4}>
            <TouchableOpacity
              onPress={() => handleStartAIModule(module.type)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={module.gradient}
                style={styles.cardHeader}
              >
                <View style={styles.cardHeaderContent}>
                  <View style={styles.skillIconContainer}>
                    <MaterialIcons name={module.icon as any} size={32} color="white" />
                  </View>
                  <View style={styles.skillInfo}>
                    <Text style={styles.skillTitle}>{module.label}</Text>
                    <Text style={styles.skillDescription}>{module.description}</Text>
                  </View>
                </View>
              </LinearGradient>
              
              <Card.Content style={styles.cardContent}>
                <View style={styles.skillMeta}>
                  <Chip 
                    mode="outlined" 
                    compact 
                    style={[styles.difficultyChip, { borderColor: module.gradient[0] }]}
                    textStyle={{ color: module.gradient[0], fontSize: 12 }}
                  >
                    AI Powered
                  </Chip>
                  <Text style={[styles.durationText, { color: theme.colors.onSurfaceVariant }]}>
                    Interactive
                  </Text>
                </View>
                
                <View style={styles.topicsContainer}>
                  <Text style={[styles.topicsTitle, { color: theme.colors.onSurface }]}>
                    Key Features:
                  </Text>
                  <View style={styles.topicsList}>
                    {Array.isArray(module.features) ? module.features.slice(0, 3).map((feature: string, idx: number) => (
                      <Chip
                        key={idx}
                        mode="outlined"
                        compact
                        style={styles.topicChip}
                        textStyle={{ fontSize: 10 }}
                      >
                        {feature}
                      </Chip>
                    )) : null}
                    {Array.isArray(module.features) && module.features.length > 3 && (
                      <Chip
                        mode="outlined"
                        compact
                        style={styles.topicChip}
                        textStyle={{ fontSize: 10 }}
                      >
                        +{Array.isArray(module.features) ? module.features.length - 3 : 0} more
                      </Chip>
                    )}
                  </View>
                </View>
                
                <View style={styles.skillsContainer}>
                  <Text style={[styles.skillsTitle, { color: theme.colors.onSurface }]}>
                    AI Capabilities:
                  </Text>
                  <View style={styles.skillsList}>
                    <Chip
                      mode="flat"
                      compact
                      style={[styles.skillChip, { backgroundColor: module.gradient[0] + '20' }]}
                      textStyle={{ color: module.gradient[0], fontSize: 10 }}
                    >
                      Smart Learning
                    </Chip>
                    <Chip
                      mode="flat"
                      compact
                      style={[styles.skillChip, { backgroundColor: module.gradient[0] + '20' }]}
                      textStyle={{ color: module.gradient[0], fontSize: 10 }}
                    >
                      Personalized
                    </Chip>
                    <Chip
                      mode="flat"
                      compact
                      style={[styles.skillChip, { backgroundColor: module.gradient[0] + '20' }]}
                      textStyle={{ color: module.gradient[0], fontSize: 10 }}
                    >
                      Adaptive
                    </Chip>
                  </View>
                </View>
              </Card.Content>
            </TouchableOpacity>
          </Card>
        </Animated.View>
      ))}
    </View>
  );


  const renderDailyChallenge = () => (
    <Animated.View 
      style={[
        styles.animatedCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <View style={styles.dailyChallengeContainer}>
        <LinearGradient
          colors={['#ff6b6b', '#ee5a52', '#ff8a80']}
          style={styles.dailyChallengeCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.dailyChallengeContent}>
            <View style={styles.dailyChallengeLeft}>
              <View style={styles.challengeIconContainer}>
                <MaterialIcons name="auto-awesome" size={32} color="white" />
              </View>
              <View style={styles.dailyChallengeText}>
                <Text style={styles.dailyChallengeTitle}>AI Daily Challenge</Text>
                <Text style={styles.dailyChallengeSubtitle}>Complete today's AI-powered task</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.dailyChallengeButton}
              onPress={() => handleStartAIModule('personalized-tutor')}
            >
              <MaterialIcons name="play-arrow" size={20} color="#ff6b6b" />
              <Text style={styles.dailyChallengeButtonText}>Start</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  );

  const renderStats = () => {
    const stats = user?.progress || {
      currentStreak: 0,
      totalTimeSpent: 0,
      points: 0
    };
    
    return (
      <Animated.View 
        style={[
          styles.animatedCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={4}>
          <Card.Content>
            <Text variant="titleMedium" style={{ fontWeight: 'bold', marginBottom: 16, color: theme.colors.onSurface }}>
              AI Learning Stats
            </Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: '#10b981' }]}>
                  <MaterialIcons name="trending-up" size={24} color="white" />
                </View>
                <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: '#10b981' }}>
                  {stats.currentStreak || 0}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Day Streak
                </Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: '#6366f1' }]}>
                  <MaterialIcons name="psychology" size={24} color="white" />
                </View>
                <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: '#6366f1' }}>
                  {Math.floor((stats.totalTimeSpent || 0) / 60)}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  AI Sessions
                </Text>
              </View>
              <View style={styles.statItem}>
                <View style={[styles.statIconContainer, { backgroundColor: '#f59e0b' }]}>
                  <MaterialIcons name="star" size={24} color="white" />
                </View>
                <Text variant="headlineSmall" style={{ fontWeight: 'bold', color: '#f59e0b' }}>
                  {stats.points || 0}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  AI Points
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      {renderAIHeader()}
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderDailyChallenge()}
        {renderAITutorProgress()}
        {renderStats()}
        {renderAIModules()}
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ marginTop: 16, color: theme.colors.onSurface }}>
              Loading AI modules...
            </Text>
          </View>
        )}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
    paddingTop: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  aiBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggle: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  animatedCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  dailyChallengeContainer: {
    marginBottom: 16,
  },
  dailyChallengeCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  dailyChallengeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dailyChallengeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  challengeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dailyChallengeText: {
    flex: 1,
  },
  dailyChallengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  dailyChallengeSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dailyChallengeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  dailyChallengeButtonText: {
    color: '#ff6b6b',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 14,
  },
  tutorCardGradient: {
    borderRadius: 20,
  },
  tutorCardContent: {
    padding: 20,
  },
  tutorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tutorInfo: {
    flex: 1,
    marginLeft: 16,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakText: {
    color: '#f59e0b',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  progressSection: {
    marginBottom: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  weakAreas: {
    marginTop: 8,
  },
  weakAreaChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  weakAreaChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  modulesHeader: {
    marginBottom: 20,
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  moduleCard: {
    width: (width - 80) / 2, // More precise calculation for 2-per-row
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    marginBottom: 16,
  },
  moduleGradient: {
    padding: 16,
    minHeight: 160,
  },
  moduleContent: {
    flex: 1,
  },
  moduleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  moduleTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  moduleDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginBottom: 12,
    lineHeight: 16,
  },
  moduleFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  featureTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  featureText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
  skillCard: {
    marginBottom: 20,
  },
  cardHeader: {
    padding: 20,
  },
  cardHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  skillInfo: {
    flex: 1,
  },
  skillTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  skillDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  cardContent: {
    padding: 20,
  },
  skillMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  difficultyChip: {
    borderWidth: 1,
  },
  durationText: {
    fontSize: 12,
    fontWeight: '500',
  },
  topicsContainer: {
    marginBottom: 16,
  },
  topicsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  topicsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  topicChip: {
    marginBottom: 4,
  },
  skillsContainer: {
    marginBottom: 8,
  },
  skillsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillChip: {
    marginBottom: 4,
  },
  bottomSpacing: {
    height: 20,
  },
});
