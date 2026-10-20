import qrCode from "qrcode";

export async function generateQRCode(data: any): Promise<Buffer> {
    return await qrCode.toBuffer(data, { type: "png", width: 300, errorCorrectionLevel: "H" })
}