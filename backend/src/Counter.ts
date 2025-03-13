// backend/src/Counter.ts
export default class Counter {
  private static instance: Counter;
  private count: number = 0;

  private constructor() {}

  public static getInstance(): Counter {
    if (!Counter.instance) {
      Counter.instance = new Counter();
      console.log("Singleton instance created!");
    }
    return Counter.instance;
  }

  public increment(): void {
    this.count++;
  }

  public decrement(): void {
    if (this.count > 0) {
      this.count--;
    }
  }

  public getCount(): number {
    return this.count;
  }
}
