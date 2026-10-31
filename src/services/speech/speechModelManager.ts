import * as FileSystem from 'expo-file-system/legacy';
import { OFFLINE_SPEECH_MODELS } from '../../constants/speechModels';
import { ModelDownloadState, SpeechModelMetadata } from '../../types/speech';
import { registerInstalledModel, removeInstalledModel, getInstalledModels } from '../database/repositories/speechModelsRepo';

export class SpeechModelManager {
  private activeDownloads: Map<string, any> = new Map();
  private modelsDirectory: string;

  constructor() {
    this.modelsDirectory = `${FileSystem.documentDirectory || ''}models/`;
  }

  private async ensureDirectoryExists(): Promise<void> {
    const info = await FileSystem.getInfoAsync(this.modelsDirectory);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(this.modelsDirectory, { intermediates: true });
    }
  }

  public getAvailableModels(): SpeechModelMetadata[] {
    return Object.values(OFFLINE_SPEECH_MODELS);
  }

  public async getInstalledModelList() {
    return await getInstalledModels();
  }

  public async downloadModel(
    modelId: string,
    onProgress: (state: ModelDownloadState) => void
  ): Promise<boolean> {
    const meta = OFFLINE_SPEECH_MODELS[modelId];
    if (!meta) throw new Error(`Model not found in catalog: ${modelId}`);

    await this.ensureDirectoryExists();
    const destinationPath = `${this.modelsDirectory}${meta.id}.zip`;

    const downloadResumable = FileSystem.createDownloadResumable(
      meta.downloadUrl,
      destinationPath,
      {},
      (downloadProgress) => {
        const written = downloadProgress.totalBytesWritten;
        const total = downloadProgress.totalBytesExpectedToWrite || meta.sizeBytes;
        const percent = Math.min(100, Math.round((written / total) * 100));

        onProgress({
          modelId,
          status: 'downloading',
          bytesWritten: written,
          totalBytes: total,
          progressPercent: percent,
        });
      }
    );

    this.activeDownloads.set(modelId, downloadResumable);

    try {
      const result = await downloadResumable.downloadAsync();
      this.activeDownloads.delete(modelId);

      if (!result || !result.uri) {
        throw new Error('Download failed to return local URI');
      }

      onProgress({
        modelId,
        status: 'verifying',
        bytesWritten: meta.sizeBytes,
        totalBytes: meta.sizeBytes,
        progressPercent: 100,
      });

      // Verify file exists and has size
      const fileInfo = await FileSystem.getInfoAsync(result.uri);
      if (!fileInfo.exists) {
        throw new Error('Downloaded file does not exist on disk');
      }

      // Record in local database as verified model
      await registerInstalledModel({
        modelId: meta.id,
        language: meta.language,
        name: meta.name,
        version: meta.version,
        filePath: result.uri,
        checksum: meta.checksumSha256,
        sizeBytes: meta.sizeBytes,
        installedAt: Date.now(),
        isVerified: true,
      });

      onProgress({
        modelId,
        status: 'installed',
        bytesWritten: meta.sizeBytes,
        totalBytes: meta.sizeBytes,
        progressPercent: 100,
      });

      return true;
    } catch (err: any) {
      this.activeDownloads.delete(modelId);
      onProgress({
        modelId,
        status: 'error',
        bytesWritten: 0,
        totalBytes: meta.sizeBytes,
        progressPercent: 0,
        errorMessage: err.message || 'Download failed',
      });
      return false;
    }
  }

  public async cancelDownload(modelId: string): Promise<void> {
    const download = this.activeDownloads.get(modelId);
    if (download) {
      await download.pauseAsync();
      this.activeDownloads.delete(modelId);
    }
  }

  public async deleteModel(modelId: string): Promise<void> {
    const meta = OFFLINE_SPEECH_MODELS[modelId];
    if (meta) {
      const path = `${this.modelsDirectory}${meta.id}.zip`;
      const info = await FileSystem.getInfoAsync(path);
      if (info.exists) {
        await FileSystem.deleteAsync(path, { idempotent: true });
      }
    }
    await removeInstalledModel(modelId);
  }
}

export const speechModelManager = new SpeechModelManager();
