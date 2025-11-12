export const addZero = (num: number) => (num < 10 ? `0${num}` : `${num}`);
export const formatDate = (date: Date, long: boolean = false) => {
    const day = date.getDate();
    const dayStr = addZero(day);

    const month = date.getMonth() + 1;
    const monthStr = addZero(month);

    const year = date.getFullYear();
    const stringifiedYear = year.toString();
    const yearStr = long
        ? `${stringifiedYear}`
        : `${stringifiedYear.slice(stringifiedYear.length - 2)}`;

    return (`${dayStr}/${monthStr}/${yearStr}`);
};
