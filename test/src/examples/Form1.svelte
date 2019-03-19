<h1>Form</h1>
<Form name="form1" hasSubmitButton={true} hasResetButton={true}>
    <div>
        <label for="Name">Name:</label>
        <FormElement belongsTo="form1" name="Name" bind:value="$form1Data.name" isRequired={true} component={CustomFormElem}/>
    </div>
    <br />
    <div>
        <label for="world">World:</label>
        <FormElement belongsTo="form1" name="world" bind:value="$form1Data.world" isRequired={true} component={CustomFormElem}/>
    </div>
    <br />
    <div>
        <label for="magic">Magic:</label>
        <FormElement belongsTo="form1" name="magic" bind:value="$form1Data.magic" isRequired={true} component={CustomFormElem} />
    </div>
    <br />
    <div>
        <label for="custom">Custom:</label>
        <FormElement belongsTo="form1" name="custom" bind:value="$form1Data.custom" isRequired={true} component={CustomFormElem}/>
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
<p>Form isDirty: {$forms.form1.isDirty}</p>
<p>Form hasSubmitted: {$forms.form1.hasSubmitted}</p>
{/if}

<script>
    import Form from '../../../src/Form.svelte';
    import FormElement from '../../../src/FormElement.svelte';
    import CustomFormElem from './CustomFormElem.svelte';

    export default {
        components: {
            Form,
            FormElement
        },
        data() {
            return {
                CustomFormElem
            }
        },
        methods: {
        }
    }

</script>