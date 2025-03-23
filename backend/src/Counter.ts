// backend/src/Counter.ts
import db from "./firebase-admin";

export default class Counter {
  private static instance: Counter;
  private countRef = db.ref("count");

  private constructor() {
    console.log("Counter instance created!");
  }

  public static getInstance(): Counter {
    if (!Counter.instance) {
      Counter.instance = new Counter();
    }
    return Counter.instance;
  }

  public async increment(): Promise<void> {
    try {
      const snapshot = await this.countRef.once("value");
      const currentCount = snapshot.val() || 0;
      await this.countRef.set(currentCount + 1);
    } catch (error) {
      console.error("Error incrementing count:", error);
      throw error;
    }
  }

  public async decrement(): Promise<void> {
    try {
      const snapshot = await this.countRef.once("value");
      const currentCount = snapshot.val() || 0;
      if (currentCount > 0) {
        await this.countRef.set(currentCount - 1);
      }
    } catch (error) {
      console.error("Error decrementing count:", error);
      throw error;
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
