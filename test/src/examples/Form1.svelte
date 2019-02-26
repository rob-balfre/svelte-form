<h1>Form</h1>
<Form name="form1" hasSubmitButton={true}>
    <div>
        <label for="Name">Name:</label>
        <FormElement belongsTo="form1" name="Name" bind:value="$form1Data.name" isRequired={true}
            pattern="Rob|Tom|Kev" />
    </div>
    <br />
    <div>
        <label for="world">World:</label>
        <FormElement belongsTo="form1" name="world" bind:value="$form1Data.world" isRequired={true} minlength="3"
            maxlength="6" />
    </div>
    <br />
</Form>

{#if $form1Data}
<h2>Data:</h2>
{#each Object.entries($form1Data) as [key, val]}
	<p>{key}:{val}</p>
{/each}
{/if }

{#if $forms}
<h2>Form state:</h2>
<p>Form isValid: {$forms.form1.isValid}</p>
<p>Form hasSubmitted: {$forms.form1.hasSubmitted}</p>
{/if}

<script>
    import Form from '../../../src/Form.svelte';
    import FormElement from '../../../src/FormElement.svelte';

    export default {
        components: {
            Form,
            FormElement
        },
        data() {
            return {
            }
        },
        methods: {
        }
    }

</script>