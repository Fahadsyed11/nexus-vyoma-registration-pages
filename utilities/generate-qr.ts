import qrCode from "qrcode";

export async function generateQRCode(data: any): Promise<Buffer> {
    const payload = JSON.stringify(data);
    return await qrCode.toBuffer(payload, { type: "png", width: 300, errorCorrectionLevel: "H" })
}