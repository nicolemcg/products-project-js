export function readJSON(key, fallback = null){
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback
}

export function writeJSON(key, value){
    localStorage.setItem(key,JSON.stringify(value));
}

export function remove(key){
    localStorage.removeItem(key);
}