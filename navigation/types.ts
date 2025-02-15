import { Post } from '../services/FeedService';

export type RootStackParamList = {
  MainTabs: undefined;
  Login: undefined;
  Register: undefined;
  SetupProfile: undefined;
  CreatePost: undefined;
  Comments: {
    post: Post;
  };
};

export type BottomTabParamList = {
  Home: undefined;
  Explore: undefined;
  Chat: undefined;
  Profile: { userId?: string };
}; 