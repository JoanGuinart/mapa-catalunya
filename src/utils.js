function convertircoordenades(lat, lng) {
    const coordenadesBarcelona = { x: 464, y: 481 };
    const coordenadesGirona = { x: 616.2104, y: 278.29543999999964 };
    const latBarcelona = 41.3851;
    const lngBarcelona = 2.1734;
    const latGirona = 41.9793;
    const lngGirona = 2.8198;

    let x_pantalla = coordenadesBarcelona.x + ((coordenadesGirona.x - coordenadesBarcelona.x) * (lng - lngBarcelona) / (lngGirona - lngBarcelona));

    let y_pantalla = coordenadesBarcelona.y + ((coordenadesGirona.y - coordenadesBarcelona.y) * (lat - latBarcelona) / (latGirona - latBarcelona));

    return { x: x_pantalla, y: y_pantalla };
}

export { convertircoordenades };