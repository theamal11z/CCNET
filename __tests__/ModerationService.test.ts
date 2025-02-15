
import { ModerationService } from '../services/ModerationService';

describe('ModerationService', () => {
  beforeAll(async () => {
    await ModerationService.initialize();
  });

  test('should detect NSFW images', async () => {
    const result = await ModerationService.checkImage('test-image-url');
    expect(typeof result).toBe('boolean');
  });

  test('should analyze text content', async () => {
    const result = await ModerationService.analyzeText('Test content');
    expect(result).toHaveProperty('toxicity');
    expect(result).toHaveProperty('isSpam');
  });

  test('should create content reports', async () => {
    const { data, error } = await ModerationService.reportContent(
      'test-content-id',
      'test-reporter-id',
      'inappropriate content'
    );
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
});
