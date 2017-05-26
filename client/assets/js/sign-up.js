export class Form {
  //{url, inputs, buttons, instructions, title}
  constructor(config) {
    this.url = config.url;
    this.inputs = config.inputs;
    this.buttons = config.buttons;
    this.instructions = config.instructions;
    this.title = config.title;

    this.username = '';
    this.password = '';
  }
  
  createTitle() {
    return (
      `<div class="title ${this.title.class}">${this.title.text}</div>`
    )
  }
  
  createInputs() {
    return this.inputs.map(input => {
      return `
        <input type=${input.type} id=${input.id} placeholder=${input.placeholder} />
      `;
    }).join('<br />');
  }
  
  createButtons() {
    return this.buttons.map(button => {
      return `
        <button type=${button.type} class=${button.class}>${button.title}</button>
      `;
    }).join('');
  }
  
  createInstructions() {
    return (
      `<div class="instructions">${this.instructions}</div>`
    );
  }
  
  createFormHtml() {
    let inputHtml = '';
    
    if(this.title) {
      inputHtml += this.createTitle();
    }
    
    inputHtml += this.createInputs() + '<br />' + this.createButtons();
    
    if(this.instructions) {
      inputHtml += this.createInstructions();
    }

    function submit(evt) {
        evt.preventDefault();
        console.log('submitting form...');
    }
    
    return `
      <form onSubmit="submit">${inputHtml}</form>
    `;
  }

  login(evt) {
      evt.preventDefault();
      console.log('logging in:', this.username, this.password);

  }
}