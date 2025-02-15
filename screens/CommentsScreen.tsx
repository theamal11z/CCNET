import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Divider } from 'react-native-paper';
import { Comment, CommentService } from '../services/CommentService';
import CommentItem from '../components/CommentItem';
import PostCard from '../components/PostCard';

export default function CommentsScreen({ route }) {
  const { post } = route.params;
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [replying, setReplying] = useState<string | null>(null);

  useEffect(() => {
    loadComments();
  }, [post.id]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await CommentService.getComments(post.id);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      setLoading(true);
      const newComment = await CommentService.createComment(post.id, content, replying);
      
      if (replying) {
        // Update replies count and add to nested comments
        setComments(prev => prev.map(comment => 
          comment.id === replying
            ? { ...comment, replies_count: comment.replies_count + 1 }
            : comment
        ));
      } else {
        setComments(prev => [...prev, newComment]);
      }
      
      setContent('');
      setReplying(null);
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={comments}
        keyExtractor={item => item.id}
        ListHeaderComponent={() => (
          <>
            <PostCard post={post} />
            <Divider />
          </>
        )}
        renderItem={({ item }) => (
          <CommentItem
            comment={item}
            onReply={() => setReplying(item.id)}
            onRefresh={loadComments}
          />
        )}
        refreshing={loading}
        onRefresh={loadComments}
      />
      
      <View style={styles.inputContainer}>
        {replying && (
          <Button
            icon="close"
            onPress={() => setReplying(null)}
            style={styles.cancelButton}
          >
            Cancel Reply
          </Button>
        )}
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder={replying ? "Write a reply..." : "Write a comment..."}
          multiline
          style={styles.input}
          right={
            <TextInput.Icon
              icon="send"
              disabled={!content.trim() || loading}
              onPress={handleSubmit}
            />
          }
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    backgroundColor: '#f5f5f5',
  },
  cancelButton: {
    marginBottom: 8,
  },
}); 