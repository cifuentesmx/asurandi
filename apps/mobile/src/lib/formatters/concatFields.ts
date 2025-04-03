export const concatFields = (renderer: string, fields: string[], record: { [key: string]: string }) => {
    const joiner = renderer.split(':')[1] ?? ' '
    const selected = []
    for (let i = 0; i < fields.length; i++) {
        const key = fields[i];
        if (record[key] && record[key] !== '') selected.push(record[key])
        else selected.push('-')
    }
    return selected.length < 2 ? (selected[0] ?? '') : selected.join(joiner)
}

