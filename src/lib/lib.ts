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

export function genID(): string {
    function chr4(){
        return Math.random().toString(16).slice(-4);
      }
      return chr4() + chr4() +
        '-' + chr4() +
        '-' + chr4() +
        '-' + chr4() +
        '-' + chr4() + chr4() + chr4();
}

export function onlyDigits(e: any) {
    e = e || event;
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    let chr = null;

    if (e.which == null) {
      if (e.keyCode < 32) return null;
      chr = String.fromCharCode(e.keyCode)
    }
    
    if (e.which != 0 && e.charCode != 0) {
      if (e.which < 32) return null;
      chr = String.fromCharCode(e.which)
    }

    if (chr == null) return;

    if (chr < "0" || chr > "9") return false;
}