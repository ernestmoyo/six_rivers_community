/**
 * Convert Tanzania Admin Shapefiles to filtered GeoJSON for MapLibre GL
 * Reprojects from WGS_1984_World_Mercator (EPSG:3395) to WGS84 (EPSG:4326)
 * Filters to operational areas: Mbarali District (Usangu) + Kilombero District (Psolo)
 */
import * as shapefile from "shapefile";
import proj4 from "proj4";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SHAPEFILE_DIR = join(__dirname, "..", "..", "Tanzania_Admin_Shapefiles-main");
const OUTPUT_DIR = join(__dirname, "..", "public", "geo");

// Shapefiles are already in WGS84 (lon/lat degrees) despite .prj claiming World Mercator
// No reprojection needed

// Operational district names (case-insensitive matching)
const OPERATIONAL_DISTRICTS = ["mbarali", "kilombero"];

// Broader region filter for context layers
const OPERATIONAL_REGIONS = ["mbeya", "morogoro", "iringa", "njombe", "songwe"];

async function readShapefile(name) {
  const path = join(SHAPEFILE_DIR, name);
  const source = await shapefile.open(path);
  const features = [];
  let result;
  while (!(result = await source.read()).done) {
    if (result.value.geometry) {
      features.push(result.value);
    }
  }
  return features;
}

function matchesDistrict(props, districts) {
  // Region/District/Ward shapefiles use dist_name; Village shapefile uses District_N
  const fields = ["dist_name", "District_N", "counc_name"];
  for (const f of fields) {
    if (props[f]) {
      const val = String(props[f]).toLowerCase().trim();
      if (districts.some((d) => val.includes(d) || d.includes(val))) return true;
    }
  }
  return false;
}

function matchesRegion(props, regions) {
  // Region/District/Ward shapefiles use reg_name; Village shapefile uses Region_Nam
  const fields = ["reg_name", "Region_Nam"];
  for (const f of fields) {
    if (props[f]) {
      const val = String(props[f]).toLowerCase().trim();
      if (regions.some((r) => val.includes(r) || r.includes(val))) return true;
    }
  }
  return false;
}

function toGeoJSON(features) {
  return { type: "FeatureCollection", features };
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log("Reading shapefiles...");

  // 1. Regions - full Tanzania for context, but mark operational ones
  console.log("  Processing regions...");
  const regionFeatures = await readShapefile("Region.shp");
  console.log(`    Total regions: ${regionFeatures.length}`);
  // Log property keys from first feature
  if (regionFeatures.length > 0) {
    console.log(`    Region props: ${Object.keys(regionFeatures[0].properties).join(", ")}`);
    console.log(`    Sample: ${JSON.stringify(regionFeatures[0].properties)}`);
  }

  // Filter to operational regions only (southern Tanzania)
  const opRegions = regionFeatures.filter((f) => matchesRegion(f.properties, OPERATIONAL_REGIONS));
  console.log(`    Operational regions: ${opRegions.length}`);
  writeFileSync(join(OUTPUT_DIR, "regions.geojson"), JSON.stringify(toGeoJSON(opRegions)));

  // 2. Districts - filter to operational regions
  console.log("  Processing districts...");
  const districtFeatures = await readShapefile("District_Council.shp");
  console.log(`    Total districts: ${districtFeatures.length}`);
  if (districtFeatures.length > 0) {
    console.log(`    District props: ${Object.keys(districtFeatures[0].properties).join(", ")}`);
    console.log(`    Sample: ${JSON.stringify(districtFeatures[0].properties)}`);
  }

  // Keep all districts in operational regions for context
  const opDistricts = districtFeatures.filter(
    (f) => matchesRegion(f.properties, OPERATIONAL_REGIONS) || matchesDistrict(f.properties, OPERATIONAL_DISTRICTS)
  );
  console.log(`    Operational districts: ${opDistricts.length}`);
  writeFileSync(join(OUTPUT_DIR, "districts.geojson"), JSON.stringify(toGeoJSON(opDistricts)));

  // 3. Wards - filter to operational districts
  console.log("  Processing wards...");
  const wardFeatures = await readShapefile("Wards.shp");
  console.log(`    Total wards: ${wardFeatures.length}`);
  if (wardFeatures.length > 0) {
    console.log(`    Ward props: ${Object.keys(wardFeatures[0].properties).join(", ")}`);
    console.log(`    Sample: ${JSON.stringify(wardFeatures[0].properties)}`);
  }

  // Filter wards to operational districts
  const opWards = wardFeatures.filter((f) => matchesDistrict(f.properties, OPERATIONAL_DISTRICTS));
  console.log(`    Operational wards: ${opWards.length}`);
  writeFileSync(join(OUTPUT_DIR, "wards.geojson"), JSON.stringify(toGeoJSON(opWards)));

  // 4. Villages - filter to operational districts
  console.log("  Processing villages...");
  const villageFeatures = await readShapefile("villages.shp");
  console.log(`    Total villages: ${villageFeatures.length}`);
  if (villageFeatures.length > 0) {
    console.log(`    Village props: ${Object.keys(villageFeatures[0].properties).join(", ")}`);
    console.log(`    Sample: ${JSON.stringify(villageFeatures[0].properties)}`);
  }

  // Filter villages to operational districts
  const opVillages = villageFeatures.filter((f) => matchesDistrict(f.properties, OPERATIONAL_DISTRICTS));
  console.log(`    Operational villages: ${opVillages.length}`);
  writeFileSync(join(OUTPUT_DIR, "villages.geojson"), JSON.stringify(toGeoJSON(opVillages)));

  // Summary
  console.log("\n=== Conversion Complete ===");
  console.log(`Regions:   ${opRegions.length} features`);
  console.log(`Districts: ${opDistricts.length} features`);
  console.log(`Wards:     ${opWards.length} features`);
  console.log(`Villages:  ${opVillages.length} features`);
  console.log(`Output:    ${OUTPUT_DIR}`);
}

main().catch(console.error);
