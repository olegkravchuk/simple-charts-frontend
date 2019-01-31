export const filterInformation = (selectedBuyers, selectedDepartments, selectedRequesters, information) => {
    let filteredInformation = [ ...information ];

    if (selectedBuyers.length) {
        filteredInformation = filteredInformation.filter(item => selectedBuyers.includes(`${item.buyer}`));
    }
    if (selectedDepartments.length) {
        filteredInformation = filteredInformation.filter(item => selectedDepartments.includes(`${item.department}`));
    }
    if (selectedRequesters.length) {
        filteredInformation = filteredInformation.filter(item => selectedRequesters.includes(`${item.requester}`));
    }

    return filteredInformation;
};