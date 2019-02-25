<form on:submit="handleSubmit(event)">
<div>
    <label for="hello">Hello:</label>
    <FormElement belongsTo="form1" name="hello" bind:value="$form1Data.hello" isRequired={true} />
</div>

<div>
    <label for="world">World:</label>
    <FormElement belongsTo="form1" name="world" bind:value="$form1Data.world" />
</div>

<button type="submit">Submit</button>
</form>

{#if $form1Data}
{#each Object.entries($form1Data) as [key, val]}
	<p>{key}:{val}</p>
{/each}
{/if }

<script>
    import FormElement from '../../../src/FormElement.svelte';

    export default {
        components: {
            FormElement
        },
        data() {
            return {
            }
        },
        methods: {
            handleSubmit(e) {
                e.preventDefault();
            }
        }
    }

</script>