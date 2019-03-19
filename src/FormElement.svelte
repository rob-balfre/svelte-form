{#if parentForm && component }
<svelte:component this="{component}" {name} bind:value {...props} {placeholder} {isValid} {hasError} />
{/if}

<script>
    import { createForm, checkFormIsValid } from './formService';

    export default {
        data() {
            return {
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
            hasError: ({parentForm, isValid}) => {
                if (!parentForm) return;
                return parentForm.hasSubmitted && !isValid;
            },

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
                originalValue,
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

            if (!forms || !forms[belongsTo]) {
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
                    isDirty
                }

                element = form.formElements[name];
            };

            if (previous && element && !current.isDirty && changed.value) {
                form.isDirty = true;
                element.isDirty = true;
                this.set({ isDirty: true });
            }

            if (element) element.isValid = isValid;
            form.isValid = checkFormIsValid(form);

            this.store.set({
                forms
            })
        },


        oncreate() {
            setTimeout(() => {
                this.set({ isReady: true });
            }, 0);
        }
    }
</script>