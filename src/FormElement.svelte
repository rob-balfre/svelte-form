<!-- {#if show} -->

{#if type === 'text'}
<input
    ref:input
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

<div>
    <small>isDirty: { isDirty }</small> <br />
    <small>isValid: { isValid }</small>
</div>

<!-- {/if} -->

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
                value: '',
                isRequired: false,
                isValid: undefined,
                isDirty: false,
                onChange: () => { },
                handleClear: () => { },
                handleValidation: () => { },
                ref: undefined
            }
        },
        computed: {
            isValid: ({ value, ref }) => {
                if (!value || !ref) return false;
                return ref.checkValidity()
            },
        },
        onstate({ changed, current, previous }) {
            const {
                belongsTo,
                name,
                value,
                isValid,
                isRequired,
                isDirty,
                onChange,
                handleClear,
                handleValidation } = current;

            if (!this.store) return console.warn('No store found.');
            if (!name) return console.warn('No name set.');
            if (!belongsTo) return console.warn('No belongsTo set.');

            let { forms } = this.store.get();
            if (!forms) {
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

                element = form.formElements[name];
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
                this.set({ ref: this.refs.input });

            }, 0);
        }
    }
</script>