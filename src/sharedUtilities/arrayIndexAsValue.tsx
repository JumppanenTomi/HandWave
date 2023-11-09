export default function arrayIndexAsValue(originalObject: { [key: string | number]: string | number }): { name: any, value: any }[] {
    const rearrangedJSON: { name: any, value: any }[] = [];

    for (const key in originalObject) {
        if (Object.prototype.hasOwnProperty.call(originalObject, key)) {
            const value = parseInt(key, 10); // Convert the key to an integer
            const name = originalObject[key];
            rearrangedJSON[value] = { name, value };
        }
    }

    return rearrangedJSON;
}
