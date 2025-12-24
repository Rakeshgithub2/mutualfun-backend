import { MongoClient, Db, Collection, Document } from 'mongodb';
import { config } from 'dotenv';

// Load environment variables
config();

const DATABASE_URL =
  process.env.DATABASE_URL || 'mongodb://localhost:27017/mutual_funds_db';

class MongoDB {
  private static instance: MongoDB;
  private client: MongoClient;
  private db: Db | null = null;

  private constructor() {
    this.client = new MongoClient(DATABASE_URL);
  }

  public static getInstance(): MongoDB {
    if (!MongoDB.instance) {
      MongoDB.instance = new MongoDB();
    }
    return MongoDB.instance;
  }

  public async connect(): Promise<void> {
    try {
      // If already connected, just return
      if (this.db) {
        console.log('✅ MongoDB already connected');
        return;
      }

      console.log('🔄 Connecting to MongoDB...');
      console.log(
        '📍 Using DATABASE_URL:',
        DATABASE_URL.replace(/:[^:@]+@/, ':***@')
      ); // Hide password

      await this.client.connect();

      // Extract database name from URL
      let dbName = 'mutual_funds_db'; // Default

      // For Atlas URLs, extract the database name from the path
      if (DATABASE_URL.includes('mongodb+srv://')) {
        // Pattern: mongodb+srv://user:pass@host/dbname?params
        const match = DATABASE_URL.match(/mongodb\+srv:\/\/[^\/]+\/([^?]+)/);
        if (match && match[1]) {
          dbName = match[1];
        }
      } else {
        // For local MongoDB URLs
        const extracted = DATABASE_URL.split('/').pop()?.split('?')[0];
        if (extracted) {
          dbName = extracted;
        }
      }

      this.db = this.client.db(dbName);

      console.log(`✅ MongoDB connected successfully to database: ${dbName}`);
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      this.db = null;
      throw error;
    }
  }

  public getDb(): Db {
    if (!this.db) {
      throw new Error('Database not initialized. Call connect() first.');
    }
    return this.db;
  }

  public getCollection<T extends Document = Document>(
    name: string
  ): Collection<T> {
    return this.getDb().collection<T>(name);
  }

  public async disconnect(): Promise<void> {
    await this.client.close();
    console.log('MongoDB disconnected');
  }

  public isConnected(): boolean {
    return this.db !== null;
  }
}

export const mongodb = MongoDB.getInstance();
