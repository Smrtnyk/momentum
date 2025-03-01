export function getColorFromId(id: string): string {
    const colors = [
        "deep-purple",
        "indigo",
        "light-blue",
        "teal",
        "light-green",
        "amber",
        "deep-orange",
    ];

    const hash = id.split("").reduce(function (acc, char) {
        // eslint-disable-next-line no-bitwise -- FIXME
        return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const index = Math.abs(hash) % colors.length;
    return `${colors[index]}-lighten-1`;
}
