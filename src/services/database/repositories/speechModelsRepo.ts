import { getDatabase } from '../index';
import { InstalledSpeechModel, Language } from '../../../types/database';

export async function getInstalledModels(): Promise<InstalledSpeechModel[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<{
    model_id: string;
    language: string;
    name: string;
    version: string;
    file_path: string;
    checksum: string;
    size_bytes: number;
    installed_at: number;
    is_verified: number;
  }>('SELECT * FROM installed_speech_models');

  return rows.map((r) => ({
    modelId: r.model_id,
    language: r.language as Language,
    name: r.name,
    version: r.version,
    filePath: r.file_path,
    checksum: r.checksum,
    sizeBytes: r.size_bytes,
    installedAt: r.installed_at,
    isVerified: Boolean(r.is_verified),
  }));
}

export async function registerInstalledModel(model: InstalledSpeechModel): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `INSERT OR REPLACE INTO installed_speech_models (
      model_id, language, name, version, file_path, checksum, size_bytes, installed_at, is_verified
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    model.modelId,
    model.language,
    model.name,
    model.version,
    model.filePath,
    model.checksum,
    model.sizeBytes,
    model.installedAt,
    model.isVerified ? 1 : 0
  );
}

export async function removeInstalledModel(modelId: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM installed_speech_models WHERE model_id = ?', modelId);
}
