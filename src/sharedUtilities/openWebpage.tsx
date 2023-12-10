/**
 * Opens a webpage in the default browser.
 *
 * @param {string} url - The URL of the webpage to open.
 */
export const openWebpage = (url: string) => {
    const {shell} = window.require('electron');
    shell.openExternal(url);
};