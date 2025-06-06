// ABOUTME: Type definitions for error correction system that automatically fixes common Things3 issues
// ABOUTME: Provides interfaces for correction results, types, and detailed reporting

/**
 * Types of corrections that can be applied
 */
export enum CorrectionType {
  DATE_CONFLICT = 'date_conflict',
  MISSING_TITLE = 'missing_title',
  INVALID_PROJECT_REFERENCE = 'invalid_project_reference',
  INVALID_AREA_REFERENCE = 'invalid_area_reference',
  INVALID_TAG_NAME = 'invalid_tag_name',
}

/**
 * Result of a single correction operation
 */
export interface CorrectionResult {
  type: CorrectionType;
  field: string;
  originalValue: unknown;
  correctedValue: unknown;
  reason: string;
}

/**
 * Complete correction report for an operation
 */
export interface CorrectionReport<T = Record<string, unknown>> {
  hasCorrections: boolean;
  corrections: CorrectionResult[];
  correctedData: T;
}

/**
 * Interface for correction strategies
 */
export interface CorrectionStrategy<T = Record<string, unknown>> {
  shouldCorrect(data: T): boolean;
  correct(data: T): CorrectionResult | null;
}