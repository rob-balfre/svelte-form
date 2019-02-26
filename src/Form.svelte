<form on:submit=handleSubmit(event)>
    <slot></slot>

    {#if hasSubmitButton}
    <button type="submit">Submit</button>
    {/if}
</form>


<script>

    export default {
        data() {
            return {
                hasSubmitButton: false
            }
        },
        methods: {
            handleSubmit(event) {
                event.preventDefault();
                const {name} = this.get();
                const {forms} = this.store.get();
                const form = forms[name];
                if (form.isValid) {
                    form.hasSubmitted = true;
                }

                this.store.set({ forms });
            }
        }
    }

</script>