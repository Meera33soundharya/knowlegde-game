export const questionBank = {
    technical: {
        easy: [
            {
                question: "What is a variable in programming?",
                answer: "A variable is a container that stores data values in a program.",
                explanation: "Think of a variable like a labeled box where you can store information.",
                options: ["A container that stores data values", "A type of loop", "A computer processor", "An error message"]
            },
            {
                question: "What does RAM stand for?",
                answer: "Random Access Memory",
                explanation: "RAM is your computer's short-term memory.",
                options: ["Random Access Memory", "Read And Modify", "Rapid Application Memory", "Remote Access Module"]
            },
            // ... (keeping a smaller subset for brevity, the AI will generate more)
            {
                question: "What does HTTP stand for?",
                answer: "HyperText Transfer Protocol",
                explanation: "HTTP is the set of rules that allows your web browser to communicate with websites.",
                options: ["HyperText Transfer Protocol", "High Tech Programming Protocol", "Home Transfer Text Protocol", "Hyper Terminal Transport Process"]
            }
        ],
        medium: [
            {
                question: "What is the difference between a compiler and an interpreter?",
                answer: "A compiler translates the entire program before execution, an interpreter translates line by line",
                explanation: "Compiled programs run faster but take time to compile.",
                options: ["A compiler translates the entire program before execution, an interpreter translates line by line", "They are the same thing", "A compiler is faster to start", "An interpreter creates .exe files"]
            }
        ],
        hard: [
            {
                question: "What is the time complexity of binary search?",
                answer: "O(log n)",
                explanation: "Binary search eliminates half the search space in each step.",
                options: ["O(log n)", "O(n)", "O(n²)", "O(1)"]
            }
        ]
    },
    gk: {
        easy: [
            {
                question: "What is the largest planet in our solar system?",
                answer: "Jupiter",
                explanation: "Jupiter is a gas giant and is more than twice as massive as all other planets combined.",
                options: ["Jupiter", "Saturn", "Earth", "Neptune"]
            }
        ],
        medium: [
            {
                question: "What is the main product of photosynthesis?",
                answer: "Glucose and oxygen",
                explanation: "Photosynthesis converts sunlight, water, and CO₂ into glucose and oxygen.",
                options: ["Glucose and oxygen", "Water and nitrogen", "Carbon dioxide and sugar", "Protein and minerals"]
            }
        ],
        hard: [
            {
                question: "What triggered World War I?",
                answer: "Assassination of Archduke Franz Ferdinand",
                explanation: "The assassination activated alliance systems, pulling multiple nations into war.",
                options: ["Assassination of Archduke Franz Ferdinand", "Pearl Harbor attack", "Fall of Berlin Wall", "Stock market crash"]
            }
        ]
    }
};
