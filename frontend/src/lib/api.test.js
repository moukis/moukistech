import api from './api';

describe('offline API adapter', () => {
  it('returns an array for contact list requests', async () => {
    const response = await api.get('/contact');
    expect(Array.isArray(response.data)).toBe(true);
  });

  it('returns an array for blog list requests', async () => {
    const response = await api.get('/blog?published_only=false');
    expect(Array.isArray(response.data)).toBe(true);
  });
});
