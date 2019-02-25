{#if show}
<input id={name} bind:value required={isRequired}>
<p>isDirty: { $forms[belongsTo].formElements[name].isDirty }</p>
{/if}

<script>
    import { createForm } from './formService';

    export default {
        data() {
            return {
                show: false,
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
            // isDirty: ({ value }) => time.getHours(),
        },
        onstate({ changed, current, previous }) {
            if (previous && !current.isDirty && changed.value) {
                console.log('wow');
                const { forms } = this.store.get();
                const form = forms[current.belongsTo];
                const element = form.formElements[current.name]
                element.isDirty = true;
                this.set({ isDirty: true});
                this.store.set({
                    forms
                })
            }

            console.log('this.store.get().forms :', this.store.get().forms);
            
        },
        oncreate() {
            const { name, belongsTo, value, isRequired, isValid, isDirty, onChange, handleClear, handleValidation } = this.get();
            if (!this.store && !name && !belongsTo) return console.warn('No store found.');
            let { forms } = this.store.get();
            if (!forms) {
                forms = createForm(this, {
                    name: belongsTo
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