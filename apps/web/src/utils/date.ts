export const formatDate = (date: Date, long: boolean = false) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const monthStr = month < 10
        ? `0${month}`
        : `${month}`;

    const year = date.getFullYear();
    const stringifiedYear = year.toString();
    const yearStr = long
        ? `${stringifiedYear}`
        : `${stringifiedYear.slice(stringifiedYear.length - 2)}`;

    return (`${day}/${monthStr}/${yearStr}`);
};
