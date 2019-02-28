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
                value: undefined,
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
            if (!this.store && !current.name && !current.belongsTo) return console.warn('No store found.');

            let { forms } = this.store.get();
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


            if (!current.isDirty && changed.value) {
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
                this.set({ref: this.refs.input});
            
            }, 0);



            // console.log('W T F', this.refs);
            // if (this.refs.input) {
            //     console.log('this.get() :', this.get());
            //     console.log('BLAH');
            // }
        }
    }
</script>