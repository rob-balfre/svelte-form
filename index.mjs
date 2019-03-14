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

function getSpreadUpdate(levels, updates) {
	var update = {};

	var to_null_out = {};
	var accounted_for = {};

	var i = levels.length;
	while (i--) {
		var o = levels[i];
		var n = updates[i];

		if (n) {
			for (var key in o) {
				if (!(key in n)) to_null_out[key] = 1;
			}

			for (var key in n) {
				if (!accounted_for[key]) {
					update[key] = n[key];
					accounted_for[key] = 1;
				}
			}

			levels[i] = n;
		} else {
			for (var key in o) {
				accounted_for[key] = 1;
			}
		}
	}

	for (var key in to_null_out) {
		if (!(key in update)) update[key] = undefined;
	}

	return update;
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
    data    
}) => {
    if (!state && !state.store) return;

    let { forms } = state.store.get();

    forms = forms || {};
    forms[name] = {
        name,
        formElements: formElements || {},
        data: data || {},
        isDirty: false,
        hasSubmitted: false,
    };

    state.store.set({ forms });

    return state.store.get().forms
};

const checkFormIsValid = (form) => {
    let isValid = true;
    
    Object.values(form.formElements).forEach(element => {
        if (isValid) {
            isValid = element.isValid || false;
        }
    });
    return isValid;
};

/* src/FormElement.svelte generated by Svelte v2.16.1 */

function isValid({ value, isRequired }) {
    if (!isRequired) return true;
    if (value === '') return false;
    if (value === undefined) return false;
    return true;
}

function parentForm({$forms, belongsTo}) {
    if (!$forms) return;

    return $forms[belongsTo];
}

function data() {
    return {
        type: 'text',
        belongsTo: undefined,
        name: undefined,
        value: '',
        isRequired: false,
        isValid: undefined,
        isDirty: false,
        isReady: false,
        originalValue: undefined
    }
}
function oncreate() {
    setTimeout(() => {
        this.set({ isReady: true });
    }, 0);

    const listener = this.store.on('state', ({ current, changed }) => {
        const { name, belongsTo, originalValue } = this.get();
        const form = current.forms[belongsTo];

        if (form && form.shouldReset < Object.keys(current.forms[belongsTo].formElements).length) {
            this.set({ value: JSON.parse(originalValue) });

            form.shouldReset += 1;
            this.store.set({ form });
        }
    });


    this.on('destroy', listener.cancel);
}
function onstate({ changed, current, previous }) {
    if (!previous) return;

    const {
        belongsTo,
        name,
        value,
        isValid,
        isRequired,
        isDirty } = current;

    if (!this.store) return console.warn('No store found.');
    if (!name) return console.warn('No name set.');
    if (!belongsTo) return console.warn('No belongsTo set.');

    let { forms } = this.store.get();
    if (!forms) {
        console.log('NO FORMS');
        forms = createForm(this, {
            name: belongsTo,
            handleSubmit: (event) => {
                event.preventDefault();
            }
        });
    }
    let form = forms[belongsTo];
    let element = form.formElements[name];

    if (!element) {
        const originalValue = JSON.stringify(value);

        form.formElements[name] = {
            belongsTo,
            name,
            value,
            isRequired,
            isValid,
            isDirty,
            originalValue
        };

        element = form.formElements[name];
        this.set({ originalValue });
    }

    if (previous && !current.isDirty && changed.value) {
        form.isDirty = true;
        element.isDirty = true;
        this.set({ isDirty: true });
    }

    element.isValid = isValid;
    form.isValid = checkFormIsValid(form);

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
	var text, if_block1_anchor;

	var if_block0 = (ctx.type === 'text' && !ctx.component) && create_if_block_1(component, ctx);

	var if_block1 = (ctx.parentForm && ctx.component) && create_if_block(component, ctx);

	return {
		c() {
			if (if_block0) if_block0.c();
			text = createText("\n\n");
			if (if_block1) if_block1.c();
			if_block1_anchor = createComment();
		},

		m(target, anchor) {
			if (if_block0) if_block0.m(target, anchor);
			insert(target, text, anchor);
			if (if_block1) if_block1.m(target, anchor);
			insert(target, if_block1_anchor, anchor);
		},

		p(changed, ctx) {
			if (ctx.type === 'text' && !ctx.component) {
				if (if_block0) {
					if_block0.p(changed, ctx);
				} else {
					if_block0 = create_if_block_1(component, ctx);
					if_block0.c();
					if_block0.m(text.parentNode, text);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (ctx.parentForm && ctx.component) {
				if (if_block1) {
					if_block1.p(changed, ctx);
				} else {
					if_block1 = create_if_block(component, ctx);
					if_block1.c();
					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}
		},

		d(detach) {
			if (if_block0) if_block0.d(detach);
			if (detach) {
				detachNode(text);
			}

			if (if_block1) if_block1.d(detach);
			if (detach) {
				detachNode(if_block1_anchor);
			}
		}
	};
}

// (1:0) {#if type === 'text' && !component}
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
			input.pattern = input_pattern_value = ctx.pattern || '.*?';
			setAttribute(input, "minlength", input_minlength_value = ctx.minlength || 0);
			input.maxLength = input_maxlength_value = ctx.maxlength || 9999;
			input.name = ctx.name;
		},

		m(target, anchor) {
			insert(target, input, anchor);

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

			if ((changed.pattern) && input_pattern_value !== (input_pattern_value = ctx.pattern || '.*?')) {
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
		}
	};
}

// (14:0) {#if parentForm && component }
function create_if_block(component, ctx) {
	var switch_instance_updating = {}, switch_instance_anchor;

	var switch_instance_spread_levels = [
		{ name: ctx.name },
		ctx.props,
		{ placeholder: ctx.placeholder },
		{ isValid: ctx.isValid },
		{ hasError: ctx.parentForm.hasSubmitted && !ctx.isValid }
	];

	var switch_value = ctx.component;

	function switch_props(ctx) {
		var switch_instance_initial_data = {};
		for (var i = 0; i < switch_instance_spread_levels.length; i += 1) {
			switch_instance_initial_data = assign(switch_instance_initial_data, switch_instance_spread_levels[i]);
		}
		if (ctx.value  !== void 0) {
			switch_instance_initial_data.value = ctx.value ;
			switch_instance_updating.value = true;
		}
		return {
			root: component.root,
			store: component.store,
			data: switch_instance_initial_data,
			_bind(changed, childState) {
				var newState = {};
				if (!switch_instance_updating.value && changed.value) {
					newState.value = childState.value;
				}
				component._set(newState);
				switch_instance_updating = {};
			}
		};
	}

	if (switch_value) {
		var switch_instance = new switch_value(switch_props(ctx));

		component.root._beforecreate.push(() => {
			switch_instance._bind({ value: 1 }, switch_instance.get());
		});
	}

	return {
		c() {
			if (switch_instance) switch_instance._fragment.c();
			switch_instance_anchor = createComment();
		},

		m(target, anchor) {
			if (switch_instance) {
				switch_instance._mount(target, anchor);
			}

			insert(target, switch_instance_anchor, anchor);
		},

		p(changed, _ctx) {
			ctx = _ctx;
			var switch_instance_changes = (changed.name || changed.props || changed.placeholder || changed.isValid || changed.parentForm) ? getSpreadUpdate(switch_instance_spread_levels, [
				(changed.name) && { name: ctx.name },
				(changed.props) && ctx.props,
				(changed.placeholder) && { placeholder: ctx.placeholder },
				(changed.isValid) && { isValid: ctx.isValid },
				(changed.parentForm || changed.isValid) && { hasError: ctx.parentForm.hasSubmitted && !ctx.isValid }
			]) : {};
			if (!switch_instance_updating.value && changed.value) {
				switch_instance_changes.value = ctx.value ;
				switch_instance_updating.value = ctx.value  !== void 0;
			}

			if (switch_value !== (switch_value = ctx.component)) {
				if (switch_instance) {
					switch_instance.destroy();
				}

				if (switch_value) {
					switch_instance = new switch_value(switch_props(ctx));

					component.root._beforecreate.push(() => {
						const changed = {};
						if (ctx.value  === void 0) changed.value = 1;
						switch_instance._bind(changed, switch_instance.get());
					});
					switch_instance._fragment.c();
					switch_instance._mount(switch_instance_anchor.parentNode, switch_instance_anchor);
				} else {
					switch_instance = null;
				}
			}

			else if (switch_value) {
				switch_instance._set(switch_instance_changes);
				switch_instance_updating = {};
			}
		},

		d(detach) {
			if (detach) {
				detachNode(switch_instance_anchor);
			}

			if (switch_instance) switch_instance.destroy(detach);
		}
	};
}

function FormElement(options) {
	init(this, options);
	this._state = assign(assign(this.store._init(["forms"]), data()), options.data);
	this.store._add(this, ["forms"]);

	this._recompute({ value: 1, isRequired: 1, $forms: 1, belongsTo: 1 }, this._state);
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
	if (changed.value || changed.isRequired) {
		if (this._differs(state.isValid, (state.isValid = isValid(state)))) changed.isValid = true;
	}

	if (changed.$forms || changed.belongsTo) {
		if (this._differs(state.parentForm, (state.parentForm = parentForm(state)))) changed.parentForm = true;
	}
};

export default FormElement;
