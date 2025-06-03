// Day 14: Final Project - Contact Management System
// ============================================

// Contact Management System that uses everything we've learned

// Contact Class (using object literal for simplicity)
const ContactManager = {
    // Store contacts array
    contacts: [],
    
    // Add a new contact
    addContact(name, email, phone, type = "personal") {
        const newContact = {
            id: Date.now(), // unique ID using timestamp
            name,
            email,
            phone,
            type,
            createdAt: new Date().toLocaleString()
        };
        
        this.contacts.push(newContact);
        console.log("Contact added successfully:", newContact.name);
        return newContact;
    },
    
    // Delete a contact by ID
    deleteContact(id) {
        const index = this.contacts.findIndex(contact => contact.id === id);
        if (index !== -1) {
            const deleted = this.contacts.splice(index, 1)[0];
            console.log("Contact deleted successfully:", deleted.name);
            return true;
        }
        console.log("Contact not found!");
        return false;
    },
    
    // Update a contact
    updateContact(id, updatedInfo) {
        const contact = this.contacts.find(contact => contact.id === id);
        if (contact) {
            Object.assign(contact, updatedInfo);
            console.log("Contact updated successfully:", contact.name);
            return true;
        }
        console.log("Contact not found!");
        return false;
    },
    
    // Search contacts by name
    searchContacts(query) {
        const results = this.contacts.filter(contact => 
            contact.name.toLowerCase().includes(query.toLowerCase())
        );
        return results;
    },
    
    // Get all contacts of a specific type
    getContactsByType(type) {
        return this.contacts.filter(contact => contact.type === type);
    },
    
    // Display all contacts
    displayContacts() {
        if (this.contacts.length === 0) {
            console.log("No contacts found!");
            return;
        }
        
        console.log("\nAll Contacts:");
        console.log("=============");
        
        this.contacts.forEach(contact => {
            console.log(`
Name: ${contact.name}
Email: ${contact.email}
Phone: ${contact.phone}
Type: ${contact.type}
Created: ${contact.createdAt}
-------------------`);
        });
    }
};

// Let's test our Contact Management System!
console.log("Contact Management System Demo");
console.log("=============================");

// 1. Adding contacts
console.log("\n1. Adding contacts:");
ContactManager.addContact("John Doe", "john@example.com", "555-1234", "personal");
ContactManager.addContact("Jane Smith", "jane@company.com", "555-5678", "business");
ContactManager.addContact("Bob Wilson", "bob@example.com", "555-9012", "personal");

// 2. Display all contacts
console.log("\n2. Current contact list:");
ContactManager.displayContacts();

// 3. Search for contacts
console.log("\n3. Searching for 'john':");
const searchResults = ContactManager.searchContacts("john");
console.log("Search results:", searchResults);

// 4. Update a contact
console.log("\n4. Updating Jane's contact:");
const janeContact = ContactManager.contacts.find(c => c.name === "Jane Smith");
ContactManager.updateContact(janeContact.id, {
    phone: "555-9999",
    email: "jane.smith@company.com"
});

// 5. Get contacts by type
console.log("\n5. Business contacts:");
const businessContacts = ContactManager.getContactsByType("business");
console.log(businessContacts);

// 6. Delete a contact
console.log("\n6. Deleting Bob's contact:");
const bobContact = ContactManager.contacts.find(c => c.name === "Bob Wilson");
ContactManager.deleteContact(bobContact.id);

// 7. Final contact list
console.log("\n7. Final contact list:");
ContactManager.displayContacts();

// This project demonstrates:
// 1. Objects and Object Methods
// 2. Arrays and Array Methods
// 3. Functions and Arrow Functions
// 4. Scope and this keyword
// 5. Template Literals
// 6. Conditional Statements
// 7. Loops and Iteration
// 8. Date Object
// 9. Error Handling
// 10. Modern JavaScript Features 