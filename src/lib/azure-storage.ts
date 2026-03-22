// ============================================================
// src/lib/azure-storage.ts
// Azure Blob Storage — upload de imagens de imóveis
// ============================================================
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  ContainerClient,
} from "@azure/storage-blob";

const ACCOUNT_NAME  = process.env.AZURE_STORAGE_ACCOUNT_NAME!;
const ACCOUNT_KEY   = process.env.AZURE_STORAGE_ACCOUNT_KEY!;
const CONTAINER     = process.env.AZURE_STORAGE_CONTAINER_NAME ?? "imoveis";

// Build the credential and client (reuse across requests)
function getContainerClient(): ContainerClient {
  const credential   = new StorageSharedKeyCredential(ACCOUNT_NAME, ACCOUNT_KEY);
  const blobService  = new BlobServiceClient(
    `https://${ACCOUNT_NAME}.blob.core.windows.net`,
    credential
  );
  return blobService.getContainerClient(CONTAINER);
}

/**
 * Upload a file Buffer/Uint8Array to Azure Blob Storage.
 * Returns the public HTTPS URL of the uploaded blob.
 */
export async function uploadToAzure({
  buffer,
  filename,
  contentType,
  folder = "properties",
}: {
  buffer: Buffer | Uint8Array;
  filename: string;
  contentType: string;
  folder?: string;
}): Promise<string> {
  const container = getContainerClient();

  // Ensure container exists (idempotent)
  await container.createIfNotExists({ access: "blob" });

  // Build unique blob name: folder/timestamp-originalname
  const ext      = filename.split(".").pop() ?? "jpg";
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  const blobName = `${folder}/${Date.now()}-${safeName}`;

  const blockBlob = container.getBlockBlobClient(blobName);

  await blockBlob.uploadData(buffer, {
    blobHTTPHeaders: { blobContentType: contentType },
  });

  return blockBlob.url; // public URL (container access = blob)
}

/**
 * Delete a blob from Azure Blob Storage by its full URL.
 */
export async function deleteFromAzure(blobUrl: string): Promise<void> {
  try {
    const container = getContainerClient();
    // Extract blob name from URL: everything after the container name
    const url     = new URL(blobUrl);
    const prefix  = `/${CONTAINER}/`;
    const idx     = url.pathname.indexOf(prefix);
    if (idx === -1) return;
    const blobName = url.pathname.slice(idx + prefix.length);
    await container.deleteBlob(blobName, { deleteSnapshots: "include" });
  } catch (err) {
    console.error("[Azure] deleteFromAzure error:", err);
  }
}

/**
 * Generate a short-lived SAS URL for private blobs (if container is private).
 * Not needed when container access = "blob" (public read).
 */
export async function generateSasUrl(blobUrl: string, expiresInMinutes = 60): Promise<string> {
  const credential = new StorageSharedKeyCredential(ACCOUNT_NAME, ACCOUNT_KEY);
  const url        = new URL(blobUrl);
  const prefix     = `/${CONTAINER}/`;
  const idx        = url.pathname.indexOf(prefix);
  if (idx === -1) return blobUrl;
  const blobName   = url.pathname.slice(idx + prefix.length);

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: CONTAINER,
      blobName,
      permissions: BlobSASPermissions.parse("r"),
      expiresOn: new Date(Date.now() + expiresInMinutes * 60 * 1000),
    },
    credential
  ).toString();

  return `${blobUrl}?${sasToken}`;
}
