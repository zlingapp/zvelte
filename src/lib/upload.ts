import { authXhr } from "src/lib/auth";

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

    const xhr = await authXhr("/media/upload", "POST");

    return new Promise((resolve, reject) => {
        xhr.upload.onprogress = onProgress as any;
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

export interface PendingUpload {
    // for svelte key blocks
    randomLocalId: string;
    // local file
    file: File;
    // server-side file, present if upload is complete
    uploadedFile?: UploadedFile;
    // progress, 0-100
    progress: number;
    // whether the upload has started
    started: boolean;
}
