


export const clearLocalStorageExcept = (keysToKeep: string[]) => {
    try {
        const allKeys = Object.keys(localStorage);
        const keysToRemove = allKeys.filter(key => !keysToKeep.includes(key));

        for (const keyToRemove of keysToRemove) {
            localStorage.removeItem(keyToRemove);
        }

    } catch (error){
        console.log("Error clearing localStorage: ", error)
    }
}
