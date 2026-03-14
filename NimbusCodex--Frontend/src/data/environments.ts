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
    description:
      'Foundational Python scripting and general-purpose programming.',
    libraries: ['os', 'sys', 'json', 'pathlib', 'datetime'],
    color: '#3b82f6',
    language: 'python',
    template: `# Python Basic — CloudLab
print("Hello, CloudLab!")

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
    libraries: [
      'tensorflow',
      'torch',
      'transformers',
      'scikit-learn',
      'openai',
    ],
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
    std::vector<int> nums = {5,2,8,1,9,3};

    std::sort(nums.begin(), nums.end());

    std::cout << "Sorted: ";
    for (int n : nums)
        std::cout << n << " ";

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

    List<Integer> numbers = List.of(1,2,3,4,5,6,7,8,9,10);

    List<Integer> evens = numbers.stream()
      .filter(n -> n % 2 == 0)
      .collect(Collectors.toList());

    System.out.println("Even numbers: " + evens);
    System.out.println("Hello from CloudLab!");
  }
}
`,
  },
];
