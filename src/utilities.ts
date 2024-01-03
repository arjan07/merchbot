export const isJSON = (string: string): boolean => {
    let isJSON = true;
    try {
        JSON.parse(string);
    } catch (e) {
        isJSON = false;
    }
    return isJSON;
};
