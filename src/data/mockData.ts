import {
  StudyTask,
  QuizQuestion,
  NoteItem,
  StudentProfile,
  VoiceCommandResult,
  BookItem,
  FlashcardItem,
  ChatMessage,
} from '../types';

export const INITIAL_PROFILE: StudentProfile = {
  name: 'Alex Chen',
  email: 'alex.chen@scirian.edu',
  major: 'Computer Science & AI',
  semester: 'Year 3, Semester 1',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  streakDays: 7,
  targetDailyHours: 4.5,
  booksCompleted: 4,
  quizzesTaken: 18,
  totalStudyHours: 42.5,
};

export const INITIAL_BOOKS: BookItem[] = [
  {
    id: 'book-1',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    coverGradient: 'from-blue-600 via-indigo-700 to-slate-900',
    category: 'System Architecture',
    totalPages: 560,
    currentPage: 142,
    progressPercent: 25,
    lastReadAt: '15 mins ago',
    fileSize: '14.2 MB',
    summary: 'The definitive guide to the architecture of storage engines, distributed consensus, data replication, and streaming systems.',
    chapters: [
      {
        id: 'c1',
        title: 'Chapter 1: Reliable, Scalable, and Maintainable Applications',
        pageStart: 1,
        excerpt: 'Thinking about reliability, scalability, and maintainability in data systems under hardware and software faults.',
        fullText: `Reliability means continuing to work correctly (performing the correct function at the desired level of performance) even when things go wrong.

The things that can go wrong are called faults, and systems that anticipate faults and can cope with them are called fault-tolerant or resilient. We should distinguish between faults and failures. A fault is usually defined as one component of the system deviating from its spec, whereas a failure is when the system as a whole stops providing the required service to the user.

Scalability is the term we use to describe a system's ability to cope with increased load. It is not a one-dimensional label that we can attach to a system: it is meaningless to say "X is scalable" or "Y doesn't scale." Rather, discussing scalability means considering questions like: "If the system grows in a particular way, what are our options for coping with the growth?"

Key maintainability principles:
1. Operability: Make it easy for operations teams to keep the system running smoothly.
2. Simplicity: Make it easy for new engineers to understand the system, largely by removing as much accidental complexity as possible.
3. Evolvability: Make it easy for engineers to make changes to the system in the future, adapting it for unanticipated use cases as requirements change.`,
        keyConcepts: ['Fault vs Failure', 'Scalability Metrics', 'Operability & Evolvability'],
      },
      {
        id: 'c2',
        title: 'Chapter 5: Replication & High Availability',
        pageStart: 120,
        excerpt: 'Single-leader, multi-leader, and leaderless replication strategies with trade-offs in consistency and partition tolerance.',
        fullText: `Replication means keeping a copy of the same data on multiple machines that are connected via a network. Why replicate data?
1. To keep data geographically close to your users (reduce latency).
2. To allow the system to continue working even if some parts have failed (increase availability).
3. To scale out the number of machines that can serve read queries (increase read throughput).

In single-leader replication (also known as active/passive or master-slave replication):
- One of the replicas is designated the leader (master, primary). When clients want to write to the database, they must send their requests to the leader.
- The other replicas are known as followers (read replicas, slaves, secondaries). Whenever the leader writes new data to its local storage, it sends the data change to all of its followers as part of a replication log or change stream.
- When a client wants to read from the database, it can query either the leader or any of the followers.

Synchronous vs. Asynchronous Replication:
In synchronous replication, the leader waits until the follower has confirmed that it received the write before reporting success to the client. In asynchronous replication, the leader sends the message but does not wait for a response from the follower. Asynchronous replication is fast and common, but introduces replication lag and eventual consistency challenges.`,
        keyConcepts: ['Leader-Follower Pattern', 'Replication Lag', 'Split-Brain Prevention', 'Failover Protocols'],
      },
      {
        id: 'c3',
        title: 'Chapter 6: Partitioning & Sharding',
        pageStart: 180,
        excerpt: 'Breaking massive datasets into subsets (partitions) across nodes using key-range and hash partitioning.',
        fullText: `For very large datasets, or very high query throughput, replication is not sufficient: we need to break the data up into partitions, also known as sharding.

Normally, partitions are defined in such a way that each piece of data (each record, row, or document) belongs to exactly one partition. In effect, each partition is a small database of its own, although the database may support operations that touch multiple partitions at the same time.

The main reason for partitioning is scalability. Different partitions can be assigned to different nodes in a shared-nothing cluster. Thus, a large dataset can be distributed across many disks, and query load can be distributed across many processors.

Partitioning Strategies:
- Partitioning by Key Range: Assigning a continuous range of keys (from minimum to maximum) to each partition, similar to an encyclopedia. Good for range queries, but risks hot spots if certain keys are accessed frequently.
- Partitioning by Hash of Key: A good hash function takes skewed data and makes it uniformly distributed. Good for avoiding hot spots, but destroys efficient range queries.`,
        keyConcepts: ['Consistent Hashing', 'Hot Spots & Skew', 'Rebalancing Partitions'],
      },
    ],
  },
  {
    id: 'book-2',
    title: 'Grokking Algorithms & Advanced Data Structures',
    author: 'Aditya Bhargava & Steven Skiena',
    coverGradient: 'from-emerald-600 via-teal-700 to-slate-900',
    category: 'Computer Science',
    totalPages: 340,
    currentPage: 96,
    progressPercent: 28,
    lastReadAt: '2 hours ago',
    fileSize: '8.7 MB',
    summary: 'Visual, deeply intuitive explanations of sorting algorithms, graphs, dynamic programming, and binary search structures.',
    chapters: [
      {
        id: 'g1',
        title: 'Chapter 3: Recursion & The Call Stack',
        pageStart: 42,
        excerpt: 'Understanding base cases, recursive cases, and how the computer memory stack manages activation frames.',
        fullText: `Recursion is where a function calls itself. Every recursive function has two parts: the base case and the recursive case.
The recursive case is when the function calls itself. The base case is when the function doesn't call itself again, so it doesn't enter an infinite loop.

When you call a function from another function, the calling function is paused in a partially completed state. All the values of the variables for that function are still stored in memory on the call stack.
When you use a recursive function, the call stack can grow very large, using significant amounts of memory. If your stack gets too tall, you hit a stack overflow!

Takeaway for technical interviews: Always identify the base case first. Look for termination conditions where the problem size shrinks to 0 or 1.`,
        keyConcepts: ['Base Case vs Recursive Case', 'Stack Frame Allocation', 'Tail Call Optimization'],
      },
      {
        id: 'g2',
        title: 'Chapter 6: Breadth-First Search & Graph Modeling',
        pageStart: 88,
        excerpt: 'Solving shortest-path problems using graphs, adjacency lists, and FIFO queues.',
        fullText: `Breadth-First Search (BFS) allows you to find the shortest distance between two things. It helps answer two types of questions:
1. Is there a path from node A to node B?
2. What is the shortest path from node A to node B?

BFS radiates outward from the starting point. It visits first-degree connections before second-degree connections.
To enforce this order, you must use a Queue (First In, First Out). A Stack (LIFO) will not work because it will traverse deeply into one branch first instead of checking immediate neighbors.

Algorithm outline:
1. Keep a queue of nodes to check.
2. Pop a node off the queue.
3. Check if this person/node is the target.
4. If yes, you are done!
5. If no, add all their neighbors to the queue, making sure to track visited nodes in a Set so you don't end up in an infinite loop.`,
        keyConcepts: ['Adjacency List', 'Queue FIFO', 'Visited Set Cycle Guard', 'Shortest Unweighted Path'],
      },
    ],
  },
  {
    id: 'book-3',
    title: 'Deep Learning & Neural Network Foundations',
    author: 'Ian Goodfellow & Yoshua Bengio',
    coverGradient: 'from-purple-600 via-violet-800 to-slate-900',
    category: 'Artificial Intelligence',
    totalPages: 480,
    currentPage: 210,
    progressPercent: 44,
    lastReadAt: 'Yesterday',
    fileSize: '18.9 MB',
    summary: 'Mathematical principles of gradient backpropagation, convolution kernels, attention mechanisms, and optimization.',
    chapters: [
      {
        id: 'dl1',
        title: 'Chapter 6: Deep Feedforward Networks & Backpropagation',
        pageStart: 168,
        excerpt: 'How multi-layer perceptrons approximate non-linear functions and how chain rule gradient backpropagation propagates errors.',
        fullText: `Deep feedforward networks, also called feedforward neural networks or multilayer perceptrons (MLPs), are the quintessential deep learning models. The goal of a feedforward network is to approximate some function f*.

To allow the network to learn non-linear functions, we apply an activation function g(z) element-wise to the affine transformation of inputs. Modern networks default to the Rectified Linear Unit (ReLU), g(z) = max{0, z}.

Backpropagation (often abbreviated backprop) allows the information from the cost to flow backward through the network in order to compute the gradient. Backprop is an efficient implementation of the chain rule of calculus for vectors and matrices.

Chain Rule in Matrix Form:
If y = g(x) and z = f(y), then dz/dx = (dz/dy) * (dy/dx). By caching the intermediate activations during the forward pass, we compute all partial derivatives in time proportional to the forward pass execution time.`,
        keyConcepts: ['Non-linear Activations', 'Chain Rule Calculus', 'Gradient Vanishing / Exploding', 'Loss Computation'],
      },
    ],
  },
  {
    id: 'book-4',
    title: 'Clean Code & Modern Full-Stack Systems',
    author: 'Robert C. Martin & Addy Osmani',
    coverGradient: 'from-amber-600 via-orange-700 to-slate-900',
    category: 'Software Engineering',
    totalPages: 310,
    currentPage: 45,
    progressPercent: 15,
    lastReadAt: '3 days ago',
    fileSize: '6.4 MB',
    summary: 'Refactoring principles, SOLID patterns, microservices architecture, and clean async TypeScript practices.',
    chapters: [
      {
        id: 'cc1',
        title: 'Chapter 2: Meaningful Names & Function Single Responsibility',
        pageStart: 18,
        excerpt: 'Writing code that conveys intent, avoids side effects, and minimizes cognitive load for team members.',
        fullText: `Names should reveal intent. If a variable, function, or class requires a comment to explain what it does, the name has failed.

Functions should do one thing. They should do it well. They should do it only.
How do you know if a function is doing "one thing"? If you can extract another function from it with a name that is not merely a restatement of its implementation, then the function was doing more than one thing.

Functions should either do something or answer something, but not both. Either your function should change the state of an object, or it should return some information about that object. Doing both often leads to confusion and hidden bugs.`,
        keyConcepts: ['Intention-Revealing Names', 'Single Responsibility Principle', 'Command-Query Separation'],
      },
    ],
  },
];

export const INITIAL_FLASHCARDS: FlashcardItem[] = [
  {
    id: 'fc-1',
    question: 'What is the key difference between a Fault and a Failure in distributed systems?',
    answer: 'A fault is a component deviating from specification (e.g. one disk failing). A failure is when the whole system stops serving users.',
    category: 'System Architecture',
    sourceRef: 'Designing Data-Intensive Applications (Ch 1)',
    mastered: true,
    repetitions: 4,
    lastReviewed: 'Yesterday',
  },
  {
    id: 'fc-2',
    question: 'Why does BFS guarantee the shortest unweighted path while DFS does not?',
    answer: 'BFS explores nodes layer by layer using a FIFO queue, encountering all distance-k nodes before distance-(k+1) nodes.',
    category: 'Data Structures',
    sourceRef: 'Grokking Algorithms (Ch 6)',
    mastered: true,
    repetitions: 3,
    lastReviewed: 'Today',
  },
  {
    id: 'fc-3',
    question: 'What is the primary vulnerability of single-leader asynchronous replication?',
    answer: 'Replication lag can lead to data loss during an unexpected leader failover (unreplicated writes on leader are lost), and stale reads for clients.',
    category: 'System Architecture',
    sourceRef: 'Designing Data-Intensive Applications (Ch 5)',
    mastered: false,
    repetitions: 1,
    lastReviewed: '2 days ago',
  },
  {
    id: 'fc-4',
    question: 'Why is ReLU preferred over Sigmoid in modern deep neural networks?',
    answer: 'ReLU does not saturate in positive regions (derivative is constant 1), preventing vanishing gradients and speeding up gradient descent convergence.',
    category: 'Machine Learning',
    sourceRef: 'Deep Learning Foundations (Ch 6)',
    mastered: false,
    repetitions: 2,
    lastReviewed: '3 days ago',
  },
  {
    id: 'fc-5',
    question: 'What is the Command-Query Separation (CQS) principle?',
    answer: 'A method should either be a command that changes state (void return) or a query that returns data without side-effects, never both.',
    category: 'Software Engineering',
    sourceRef: 'Clean Code (Ch 2)',
    mastered: true,
    repetitions: 5,
    lastReviewed: '4 days ago',
  },
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: "Hello Alex! I am your Scirian AI Learning Tutor. I have indexed your library books and study notes. You can speak or type any question, request a concept breakdown, or say voice commands like 'Explain Chapter 5 of Designing Data-Intensive Applications'. What would you like to master today?",
    timestamp: 'Just now',
  },
];

export const INITIAL_TASKS: StudyTask[] = [
  {
    id: 'task-1',
    title: 'Read Ch 5: Replication & High Availability',
    subject: 'System Architecture',
    time: '09:30 AM',
    durationMinutes: 45,
    priority: 'high',
    completed: true,
    bookRef: 'Designing Data-Intensive Applications',
  },
  {
    id: 'task-2',
    title: 'Solve 3 BFS Shortest Path Graph Problems',
    subject: 'Data Structures',
    time: '11:15 AM',
    durationMinutes: 60,
    priority: 'high',
    completed: true,
    bookRef: 'Grokking Algorithms',
  },
  {
    id: 'task-3',
    title: 'Complete 10-Question Python Quiz',
    subject: 'Python',
    time: '02:00 PM',
    durationMinutes: 30,
    priority: 'medium',
    completed: false,
  },
  {
    id: 'task-4',
    title: 'Review Daily Recall Flashcards (System Architecture)',
    subject: 'Daily Recall',
    time: '04:00 PM',
    durationMinutes: 20,
    priority: 'medium',
    completed: false,
  },
  {
    id: 'task-5',
    title: 'Synthesize Backpropagation Notes into Flashcards',
    subject: 'Machine Learning',
    time: '05:30 PM',
    durationMinutes: 40,
    priority: 'low',
    completed: false,
    bookRef: 'Deep Learning Foundations',
  },
];

export const QUIZ_BANK: QuizQuestion[] = [
  // System Architecture / Books
  {
    id: 'sys-1',
    subject: 'System Architecture',
    question: 'In single-leader database replication, what happens if the leader fails before asynchronous writes reach followers?',
    options: [
      'The client receives a database timeout error',
      'The unreplicated writes are lost when a new follower is promoted to leader',
      'The followers automatically halt all reads',
      'The writes are recovered automatically from the disk cache',
    ],
    correctIndex: 1,
    explanation: 'In asynchronous replication, the leader acknowledges writes before followers commit. If the leader fails before replication, un-replicated writes are lost upon failover.',
  },
  {
    id: 'sys-2',
    subject: 'System Architecture',
    question: 'What is the primary benefit of partitioning data by hash of key rather than key range?',
    options: [
      'It preserves fast lexicographical range queries',
      'It distributes keys uniformly across nodes to prevent hot spots',
      'It eliminates the need for secondary indexes',
      'It ensures synchronous replication across regions',
    ],
    correctIndex: 1,
    explanation: 'A good cryptographic or Murmur hash function distributes skewed keys uniformly, significantly reducing the probability of write or read hot spots.',
  },

  // Python
  {
    id: 'py-1',
    subject: 'Python',
    question: 'What is the output of the following Python expression?',
    codeSnippet: 'x = [1, 2, 3]\ny = x\ny.append(4)\nprint(len(x))',
    options: ['3', '4', 'TypeError', 'None'],
    correctIndex: 1,
    explanation: 'Lists in Python are mutable reference types. Assigning y = x copies the memory reference, so modifying y modifies x.',
  },
  {
    id: 'py-2',
    subject: 'Python',
    question: 'Which built-in function creates an iterator yielding pairs of (index, item)?',
    options: ['zip()', 'enumerate()', 'map()', 'filter()'],
    correctIndex: 1,
    explanation: 'enumerate(iterable, start=0) returns tuples containing an index count and items from the iterable.',
  },
  {
    id: 'py-3',
    subject: 'Python',
    question: 'What is the primary difference between a list and a tuple in Python?',
    options: [
      'Lists can store heterogeneous data, tuples cannot',
      'Lists are mutable; tuples are immutable',
      'Tuples have higher memory overhead than lists',
      'Lists cannot be nested inside dictionaries',
    ],
    correctIndex: 1,
    explanation: 'Tuples are immutable sequences, making them hashable and suitable as dictionary keys if elements are immutable.',
  },
  {
    id: 'py-4',
    subject: 'Python',
    question: 'What does the `*args` syntax inside a Python function definition accomplish?',
    options: [
      'Forces keyword-only arguments',
      'Packs arbitrary positional arguments into a tuple',
      'Creates a pointer to the memory address',
      'Unpacks a dictionary into local variables',
    ],
    correctIndex: 1,
    explanation: '*args gathers arbitrary positional arguments into a tuple inside the function.',
  },

  // Data Structures
  {
    id: 'dsa-1',
    subject: 'Data Structures',
    question: 'Which data structure is essential to implement Breadth-First Search (BFS)?',
    options: ['Stack', 'Queue', 'Min-Heap', 'Disjoint Set'],
    correctIndex: 1,
    explanation: 'BFS explores neighbor nodes level-by-level using a FIFO Queue to ensure closest vertices are evaluated first.',
  },
  {
    id: 'dsa-2',
    subject: 'Data Structures',
    question: 'What is the worst-case time complexity of searching an element in an unbalanced Binary Search Tree (BST)?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctIndex: 2,
    explanation: 'When a BST degrades into a linear chain (e.g. inserting sorted items), search degrades to O(n).',
  },
  {
    id: 'dsa-3',
    subject: 'Data Structures',
    question: 'In a Min-Heap with N elements, what is the time complexity of extracting the minimum element?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    correctIndex: 1,
    explanation: 'Inspecting the root is O(1), but bubbling down to restore the heap invariant takes O(log n).',
  },

  // Machine Learning
  {
    id: 'ml-1',
    subject: 'Machine Learning',
    question: 'What problem does Dropout aim to mitigate during deep neural network training?',
    options: ['Underfitting', 'Vanishing gradient', 'Overfitting', 'Data starvation'],
    correctIndex: 2,
    explanation: 'Dropout randomly zeroes out activations during forward passes, preventing co-adaptation of features.',
  },
  {
    id: 'ml-2',
    subject: 'Machine Learning',
    question: 'Which activation function is most widely used in hidden layers of modern deep feedforward networks?',
    options: ['Sigmoid', 'Tanh', 'ReLU (Rectified Linear Unit)', 'Step Function'],
    correctIndex: 2,
    explanation: 'ReLU (max(0, x)) computes quickly and prevents vanishing gradients on positive inputs.',
  },
];

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    title: 'Distributed Systems: Reliable Replication Models',
    subject: 'System Architecture',
    tags: ['Architecture', 'Replication', 'Distributed'],
    updatedAt: 'Today, 10:15 AM',
    bookRef: 'Designing Data-Intensive Applications',
    content: `Key takeaways from Chapter 5 of Designing Data-Intensive Applications:
1. Leaders & Followers: Master-slave replication routes all writes through a designated leader node, while read queries can be load-balanced across multiple read-replicas.
2. Synchronous vs Asynchronous: Synchronous replication guarantees zero data loss upon failover, but one slow or unreachable follower blocks the entire write pipeline. Most production systems use semi-synchronous or asynchronous models.
3. Split-Brain Condition: If two nodes both believe they are the active leader, conflicting writes occur. Fencing tokens and quorum consensus are mandatory to mitigate this hazard.
4. Eventual Consistency: Read-after-write consistency and monotonic reads must be carefully designed into frontend user sessions.`,
  },
  {
    id: 'note-2',
    title: 'Python Memory Architecture & Closures',
    subject: 'Python',
    tags: ['Python', 'Internals', 'Memory'],
    updatedAt: 'Yesterday, 04:30 PM',
    content: `Python Memory Management & Closure Notes:
1. CPython Private Heap: Objects and data structures reside on a private heap managed by the CPython memory manager.
2. Reference Counting: Every object holds an ob_refcnt counter. When ref count hits zero, the memory is deallocated immediately.
3. Generational Garbage Collection: Generations 0, 1, 2 detect reference cycles that reference counting alone cannot resolve.
4. Python Closures: An inner nested function retains access to variables from its enclosing lexical scope even after the outer function finishes execution. The closure variables are stored in the inner function's __closure__ attribute.`,
  },
  {
    id: 'note-3',
    title: 'Graph Traversals: BFS vs DFS & Shortest Path',
    subject: 'Data Structures',
    tags: ['DSA', 'Algorithms', 'Graphs'],
    updatedAt: 'Sep 14, 02:20 PM',
    bookRef: 'Grokking Algorithms',
    content: `Graph Algorithms Summary:
- Breadth-First Search (BFS): Uses a FIFO Queue. Explores level by level. Guarantees finding the shortest unweighted path from source S to destination D. Time: O(V + E), Space: O(V).
- Depth-First Search (DFS): Uses recursion or an explicit LIFO Stack. Backtracks deeply. Excellent for topological sorting, cycle detection, and connected components.
- Dijkstra's Algorithm: Uses a Priority Queue (Min-Heap). Finds shortest paths from a single source in graphs with non-negative edge weights. Time: O((V + E) log V).`,
  },
];

export const INITIAL_COMMAND_HISTORY: VoiceCommandResult[] = [
  {
    id: 'cmd-1',
    transcript: 'Open my library',
    intent: 'OPEN_LIBRARY',
    confidence: 0.99,
    parameters: {},
    actionSummary: 'Opened My Library (4 Books / 1 In-Progress)',
    timestamp: '10:14 AM',
    source: 'rule_engine',
    status: 'executed',
  },
  {
    id: 'cmd-2',
    transcript: 'Explain this section',
    intent: 'EXPLAIN_SECTION',
    confidence: 0.96,
    parameters: { bookId: 'book-1' },
    actionSummary: 'Contextual AI breakdown for Designing Data-Intensive Applications (Ch 5)',
    timestamp: '10:10 AM',
    source: 'gemini_nlu',
    status: 'executed',
    contextSnapshot: {
      activeTab: 'reader',
      currentBookTitle: 'Designing Data-Intensive Applications',
      currentPage: 142,
    },
  },
  {
    id: 'cmd-3',
    transcript: 'Start a Python quiz with 10 questions',
    intent: 'START_QUIZ',
    confidence: 0.98,
    parameters: { subject: 'Python', questionCount: 10 },
    actionSummary: 'Configured & opened Python Quiz (10 questions)',
    timestamp: '9:42 AM',
    source: 'gemini_nlu',
    status: 'executed',
  },
  {
    id: 'cmd-4',
    transcript: 'Review daily recall flashcards',
    intent: 'OPEN_DAILY_RECALL',
    confidence: 0.97,
    parameters: {},
    actionSummary: 'Launched Spaced Repetition Daily Recall deck',
    timestamp: '9:25 AM',
    source: 'rule_engine',
    status: 'executed',
  },
];

export const INITIAL_CHAT_HISTORY: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content: "Hi Alex! I'm your Scirian AI Tutor. I can help answer complex questions, explain concepts from your library books, quiz you on topics, or guide your study sessions. What are you studying today?",
    timestamp: '10:00 AM',
  },
  {
    id: 'msg-2',
    role: 'user',
    content: 'Can you summarize how single-leader replication works in distributed databases?',
    timestamp: '10:02 AM',
  },
  {
    id: 'msg-3',
    role: 'assistant',
    content: "In single-leader replication (also known as active-passive):\n\n1. **Writes**: Clients only write to the designated leader node.\n2. **Replication Stream**: The leader appends changes to its write-ahead log and streams them to all follower nodes.\n3. **Reads**: Clients can read from either the leader or any follower replica to scale read throughput.\n4. **Trade-off**: High read scalability, but asynchronous replication introduces replication lag and potential stale reads.",
    timestamp: '10:03 AM',
  },
];

export const SAMPLE_VOICE_PROMPTS = [
  { text: 'Open my library.', intent: 'OPEN_LIBRARY', label: 'My Library', context: 'global' },
  { text: 'Explain this section.', intent: 'EXPLAIN_SECTION', label: 'Explain Section', context: 'reader' },
  { text: 'Summarize this page.', intent: 'SUMMARIZE_PAGE', label: 'Summarize Page', context: 'reader' },
  { text: 'Start a Python quiz.', intent: 'START_QUIZ', label: 'Python Quiz', context: 'global' },
  { text: 'Review daily recall.', intent: 'OPEN_DAILY_RECALL', label: 'Daily Recall', context: 'global' },
  { text: 'Ask AI tutor how backpropagation works.', intent: 'OPEN_AI_TUTOR', label: 'AI Tutor', context: 'global' },
  { text: 'Create a study plan.', intent: 'CREATE_STUDY_PLAN', label: 'Plan Session', context: 'global' },
  { text: 'Summarize my notes.', intent: 'SUMMARIZE_NOTES', label: 'Summarize Notes', context: 'notes' },
  { text: 'What can you do?', intent: 'SHOW_HELP', label: 'Command Guide', context: 'global' },
];
