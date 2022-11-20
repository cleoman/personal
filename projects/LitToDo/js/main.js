import {LitElement, html} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class ToDoList extends LitElement {
    static properties = {
        items: 
        {
            name: String,
            description: String,
            completed: Boolean,
            id: String
        }
    }

    constructor() {
        super();
        this.loadItemsFromLocalStorage();
        this.addEventListener('addedItem', (e) => this.addItem(e.detail))
        this.addEventListener('removedItem', (e) => this.removeItem(e.detail.id))
        this.addEventListener('updatedItem', (e) => this.updateItem(e.detail))
    }

    loadItemsFromLocalStorage()
    {
        let litToDoItems = localStorage.getItem('lit-to-do-items');
        if (litToDoItems)
        {
            this.items = JSON.parse(litToDoItems);
            return;
        }

        this.items = [];
    }

    saveItemsToLocalStorage()
    {
        let itemsSerialized = JSON.stringify(this.items);
        localStorage.setItem('lit-to-do-items', itemsSerialized);
    }

    removeItem(id)
    {
        const newItems = [];
        this.items.forEach(item => {
            if (item.id !== id)
            {
                newItems.push(item);
            }
        })

        this.items = newItems;
        this.saveItemsToLocalStorage();
    }

    addItem(item)
    {
        this.items = [
            ...this.items,
            {
                name: item.name,
                description: item.description,
                completed: false,
                id: self.crypto.randomUUID()
            }
        ];

        this.saveItemsToLocalStorage();
    }

    updateItem(updatedItem)
    {
        console.log(updatedItem);
        const newItems = [];
        this.items.forEach(item => {
            if (item.id == updatedItem.id)
            {
                item.completed = updatedItem.completed
            };
            newItems.push(item);
        })

        this.items = newItems;
        this.saveItemsToLocalStorage();
    }

    render() {
        return html`
        <ul>
            ${this.items.map((item) =>
                html`<to-do-list-item .item=${item}></to-do-list-item>`
            )}
        </ul>
        <to-do-list-item-input></to-do-list-item-input>
        `
    }
}

export class ToDoListItemInput extends LitElement {
    static properties = {
        name: { type: String },
        description: { type: String }
    }

    constructor()
    {
        super();
    }

    addItem() {
        const options = {
            detail: {
                name: this.getNameInput().value,
                description: this.getDescriptionInput().value
            },
            bubbles: true,
            composed: true
        }
        const event = new CustomEvent('addedItem', options);
        this.dispatchEvent(event);

        this.getNameInput().value = '';
        this.getDescriptionInput().value = '';
    }

    getNameInput() {
        return this.renderRoot?.querySelector('#name');
    }

    getDescriptionInput() {
        return this.renderRoot?.querySelector('#description');
    }

    render() {
        return html`
        Name: <input id="name" type="text" /> 
        Description: <input id="description" type="text" />
        <input type="button" value="Add Item" @click=${this.addItem} />
        `
    }
}

export class ToDoListItem extends LitElement {
    static properties = {
        item: {
            name: { type: String },
            description: { type: String },
            completed: { type: Boolean },
            id: { type: String }
        }
    }

    constructor() {
        super();
    }

    // dispatch remove item event
    removeItem() {
        const options = {
            detail: {
                id: this.item.id
            },
            bubbles: true,
            composed: true
        }
        const event = new CustomEvent('removedItem', options);
        this.dispatchEvent(event);
    }

    updateItem() {
        const options = {
            detail: {
                id: this.item.id,
                completed: !this.item.completed
            },
            bubbles: true,
            composed: true
        }
        const event = new CustomEvent('updatedItem', options);
        this.dispatchEvent(event);
    }

    render() {
        return html`
        <li>
            <input type="checkbox" ?checked=${this.item.completed} @click=${this.updateItem}/>
            ${this.item.name} - ${this.item.description}
            <input type="button" value="Remove Item" @click=${this.removeItem}>
        </li>
        `
    }
}

customElements.define('to-do-list', ToDoList);
customElements.define('to-do-list-item', ToDoListItem);
customElements.define('to-do-list-item-input', ToDoListItemInput);