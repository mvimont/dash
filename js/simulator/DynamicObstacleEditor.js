import DynamicObstacle from "../autonomy/DynamicObstacle.js";

export default class DynamicObstacleEditor {
  constructor() {
    this.editorDom = document.getElementById('editor-dynamic-obstacles-box');
    this.formsContainer = document.getElementById('editor-dynamic-obstacle-forms');

    document.getElementById('editor-add-dynamic-obstacle').addEventListener('click', this.addDynamicObstacle.bind(this));
  }

  enable() {
    this.editorDom.classList.remove('is-hidden');
  }

  disable() {
    this.editorDom.classList.add('is-hidden');
  }

  collectDynamicObstacles() {
    const forms = this.formsContainer.getElementsByTagName('form');
    const obstacles = [];

    for (let i = 0; i < forms.length; i++) {
      const formData = new FormData(forms[i]);
      const params = { parallel: false };

      for (const [k, v] of formData.entries())
        params[k] = v;

      const pos = new THREE.Vector2(Number(params.sPos) || 0, Number(params.lPos) || 0);
      const vel = new THREE.Vector2(Number(params.sVel) || 0, Number(params.lVel) || 0);
      const parallel = !!params.parallel;

      obstacles.push(new DynamicObstacle(params.type, pos, vel, parallel));
    }

    return obstacles;
  }

  addDynamicObstacle() {
    const index = this.formsContainer.getElementsByTagName('form').length + 1;
    const form = this.buildForm(index);

    this.formsContainer.appendChild(form);
  }

  removeDynamicObstacle(form) {
    this.formsContainer.removeChild(form);
    this.reindexForms();
  }

  clearDynamicObstacles() {
    this.formsContainer.innerHTML = '';
  }

  reindexForms() {
    const forms = this.formsContainer.getElementsByTagName('form');
    
    for (let i = 0; i < forms.length; i++) {
      forms[i].getElementsByClassName('dynamic-obstacle-index')[0].textContent = i + 1;
    }
  }

  buildForm(index) {
    const html =
      `<form class="editor-dynamic-obstacle-form">
          <div class="columns is-gapless">
              <div class="column is-1">
                  <div class="field">
                      <div class="field-label is-normal is-size-7 has-text-grey-lighter has-text-weight-bold dynamic-obstacle-index">${index}</div>
                  </div>
              </div>
              <div class="column is-3">
                  <div class="field">
                      <div class="control">
                          <div class="select is-small">
                              <select name="type">
                                  <option value="vehicle">Vehicle</option>
                                  <option value="cyclist">Cyclist</option>
                                  <option value="pedestrian">Pedestrian</option>
                              </select>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="column is-1">
                  <div class="field">
                      <div class="control has-text-centered">
                          <label class="checkbox">
                              <input type="checkbox" name="parallel" checked />&nbsp;
                          </label>
                      </div>
                  </div>
              </div>
              <div class="column is-3">
                  <div class="field has-addons editor-field-center">
                      <div class="control">
                          <input class="input is-small" type="text" name="sPos" style="width: 50px;" value="0" />
                      </div>
                      <div class="control">
                          <input class="input is-small" type="text" name="lPos" style="width: 50px;" value="0" />
                      </div>
                  </div>
              </div>
              <div class="column is-3">
                  <div class="field has-addons editor-field-center">
                      <div class="control">
                          <input class="input is-small" type="text" name="sVel" style="width: 50px;" value="0" />
                      </div>
                      <div class="control">
                          <input class="input is-small" type="text" name="lVel" style="width: 50px;" value="0" />
                      </div>
                  </div>
              </div>
              <div class="column is-1">
                  <div class="field has-text-right">
                      <div class="button is-small is-danger editor-remove-dynamic-obstacle" title="Remove Dynamic Obstacle">
                          <span class="icon is-small">
                              <i class="fas fa-trash-alt"></i>
                          </span>
                      </div>
                  </div>
              </div>
          </div>
      </form>`;

    const template = document.createElement('template');
    template.innerHTML = html;
    const form = template.content.firstChild;

    form.getElementsByClassName('editor-remove-dynamic-obstacle')[0].addEventListener('click', e => this.removeDynamicObstacle(form));

    return form;
  }
}