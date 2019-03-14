{#if type === 'text' && !component}
<input
    class="{classes}"
    id={name} 
    bind:value
    required={isRequired}
    pattern={pattern || '.*?' }
    minlength={minlength || 0 }
    maxlength={maxlength || 9999 }
    {name}
    >
{/if}

{#if parentForm && component }
<svelte:component this="{component}" {name} bind:value {...props} {placeholder} {isValid} hasError={parentForm.hasSubmitted && !isValid} />
{/if}

<!-- <div>
    <small>isDirty: { isDirty }</small> 
    <br />
    <small>isValid: { isValid }</small>
</div> -->

<style>
    input:valid {
        border: 2px solid green;
    }

    input:invalid {
        border: 2px solid red;
    }
</style>

<script>
    import { createForm, checkFormIsValid } from './formService';

    export default {
        data() {
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
        },
        computed: {
            isValid: ({ value, isRequired }) => {
                if (!isRequired) return true;
                if (value === '') return false;
                if (value === undefined) return false;
                return true;
            },
            parentForm: ({$forms, belongsTo}) => {
                if (!$forms) return;

                return $forms[belongsTo];
            }
        },
        onstate({ changed, current, previous }) {
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
                })
            };

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
                }

                element = form.formElements[name];
                this.set({ originalValue });
            };


            if (previous && !current.isDirty && changed.value) {
                form.isDirty = true;
                element.isDirty = true;
                this.set({ isDirty: true });
            }

            element.isValid = isValid;
            form.isValid = checkFormIsValid(form);

            this.store.set({
                forms
            })
        },


        oncreate() {
            setTimeout(() => {
                this.set({ isReady: true });
            }, 0);

            const listener = this.store.on('state', ({ current, changed }) => {
                const { name, belongsTo, originalValue } = this.get();
                const form = current.forms[belongsTo];

                if (form && form.shouldReset < Object.keys(current.forms[belongsTo].formElements).length) {
                    this.set({ value: JSON.parse(originalValue) });

                    form.shouldReset += 1;
                    this.store.set({ form })
                }
            });


            this.on('destroy', listener.cancel);
        }
    }
</script>