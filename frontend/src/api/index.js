export async function fetchMenus() {
    const response = await fetch(process.env.REACT_APP_MENUS_DATA_URL);
    const data = await response.json();

    console.log(data);

    return data;
}
