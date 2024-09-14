import fs from 'fs';

export const isJSON = (string: string): boolean => {
    let isJSON = true;
    try {
        JSON.parse(string);
    } catch (e) {
        isJSON = false;
    }
    return isJSON;
};

export const loadJSON = async (path: string) => {
    const fileUrl = new URL(path, import.meta.url);
    return JSON.parse(await fs.promises.readFile(fileUrl, 'utf8'));
};
