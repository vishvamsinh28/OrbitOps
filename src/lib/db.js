import mongoose from "mongoose";

const globalForMongoose = globalThis;

if (!globalForMongoose.mongooseCache) {
  globalForMongoose.mongooseCache = {
    conn: null,
    promise: null,
  };
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (globalForMongoose.mongooseCache.conn) {
    return globalForMongoose.mongooseCache.conn;
  }

  if (!globalForMongoose.mongooseCache.promise) {
    globalForMongoose.mongooseCache.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  globalForMongoose.mongooseCache.conn =
    await globalForMongoose.mongooseCache.promise;

  return globalForMongoose.mongooseCache.conn;
}
