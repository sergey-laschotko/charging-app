
export function formatDate(date: Date) {
    let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let year = date.getFullYear();

    return { 
        hours, 
        minutes, 
        day, 
        month, 
        year,
        string: `${hours}:${minutes} ${day}.${month}.${year}` 
    };
}