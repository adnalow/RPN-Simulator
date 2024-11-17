# 🎮 Reverse Polish Notation (RPN) Simulator  


## 📝 **Project Overview**  
The objective of this project is to **visualize and simulate** the process behind Reverse Polish Notation (RPN). The **Shunting Yard Algorithm** and **Stack-based Approach** serve as the foundation for this project's functionality. This interactive arcade-inspired simulation provides users with a fun and educational way to explore the concepts behind RPN.  

---

## 🏗️ **System Architecture**  

### **Key Components**  

#### **1. Frontend**  
- **Technologies Used**: HTML, CSS, JavaScript  
- **Responsibilities**:  
  - Render the arcade-inspired user interface (UI).  
  - Provide interactive elements for an engaging user experience (UX).  
  - Visualize the step-by-step process of infix to postfix conversion and postfix evaluation.  

#### **2. Simulation Logic (JavaScript)**  
- **Responsibilities**:  
  - Convert infix expressions to postfix using the Shunting Yard Algorithm.  
  - Evaluate postfix expressions using a stack-based approach.  
  - Provide detailed step-by-step visualization of each operation performed.  

#### **3. UI/UX Design**  
1. **Arcade Interface**: Mimics an arcade machine, offering a playful experience.  
2. **Input Areas**: Allows users to input mathematical expressions for evaluation.  
3. **Output Visualization**: Displays simulation steps clearly for better understanding.  
4. **Interactive Controls**: Includes arcade-style buttons and a token insertion mechanism.  

#### **4. Component Interactions**  
- **Flow**:  
  1. User inputs an expression via the arcade-style UI.  
  2. JavaScript processes the input, converting it to postfix notation.  
  3. The postfix expression is evaluated step-by-step.  
  4. Results and visualizations are displayed to the user.  

---

## 💡 **Applied Computer Science Concepts**  
### **Reverse Polish Notation (RPN)**  
RPN is a mathematical notation where operators follow their operands, eliminating the need for parentheses to dictate operation order. For example:  
- Infix: `3 + 4` → Postfix: `3 4 +`  

The evaluation process uses a **stack** for efficient computation, making RPN popular in calculators and stack-based programming languages.  

---

## ⚙️ **Algorithms Used**  
1. **Shunting Yard Algorithm**  
   - Converts infix expressions to postfix notation.  
2. **Stack-Based Approach**  
   - Evaluates postfix expressions step-by-step.  

---

## 🔒 **Security Mechanisms**  
- **Input Validation**: Ensures clean user input by:  
  - Removing invalid characters.  
  - Restricting inputs to numbers, operators, and parentheses.  
- **Error Handling**: Prevents crashes by detecting invalid expressions and displaying clear error messages.  

---

## 🎨 **Development Process and Design Decisions**  
### **Influence of Reverse Polish Notation (RPN)**  
1. **Algorithm Choice**  
   - Selected the Shunting Yard Algorithm for infix to postfix conversion.  
   - Used the Stack-Based Approach for postfix evaluation.  

2. **System Workflow**  
   - Designed the UI to mirror the sequential nature of RPN evaluation.  

3. **Educational Approach**  
   - Focused on demonstrating stack behavior to help users understand the algorithms.  

---

## ✅ **Correctness and Efficiency**  
1. **Correctness**  
   - Verified algorithms with various test cases, including nested parentheses, precedence rules, and invalid inputs.  

2. **Efficiency**  
   - Optimized the Shunting Yard Algorithm and stack operations for constant time complexity (O(1)).  
   - Ensured lightweight client-side execution to minimize latency.  

---

## 🚀 **How to Run the Project**  

1. 🎲 Get your coin from the coin box.  
2. 🪙 Insert your coin into the coin slot.  
3. ▶️ Press the "Start" button.  
4. 📥 Input your mathematical expression.  
5. ▶️ Press the "Start" button again.  
6. 🔄 Press the "Next" button to progress through each step.  
7. ✅ View the final result and repeat as desired!  

---

## 👨‍💻 **Contributors**  
- **Instructor**: Ms. Fatima Marie Agdon  
- **Project Manager**: Reinier Adrian Luna  
- **Frontend Developer**: Kim Mathew Bautista  
- **Backend Developers**:  
  - Gian Ezekiel Gersaniba  
  - Francois Louise Mosuela  

---

## 🙏 **Acknowledgments**  
The team would like to thank:  
- **God** for providing strength and guidance throughout the project.  
- **Ms. Fatima Marie Agdon** for her teachings and mentorship.  

---
