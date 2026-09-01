import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { key } = req.query;
      const value = await redis.get(key);
      return res.status(200).json({ value });
    }

    if (req.method === 'POST') {
      const { op, key, value } = req.body;
      if (op === 'set') {
        await redis.set(key, value);
        return res.status(200).json({ success: true });
      }
      if (op === 'delete') {
        await redis.del(key);
        return res.status(200).json({ success: true });
      }
    }
    return res.status(400).json({ error: 'Operação inválida' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}