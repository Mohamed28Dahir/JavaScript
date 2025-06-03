/*
 * Day 16: Object-Oriented Programming in JavaScript
 * Topics covered:
 * 1. Classes and Constructors
 * 2. Inheritance
 * 3. Polymorphism
 * 4. Encapsulation
 * 5. Abstract Classes
 */

// 1. Shape Hierarchy Implementation
class Shape {
    constructor(color = 'black') {
        if (this.constructor === Shape) {
            throw new Error('Shape is an abstract class');
        }
        this.color = color;
    }
    
    // Abstract methods
    getArea() {
        throw new Error('getArea() must be implemented');
    }
    
    getPerimeter() {
        throw new Error('getPerimeter() must be implemented');
    }
    
    // Concrete methods
    setColor(color) {
        this.color = color;
    }
    
    getColor() {
        return this.color;
    }
    
    toString() {
        return `${this.constructor.name} (${this.color})`;
    }
}

class Circle extends Shape {
    constructor(radius, color) {
        super(color);
        this.radius = radius;
    }
    
    getArea() {
        return Math.PI * this.radius ** 2;
    }
    
    getPerimeter() {
        return 2 * Math.PI * this.radius;
    }
}

class Rectangle extends Shape {
    constructor(width, height, color) {
        super(color);
        this.width = width;
        this.height = height;
    }
    
    getArea() {
        return this.width * this.height;
    }
    
    getPerimeter() {
        return 2 * (this.width + this.height);
    }
}

class Triangle extends Shape {
    constructor(base, height, color) {
        super(color);
        this.base = base;
        this.height = height;
    }
    
    getArea() {
        return (this.base * this.height) / 2;
    }
    
    getPerimeter() {
        // Assuming an isosceles triangle for simplicity
        const side = Math.sqrt((this.base/2)**2 + this.height**2);
        return this.base + 2 * side;
    }
}

// 2. Shape Factory
class ShapeFactory {
    static createShape(type, ...params) {
        switch(type.toLowerCase()) {
            case 'circle':
                return new Circle(...params);
            case 'rectangle':
                return new Rectangle(...params);
            case 'triangle':
                return new Triangle(...params);
            default:
                throw new Error(`Unknown shape type: ${type}`);
        }
    }
}

// 3. Shape Collection Manager
class ShapeManager {
    constructor() {
        this.shapes = new Map();
    }
    
    addShape(id, shape) {
        if (!(shape instanceof Shape)) {
            throw new Error('Invalid shape object');
        }
        this.shapes.set(id, shape);
    }
    
    removeShape(id) {
        return this.shapes.delete(id);
    }
    
    getShape(id) {
        return this.shapes.get(id);
    }
    
    getAllShapes() {
        return Array.from(this.shapes.values());
    }
    
    getTotalArea() {
        return Array.from(this.shapes.values())
            .reduce((sum, shape) => sum + shape.getArea(), 0);
    }
    
    getShapesByType(type) {
        return Array.from(this.shapes.values())
            .filter(shape => shape.constructor.name === type);
    }
}

// 4. Observable Shape (Observer Pattern)
class ObservableShape extends Shape {
    constructor(color) {
        super(color);
        this.observers = new Set();
    }
    
    addObserver(observer) {
        this.observers.add(observer);
    }
    
    removeObserver(observer) {
        this.observers.delete(observer);
    }
    
    notifyObservers() {
        this.observers.forEach(observer => 
            observer.update(this)
        );
    }
    
    setColor(color) {
        super.setColor(color);
        this.notifyObservers();
    }
}

// 5. Shape Decorator (Decorator Pattern)
class ShapeDecorator extends Shape {
    constructor(shape) {
        super();
        this.shape = shape;
    }
    
    getArea() {
        return this.shape.getArea();
    }
    
    getPerimeter() {
        return this.shape.getPerimeter();
    }
}

class BorderDecorator extends ShapeDecorator {
    constructor(shape, borderWidth = 1) {
        super(shape);
        this.borderWidth = borderWidth;
    }
    
    getPerimeter() {
        return super.getPerimeter() + this.borderWidth * 2;
    }
}

// Usage Examples
const shapeManager = new ShapeManager();

// Create shapes using factory
const circle = ShapeFactory.createShape('circle', 5, 'red');
const rectangle = ShapeFactory.createShape('rectangle', 4, 6, 'blue');
const triangle = ShapeFactory.createShape('triangle', 3, 4, 'green');

// Add shapes to manager
shapeManager.addShape('circle1', circle);
shapeManager.addShape('rect1', rectangle);
shapeManager.addShape('tri1', triangle);

// Calculate total area
console.log('Total area:', shapeManager.getTotalArea());

// Get all circles
const circles = shapeManager.getShapesByType('Circle');
console.log('Circles:', circles);

// Create decorated shape
const borderedCircle = new BorderDecorator(circle, 2);
console.log('Bordered circle perimeter:', borderedCircle.getPerimeter());

// Export classes for testing
export {
    Shape,
    Circle,
    Rectangle,
    Triangle,
    ShapeFactory,
    ShapeManager,
    ObservableShape,
    ShapeDecorator,
    BorderDecorator
}; 