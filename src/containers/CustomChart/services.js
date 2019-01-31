export const filterInformation = (selectedMeasures, selectedDimension, allInformation) => {
    if (selectedMeasures && selectedDimension.length) {
        const [field, value] = selectedDimension;
        return allInformation.filter(item => item[field] === value);
    }
    return allInformation;
};

const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};

export const convertDataForSelect = (data) =>
    Object.keys(data).map(key => ({
        value: key,
        label: capitalize(key),
        children: data[key].map(item => ({ value: item.id, label: item.name })),
    }));