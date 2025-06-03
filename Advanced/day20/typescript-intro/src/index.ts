import {
    User,
    Point,
    Direction,
    UserRole,
    Response,
    Dog,
    Todo
} from './types';

// Example usage of types and interfaces
const user: User = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    createdAt: new Date()
};

const point: Point = {
    x: 10,
    y: 20
};

const direction: Direction = Direction.Up;
const role: UserRole = "admin";

// Generic response example
const response: Response<User> = {
    data: user,
    status: 200,
    message: "Success"
};

// Class instance
const dog = new Dog("Rex");
dog.makeSound();

// Function with type annotations
function calculateDistance(p1: Point, p2: Point): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// Array methods with types
const numbers: number[] = [1, 2, 3, 4, 5];
const doubled: number[] = numbers.map((n: number): number => n * 2);
const sum: number = numbers.reduce((acc: number, curr: number): number => acc + curr, 0);

// Async function with types
async function fetchUser(id: number): Promise<User> {
    try {
        const response = await fetch(`https://api.example.com/users/${id}`);
        const data: User = await response.json();
        return data;
    } catch (error) {
        throw new Error(`Failed to fetch user: ${error}`);
    }
}

// Todo management example
const todos: Todo[] = [];

function addTodo(title: string, description: string): void {
    const todo: Todo = {
        title,
        description,
        completed: false
    };
    todos.push(todo);
}

function toggleTodo(index: number): void {
    if (index >= 0 && index < todos.length) {
        todos[index].completed = !todos[index].completed;
    }
}

function getTodoCount(): number {
    return todos.length;
}

function getCompletedTodos(): Todo[] {
    return todos.filter((todo: Todo): boolean => todo.completed);
}

// Export functionality
export {
    calculateDistance,
    fetchUser,
    addTodo,
    toggleTodo,
    getTodoCount,
    getCompletedTodos
}; 