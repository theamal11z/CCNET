
import { supabase } from '../lib/supabase';
import * as FileSystem from 'expo-file-system';

export interface VerificationDocument {
  id: string;
  user_id: string;
  document_type: 'student_id' | 'transcript';
  status: 'pending' | 'approved' | 'rejected';
  file_url: string;
  created_at: string;
}

export class VerificationService {
  static async uploadDocument(
    userId: string, 
    documentType: VerificationDocument['document_type'],
    uri: string
  ): Promise<VerificationDocument | null> {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) throw new Error('File does not exist');
      
      const fileName = `${userId}/${documentType}_${Date.now()}`;
      const fileExt = uri.split('.').pop();
      const filePath = `${fileName}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('verification-docs')
        .upload(filePath, {
          uri,
          type: 'image/*',
          name: filePath,
        });

      if (error) throw error;

      const { data: doc, error: docError } = await supabase
        .from('verification_documents')
        .insert({
          user_id: userId,
          document_type: documentType,
          file_url: data.path,
          status: 'pending'
        })
        .select()
        .single();

      if (docError) throw docError;
      return doc;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  }

  static async getVerificationStatus(userId: string) {
    const { data, error } = await supabase
      .from('verification_documents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    return data?.[0] || null;
  }
}
