export const openWebpage = (url: string) => {
    const {shell} = window.require('electron');
    shell.openExternal(url);
};