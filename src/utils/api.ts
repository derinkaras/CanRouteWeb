


export const getCan = async (canId: string)=>{
    try{
        const response = await fetch(`https://canroute.onrender.com/api/v1/cans/${canId}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        return data.data
    } catch (error) {
        console.error("Error happened while getting the specific can: ", error);
    }

}