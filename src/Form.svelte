<form on:submit=handleSubmit(event)>
    <slot></slot>

    {#if hasSubmitButton}
    <button type="submit">Submit</button>
    {/if}

    {#if hasResetButton}
    <button class="resetButton" on:click=handleReset(event)>Reset</button>
    {/if}
</form>


<script>

    export default {
        data() {
            return {
                name: undefined,
                hasSubmitButton: false,
                hasResetButton: false
            }
        },

        methods: {
            handleReset(event) {
                event.preventDefault();
                
                const { name } = this.get();
                const { forms } = this.store.get();
                let form = forms[name];
                if (form) {
                    form.shouldReset = 0;                
                    this.store.set({ forms });
                }
            },
            handleSubmit(event) {
                event.preventDefault();
                const { name } = this.get();
                const { forms } = this.store.get();
                const form = forms[name];
                if (form.isValid) {
                    form.hasSubmitted = true;
                }

                this.store.set({ forms });
            }
        }
    }
</script>