export const getLocalISOString = (dateISOString) => {
    const date = new Date(dateISOString);
    return `${date.getFullYear()}-${date.getMonth() < 9 ? "0" + (1 + date.getMonth()) : date.getMonth() + 1}-${date.getDate() < 10 ? "0" + (date.getDate()) : date.getDate()}T${date.getHours() < 10 ? "0" + (date.getHours()) : date.getHours()}:${date.getMinutes() < 10 ? "0" + (date.getMinutes()) : date.getMinutes()}`;
};
