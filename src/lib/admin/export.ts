export type ExportCell = string | number | boolean;
const xml = (s: unknown) => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]!));
function download(bytes: BlobPart, type: string, name: string) { const url = URL.createObjectURL(new Blob([bytes], { type })); const link = document.createElement("a"); link.href = url; link.download = name; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
export function exportCSV(rows: ExportCell[][], name: string) { const safe = (v: ExportCell) => { const raw = String(v); return '"' + (/^[=+@\-\t\r]/.test(raw) ? "'" + raw : raw).replace(/"/g, '""') + '"'; }; download("\ufeff" + rows.map(row => row.map(safe).join(",")).join("\r\n"), "text/csv;charset=utf-8", name + ".csv"); }
function crc32(bytes: Uint8Array) { let crc = 0xffffffff; for (const byte of bytes) {
    crc ^= byte;
    for (let i = 0; i < 8; i++)
        crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
} return (crc ^ 0xffffffff) >>> 0; }
export function workbookBytes(rows: ExportCell[][]) {
    const column = (index: number) => { let value = ""; for (let n = index + 1; n; n = Math.floor((n - 1) / 26))
        value = String.fromCharCode(65 + (n - 1) % 26) + value; return value; };
    const sheet = `<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${rows.map((row, i) => `<row r="${i + 1}">${row.map((cell, j) => typeof cell === "number" ? `<c r="${column(j)}${i + 1}"><v>${Number.isFinite(cell) ? cell : 0}</v></c>` : `<c r="${column(j)}${i + 1}" t="inlineStr"><is><t xml:space="preserve">${xml(cell)}</t></is></c>`).join("")}</row>`).join("")}</sheetData></worksheet>`;
    const files: Record<string, string> = {
        "[Content_Types].xml": '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>',
        "_rels/.rels": '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
        "xl/workbook.xml": '<?xml version="1.0"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Funlands" sheetId="1" r:id="rId1"/></sheets></workbook>',
        "xl/_rels/workbook.xml.rels": '<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>',
        "xl/worksheets/sheet1.xml": sheet
    };
    const encoder = new TextEncoder(), chunks: Uint8Array[] = [], central: Uint8Array[] = [];
    let offset = 0;
    for (const [path, content] of Object.entries(files)) {
        const name = encoder.encode(path), body = encoder.encode(content), crc = crc32(body);
        const local = new Uint8Array(30 + name.length), l = new DataView(local.buffer);
        l.setUint32(0, 0x04034b50, true);
        l.setUint16(4, 20, true);
        l.setUint16(6, 0x800, true);
        l.setUint32(14, crc, true);
        l.setUint32(18, body.length, true);
        l.setUint32(22, body.length, true);
        l.setUint16(26, name.length, true);
        local.set(name, 30);
        chunks.push(local, body);
        const c = new Uint8Array(46 + name.length), v = new DataView(c.buffer);
        v.setUint32(0, 0x02014b50, true);
        v.setUint16(4, 20, true);
        v.setUint16(6, 20, true);
        v.setUint16(8, 0x800, true);
        v.setUint32(16, crc, true);
        v.setUint32(20, body.length, true);
        v.setUint32(24, body.length, true);
        v.setUint16(28, name.length, true);
        v.setUint32(42, offset, true);
        c.set(name, 46);
        central.push(c);
        offset += local.length + body.length;
    }
    const size = central.reduce((n, c) => n + c.length, 0), end = new Uint8Array(22), v = new DataView(end.buffer);
    v.setUint32(0, 0x06054b50, true);
    v.setUint16(8, central.length, true);
    v.setUint16(10, central.length, true);
    v.setUint32(12, size, true);
    v.setUint32(16, offset, true);
    const out = new Uint8Array(offset + size + 22);
    let pos = 0;
    for (const c of [...chunks, ...central, end]) {
        out.set(c, pos);
        pos += c.length;
    }
    return out;
}
export function exportExcel(rows: ExportCell[][], name: string) { download(new Uint8Array(workbookBytes(rows)), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", name + ".xlsx"); }
