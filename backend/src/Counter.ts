// backend/src/Counter.ts
import db from "./firebase-admin";

export default class Counter {
  private static instance: Counter;
  private countRef = db.ref("count");
  private activeConnections = new Set<string>(); // Track active connections

  private constructor() {
    console.log("Counter instance created!");
  }

  public static getInstance(): Counter {
    if (!Counter.instance) {
      Counter.instance = new Counter();
    }
    return Counter.instance;
  }

  public async increment(connectionId: string): Promise<void> {
    // Only increment if this is a new connection
    if (!this.activeConnections.has(connectionId)) {
      this.activeConnections.add(connectionId);
      try {
        await this.countRef.transaction((currentCount) => {
          return (currentCount || 0) + 1;
        });
      } catch (error) {
        console.error("Error incrementing count:", error);
        throw error;
      }
    }
  }

  public async decrement(connectionId: string): Promise<void> {
    if (this.activeConnections.has(connectionId)) {
      this.activeConnections.delete(connectionId);
      try {
        await this.countRef.transaction((currentCount) => {
          const newCount = (currentCount || 0) - 1;
          return newCount > 0 ? newCount : 0;
        });
      } catch (error) {
        console.error("Error decrementing count:", error);
        throw error;
      }
    }
  }

  public async getCount(): Promise<number> {
    try {
      const snapshot = await this.countRef.once("value");
      return snapshot.val() || 0;
    } catch (error) {
      console.error("Error getting count:", error);
      throw error;
    }
  }
}
