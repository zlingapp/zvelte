import { auth_fetch, auth_xhr } from "./auth";

export const FILESIZE_LIMIT_ICONS = 1_000_000; // 1 MB
export const FILESIZE_LIMIT_ATTACHMENTS = 250_000_000; // 250 MB

export interface UploadedFile {
    id: string;
    name: string;
    url: string;
    type: UploadedFileType;
}

export type UploadedFileType = "blob" | "image" | "video" | "audio" | "text";

export async function uploadFile(
    file: File,
    onProgress?: (e: ProgressEvent) => void
): Promise<UploadedFile> {
    const form = new FormData();
    form.append("file", file);

    const xhr = await auth_xhr("/api/media/upload", "POST");

    return new Promise((resolve, reject) => {
        xhr.upload.onprogress = onProgress;
        xhr.onreadystatechange = () => {
            if (xhr.readyState != XMLHttpRequest.DONE) {
                return;
            }

            if (xhr.status == 200) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(
                    `Failed to upload file: ${xhr.status} ${xhr.statusText}`
                );
            }
        };

        xhr.send(form);
    });
}
