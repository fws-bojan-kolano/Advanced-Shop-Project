import { SERVER } from "../utils/utils";

export async function fetchData(data) {
    const response = await fetch(`${SERVER}${data}`);
    const responseData = await response.json();

    //Errors
    if(!response.ok) {
        throw new Error(`Failed to fetch ${data}`);
    }

    return responseData.data;
}