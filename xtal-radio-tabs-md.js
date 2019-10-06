import { XtalElement } from "xtal-element/xtal-element.js";
import { define } from "trans-render/define.js";
import { createTemplate } from "xtal-element/utils.js";
import { newEventContext } from "event-switch/event-switch.js";
const mainTemplate = createTemplate(/* html */ `
<slot></slot>
<div target class="tab-wrap"></div>
<style>
    :host {
        display: block;
    }

    .tab-wrap {
        width: 100%;
        position: relative;
        display: flex;
        flex-direction: row;
    }

    .tab-wrap input[type="radio"][name="tabs"] {
        position: absolute;
        z-index: -1;
    }

    .tab-wrap input[type="radio"][name="tabs"]:checked+.tab-label-content label {
        color: white;
    }

    .tab-wrap input[type="radio"][name="tabs"]:checked+.tab-label-content .tab-content {
        display: block;
    }


    .tab-wrap input[type="radio"][name="tabs"]:first-of-type:checked~.slide {
        left: 0;
    }

    .tab-wrap label {
        cursor: pointer;
        color: rgba(255, 255, 255, 0.8);
        background-color: #00bcd4;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        height: 56px;
        transition: color 0.2s ease;
        width: 100%;
    }

    .tab-wrap .slide {
        background: #ffeb3b;
        height: 4px;
        position: absolute;
        left: 0;
        top: calc(100% - 4px);
        transition: left 0.3s ease-out;
    }


    .tab-wrap .tab-label-content {
        width: 100%;
    }

    .tab-wrap .tab-label-content .tab-content {
        position: absolute;
        top: 100px;
        left: 16px;
        line-height: 130%;
        display: none;
    }


    .tab-wrap .follow {
        width: 42px;
        height: 42px;
        border-radius: 50px;
        background: #03A9F4;
        display: block;
        margin: 300px auto 0;
        white-space: nowrap;
        padding: 13px;
        box-sizing: border-box;
        color: white;
        transition: all 0.2s ease;
        font-family: Roboto, sans-serif;
        text-decoration: none;
        box-shadow: 0 5px 6px 0 rgba(0, 0, 0, 0.2);
    }

    .tab-wrap .follow i {
        margin-right: 20px;
        transition: margin-right 0.2s ease;
    }

    .tab-wrap .follow:hover {
        width: 134px;
    }

    .tab-wrap .follow:hover i {
        margin-right: 10px;
    }
</style>
`);
const styleFn = (n, t) => /* css */ `
input[type="radio"][name="tabs"]:nth-of-type(${n + 1}):checked~.slide {
    left: calc((100% / ${t}) * ${n});
}`;
export class XtalRadioTabsMD extends XtalElement {
    constructor() {
        super(...arguments);
        this._initContext = {};
        this._eventContext = newEventContext({
            slotchange: e => {
                e.target
                    .assignedNodes()
                    .forEach(node => {
                    if (node.nodeType !== 1)
                        return;
                    if (node.localName === "datalist") {
                        const buttons = [];
                        const children = node.children;
                        const len = children.length;
                        const styles = [];
                        Array.from(children).forEach((option, idx) => {
                            const rb = /* html */ `
<input type="radio" name="tabs" id="tab${idx}" value="${option.value}">
<div class="tab-label-content" id="tab${idx}-content">
    <label for="tab${idx}">${option.textContent || option.value}</label>
</div>`;
                            buttons.push(rb);
                            styles.push(styleFn(idx, len));
                        });
                        this.root.querySelector("[target]").innerHTML = buttons.join("") + /* html */ `<div class="slide"></div>`;
                        styles.push(`
            .slide {
                width: calc(100% / ${children.length});
            }
            `);
                        const style = document.createElement('style');
                        style.innerHTML = styles.join('');
                        this.root.appendChild(style);
                    }
                });
            }
            // change: e => {
            //   const element = this.inputElement;
            //   if (element && element.matches(".form-element-field")) {
            //     element.classList[element.value ? "add" : "remove"]("-hasvalue");
            //   }
            // },
            // input: e => {
            //   this.emitEvent();
            // }
        });
    }
    static get is() {
        return "xtal-radio-tabs-md";
    }
    get mainTemplate() {
        return mainTemplate;
    }
    get initContext() {
        return this._initContext;
    }
    get eventContext() {
        return this._eventContext;
    }
    get readyToInit() {
        return true;
    }
}
define(XtalRadioTabsMD);
