// Basic Types
let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";
let list: number[] = [1, 2, 3];
let tuple: [string, number] = ["hello", 10];

// Enums
enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT"
}

// Interfaces
interface User {
    id: number;
    name: string;
    email: string;
    age?: number; // Optional property
    readonly createdAt: Date;
}

// Type Aliases
type Point = {
    x: number;
    y: number;
};

type UserRole = "admin" | "user" | "guest";

// Generic Types
interface Response<T> {
    data: T;
    status: number;
    message: string;
}

// Union Types
type Result = string | number;
type Nullable<T> = T | null;

// Function Types
interface MathFunc {
    (x: number, y: number): number;
}

// Class with Interface
interface Animal {
    name: string;
    makeSound(): void;
}

class Dog implements Animal {
    constructor(public name: string) {}

    makeSound(): void {
        console.log("Woof!");
    }
}

// Generic Function
function identity<T>(arg: T): T {
    return arg;
}

// Utility Types
interface Todo {
    title: string;
    description: string;
    completed: boolean;
}

type PartialTodo = Partial<Todo>;
type ReadonlyTodo = Readonly<Todo>;
type TodoPreview = Pick<Todo, "title" | "completed">;
type TodoWithoutDescription = Omit<Todo, "description">;

// Export types and interfaces
export {
    Direction,
    User,
    Point,
    UserRole,
    Response,
    Result,
    Nullable,
    MathFunc,
    Animal,
    Dog,
    Todo,
    PartialTodo,
    ReadonlyTodo,
    TodoPreview,
    TodoWithoutDescription
}; 