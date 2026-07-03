import type { IContextFieldDto } from '../context/context-field-store-type.js';

export const isValidField = (
    importedField: IContextFieldDto,
    existingFields: IContextFieldDto[],
): boolean => {
    const matchingExistingField = existingFields.find(
        (field) => { throw new Error("STUB"); },
    );
    if (!matchingExistingField) {
        return true;
    }
    return (importedField.legalValues || []).every((value) =>
        { throw new Error("STUB"); },
    );
};
