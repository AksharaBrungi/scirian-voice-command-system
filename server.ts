import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client lazily or safely
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY",
  });
});

// Allowed intents enumeration
const ALLOWED_INTENTS = [
  // Global Navigation
  "GO_HOME",
  "OPEN_LIBRARY",
  "OPEN_READER",
  "OPEN_STUDY_PLAN",
  "CREATE_STUDY_PLAN",
  "SHOW_STUDY_PLAN",
  "START_QUIZ",
  "OPEN_NOTES",
  "SUMMARIZE_NOTES",
  "OPEN_ANALYTICS",
  "OPEN_AI_TUTOR",
  "OPEN_DAILY_RECALL",
  "SHOW_HELP",
  // Contextual Reader
  "EXPLAIN_SECTION",
  "SUMMARIZE_PAGE",
  "GENERATE_BOOK_QUIZ",
  "NEXT_PAGE",
  "PREVIOUS_PAGE",
  // Contextual Quiz
  "NEXT_QUESTION",
  "EXPLAIN_ANSWER",
  "SELECT_OPTION",
  // Contextual Notes
  "CREATE_FLASHCARDS",
  "ADD_NOTE",
  // Contextual Daily Recall
  "SHOW_ANSWER",
  "NEXT_FLASHCARD",
  "MARK_MASTERED",
  // Contextual AI Tutor
  "ASK_TUTOR",
] as const;

// Context-aware rule-based resolver
function ruleBasedResolver(transcript: string, context?: any) {
  const clean = transcript.toLowerCase().trim();
  const activeTab = context?.activeTab || "";

  // 1. HELP
  if (
    clean.includes("help") ||
    clean.includes("what can you do") ||
    clean.includes("command list") ||
    clean.includes("voice guide") ||
    clean.includes("show commands")
  ) {
    return { intent: "SHOW_HELP", confidence: 0.99, parameters: {} };
  }

  // 2. CONTEXTUAL: BOOK READER ACTIONS (When inside reader or explicitly referring to book/section)
  if (activeTab === "reader" || clean.includes("this section") || clean.includes("this page") || clean.includes("this chapter") || clean.includes("this book")) {
    if (clean.includes("explain") && (clean.includes("section") || clean.includes("paragraph") || clean.includes("concept") || clean.includes("this"))) {
      return {
        intent: "EXPLAIN_SECTION",
        confidence: 0.98,
        parameters: { bookId: context?.currentBookId, page: context?.currentPage },
      };
    }
    if (clean.includes("summariz") && (clean.includes("page") || clean.includes("chapter") || clean.includes("section") || clean.includes("this"))) {
      return {
        intent: "SUMMARIZE_PAGE",
        confidence: 0.98,
        parameters: { bookId: context?.currentBookId, page: context?.currentPage },
      };
    }
    if (clean.includes("quiz") && (clean.includes("from this") || clean.includes("chapter") || clean.includes("book"))) {
      return {
        intent: "GENERATE_BOOK_QUIZ",
        confidence: 0.97,
        parameters: {
          bookId: context?.currentBookId,
          subject: context?.currentBookTitle || "System Architecture",
        },
      };
    }
    if (clean.includes("next page") || clean === "next") {
      return { intent: "NEXT_PAGE", confidence: 0.98, parameters: {} };
    }
    if (clean.includes("previous page") || clean.includes("prev page") || clean.includes("go back a page")) {
      return { intent: "PREVIOUS_PAGE", confidence: 0.98, parameters: {} };
    }
  }

  // 3. CONTEXTUAL: QUIZ ACTIONS (When quiz is active)
  if (activeTab === "quiz" || context?.quizActive) {
    if (clean.includes("next question") || clean === "next") {
      return { intent: "NEXT_QUESTION", confidence: 0.98, parameters: {} };
    }
    if (clean.includes("explain") || clean.includes("why") || clean.includes("solution")) {
      return { intent: "EXPLAIN_ANSWER", confidence: 0.97, parameters: {} };
    }
    // Option selection like "Option A", "Option 1", "Select 2", "Choose B"
    const optMatch = clean.match(/(?:option|choose|select|pick)\s+([a-d]|1|2|3|4)/i);
    if (optMatch) {
      const val = optMatch[1].toLowerCase();
      const map: Record<string, number> = { a: 0, b: 1, c: 2, d: 3, "1": 0, "2": 1, "3": 2, "4": 3 };
      return {
        intent: "SELECT_OPTION",
        confidence: 0.96,
        parameters: { optionIndex: map[val] ?? 0 },
      };
    }
  }

  // 4. CONTEXTUAL: DAILY RECALL (When recall is active)
  if (activeTab === "daily-recall" || context?.recallActive) {
    if (clean.includes("show answer") || clean.includes("flip") || clean.includes("turn card")) {
      return { intent: "SHOW_ANSWER", confidence: 0.98, parameters: {} };
    }
    if (clean.includes("mastered") || clean.includes("know it") || clean.includes("got it")) {
      return { intent: "MARK_MASTERED", confidence: 0.97, parameters: {} };
    }
    if (clean.includes("next card") || clean.includes("next flashcard") || clean === "next") {
      return { intent: "NEXT_FLASHCARD", confidence: 0.98, parameters: {} };
    }
  }

  // 5. GLOBAL: MY LIBRARY & BOOK READER
  if (
    clean.includes("open library") ||
    clean.includes("my library") ||
    clean.includes("go to library") ||
    clean.includes("show library") ||
    clean.includes("show books") ||
    clean.includes("my books")
  ) {
    return { intent: "OPEN_LIBRARY", confidence: 0.98, parameters: {} };
  }

  if (
    clean.includes("open reader") ||
    clean.includes("read book") ||
    clean.includes("continue reading") ||
    clean.includes("continue learning")
  ) {
    return { intent: "OPEN_READER", confidence: 0.98, parameters: {} };
  }

  // 6. GLOBAL: AI TUTOR
  if (
    clean.includes("ai tutor") ||
    clean.includes("open tutor") ||
    clean.includes("talk to tutor") ||
    clean.includes("ask tutor") ||
    clean.includes("chat with tutor") ||
    clean.startsWith("ask ai") ||
    clean.startsWith("ask tutor")
  ) {
    let query = "";
    const askMatch = clean.match(/(?:ask\s+(?:ai|tutor)|tutor)\s+(.+)/);
    if (askMatch && askMatch[1]) {
      query = askMatch[1].trim();
    }
    return {
      intent: "OPEN_AI_TUTOR",
      confidence: 0.98,
      parameters: query ? { query } : {},
    };
  }

  // 7. GLOBAL: DAILY RECALL
  if (
    clean.includes("daily recall") ||
    clean.includes("flashcard") ||
    clean.includes("review recall") ||
    clean.includes("practice flashcards") ||
    clean.includes("spaced repetition")
  ) {
    return { intent: "OPEN_DAILY_RECALL", confidence: 0.98, parameters: {} };
  }

  // 8. GLOBAL: DASHBOARD / HOME
  if (
    clean === "home" ||
    clean === "go home" ||
    clean === "dashboard" ||
    clean.includes("go to dashboard") ||
    clean.includes("open dashboard") ||
    clean.includes("main page")
  ) {
    return { intent: "GO_HOME", confidence: 0.98, parameters: {} };
  }

  // 9. GLOBAL: QUIZ
  if (clean.includes("quiz") || clean.includes("test") || clean.includes("exam")) {
    let subject = "Python";
    if (clean.includes("architecture") || clean.includes("system")) subject = "System Architecture";
    else if (clean.includes("python")) subject = "Python";
    else if (clean.includes("data structure") || clean.includes("dsa") || clean.includes("algorithm")) subject = "Data Structures";
    else if (clean.includes("machine learning") || clean.includes("ai") || clean.includes("ml")) subject = "Machine Learning";

    const countMatch = clean.match(/(\d+)\s*(?:question|item|problem)/);
    const questionCount = countMatch ? parseInt(countMatch[1], 10) : 10;

    return {
      intent: "START_QUIZ",
      confidence: 0.96,
      parameters: { subject, questionCount },
    };
  }

  // 10. GLOBAL: NOTES & SUMMARIZATION
  if (clean.includes("summariz") || clean.includes("summary")) {
    let subject = "";
    if (clean.includes("python")) subject = "Python";
    else if (clean.includes("data structure") || clean.includes("algorithm")) subject = "Data Structures";
    else if (clean.includes("architecture") || clean.includes("replication")) subject = "System Architecture";

    return {
      intent: "SUMMARIZE_NOTES",
      confidence: 0.96,
      parameters: subject ? { subject } : {},
    };
  }

  if (clean.includes("create flashcard") || clean.includes("make flashcards")) {
    return { intent: "CREATE_FLASHCARDS", confidence: 0.97, parameters: {} };
  }

  if (clean.includes("note") || clean.includes("lecture notes")) {
    return { intent: "OPEN_NOTES", confidence: 0.96, parameters: {} };
  }

  // 11. GLOBAL: STUDY PLAN
  if (clean.includes("create") && (clean.includes("study") || clean.includes("plan") || clean.includes("schedule") || clean.includes("task"))) {
    let taskTitle = "";
    const match = clean.match(/(?:for|about|on)\s+([a-zA-Z0-9\s]+?)(?:\s+to|\s+in|$)/);
    if (match && match[1]) taskTitle = match[1].trim();

    return {
      intent: "CREATE_STUDY_PLAN",
      confidence: 0.95,
      parameters: taskTitle ? { taskTitle } : {},
    };
  }

  if (clean.includes("study plan") || clean.includes("schedule") || clean.includes("tasks") || clean.includes("routine")) {
    return { intent: "OPEN_STUDY_PLAN", confidence: 0.96, parameters: {} };
  }

  // 12. GLOBAL: ANALYTICS & PROGRESS
  if (
    clean.includes("analytic") ||
    clean.includes("progress") ||
    clean.includes("statistic") ||
    clean.includes("performance") ||
    clean.includes("how i am doing") ||
    clean.includes("how i'm doing") ||
    clean.includes("study hours")
  ) {
    return { intent: "OPEN_ANALYTICS", confidence: 0.97, parameters: {} };
  }

  return null;
}

// Intent Classification Endpoint
app.post("/api/intent", async (req, res) => {
  const { transcript, context } = req.body;

  if (!transcript || typeof transcript !== "string") {
    return res.status(400).json({ error: "Transcript is required." });
  }

  // 1. Fast local rule-based match
  const ruleMatch = ruleBasedResolver(transcript, context);
  if (ruleMatch && ruleMatch.confidence >= 0.95) {
    return res.json({
      ...ruleMatch,
      source: "rule_engine",
      validated: true,
    });
  }

  const ai = getGeminiClient();
  if (!ai) {
    if (ruleMatch) {
      return res.json({
        ...ruleMatch,
        source: "rule_engine_fallback",
        validated: true,
      });
    }
    return res.json({
      intent: "UNKNOWN",
      confidence: 0.2,
      parameters: {},
      source: "fallback_no_api_key",
      message: "Could not recognize command.",
      validated: false,
    });
  }

  try {
    const prompt = `You are the Natural Language Understanding (NLU) engine for Scirian, an AI Operating System for Smart Learning with books, AI tutor, daily recall, quizzes, and study planner.
Classify the user's spoken voice command into exactly one of the ALLOWED INTENTS below.

CURRENT USER APPLICATION CONTEXT:
- Active Screen / Tab: ${context?.activeTab || "dashboard"}
- Current Book Title: ${context?.currentBookTitle || "None"}
- Current Book Page: ${context?.currentPage || "N/A"}
- Quiz Active: ${context?.quizActive ? "YES" : "NO"}
- Recall Active: ${context?.recallActive ? "YES" : "NO"}

ALLOWED INTENTS:
Global Navigation:
1. GO_HOME: Go to main dashboard.
2. OPEN_LIBRARY: Open library of books / PDFs / documents.
3. OPEN_READER: Open interactive book reader or continue learning.
4. OPEN_AI_TUTOR: Open AI Tutor chat or ask the tutor a question.
5. OPEN_DAILY_RECALL: Open spaced repetition flashcards / daily recall.
6. OPEN_STUDY_PLAN: View study timetable or plan.
7. CREATE_STUDY_PLAN: Create a study plan or add a new study task.
8. START_QUIZ: Start an assessment or quiz. Extract subject and questionCount.
9. OPEN_NOTES: Open student notes.
10. SUMMARIZE_NOTES: Synthesize or summarize notes.
11. OPEN_ANALYTICS: Open study metrics, streak, and performance stats.
12. SHOW_HELP: Show available voice commands.

Contextual Actions (take user context into account):
13. EXPLAIN_SECTION: Explain the active book page, paragraph, or concept in the reader.
14. SUMMARIZE_PAGE: Summarize the current book page or chapter.
15. GENERATE_BOOK_QUIZ: Generate a quiz directly based on the active book or chapter.
16. NEXT_PAGE: Advance to the next book page in the reader.
17. PREVIOUS_PAGE: Return to previous book page.
18. NEXT_QUESTION: Move to next question in quiz.
19. EXPLAIN_ANSWER: Explain why an answer is correct in the quiz.
20. SELECT_OPTION: Choose option in quiz (extract optionIndex: 0, 1, 2, or 3).
21. SHOW_ANSWER: Flip or reveal flashcard in Daily Recall.
22. NEXT_FLASHCARD: Go to next flashcard in Daily Recall.
23. MARK_MASTERED: Mark current flashcard as mastered.
24. CREATE_FLASHCARDS: Generate flashcards from current note.

If none match with confidence, return UNKNOWN.
Never invent arbitrary intents outside this list.

User Spoken Command: "${transcript}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            parameters: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING },
                questionCount: { type: Type.INTEGER },
                taskTitle: { type: Type.STRING },
                bookId: { type: Type.STRING },
                optionIndex: { type: Type.INTEGER },
                query: { type: Type.STRING },
              },
            },
            explanation: { type: Type.STRING },
          },
          required: ["intent", "confidence"],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    const validIntent = ALLOWED_INTENTS.includes(parsed.intent as any) ? parsed.intent : "UNKNOWN";

    return res.json({
      intent: validIntent,
      confidence: parsed.confidence || 0.85,
      parameters: parsed.parameters || {},
      explanation: parsed.explanation || "",
      source: "gemini_nlu",
      validated: validIntent !== "UNKNOWN",
    });
  } catch (error: any) {
    console.error("Gemini Intent API error:", error?.message || error);
    if (ruleMatch) {
      return res.json({
        ...ruleMatch,
        source: "rule_engine_recovery",
        validated: true,
      });
    }
    return res.json({
      intent: "UNKNOWN",
      confidence: 0.1,
      parameters: {},
      validated: false,
    });
  }
});

// AI Tutor Chat Endpoint
app.post("/api/tutor", async (req, res) => {
  const { messages, context } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array required" });
  }

  const lastUserMessage = messages[messages.length - 1]?.content || "";
  const ai = getGeminiClient();

  if (!ai) {
    // Intelligent heuristic tutor reply
    const replies: Record<string, string> = {
      default: `As your Scirian AI Tutor, I've analyzed your current study focus. When studying ${context?.currentBookTitle || "computer science topics"}, make sure to break down complex theorems into fundamental invariants. Would you like me to generate a 3-question concept check or explain a specific subsection?`,
      replication: `In distributed systems, single-leader replication ensures strong order of writes via the leader's write-ahead log. However, failover requires careful fencing to prevent split-brain where two nodes accept writes concurrently.`,
      bfs: `Breadth-First Search (BFS) operates strictly level-by-level using a FIFO queue. Because each edge has uniform weight, the first time you discover a node is mathematically guaranteed to be the shortest path!`,
    };

    let reply = replies.default;
    const lower = lastUserMessage.toLowerCase();
    if (lower.includes("replication") || lower.includes("leader") || lower.includes("database")) {
      reply = replies.replication;
    } else if (lower.includes("bfs") || lower.includes("graph") || lower.includes("shortest path")) {
      reply = replies.bfs;
    }

    return res.json({
      reply,
      source: "heuristic_tutor",
    });
  }

  try {
    const bookInfo = context?.currentBookTitle
      ? `Active Reference Book: ${context.currentBookTitle} (Page ${context.currentPage || 1})`
      : "Reference: General Academic Knowledge";

    const systemInstruction = `You are Scirian's interactive AI Learning Tutor.
You provide clear, authoritative, pedagogical explanations for university-level students in Computer Science, AI, and Software Systems.
Use formatting (bullet points, brief code snippets where relevant) for high readability.
Keep answers concise (under 180 words) so they can also be spoken cleanly via Text-To-Speech.
${bookInfo}`;

    const conversationHistory = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemInstruction}\n\nStudent question: ${lastUserMessage}` }],
        },
      ],
    });

    return res.json({
      reply: response.text?.trim() || "I am ready to help you analyze your study material.",
      source: "gemini_3.8_flash",
    });
  } catch (err: any) {
    console.error("Tutor error:", err);
    return res.json({
      reply: `I've analyzed your question. In this domain, breaking the concept into foundational primitives and tracing edge cases is the most reliable approach. Let's practice with an active recall question!`,
      source: "fallback",
    });
  }
});

// Deep Section Explanation Endpoint
app.post("/api/explain-section", async (req, res) => {
  const { bookTitle, chapterTitle, textExcerpt } = req.body;

  const ai = getGeminiClient();
  if (!ai) {
    return res.json({
      title: "Core Concept Breakdown",
      concept: "Understanding Invariants & Trade-offs",
      analogy: "Think of this mechanism like a central library ledger: only one head librarian can record new acquisitions to prevent conflicting entries, while multiple assistant librarians can show copies to visitors.",
      breakdown: [
        "1. Single source of authority guarantees write consistency.",
        "2. Asynchronous distribution permits low-latency reads across multiple nodes.",
        "3. Network partitions must be resolved via strict consensus protocols.",
      ],
      source: "heuristic_explanation",
    });
  }

  try {
    const prompt = `You are Scirian's AI Study Copilot. Break down this excerpt from "${bookTitle || 'the textbook'}" - ${chapterTitle || ''}:

Excerpt:
"""${textExcerpt}"""

Generate a pedagogical breakdown:
1. concept: 1-2 sentence definition of the central principle.
2. analogy: Intuitive real-world analogy to solidify understanding.
3. breakdown: Array of 3 key technical takeaways.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            concept: { type: Type.STRING },
            analogy: { type: Type.STRING },
            breakdown: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["concept", "analogy", "breakdown"],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    return res.json({
      ...parsed,
      source: "gemini_3.8_flash",
    });
  } catch (err) {
    return res.json({
      concept: "Core architectural principle in distributed learning.",
      analogy: "Like a flight control tower synchronizing runway availability across approaching aircraft.",
      breakdown: [
        "Establishes a single monotonic timeline of state changes.",
        "Minimizes synchronization overhead during steady-state processing.",
        "Provides clear bounds for failure recovery and replication lag.",
      ],
      source: "fallback",
    });
  }
});

// Note Summarization Endpoint
app.post("/api/summarize", async (req, res) => {
  const { title, content, subject } = req.body;

  if (!content) {
    return res.status(400).json({ error: "Content is required for summarization." });
  }

  const ai = getGeminiClient();

  if (!ai) {
    const sentences = content
      .split(/[.!?\n]+/)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 20);

    const keyPoints = sentences.slice(0, 4);
    const summary = keyPoints.join(". ") + (keyPoints.length ? "." : content.slice(0, 160));

    return res.json({
      summary,
      keyPoints: keyPoints.length > 0 ? keyPoints : ["Core concept review completed", "Synthesized from student lecture notes"],
      flashcards: [
        {
          front: `What is the core takeaway of ${title || subject || "this note"}?`,
          back: keyPoints[0] || "Review primary principles and key definitions.",
        },
      ],
      source: "heuristic_engine",
    });
  }

  try {
    const prompt = `You are Scirian's AI Study Companion. Provide an executive study summary for the following student note.
Subject: ${subject || "General Study"}
Note Title: ${title || "Untitled"}
Note Content:
${content}

Generate:
1. summary: A crisp 2-3 sentence overview.
2. keyPoints: Array of 3-5 concise bullet points with key concepts/formulas/definitions.
3. flashcards: Array of 2-3 rapid revision flashcards with 'front' (question) and 'back' (answer).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyPoints: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING },
                  back: { type: Type.STRING },
                },
                required: ["front", "back"],
              },
            },
          },
          required: ["summary", "keyPoints", "flashcards"],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    return res.json({
      ...parsed,
      source: "gemini_3.8_flash",
    });
  } catch (error: any) {
    console.error("Summarization error:", error);
    return res.json({
      summary: "Notes synthesized into primary study concepts. Focus on data structures, algorithmic complexity, and idiomatic syntax.",
      keyPoints: [
        "Review foundational theory and syntax patterns",
        "Practice problem solving with edge-case handling",
        "Test knowledge using the built-in Scirian Quiz module",
      ],
      flashcards: [
        {
          front: `Core concept in ${subject || "Study Notes"}`,
          back: "Structured practice and incremental recall builds long-term mastery.",
        },
      ],
      source: "fallback",
    });
  }
});

// Vite middleware / static files
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Scirian Voice Command System server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
