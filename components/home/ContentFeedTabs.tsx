import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useTheme } from 'react-native-paper';
import FeedScreen from '../../screens/FeedScreen';

// Create feed screens using FeedScreen component
const ForYouTab = () => <FeedScreen feedType="forYou" />;
const CampusTab = () => <FeedScreen feedType="campus" />;
const TrendingTab = () => <FeedScreen feedType="trending" />;
const FollowingTab = () => <FeedScreen feedType="following" />;

const renderScene = SceneMap({
  forYou: ForYouTab,
  campus: CampusTab,
  trending: TrendingTab,
  following: FollowingTab,
});

export default function ContentFeedTabs() {
  const theme = useTheme();
  const layout = Dimensions.get('window');

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'forYou', title: 'For You' },
    { key: 'campus', title: 'Campus' },
    { key: 'trending', title: 'Trending' },
    { key: 'following', title: 'Following' },
  ]);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={{ backgroundColor: theme.colors.primary }}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
      tabStyle={{ width: layout.width / 3 }}
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.backdrop}
    />
  );

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: 'white',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabLabel: {
    textTransform: 'none',
    fontWeight: '600',
    fontSize: 14,
  },
}); 