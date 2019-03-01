<div class="customFormElem">
    <p>{ value || 'undefined...' }</p>
    <button on:click=handleRandomize(event)>Randomize value</button>
</div>

<script>
    export default {
        methods: {
            handleRandomize(event) {
                event.preventDefault();
                this.set({
                    value: Math.random().toString(36).substring(7)
                })
            }
        }
    }
</script>