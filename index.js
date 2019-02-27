(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Select = factory());
}(this, (function () { 'use strict';

	function noop() {}

	function assign(tar, src) {
		for (var k in src) tar[k] = src[k];
		return tar;
	}

	function assignTrue(tar, src) {
		for (var k in src) tar[k] = 1;
		return tar;
	}

	function append(target, node) {
		target.appendChild(node);
	}

	function insert(target, node, anchor) {
		target.insertBefore(node, anchor);
	}

	function detachNode(node) {
		node.parentNode.removeChild(node);
	}

	function createElement(name) {
		return document.createElement(name);
	}

	function createText(data) {
		return document.createTextNode(data);
	}

	function createComment() {
		return document.createComment('');
	}

	function addListener(node, event, handler, options) {
		node.addEventListener(event, handler, options);
	}

	function removeListener(node, event, handler, options) {
		node.removeEventListener(event, handler, options);
	}

	function setAttribute(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else node.setAttribute(attribute, value);
	}

	function setData(text, data) {
		text.data = '' + data;
	}

	function blankObject() {
		return Object.create(null);
	}

	function destroy(detach) {
		this.destroy = noop;
		this.fire('destroy');
		this.set = noop;

		this._fragment.d(detach !== false);
		this._fragment = null;
		this._state = {};
	}

	function _differs(a, b) {
		return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
	}

	function fire(eventName, data) {
		var handlers =
			eventName in this._handlers && this._handlers[eventName].slice();
		if (!handlers) return;

		for (var i = 0; i < handlers.length; i += 1) {
			var handler = handlers[i];

			if (!handler.__calling) {
				try {
					handler.__calling = true;
					handler.call(this, data);
				} finally {
					handler.__calling = false;
				}
			}
		}
	}

	function flush(component) {
		component._lock = true;
		callAll(component._beforecreate);
		callAll(component._oncreate);
		callAll(component._aftercreate);
		component._lock = false;
	}

	function get() {
		return this._state;
	}

	function init(component, options) {
		component._handlers = blankObject();
		component._slots = blankObject();
		component._bind = options._bind;
		component._staged = {};

		component.options = options;
		component.root = options.root || component;
		component.store = options.store || component.root.store;

		if (!options.root) {
			component._beforecreate = [];
			component._oncreate = [];
			component._aftercreate = [];
		}
	}

	function on(eventName, handler) {
		var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
		handlers.push(handler);

		return {
			cancel: function() {
				var index = handlers.indexOf(handler);
				if (~index) handlers.splice(index, 1);
			}
		};
	}

	function set(newState) {
		this._set(assign({}, newState));
		if (this.root._lock) return;
		flush(this.root);
	}

	function _set(newState) {
		var oldState = this._state,
			changed = {},
			dirty = false;

		newState = assign(this._staged, newState);
		this._staged = {};

		for (var key in newState) {
			if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
		}
		if (!dirty) return;

		this._state = assign(assign({}, oldState), newState);
		this._recompute(changed, this._state);
		if (this._bind) this._bind(changed, this._state);

		if (this._fragment) {
			this.fire("state", { changed: changed, current: this._state, previous: oldState });
			this._fragment.p(changed, this._state);
			this.fire("update", { changed: changed, current: this._state, previous: oldState });
		}
	}

	function _stage(newState) {
		assign(this._staged, newState);
	}

	function callAll(fns) {
		while (fns && fns.length) fns.shift()();
	}

	function _mount(target, anchor) {
		this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
	}

	function removeFromStore() {
		this.store._remove(this);
	}

	var proto = {
		destroy,
		get,
		fire,
		on,
		set,
		_recompute: noop,
		_set,
		_stage,
		_mount,
		_differs
	};

	const createForm = (state, {
	    name,
	    formElements,
	    data,
	    onChange,
	    handleReset,
	    handleSubmit
	}) => {
	    if (!state && !state.store) return;
	    let emptyFn = () => { };

	    let { forms } = state.store.get();

	    forms = forms || {};

	    forms[name] = {
	        name,
	        formElements: formElements || {},
	        data: data || {},
	        isDirty: false,
	        hasSubmitted: false,
	        onChange: onChange || emptyFn,
	        handleReset: handleReset || emptyFn,
	        handleSubmit: handleSubmit || emptyFn
	    };

	    state.store.set({ forms });

	    return state.store.get().forms
	};

	const checkFormIsValid = (form) => {
	    let isValid = true;
	    // console.log('form.formElements :', form.formElements);
	    Object.values(form.formElements).forEach(element => {
	        if (isValid) {
	            isValid = element.isValid || false;
	        }
	    });
	    return isValid;
	};

	/* src/FormElement.svelte generated by Svelte v2.16.1 */

	function isValid({ value, ref }) {
	    if (!value || !ref) return false;
	    console.log('COMP');
	    return ref.checkValidity()
	}

	function data() {
	    return {
	        show: false,
	        type: 'text',
	        belongsTo: undefined,
	        name: undefined,
	        value: undefined,
	        isRequired: false,
	        // isValid: undefined,
	        isDirty: false,
	        onChange: () => { },
	        handleClear: () => { },
	        handleValidation: () => { },
	        ref: undefined
	    }
	}
	function oncreate() {
	    const { name, belongsTo, value, isRequired, isValid, isDirty, onChange, handleClear, handleValidation } = this.get();
	    if (!this.store && !name && !belongsTo) return console.warn('No store found.');
	    let { forms } = this.store.get();
	    if (!forms) {
	        forms = createForm(this, {
	            name: belongsTo,
	            handleSubmit: (event) => {
	                event.preventDefault();
	            }
	        });
	    }

	    const form = forms[belongsTo];
	    if (!form) return console.warn('No form with that name is registered with this store.')


	    console.log('isValid :', isValid);

	    form.formElements[name] = {
	        belongsTo,
	        name,
	        value,
	        isRequired,
	        isValid,
	        isDirty,
	        onChange,
	        handleClear,
	        handleValidation
	    };

	    
	    // element.isValid = isValid;

	    form.isValid = checkFormIsValid(form);

	    this.store.set({
	        forms
	    });

	    this.set({
	        show: true
	    });
	}
	function onstate({ changed, current, previous }) {
	    const { forms } = this.store.get();
	    // console.log('ONE');
	    if (!forms) return;

	    const form = forms[current.belongsTo];
	    // console.log('TWO');
	    if (!form) return;

	    const element = form.formElements[current.name];
	    // console.log('THREE');
	    if (!element) return;

	    const input = this.refs.input;
	    // console.log('FOUR');
	    if (!input) return;
	    this.set({ref: input});

	    if (!current.isDirty && changed.value) {
	        form.isDirty = true;
	        element.isDirty = true;
	        this.set({ isDirty: true });
	    }

	    // if (changed.value) {
	        console.log('FIVE');
	        const {isValid} = this.get();
	        element.isValid = isValid;

	        console.log('element.isValid :', element.isValid);

	        form.isValid = checkFormIsValid(form);
	    // }

	    this.store.set({
	        forms
	    });
	}
	function add_css() {
		var style = createElement("style");
		style.id = 'svelte-z44360-style';
		style.textContent = "input.svelte-z44360:valid{border:2px solid green}input.svelte-z44360:invalid{border:2px solid red}";
		append(document.head, style);
	}

	function create_main_fragment(component, ctx) {
		var if_block_anchor;

		var if_block = (ctx.show) && create_if_block(component, ctx);

		return {
			c() {
				if (if_block) if_block.c();
				if_block_anchor = createComment();
			},

			m(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insert(target, if_block_anchor, anchor);
			},

			p(changed, ctx) {
				if (ctx.show) {
					if (if_block) {
						if_block.p(changed, ctx);
					} else {
						if_block = create_if_block(component, ctx);
						if_block.c();
						if_block.m(if_block_anchor.parentNode, if_block_anchor);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}
			},

			d(detach) {
				if (if_block) if_block.d(detach);
				if (detach) {
					detachNode(if_block_anchor);
				}
			}
		};
	}

	// (1:0) {#if show}
	function create_if_block(component, ctx) {
		var text0, div, small0, text1, text2_value = ctx.$forms[ctx.belongsTo].formElements[ctx.name].isDirty, text2, text3, br, text4, small1, text5, text6;

		var if_block = (ctx.type === 'text') && create_if_block_1(component, ctx);

		return {
			c() {
				if (if_block) if_block.c();
				text0 = createText("\n\n");
				div = createElement("div");
				small0 = createElement("small");
				text1 = createText("isDirty: ");
				text2 = createText(text2_value);
				text3 = createText(" ");
				br = createElement("br");
				text4 = createText("\n    ");
				small1 = createElement("small");
				text5 = createText("isValid: ");
				text6 = createText(ctx.isValid);
			},

			m(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insert(target, text0, anchor);
				insert(target, div, anchor);
				append(div, small0);
				append(small0, text1);
				append(small0, text2);
				append(div, text3);
				append(div, br);
				append(div, text4);
				append(div, small1);
				append(small1, text5);
				append(small1, text6);
			},

			p(changed, ctx) {
				if (ctx.type === 'text') {
					if (if_block) {
						if_block.p(changed, ctx);
					} else {
						if_block = create_if_block_1(component, ctx);
						if_block.c();
						if_block.m(text0.parentNode, text0);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}

				if ((changed.$forms || changed.belongsTo || changed.name) && text2_value !== (text2_value = ctx.$forms[ctx.belongsTo].formElements[ctx.name].isDirty)) {
					setData(text2, text2_value);
				}

				if (changed.isValid) {
					setData(text6, ctx.isValid);
				}
			},

			d(detach) {
				if (if_block) if_block.d(detach);
				if (detach) {
					detachNode(text0);
					detachNode(div);
				}
			}
		};
	}

	// (3:0) {#if type === 'text'}
	function create_if_block_1(component, ctx) {
		var input, input_updating = false, input_pattern_value, input_minlength_value, input_maxlength_value;

		function input_input_handler() {
			input_updating = true;
			component.set({ value: input.value });
			input_updating = false;
		}

		return {
			c() {
				input = createElement("input");
				addListener(input, "input", input_input_handler);
				input.className = "" + ctx.classes + " svelte-z44360";
				input.id = ctx.name;
				input.required = ctx.isRequired;
				input.pattern = input_pattern_value = ctx.pattern || '*';
				setAttribute(input, "minlength", input_minlength_value = ctx.minlength || 0);
				input.maxLength = input_maxlength_value = ctx.maxlength || 9999;
				input.name = ctx.name;
			},

			m(target, anchor) {
				insert(target, input, anchor);
				component.refs.input = input;

				input.value = ctx.value
	    ;
			},

			p(changed, ctx) {
				if (!input_updating && changed.value) input.value = ctx.value
	    ;
				if (changed.classes) {
					input.className = "" + ctx.classes + " svelte-z44360";
				}

				if (changed.name) {
					input.id = ctx.name;
				}

				if (changed.isRequired) {
					input.required = ctx.isRequired;
				}

				if ((changed.pattern) && input_pattern_value !== (input_pattern_value = ctx.pattern || '*')) {
					input.pattern = input_pattern_value;
				}

				if ((changed.minlength) && input_minlength_value !== (input_minlength_value = ctx.minlength || 0)) {
					setAttribute(input, "minlength", input_minlength_value);
				}

				if ((changed.maxlength) && input_maxlength_value !== (input_maxlength_value = ctx.maxlength || 9999)) {
					input.maxLength = input_maxlength_value;
				}

				if (changed.name) {
					input.name = ctx.name;
				}
			},

			d(detach) {
				if (detach) {
					detachNode(input);
				}

				removeListener(input, "input", input_input_handler);
				if (component.refs.input === input) component.refs.input = null;
			}
		};
	}

	function FormElement(options) {
		init(this, options);
		this.refs = {};
		this._state = assign(assign(this.store._init(["forms"]), data()), options.data);
		this.store._add(this, ["forms"]);

		this._recompute({ value: 1, ref: 1 }, this._state);
		this._intro = true;

		this._handlers.state = [onstate];

		this._handlers.destroy = [removeFromStore];

		if (!document.getElementById("svelte-z44360-style")) add_css();

		onstate.call(this, { changed: assignTrue({}, this._state), current: this._state });

		this._fragment = create_main_fragment(this, this._state);

		this.root._oncreate.push(() => {
			oncreate.call(this);
			this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
		});

		if (options.target) {
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}
	}

	assign(FormElement.prototype, proto);

	FormElement.prototype._recompute = function _recompute(changed, state) {
		if (changed.value || changed.ref) {
			if (this._differs(state.isValid, (state.isValid = isValid(state)))) changed.isValid = true;
		}
	};

	return FormElement;

})));
