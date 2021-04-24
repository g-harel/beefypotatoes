function genID() {
    var result, i, j;
    result = "";
    for (j = 0; j < 32; j++) {
        if (j == 8 || j == 12 || j == 16 || j == 20) result = result + "-";
        i = Math.floor(Math.random() * 16)
            .toString(16)
            .toUpperCase();
        result = result + i;
    }
    return result;
}

const cardText = `
REPLACE ME
`;

for (const line of cardText.split("\n")) {
    if (line.trim() === "") continue;
    console.log(`{id: "${genID()}", text: \`${line.trim()}\`},`);
}
