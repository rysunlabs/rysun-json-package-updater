const decodeURIComponentSafe = (str:string) => {
    try {
        return decodeURIComponent(str);
    } catch (e) {
        return str;
    }
};

// Extract organization name and project name
export const extractInfo = (url:string) => {
    // Define regex to extract organization and project names
    const regex = /dev\.azure\.com\/([^\/]+)\/([^\/]+)\/_git\/([^\/]+)/;
    const match = url.match(regex);

    if (match) {
        const organizationName = decodeURIComponentSafe(match[1]);
        const projectName = decodeURIComponentSafe(match[3]);

        return { organizationName, projectName };
    } else {
        throw new Error('Failed to extract organization and project name.');
    }
};