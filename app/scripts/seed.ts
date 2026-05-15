/**
 * Meta-seed: runs all seed scripts in the right order.
 *
 *   1. Taxonomy        (Pillar → Programme → Subprogramme → Activity → Variant)
 *   2. Operational     (OperationalLocation rows against canonical shapefile)
 *   3. Theory of Change (depends on Pillar/Programme rows existing first)
 *
 * Usage:  npm run seed
 */
import { seedTaxonomy } from "./seed-taxonomy";
import { seedOperationalLocations } from "./seed-operational-locations";
import { seedTheoryOfChange } from "./seed-theory-of-change";
import { seedIndicators } from "./seed-indicators";
import { createSeedClient } from "./_prisma";

const prisma = createSeedClient();

async function main(): Promise<void> {
  /* eslint-disable no-console */
  console.log("[seed] 1/4  Programme taxonomy …");
  const tax = await seedTaxonomy();
  console.log(`[seed]      ${tax.pillars} pillars, ${tax.programmes} programmes, ${tax.subprogrammes} subprogrammes, ${tax.activities} activities, ${tax.variants} variants`);

  console.log("[seed] 2/4  Operational locations …");
  const loc = await seedOperationalLocations();
  console.log(`[seed]      ${loc.rows} rows`);

  console.log("[seed] 3/4  Theory of Change …");
  const toc = await seedTheoryOfChange();
  console.log(`[seed]      ${toc.tocs} ToCs, ${toc.nodes} nodes`);

  console.log("[seed] 4/4  Indicators …");
  const ind = await seedIndicators();
  console.log(`[seed]      ${ind.rows} indicators`);

  console.log("[seed] All done.");
  /* eslint-enable no-console */
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    // eslint-disable-next-line no-console
    console.error("[seed] Failed:", err);
    await prisma.$disconnect();
    process.exit(1);
  });
