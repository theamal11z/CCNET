import React, { useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { useTheme } from 'react-native-paper';
import PostsTab from './tabs/PostsTab';
import LikesTab from './tabs/LikesTab';
import CollegeTab from './tabs/CollegeTab';
import { Profile } from '../../services/ProfileService';

interface ProfileTabsProps {
  profile: Profile;
  isOwnProfile: boolean;
}

export default function ProfileTabs({ profile, isOwnProfile }: ProfileTabsProps) {
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'posts', title: 'Posts' },
    { key: 'likes', title: 'Likes' },
    ...(profile.is_verified ? [{ key: 'college', title: 'College' }] : []),
  ]);

  const renderScene = SceneMap({
    posts: () => <PostsTab userId={profile.id} />,
    likes: () => <LikesTab userId={profile.id} />,
    college: () => <CollegeTab profile={profile} />,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: theme.colors.primary }}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.outline}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get('window').width }}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: '#fff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabLabel: {
    textTransform: 'none',
    fontWeight: '600',
  },
}); 