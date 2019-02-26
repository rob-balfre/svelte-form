{#if show}

{#if type === 'text'}
<input
    ref:input
    class="{classes}"
    id={name} 
    bind:value
    required={isRequired}
    pattern={pattern || '*' }
    minlength={minlength || 0 }
    maxlength={maxlength || 9999 }
    {name}
    >
{/if}

<div>
    <small>isDirty: { $forms[belongsTo].formElements[name].isDirty }</small> <br />
    <small>isValid: {  $forms[belongsTo].formElements[name].isValid }</small>
</div>

{/if}

<style>
    input:valid {
        border: 2px solid green;
    }

    input:invalid {
        border: 2px solid red;
    }
</style>

<script>
    import { createForm } from './formService';

    export default {
        data() {
            return {
                show: false,
                type: 'text',
                belongsTo: undefined,
                name: undefined,
                value: undefined,
                isRequired: false,
                isValid: undefined,
                isDirty: false,
                onChange: () => { },
                handleClear: () => { },
                handleValidation: () => { }
            }
        },
        computed: {
            // show : ({ value }) => time.getHours(),
        },
        onstate({ changed, current, previous }) {
            if (!previous) return;

            const { forms } = this.store.get();
            const form = forms[current.belongsTo];
            const element = form.formElements[current.name];

            if (!current.isDirty && changed.value) {
                element.isDirty = true;
                this.set({ isDirty: true });

            }

            if (changed.value) {
                const input = this.refs.input;
                element.isValid = input.checkValidity();

                const checkIsValid = () => {
                    let isValid = true;
                    Object.values(form.formElements).forEach(element => {
                        if (isValid) {
                            isValid = element.isValid || false;
                        }
                    })
                    return isValid;
                }

                form.isValid = checkIsValid();
            }

            console.log('forms :', forms);

            this.store.set({
                forms
            })
        },
        oncreate() {
            const { name, belongsTo, value, isRequired, isValid, isDirty, onChange, handleClear, handleValidation } = this.get();
            if (!this.store && !name && !belongsTo) return console.warn('No store found.');
            let { forms } = this.store.get();
            if (!forms) {
                forms = createForm(this, {
                    name: belongsTo,
                    handleSubmit: (event) => {
                        console.log('event :', event);
                        event.preventDefault();

                    }
                })
            }

            const form = forms[belongsTo];
            if (!form) return console.warn('No form with that name is registered with this store.')

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
            }

            this.store.set({
                forms
            })

            this.set({
                show: true
            })
        }
    }
</script>