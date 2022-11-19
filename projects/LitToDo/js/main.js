import {LitElement, html} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class ToDoList extends LitElement {
    static properties = {
        items: 
        {
            name: String,
            description: String,
            completed: Boolean
        }
    }

    constructor() {
        super();
        this.items = [
            {
                name: 'test',
                description: 'test description',
                completed: false
            },
            {
                name: 'test 2',
                description: 'test description 2',
                completed: true
            },
        ]

        this.addEventListener('addedItem', (e) => this.addItem(e.detail))
    }

    addItem(item)
    {
        console.log(item);
        this.items = [
            ...this.items,
            {
                name: item.name,
                description: item.description,
                completed: false
            }
        ];
    }

    render() {
        return html`
        <ul>
            ${this.items.map((item) =>
                html`<to-do-list-item .name=${item.name} .description=${item.description} .completed=${item.completed}></to-do-list-item>`
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
                name: this.getName(),
                description: this.getDescription()
            },
            bubbles: true,
            composed: true
        }
        const event = new CustomEvent('addedItem', options);
        this.dispatchEvent(event);

        this.getNameInput().value = '';
        this.getDescriptionInput().value = '';
    }

    getName() {
        return this.getNameInput().value;
    }

    getDescription() {
        return this.getDescriptionInput().value;
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
        name: '',
        description: '',
        completed: { type: Boolean }
    }

    constructor() {
        super();
    }

    render() {
        return html`
        <li>
            <input type="checkbox" ?checked=${this.completed} />
            ${this.name} - ${this.description}
        </li>
        `
    }
}

customElements.define('to-do-list', ToDoList);
customElements.define('to-do-list-item', ToDoListItem);
customElements.define('to-do-list-item-input', ToDoListItemInput);