
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { supabase } from '../lib/supabase';
import { PostService } from '../services/PostService';
import CommentItem from './CommentItem';

interface DiscussionProps {
  postId: string;
}

export default function Discussion({ postId }: DiscussionProps) {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const subscription = supabase
      .channel(`post_${postId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'comments',
        filter: `post_id=eq.${postId}`,
      }, payload => {
        if (payload.eventType === 'INSERT') {
          setComments(prev => [...prev, payload.new]);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [postId]);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          content,
          post_id: postId,
        })
        .select('*')
        .single();

      if (error) throw error;
      setContent('');
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.commentList}>
        {comments.map(comment => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Add a comment..."
          multiline
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={!content.trim() || loading}
        >
          Post
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commentList: {
    flex: 1,
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    marginBottom: 8,
  },
});
