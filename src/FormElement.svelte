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
    <small>isValid: { isValid }</small>
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
    import { createForm, checkFormIsValid } from './formService';

    export default {
        data() {
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
        },
        computed: {
            isValid : ({ value, ref }) => {
                if (!value || !ref) return false;
                console.log('COMP');
                return ref.checkValidity()
            },
        },
        onstate({ changed, current, previous }) {
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
            this.set({ref: input})

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
                        event.preventDefault();
                    }
                })
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
            }

            
            // element.isValid = isValid;

            form.isValid = checkFormIsValid(form);

            this.store.set({
                forms
            })

            this.set({
                show: true
            })
        }
    }
</script>