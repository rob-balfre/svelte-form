export const createForm = (state, {
    name,
    formElements,
    data    
}) => {
    if (!state && !state.store) return;

    let { forms } = state.store.get();

    forms = forms || {};
    forms[name] = {
        name,
        formElements: formElements || {},
        data: data || {},
        isDirty: false,
        hasSubmitted: false,
    }

    state.store.set({ forms });

    return state.store.get().forms
}

export const checkFormIsValid = (form) => {
    let isValid = true;
    
    Object.values(form.formElements).forEach(element => {
        if (isValid) {
            isValid = element.isValid || false;
        }
    })
    return isValid;
}