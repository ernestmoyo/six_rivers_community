# Standard Operating Procedure
# Six Rivers Community Intelligence Platform

**Document Reference:** SOP/SRC/001
**Version:** 1.0
**Date:** 10 March 2026
**Prepared by:** Ernest Moyo, 7Square Inc.
**Approved by:** ___________________ (Six Rivers Africa)

---

## 1. Purpose

This SOP provides step-by-step guidance for the Six Rivers Africa community team on how to use the Community Intelligence Platform to:

- Map and monitor operational villages adjacent to Nyerere National Park (Psolo Sector) and in the Usangu Basin
- Track farming activities, seedling distributions, and agroforestry outcomes
- Monitor seedling survival rates and understand environmental factors (drought, sandy soil, rainfall) affecting them
- Record and track cattle pressure incidents in the Usangu Basin
- Collect field data from village visits using mobile devices
- Generate impact reports for quarterly board and donor reporting

This platform operates **outside the National Park** at village and farm level. It complements the Landscape Health Intelligence Dashboard, which monitors conditions **inside** the protected areas.

---

## 2. Scope

This SOP applies to the following Six Rivers Africa community team members:

| Name | Role | Primary Responsibilities on Platform |
|------|------|--------------------------------------|
| **Mary Marandu** | Impact Manager | Dashboard review, impact reporting, donor report generation, programme oversight |
| **Edna Sonda** | M&E Specialist | Data quality review, monitoring indicators, verifying field submissions |
| **Lilian Mihambo** | Project Officer (Usangu) | Cattle incident reporting, Usangu Basin field visits, coordinating with Mbarali team |
| **Justina Kizanye** | Project Officer (Mbarali/Psolo) | Farmer registration, seedling distribution, survival checks, nursery management |
| **Irene Masonda** | Project Officer (Psolo) | Farmer registration, agroforestry plot mapping, field visits, nursery checks |

---

## 3. Platform Access

**URL:** _(to be provided upon deployment)_
**Supported devices:** Desktop browser, mobile phone browser (Android/iOS)
**Offline capability:** Field forms can be saved offline and synced when internet is available

### 3.1 Logging In

1. Open the platform URL in your browser (Chrome recommended)
2. Enter your Six Rivers email address and password
3. You will be directed to the **Dashboard** page

### 3.2 Navigation

The left sidebar provides access to all modules:

- **Dashboard** — Overview of all programme KPIs
- **Map** — Interactive map of operational villages
- **Villages** — Village directory and detail pages
- **Farming** — Farmers, seedling distributions, crop cycles, agroforestry
- **Nurseries** — Nursery management and seedling batch tracking
- **Cattle** — Cattle incident reporting and pressure monitoring (Usangu)
- **Field Collection** — Mobile forms for field visits
- **Impact** — Donor reporting and quarterly reports
- **Climate** — Weather and drought risk monitoring per ward

On mobile phones, tap the menu icon (three lines) in the top-left corner to open the sidebar.

---

## 4. Daily Operations

### 4.1 Morning Check (All Team Members) — 5 minutes

**When:** Start of each working day
**Who:** All team members

1. Open the **Dashboard** (`/dashboard`)
2. Review the **KPI summary cards** at the top:
   - Total farmers engaged
   - Seedlings distributed (cumulative)
   - Average survival rate — _flag if below 65%_
   - Operational villages count
3. Check the **Recent Activity** panel for new submissions from other field officers
4. Review the **Climate Conditions** panel — note any wards showing **"Drought Risk"** (red badge)
   - If a ward shows drought risk, **do not distribute seedlings** in that ward until conditions improve
   - This addresses the challenge raised by Justina: _"the sand rice is very high, so most of the seedlings end up dying when it's the drought season"_

---

### 4.2 Farmer Registration (Justina, Irene, Lilian)

**When:** Upon first engagement with a new farmer in an operational village
**Where:** In the field or at the village office

1. Go to **Farming > Farmers** (`/farming/farmers`)
2. Click **"Register Farmer"**
3. Fill in the form:
   - **Name:** Full name of the farmer
   - **Village:** Select from the dropdown (only operational villages are listed)
   - **Phone:** Mobile number (if available)
   - **Farm Area (hectares):** Estimated size of the farm
   - **GPS Location:** Tap **"Capture GPS"** while standing at the farmer's farm to record coordinates
4. Submit the form
5. The farmer now appears in the village's farmer list and on the map

**Important:** Each farmer should be registered only once. Search for the farmer's name first before creating a new entry.

---

### 4.3 Seedling Distribution Recording (Justina, Irene, Lilian)

**When:** Every time seedlings are distributed to a farmer
**Where:** At the distribution point in the village

This is one of the most important data collection activities. It creates the record that will later be checked for survival rates.

1. Go to **Farming > Distributions** (`/farming/distributions`)
2. Click **"New Distribution"**
3. Fill in the form:
   - **Farmer:** Select the registered farmer receiving seedlings
   - **Species:** Select the tree species (e.g., Moringa, Mango, Avocado, Grevillea, Neem)
   - **Quantity:** Number of seedlings distributed
   - **Date:** Date of distribution
   - **Nursery:** Select which nursery the seedlings came from
   - **GPS Location:** Capture the location where seedlings were planted
4. Submit

**If distributing multiple species to the same farmer:** Create one distribution record per species. This allows us to track survival rates per species separately — critical for understanding which species survive best in sandy/drought conditions.

---

### 4.4 Seedling Survival Checks (Justina, Irene, Lilian)

**When:** 8 weeks after distribution, then every 4 weeks thereafter
**Where:** At the farmer's plot

This directly addresses the team's core challenge: _"most of the seedlings end up dying when it's the drought season"_ — by systematically tracking survival, we identify which species, which villages, and which seasons have the best outcomes.

1. Go to **Field Collection** (`/field/visit`) or use the quick action **"Survival Check"**
2. Select **Visit Type: Survival Check**
3. Select the **village** and **farmer**
4. For each previous distribution:
   - Count the number of **surviving seedlings**
   - Enter the count (the system calculates survival rate automatically)
   - **Take a photo** of the surviving seedlings as evidence
5. Add **notes** describing conditions:
   - Soil condition (sandy, waterlogged, etc.)
   - Signs of drought stress
   - Pest or animal damage
   - Farmer's observations
6. Submit or **Save Offline** if no internet

**Interpreting survival rates:**
| Rate | Status | Action |
|------|--------|--------|
| 75%+ | Good | Continue current approach |
| 60–74% | Moderate | Review soil conditions, consider different species |
| Below 60% | Poor | Investigate cause — drought, soil, species suitability. Report to Mary/Edna |

---

### 4.5 Crop Cycle Tracking (Justina, Irene)

**When:** At planting and at harvest for each short-term crop cycle
**Context:** As discussed in the meeting, the community promotes short-term farming (3-month cycles) including onions, cassava, maize, rice, and sunflower.

#### At Planting:
1. Go to **Farming > Crop Cycles** (`/farming/crops`)
2. Click **"New Crop Cycle"**
3. Enter:
   - **Farmer:** Select from registered farmers
   - **Crop type:** Onion, Cassava, Maize, Rice, Sunflower, etc.
   - **Planting date:** When the crop was planted
   - **Expected harvest date:** Typically 3 months after planting
   - **Area (hectares):** How much land is under this crop

#### At Harvest:
1. Find the crop cycle in the table (filter by "Growing" status)
2. Click to edit and enter:
   - **Actual harvest date**
   - **Yield (kg):** Total harvest weight

This data allows Mary to report on agricultural productivity alongside agroforestry outcomes.

---

### 4.6 Agroforestry Plot Mapping (Justina, Irene)

**When:** When a farmer establishes a new agroforestry plot or when mapping existing plots
**Context:** As Justina described: _"we are doing the agroforestry approach, where we are providing the seedlings to farmers"_

1. Go to **Farming > Agroforestry** (`/farming/agroforestry`)
2. Click **"New Plot"**
3. Enter:
   - **Farmer:** Select from registered farmers
   - **Area (hectares):** Size of the agroforestry plot
   - **Species planted:** Select all tree species on the plot (multiple selection)
   - **Planting date**
   - **GPS boundary:** Walk the boundary of the plot with GPS capture enabled
4. Submit

Agroforestry plots are shown on the map with species tags, allowing the team to visualise the spatial distribution of tree planting across operational villages.

---

### 4.7 Nursery Management (Justina, Irene, Lilian)

**When:** Weekly nursery checks and when new batches are started

#### Checking a Nursery:
1. Go to **Nurseries** (`/nurseries`)
2. Click on the nursery you are managing
3. Review:
   - **Active batches** and their status (germinating, growing, ready, distributed)
   - **Production vs distribution** progress bar
   - **Germination counts** for each batch

#### Recording a New Batch:
1. Within a nursery detail page, click **"New Batch"**
2. Enter:
   - **Species**
   - **Quantity planted**
   - **Planting date**
3. Update the batch status as it progresses:
   - **Germinating** → record germination count
   - **Growing** → update health status
   - **Ready** → mark as ready for distribution
   - **Distributed** → mark when all seedlings have been given to farmers

---

### 4.8 Cattle Incident Reporting (Lilian — Usangu Lead)

**When:** Immediately upon becoming aware of a cattle-related incident in the Usangu Basin
**Context:** As Brandon assigned: _"Lily will be in the lead on this Usangu cattle story"_

1. Go to **Cattle > Incidents** (`/cattle/incidents`) or use the **Field Collection** quick action
2. Click **"Report Incident"**
3. Fill in:
   - **Date:** When the incident occurred
   - **GPS Location:** Capture your current location or pinpoint on the map
   - **Village:** Nearest operational village
   - **Incident Type:**
     - **Restricted Area Grazing** — cattle grazing in protected/restricted zones
     - **Crop Damage** — cattle damaging farmers' crops
     - **Water Point Conflict** — herders blocking community water access
     - **Corridor Blockage** — cattle blocking wildlife corridors
   - **Severity:** Low / Moderate / High
   - **Estimated Herd Size:** Approximate number of cattle
   - **Description:** Detailed notes on what happened, who was involved
   - **Photo:** Take a photo if safe to do so
4. Submit

**Severity Guidelines:**
| Severity | When to use |
|----------|------------|
| **Low** | Small herd (< 50), temporary, no direct damage |
| **Moderate** | Medium herd (50–150), crop damage or repeated occurrence |
| **High** | Large herd (150+), blocking water access, entering restoration areas, or recurring pattern |

The **Cattle Pressure Map** (`/cattle/map`) shows a heatmap of all incidents, allowing the team and management to visualise where pressure is concentrated and how it changes over time.

---

### 4.9 General Field Visit Recording (All Field Officers)

**When:** Every time a field officer visits an operational village for any reason

1. Go to **Field Collection** (`/field/visit`)
2. Select the appropriate **quick action card**:
   - Farm Check
   - Nursery Check
   - Community Meeting
   - Seedling Distribution
   - Incident Report
3. Fill in the form:
   - **Village**
   - **Date**
   - **GPS Location** — always capture this
   - **Notes** — describe observations, decisions made, farmer feedback
   - **Photos** — take at least one photo per visit
4. Submit or **Save Offline**

**Offline Mode:** If you have no internet connection:
- Fill in the form as normal
- Tap **"Save Offline"** instead of Submit
- The form is stored on your phone
- When you have internet, go to **Field Collection > Queue** (`/field/queue`)
- Review pending submissions and tap **"Sync All"**

---

## 5. Weekly Operations

### 5.1 Data Quality Review (Edna — M&E Specialist)

**When:** Every Monday morning
**Duration:** 30 minutes

1. Open the **Dashboard** and review KPIs for any unexpected changes
2. Go to **Villages** (`/villages`) — check that all operational villages have recent activity
3. Go to **Farming > Distributions** — review last week's distributions for completeness:
   - Every distribution should have: farmer name, species, quantity, date, GPS
   - Flag any distributions without GPS or with unusually high/low quantities
4. Go to **Field Collection** — review recent visits:
   - All visits should have notes and GPS
   - Check that **Synced** status shows green for all submissions
5. If any data quality issues are found, communicate with the relevant field officer

### 5.2 Climate Review & Planting Advisory (All Team — coordinated by Mary)

**When:** Every Monday
**Duration:** 15 minutes

1. Open **Climate** (`/climate`)
2. Review each ward's conditions:
   - **Rainfall** — is it sufficient for recently planted seedlings?
   - **Drought index** — any wards above 0.6 (drought risk)?
   - **Temperature** — any extreme heat that could stress seedlings?
3. Based on conditions, decide:
   - Which wards are safe for new seedling distributions this week
   - Which wards need survival checks prioritised
   - Whether to delay any planned plantings

Share this advisory with Justina, Irene, and Lilian via the team WhatsApp group.

---

## 6. Monthly Operations

### 6.1 Survival Rate Analysis (Mary, Edna)

**When:** First week of each month
**Duration:** 1 hour

1. Open the **Dashboard** and note the **Average Survival Rate**
2. Go to **Farming > Distributions** — sort by **Survival** column
3. Identify:
   - **Top-performing species** (highest survival rates)
   - **Under-performing species** (below 60%)
   - **Problem villages** (consistently low survival)
   - **Seasonal patterns** (e.g., dry season vs. wet season survival)
4. Cross-reference with **Climate** data:
   - Do villages with low survival correspond to drought-risk wards?
   - Is sandy soil the issue (as raised by Justina about Kilombero Valley)?
5. Document findings and share with the team
6. Adjust species selection for future distributions based on performance

### 6.2 Cattle Pressure Trend Review (Lilian, Mary)

**When:** End of each month
**Duration:** 30 minutes

1. Open **Cattle** (`/cattle`)
2. Review the KPIs:
   - Total incidents this month vs. last month
   - Number of high-severity incidents
   - Estimated total herd sizes
3. Review the **Incidents by Type** chart — is one type dominating?
4. Review the **Pressure Map** — are incidents concentrated in specific villages?
5. Document trends and escalate to Brandon/Thomas if:
   - High-severity incidents are increasing
   - New areas are being affected
   - The same corridors/water points are repeatedly impacted

---

## 7. Quarterly Operations

### 7.1 Quarterly Impact Report Generation (Mary)

**When:** Last week of each quarter (March, June, September, December)
**Duration:** 2 hours

This is the report that goes to donors and the board. As Mary described her role: _"tracking our impact and reporting other stuff."_

1. Open **Impact** (`/impact`)
2. Review all KPI cards and quarterly trend charts
3. Click **"Generate Quarterly Report"**
4. The system auto-generates a report including:
   - **Farmers engaged** (total and new this quarter)
   - **Seedlings distributed** (total and by species)
   - **Survival rates** (overall, by species, by village, by season)
   - **Agroforestry area** (total hectares under tree-crop integration)
   - **Crop cycle outcomes** (yields, area under cultivation)
   - **Nursery production** (seedlings produced vs. distributed)
   - **Cattle incidents** (count, severity, trends)
   - **Field visits** (count, coverage, types)
   - **Climate context** (rainfall patterns, drought events)
5. Review the **draft report preview** on screen
6. Edit any narrative sections or key highlights
7. Click **"Download as PDF"** for the final report
8. Also use **"Export CSV"** if raw data is needed for board presentations

### 7.2 Quarterly Data Export (Edna)

1. Open **Impact > Export** (`/impact/export`)
2. Select the quarter and data categories
3. Export as CSV or Excel
4. Use for:
   - Cross-checking against manual records
   - Feeding into Six Rivers' internal reporting systems
   - Sharing with Thomas/Brandon for technical review

---

## 8. Map Module — Detailed Usage

The Map (`/map`) is the central visual tool for the platform. It shows **where Six Rivers works** — not inside the National Park, but in the **villages adjacent to it**.

### 8.1 Understanding the Map

- **Green dots** = Psolo Sector villages (adjacent to Nyerere NP)
- **Amber dots** = Usangu Basin villages (Mbarali District)
- **Shaded area on the right** = Nyerere National Park boundary (for reference only)
- **Red pulsing dots** = Cattle incidents (when cattle layer is active)
- **Tree icons** = Nursery locations (when nursery layer is active)

### 8.2 Layer Controls

At the bottom of the map, toggle layers on/off:

| Layer | What it shows | Useful for |
|-------|--------------|------------|
| **Villages** | Village boundaries and markers | Seeing where SRA operates |
| **Farmers** | Individual farmer locations | Checking farm coverage per village |
| **Nurseries** | Nursery locations with capacity | Planning seedling distribution logistics |
| **Cattle Incidents** | Incident heatmap | Identifying pressure hotspots (Lilian) |
| **Climate** | Drought risk overlay per ward | Planning seedling distribution timing |

### 8.3 Village Detail Panel

Click any village marker to see:
- **Population** and distance to NP boundary
- **Number of farmers** registered
- **Seedlings distributed** to that village
- **Ward and district** administrative details

### 8.4 Zone Navigation

Use the **"Psolo Sector"** and **"Usangu Basin"** buttons at the top-left to quickly zoom to each operational zone.

---

## 9. How This Connects to the Landscape Dashboard

As discussed in the meeting, this platform works **outside** the National Park while the Landscape Health Intelligence Dashboard works **inside**. The two are connected:

| This Platform (Community) | Landscape Dashboard (Conservation) |
|---------------------------|-------------------------------------|
| Villages adjacent to NP | Inside Nyerere NP & Usangu GR |
| Farmer & seedling data | Satellite vegetation indices (NDVI/EVI) |
| Crop cycles & agroforestry | Fire, water, deforestation monitoring |
| Cattle incidents | Agricultural encroachment detection |
| Field officer submissions | Automated monthly satellite analysis |

**The connection:** When community agroforestry activity increases in villages adjacent to the NP, the landscape dashboard can show whether the vegetation health in the buffer zone is also improving. This is the **conservation linkage** — demonstrating that Six Rivers' community work contributes to landscape health. This is a powerful story for donor reporting.

---

## 10. Troubleshooting

| Issue | Solution |
|-------|----------|
| Form won't submit | Check internet connection. If offline, use "Save Offline" |
| GPS not capturing | Ensure location services are enabled on your phone. Go outside for better signal |
| Can't find a farmer | Search by name in Farming > Farmers. If not found, register them first |
| Village not listed | Only operational villages appear. Contact Mary to add a new village |
| Data not showing on dashboard | Check if submissions were synced (Field Collection > Queue) |
| Photos not uploading | Large photos may take time on slow connections. Try again when signal improves |
| Climate data looks old | Weather data updates daily from Open-Meteo. Check the date shown |

---

## 11. Data Collection Schedule Summary

| Activity | Frequency | Responsible | Platform Module |
|----------|-----------|------------|-----------------|
| Morning dashboard check | Daily | All | Dashboard |
| Farmer registration | As needed (new engagement) | Justina, Irene, Lilian | Farming > Farmers |
| Seedling distribution | At each distribution event | Justina, Irene, Lilian | Farming > Distributions |
| Survival check | Every 4 weeks post-distribution | Justina, Irene, Lilian | Field Collection |
| Crop cycle — planting | At planting | Justina, Irene | Farming > Crops |
| Crop cycle — harvest | At harvest | Justina, Irene | Farming > Crops |
| Nursery check | Weekly | Justina, Irene, Lilian | Nurseries |
| Cattle incident | Immediately | Lilian | Cattle > Incidents |
| Field visit | Every village visit | All field officers | Field Collection |
| Data quality review | Weekly (Monday) | Edna | Dashboard, all modules |
| Climate advisory | Weekly (Monday) | Mary + team | Climate |
| Survival analysis | Monthly | Mary, Edna | Dashboard, Distributions |
| Cattle trend review | Monthly | Lilian, Mary | Cattle |
| Quarterly report | End of quarter | Mary | Impact |
| Data export | Quarterly | Edna | Impact > Export |

---

## 12. Key Definitions

| Term | Definition |
|------|-----------|
| **Operational village** | A village where Six Rivers Africa implements community programmes |
| **Psolo Sector** | The area of villages adjacent to Nyerere National Park where SRA works |
| **Usangu Basin** | The area around Mbarali District and the Usangu Game Reserve |
| **Seedling distribution** | The act of providing tree seedlings to a registered farmer |
| **Survival check** | A follow-up visit to count how many distributed seedlings are still alive |
| **Survival rate** | (Surviving seedlings / Original quantity) x 100 |
| **Crop cycle** | A single planting-to-harvest period, typically 3 months for short-term crops |
| **Agroforestry** | The practice of integrating trees with crop farming on the same land |
| **Cattle incident** | Any event involving cattle causing pressure on land, water, crops, or wildlife corridors |
| **Drought index** | A measure from 0 to 1 where values above 0.6 indicate drought risk |
| **Buffer zone** | The area between operational villages and the National Park boundary |

---

## 13. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 10 March 2026 | Ernest Moyo | Initial SOP based on team meeting of 2 March 2026 |

---

**For questions or support, contact:**
Ernest Moyo | ernest@7squareinc.com | 7Square Inc.
Lilian Mihambo (SRA Coordinator) | Lilian.Mihambo@sixriversafrica.com
