export const createForm = (state, {
    name,
    formElements,
    data,
    isValid,
    isDirty,
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
        isValid,
        isDirty: isDirty === undefined ? false : isDirty,
        onChange: onChange || emptyFn,
        handleReset: handleReset || emptyFn,
        handleSubmit: handleSubmit || emptyFn
    }

    state.store.set({ forms });

    return state.store.get().forms
}