export const createForm = (state, {
    name,
    formElements,
    data,
    onChange,
    handleReset,
    handleSubmit
}) => {
    if (!state && !state.store) return;
    let emptyFn = () => { };

    let { forms } = state.store.get();

    forms = forms || {};

    forms[name] = {
        name,
        formElements: formElements || {},
        data: data || {},
        isDirty: false,
        hasSubmitted: false,
        onChange: onChange || emptyFn,
        handleReset: handleReset || emptyFn,
        handleSubmit: handleSubmit || emptyFn
    }

    state.store.set({ forms });

    return state.store.get().forms
}

export const handleFormElementStateChange = () => {
    console.log('object');
}

export const checkFormIsValid = (form) => {
    let isValid = true;
    // console.log('form.formElements :', form.formElements);
    Object.values(form.formElements).forEach(element => {
        if (isValid) {
            isValid = element.isValid || false;
        }
    })
    return isValid;
}