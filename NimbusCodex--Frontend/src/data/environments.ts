export interface Environment {
  id: string;
  name: string;
  icon: string;
  description: string;
  libraries: string[];
  color: string;
  language: string;
  template: string;
}

export const environments: Environment[] = [
  {
    id: 'python-basic',
    name: 'Python Basic',
    icon: '🐍',
    description: 'Foundational Python scripting and general-purpose programming.',
    libraries: ['os', 'sys', 'json', 'pathlib', 'datetime'],
    color: '#3b82f6',
    language: 'python',
    template: `# Python Basic — CloudLab
print("Hello, CloudLab!")

# Example: Fibonacci series
def fibonacci(n: int) -> list[int]:
    seq = [0, 1]
    while len(seq) < n:
        seq.append(seq[-1] + seq[-2])
    return seq

print(fibonacci(10))
`,
  },
  {
    id: 'python-ds',
    name: 'Python — Data Science',
    icon: '📊',
    description: 'ML & Data analysis with pandas, numpy and more.',
    libraries: ['numpy', 'pandas', 'scikit-learn', 'langchain', 'matplotlib'],
    color: '#4f46e5',
    language: 'python',
    template: `# Python Data Science — CloudLab
import numpy as np
import pandas as pd

# Generate sample data
data = np.random.randn(100, 3)
df = pd.DataFrame(data, columns=['A', 'B', 'C'])

print(df.describe())
print("\\nCorrelation Matrix:")
print(df.corr())
`,
  },
  {
    id: 'python-ml',
    name: 'Python ML/AI',
    icon: '🤖',
    description: 'Machine learning, deep learning, and AI experimentation.',
    libraries: ['tensorflow', 'torch', 'transformers', 'scikit-learn', 'openai'],
    color: '#7c3aed',
    language: 'python',
    template: `# Python ML/AI — CloudLab
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.2, random_state=42
)

clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)
predictions = clf.predict(X_test)

print(f"Accuracy: {accuracy_score(y_test, predictions):.4f}")
`,
  },
  {
    id: 'node-ts',
    name: 'Node.js + TypeScript',
    icon: '🟨',
    description: 'Type-safe server-side JavaScript with Node and TypeScript.',
    libraries: ['typescript', 'ts-node', 'express', 'zod', 'dotenv'],
    color: '#f59e0b',
    language: 'typescript',
    template: `// Node.js + TypeScript — CloudLab
interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: 'Alice', email: 'alice@cloudlab.dev' },
  { id: 2, name: 'Bob',   email: 'bob@cloudlab.dev'   },
];

function findUser(id: number): User | undefined {
  return users.find(u => u.id === id);
}

console.log(findUser(1));
console.log(\`Total users: \${users.length}\`);
`,
  },
  {
    id: 'node-fullstack',
    name: 'Node.js Full Stack',
    icon: '🌐',
    description: 'Full-stack JavaScript with Express, Prisma, and more.',
    libraries: ['express', 'prisma', 'socket.io', 'jsonwebtoken', 'cors'],
    color: '#10b981',
    language: 'typescript',
    template: `// Node.js Full Stack — CloudLab
import express from 'express';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(3000, () => {
  console.log('CloudLab server running on http://localhost:3000');
});
`,
  },
  {
    id: 'cpp',
    name: 'C / C++',
    icon: '⚙️',
    description: 'Systems programming with C and modern C++20.',
    libraries: ['<iostream>', '<vector>', '<algorithm>', '<memory>', 'boost'],
    color: '#ef4444',
    language: 'cpp',
    template: `// C++ — CloudLab
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> nums = {5, 2, 8, 1, 9, 3};
    std::sort(nums.begin(), nums.end());

    std::cout << "Sorted: ";
    for (int n : nums) std::cout << n << " ";
    std::cout << "\\nHello, CloudLab!" << std::endl;

    return 0;
}
`,
  },
  {
    id: 'java',
    name: 'Java',
    icon: '☕',
    description: 'Enterprise-grade Java with Spring Boot and Maven.',
    libraries: ['Spring Boot', 'Hibernate', 'Maven', 'Lombok', 'JUnit 5'],
    color: '#f97316',
    language: 'java',
    template: `// Java — CloudLab
import java.util.List;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

        List<Integer> evens = numbers.stream()
            .filter(n -> n % 2 == 0)
            .collect(Collectors.toList());

        System.out.println("Even numbers: " + evens);
        System.out.println("Hello from CloudLab!");
    }
}
`,
  },
  {
    id: 'go',
    name: 'Go',
    icon: '🐹',
    description: 'Concurrent, statically typed Go for cloud-native apps.',
    libraries: ['gin', 'gorm', 'cobra', 'zap', 'testify'],
    color: '#06b6d4',
    language: 'go',
    template: `// Go — CloudLab
package main

import (
\t"fmt"
\t"sort"
)

func fibonacci(n int) []int {
\tseq := []int{0, 1}
\tfor len(seq) < n {
\t\tl := len(seq)
\t\tseq = append(seq, seq[l-1]+seq[l-2])
\t}
\treturn seq
}

func main() {
\tnums := []int{5, 1, 9, 3, 7}
\tsort.Ints(nums)
\tfmt.Println("Sorted:", nums)
\tfmt.Println("Fibonacci(8):", fibonacci(8))
\tfmt.Println("Hello, CloudLab!")
}
`,
  },
  {
    id: 'rust',
    name: 'Rust',
    icon: '🦀',
    description: 'Memory-safe systems programming with zero-cost abstractions.',
    libraries: ['tokio', 'serde', 'actix-web', 'clap', 'rayon'],
    color: '#b45309',
    language: 'rust',
    template: `// Rust — CloudLab
fn fibonacci(n: u64) -> u64 {
    match n {
        0 => 0,
        1 => 1,
        _ => fibonacci(n - 1) + fibonacci(n - 2),
    }
}

fn main() {
    let mut nums = vec![5, 1, 9, 3, 7, 2, 8];
    nums.sort();

    println!("Sorted: {:?}", nums);
    println!("fibonacci(10) = {}", fibonacci(10));
    println!("Hello, CloudLab!");
}
`,
  },
];
