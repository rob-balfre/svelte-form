import svelte from 'svelte';
import { Store } from 'svelte/store.js';
import FormElement from '../../src/FormElement.svelte';
import Form1 from './examples/Form1.svelte';

import { createForm } from '../../src/formService';


import { assert, test, done } from 'tape-modern';


// setup
const target = document.querySelector('main');
const testTarget = document.getElementById('testTemplate');

function indent(node, spaces) {
  if (node.childNodes.length === 0) return;

  if (node.childNodes.length > 1 || node.childNodes[0].nodeType !== 3) {
    const first = node.childNodes[0];
    const last = node.childNodes[node.childNodes.length - 1];

    const head = `\n${spaces}  `;
    const tail = `\n${spaces}`;

    if (first.nodeType === 3) {
      first.data = `${head}${first.data}`;
    } else {
      node.insertBefore(document.createTextNode(head), first);
    }

    if (last.nodeType === 3) {
      last.data = `${last.data}${tail}`;
    } else {
      node.appendChild(document.createTextNode(tail));
    }

    let lastType = null;
    for (let i = 0; i < node.childNodes.length; i += 1) {
      const child = node.childNodes[i];
      if (child.nodeType === 1) {
        indent(node.childNodes[i], `${spaces}  `);

        if (lastType === 1) {
          node.insertBefore(document.createTextNode(head), child);
          i += 1;
        }
      }

      lastType = child.nodeType;
    }
  }
}

function normalize(html) {
  const div = document.createElement('div');
  div.innerHTML = html
    .replace(/<link.+\/?>/g, '')
    .replace(/<!--.+?-->/g, '')
    .replace(/<!---->/g, '')
    .replace(/<object.+\/object>/g, '')
    .replace(/svelte-ref-\w+/g, '')
    .replace(/\s*svelte-\w+\s*/g, '')
    .replace(/class=""/g, '')
    .replace(/style=""/g, '')
    .replace(/>\s+/g, '>')
    .replace(/\s+</g, '<');

  indent(div, '');

  div.normalize();
  return div.innerHTML;
}

function wait(ms) {
  return new Promise(f => setTimeout(f, ms));
}

assert.htmlEqual = (a, b, msg) => {
  assert.equal(normalize(a), normalize(b));
};

// tests
test('when a FormElement is present on page then a "forms" object is created on the store', async (t) => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const store = new Store({});

  store.set({
    form1Data: {
      name: '',
      world: ''
    }
  })

  const form = new Form1({
    target,
    store,
  });

  t.ok(store.get().forms)

  form.destroy();
});


test('when a Form has FormElements and form is interacted with then form.isDirty becomes true', async (t) => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const store = new Store({});

  store.set({
    form1Data: {
      name: '',
      world: ''
    }
  })

  const form = new Form1({
    target,
    store,
  });

  form.store.set({
    form1Data: {
      name: 'Rob',
      world: 'test'
    }
  })

  t.ok(form.store.get().forms.form1.isDirty)

  form.destroy();
});

test.only('when a Form has FormElements and each of them is valid then form.isValid becomes true', async (t) => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  const store = new Store({});

  store.set({
    form1Data: {
      name: 'Rob',
      world: 'test'
    }
  })

  const form = new Form1({
    target,
    store,
  });



  t.ok(form.store.get().forms.form1.isValid)

  // form.destroy();
});

// TODO: Tests...
// Form isDirty
// Form isValid
// FormElement isDirty
// FormElement isValid



function focus(element, setFocus) {
  return new Promise(fulfil => {
    element.addEventListener('focus', function handler() {
      element.removeEventListener('focus', handler);
      fulfil(true);
    });

    setFocus();
  });
}

// this allows us to close puppeteer once tests have completed
window.done = done;
