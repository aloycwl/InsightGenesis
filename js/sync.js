import axios from 'axios';
import pkg from 'pg';
import { DU, QK, QU } from './config.js';
import { error, serializeError } from './logger.js';

const { Pool } = pkg;
let pool = null;

function getPool() {
  if (!pool) {
    pool = new Pool({ connectionString: DU });
  }
  return pool;
}

export function normalizeRecord(jsonData) {
  const vital = jsonData.vitalSigns || {};
  const holistic = jsonData.holisticHealth || {};
  const risks = jsonData.risks || {};
  const cardioRisks = risks.cardiovascularRisks || {};

  let systolic = vital.bloodPressureSystolic;
  let diastolic = vital.bloodPressureDiastolic;

  if (systolic === undefined || diastolic === undefined) {
    const bpRaw = vital.bloodPressure;
    if (typeof bpRaw === 'string' && bpRaw.includes('/')) {
      const parts = bpRaw.split('/');
      const left = parts[0].trim();
      const right = parts[1].trim();
      if (systolic === undefined && !isNaN(Number(left))) {
        systolic = Number(left);
      }
      if (diastolic === undefined && !isNaN(Number(right))) {
        diastolic = Number(right);
      }
    }
  }

  return {
    user_id: jsonData.user_id || null,
    timestamp: jsonData.timestamp || null,
    heart_rate: vital.heartRate ?? null,
    spo2: vital.spo2 ?? null,
    respiratory_rate: vital.respiratoryRate ?? null,
    stress_score: vital.stressScore ?? null,
    hrv_sdnn: vital.hrvSdnn ?? null,
    hrv_rmssd: vital.hrvRmssd ?? null,
    systolic_bp: systolic ?? null,
    diastolic_bp: diastolic ?? null,
    cardiovascular_risk: cardioRisks.generalRisk ?? null,
    stroke_risk: cardioRisks.stroke ?? null,
    general_wellness: holistic.generalWellness ?? null,
  };
}

export function toEmbeddingText(record) {
  const val = (key) => {
    const value = record[key];
    return value === null || value === undefined ? "unknown" : value;
  };

  const lines = [
    `User ID ${val('user_id')}`,
    `Timestamp ${val('timestamp')}`,
    `Heart rate ${val('heart_rate')} bpm`,
    `SpO2 ${val('spo2')} percent`,
    `Respiratory rate ${val('respiratory_rate')} breaths/min`,
    `Stress score ${val('stress_score')}`,
    `HRV SDNN ${val('hrv_sdnn')} ms`,
    `HRV RMSSD ${val('hrv_rmssd')} ms`,
    `Systolic blood pressure ${val('systolic_bp')} mmHg`,
    `Diastolic blood pressure ${val('diastolic_bp')} mmHg`,
    `Cardiovascular risk ${val('cardiovascular_risk')}`,
    `Stroke risk ${val('stroke_risk')}`,
    `General wellness ${val('general_wellness')}`
  ];
  return lines.join('. ') + '.';
}

export async function syncToNeonAndQdrant(rawPayload, cid, sourceId, createdAt) {
  if (!sourceId) return;

  const normalized = normalizeRecord(rawPayload);
  const embeddingText = toEmbeddingText(normalized);
  const externalId = sourceId.toString();

  // Insert into Neon
  const query = `
    INSERT INTO public.health_records (
      external_id, source_id, created_at, user_id, timestamp, heart_rate, spo2,
      respiratory_rate, stress_score, hrv_sdnn, hrv_rmssd, systolic_bp, diastolic_bp,
      cardiovascular_risk, stroke_risk, general_wellness, raw_payload
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
    )
    ON CONFLICT (external_id) DO UPDATE SET
      source_id = EXCLUDED.source_id,
      created_at = EXCLUDED.created_at,
      user_id = EXCLUDED.user_id,
      timestamp = EXCLUDED.timestamp,
      heart_rate = EXCLUDED.heart_rate,
      spo2 = EXCLUDED.spo2,
      respiratory_rate = EXCLUDED.respiratory_rate,
      stress_score = EXCLUDED.stress_score,
      hrv_sdnn = EXCLUDED.hrv_sdnn,
      hrv_rmssd = EXCLUDED.hrv_rmssd,
      systolic_bp = EXCLUDED.systolic_bp,
      diastolic_bp = EXCLUDED.diastolic_bp,
      cardiovascular_risk = EXCLUDED.cardiovascular_risk,
      stroke_risk = EXCLUDED.stroke_risk,
      general_wellness = EXCLUDED.general_wellness,
      raw_payload = EXCLUDED.raw_payload;
  `;

  const values = [
    externalId,
    sourceId,
    createdAt || new Date().toISOString(),
    normalized.user_id,
    normalized.timestamp,
    normalized.heart_rate,
    normalized.spo2,
    normalized.respiratory_rate,
    normalized.stress_score,
    normalized.hrv_sdnn,
    normalized.hrv_rmssd,
    normalized.systolic_bp,
    normalized.diastolic_bp,
    normalized.cardiovascular_risk,
    normalized.stroke_risk,
    normalized.general_wellness,
    rawPayload
  ];

  try {
    await getPool().query(query, values);
  } catch (error) {
    error("neon_insert_error", { error: serializeError(error) });
  }

  // Insert into Qdrant
  try {
    const qdrantPayload = {
      points: [
        {
          id: sourceId,
          payload: {
            source_id: sourceId,
            cid: cid,
            heart_rate: normalized.heart_rate,
            spo2: normalized.spo2,
            respiratory_rate: normalized.respiratory_rate,
            stress_score: normalized.stress_score,
            hrv_sdnn: normalized.hrv_sdnn,
            hrv_rmssd: normalized.hrv_rmssd,
            systolic_bp: normalized.systolic_bp,
            diastolic_bp: normalized.diastolic_bp,
            cardiovascular_risk: normalized.cardiovascular_risk,
            stroke_risk: normalized.stroke_risk,
            general_wellness: normalized.general_wellness,
          },
          vector: {
            embedding: {
              text: embeddingText,
              model: "sentence-transformers/all-MiniLM-L6-v2"
            }
          }
        }
      ]
    };

    await axios.put(
      `${QU}/collections/health_embeddings/points`,
      qdrantPayload,
      {
        headers: {
          'api-key': QK,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    error("qdrant_insert_error", { error: serializeError(error) });
  }
}
