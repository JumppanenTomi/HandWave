/**
 * A function that formats time in seconds into a string representation of minutes and seconds in the format "MM:SS".
 *
 * @param {*} timeInSeconds - The time in seconds.
 * @returns {string} - The formatted time string in the format "MM:SS".
 */
const formatTime = (timeInSeconds: any) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
};

export default formatTime