"use server";

import { findAndDeleteOrphanedImages } from "@/lib/supabase/orphan-cleanup";

export type OrphanCleanupResult = {
  deleted: string[];
  errors: { path: string; error: string }[];
  dryRun: boolean;
};

export async function runOrphanCleanup(
  dryRun: boolean
): Promise<OrphanCleanupResult> {
  const result = await findAndDeleteOrphanedImages({ dryRun });
  return {
    deleted: result.deleted,
    errors: result.errors,
    dryRun: result.dryRun,
  };
}
