import * as nsfwjs from 'nsfwjs';
import * as tf from '@tensorflow/tfjs-node';
import { language } from '@google-cloud/language';
import Akismet from 'akismet-api';
import { supabase } from '../lib/supabase';

export class ModerationService {
  private static nsfwModel: nsfwjs.NSFWJS;
  private static languageClient = new language.LanguageServiceClient();
  private static akismet = new Akismet({ 
    key: process.env.EXPO_PUBLIC_AKISMET_KEY,
    blog: process.env.EXPO_PUBLIC_SITE_URL 
  });

  static async initialize() {
    this.nsfwModel = await nsfwjs.load();
  }

  static async checkImage(imageUrl: string) {
    const response = await fetch(imageUrl);
    const imageData = await response.arrayBuffer();
    const image = await tf.node.decodeImage(new Uint8Array(imageData), 3);
    const predictions = await this.nsfwModel.classify(image as any);
    return predictions.some(p => p.className === 'Porn' && p.probability > 0.7);
  }

  static async analyzeText(text: string) {
    const document = {
      content: text,
      type: 'PLAIN_TEXT',
    };

    const [result] = await this.languageClient.analyzeSentiment({ document });
    const toxicity = result.documentSentiment.score < -0.7;
    
    const isSpam = await this.akismet.checkSpam({
      user_ip: '0.0.0.0',
      content: text
    });

    return { toxicity, isSpam };
  }

  static async reportContent(contentId: string, reporterId: string, reason: string) {
    const { data, error } = await supabase
      .from('reports')
      .insert({
        content_id: contentId,
        reporter_id: reporterId,
        reason,
        status: 'pending',
        priority: 1
      });

    return { data, error };
  }

  static async submitAppeal(reportId: string, appealText: string) {
    const { data, error } = await supabase
      .from('appeals')
      .insert({
        report_id: reportId,
        appeal_text: appealText,
        status: 'pending'
      });

    return { data, error };
  }

  static async flagContent(contentId: string, reason: string, type: 'post' | 'comment') {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Must be logged in to flag content');

    const { error } = await supabase
      .from('content_flags')
      .insert({
        content_id: contentId,
        content_type: type,
        reason,
        reporter_id: user.id,
        status: 'pending'
      });

    if (error) throw error;
  }

  static async moderateContent(text: string) {
    // Basic content filtering
    const profanityRegex = /bad|words|here/gi;
    const hasProfanity = profanityRegex.test(text);

    // Academic relevance check
    const academicTerms = /study|research|course|professor|exam|thesis|paper/gi;
    const isAcademic = academicTerms.test(text);

    return {
      isAppropriate: !hasProfanity,
      isAcademic,
      confidence: 0.8
    };
  }
}