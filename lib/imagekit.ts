import ImageKit from "imagekit";

export const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export async function deleteFromImageKit(fileId: string) {
  try {
    await imagekit.deleteFile(fileId);
  } catch (err) {
    console.error("[IMAGEKIT_DELETE_ERROR]", err);
    throw new Error("Failed to delete file from ImageKit");
  }
}