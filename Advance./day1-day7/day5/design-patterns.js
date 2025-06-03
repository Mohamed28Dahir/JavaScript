/*
 * Day 5: Design Patterns in JavaScript
 * 
 * Common Design Patterns:
 * 1. Factory Pattern
 * 2. Singleton Pattern
 * 3. Observer Pattern
 * 4. Module Pattern
 * 5. Prototype Pattern
 */

// 1. Factory Pattern
class Car {
    constructor(make, model, year) {
        this.make = make;
        this.model = model;
        this.year = year;
    }
    
    getInfo() {
        return `${this.year} ${this.make} ${this.model}`;
    }
}

class Truck {
    constructor(make, model, year, capacity) {
        this.make = make;
        this.model = model;
        this.year = year;
        this.capacity = capacity;
    }
    
    getInfo() {
        return `${this.year} ${this.make} ${this.model} with ${this.capacity}kg capacity`;
    }
}

// Vehicle Factory
class VehicleFactory {
    createVehicle(type, make, model, year, capacity) {
        switch(type.toLowerCase()) {
            case 'car':
                return new Car(make, model, year);
            case 'truck':
                return new Truck(make, model, year, capacity);
            default:
                throw new Error('Vehicle type not supported');
        }
    }
}

// Usage of Factory Pattern
const factory = new VehicleFactory();
const myCar = factory.createVehicle('car', 'Toyota', 'Camry', 2022);
const myTruck = factory.createVehicle('truck', 'Ford', 'F150', 2022, 1500);

// 2. Singleton Pattern
class Database {
    constructor() {
        if (Database.instance) {
            return Database.instance;
        }
        
        this.connections = 0;
        Database.instance = this;
    }
    
    connect() {
        this.connections++;
        return `Database connection #${this.connections} established`;
    }
    
    disconnect() {
        if (this.connections > 0) {
            this.connections--;
            return `Database connection closed. ${this.connections} remaining`;
        }
        return "No connections to close";
    }
}

// Usage of Singleton Pattern
const db1 = new Database();
const db2 = new Database();
console.log(db1 === db2); // true - same instance

// 3. Observer Pattern
class NewsAgency {
    constructor() {
        this.subscribers = [];
    }
    
    subscribe(observer) {
        this.subscribers.push(observer);
    }
    
    unsubscribe(observer) {
        this.subscribers = this.subscribers.filter(sub => sub !== observer);
    }
    
    notify(news) {
        this.subscribers.forEach(observer => observer.update(news));
    }
}

class NewsChannel {
    constructor(name) {
        this.name = name;
    }
    
    update(news) {
        console.log(`${this.name} received news: ${news}`);
    }
}

// Usage of Observer Pattern
const newsAgency = new NewsAgency();
const channel1 = new NewsChannel('Channel 1');
const channel2 = new NewsChannel('Channel 2');

newsAgency.subscribe(channel1);
newsAgency.subscribe(channel2);
newsAgency.notify('Breaking News!');

// 4. Module Pattern
const ShoppingCart = (function() {
    // Private variables
    let items = [];
    
    // Private methods
    function calculateTotal() {
        return items.reduce((total, item) => total + item.price, 0);
    }
    
    // Public interface
    return {
        addItem: function(item) {
            items.push(item);
        },
        
        removeItem: function(index) {
            items.splice(index, 1);
        },
        
        getItems: function() {
            return [...items];
        },
        
        getTotal: function() {
            return calculateTotal();
        }
    };
})();

// Usage of Module Pattern
ShoppingCart.addItem({ name: 'Book', price: 29.99 });
ShoppingCart.addItem({ name: 'Pen', price: 3.99 });

// 5. Prototype Pattern
const carPrototype = {
    init: function(make, model, year) {
        this.make = make;
        this.model = model;
        this.year = year;
    },
    
    getInfo: function() {
        return `${this.year} ${this.make} ${this.model}`;
    }
};

function createCar(make, model, year) {
    const car = Object.create(carPrototype);
    car.init(make, model, year);
    return car;
}

// Usage of Prototype Pattern
const car1 = createCar('Honda', 'Civic', 2023);
const car2 = createCar('Tesla', 'Model 3', 2023);

/*
 * Practice Exercise: Implementing a Notification System
 * 
 * Combine Observer Pattern with Factory Pattern to create
 * a flexible notification system
 */

// Notification Types
class EmailNotification {
    constructor(recipient) {
        this.recipient = recipient;
    }
    
    send(message) {
        console.log(`Sending email to ${this.recipient}: ${message}`);
    }
}

class SMSNotification {
    constructor(phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    send(message) {
        console.log(`Sending SMS to ${this.phoneNumber}: ${message}`);
    }
}

// Notification Factory
class NotificationFactory {
    createNotification(type, contact) {
        switch(type.toLowerCase()) {
            case 'email':
                return new EmailNotification(contact);
            case 'sms':
                return new SMSNotification(contact);
            default:
                throw new Error('Notification type not supported');
        }
    }
}

// Notification System (Observer)
class NotificationSystem {
    constructor() {
        this.subscribers = new Map();
        this.factory = new NotificationFactory();
    }
    
    subscribe(type, contact) {
        const notification = this.factory.createNotification(type, contact);
        if (!this.subscribers.has(type)) {
            this.subscribers.set(type, []);
        }
        this.subscribers.get(type).push(notification);
    }
    
    notify(message, type = null) {
        if (type) {
            // Notify specific type
            const typeSubscribers = this.subscribers.get(type) || [];
            typeSubscribers.forEach(subscriber => subscriber.send(message));
        } else {
            // Notify all
            this.subscribers.forEach(typeSubscribers => {
                typeSubscribers.forEach(subscriber => subscriber.send(message));
            });
        }
    }
}

// Usage of Combined Patterns
const notificationSystem = new NotificationSystem();

notificationSystem.subscribe('email', 'user@example.com');
notificationSystem.subscribe('sms', '+1234567890');
notificationSystem.subscribe('email', 'admin@example.com');

// Notify all subscribers
notificationSystem.notify('System maintenance in 1 hour');

// Notify only email subscribers
notificationSystem.notify('Please check your email for details', 'email'); 