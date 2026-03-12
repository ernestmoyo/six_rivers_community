<div align="center">

# 🇹🇿 Tanzania Geospatial Data Repository

### A comprehensive collection of high-quality, ready-to-use shapefiles and geospatial datasets for the United Republic of Tanzania.

<br>

[![QGIS Compatible](https://img.shields.io/badge/QGIS-Compatible-589632?style=for-the-badge&logo=qgis&logoColor=white)](https://qgis.org)
[![ArcGIS Compatible](https://img.shields.io/badge/ArcGIS-Compatible-2C7AC3?style=for-the-badge&logo=arcgis&logoColor=white)](https://www.esri.com/en-us/arcgis/about-arcgis/overview)
[![GeoPandas](https://img.shields.io/badge/GeoPandas-Ready-139C5A?style=for-the-badge&logo=pandas&logoColor=white)](https://geopandas.org/)
[![R sf](https://img.shields.io/badge/R%20sf-Ready-276DC3?style=for-the-badge&logo=r&logoColor=white)](https://r-spatial.github.io/sf/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![CRS](https://img.shields.io/badge/CRS-EPSG%3A4326%20(WGS%2084)-blue?style=for-the-badge&logo=openstreetmap&logoColor=white)](https://epsg.io/4326)
[![Format](https://img.shields.io/badge/Format-Shapefile%20%7C%20CSV-orange?style=for-the-badge&logo=files&logoColor=white)](#-technical-specifications)
[![GitHub repo size](https://img.shields.io/github/repo-size/Heed725/Tanzania_Admin_Shapefiles?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Heed725/Tanzania_Admin_Shapefiles)

<br>

> Administrative boundaries · Electoral constituencies · Historical census data · Population figures · Physical features

<br>

</div>

---

## 📥 Quick Download

<div align="center">

| | Link | Description |
|:---:|:---|:---|
| 📦 | [**Download Full Repository (.zip)**](https://github.com/Heed725/Tanzania_Admin_Shapefiles/archive/refs/heads/main.zip) | All shapefiles, CSVs, and metadata in one package |

</div>

<details>
<summary><strong>⬇️ Download Individual Layers</strong></summary>

<br>

**Administrative Boundaries**

| Layer | Shapefile | Download |
|:---|:---|:---:|
| 🗺️ Regions (Admin 1) | `Region.shp` | [Download](https://github.com/Heed725/Tanzania_Admin_Shapefiles/raw/main/Region.shp) |
| 🏛️ District Councils (Admin 2) | `District_Council.shp` | [Download](https://github.com/Heed725/Tanzania_Admin_Shapefiles/raw/main/District_Council.shp) |
| 📍 Wards (Admin 3) | `Wards.shp` | [Download](https://github.com/Heed725/Tanzania_Admin_Shapefiles/raw/main/Wards.shp) |
| 🏘️ Villages (Admin 4) | `villages.shp` | [Download](https://github.com/Heed725/Tanzania_Admin_Shapefiles/raw/main/villages.shp) |

**Electoral Boundaries**

| Layer | Shapefile | Download |
|:---|:---|:---:|
| 🗳️ Constituencies | `Constituencies.shp` | [Download](https://github.com/Heed725/Tanzania_Admin_Shapefiles/raw/main/Constituencies.shp) |

**Physical Features**

| Layer | File | Download |
|:---|:---|:---:|
| 🌊 Water Bodies | `water_bodies.zip` | [Download](https://github.com/Heed725/Tanzania_Admin_Shapefiles/raw/main/water_bodies.zip) |

**Population Data (CSV)**

| Dataset | File | Download |
|:---|:---|:---:|
| 📊 Region Population | `Tanzania_Region_Population.csv` | [Download](https://github.com/Heed725/Tanzania_Admin_Shapefiles/raw/main/Tanzania_Region_Population.csv) |
| 📊 District Population | `Tanzania_District_Population.csv` | [Download](https://github.com/Heed725/Tanzania_Admin_Shapefiles/raw/main/Tanzania_District_Population.csv) |
| 📊 Ward Population | `Tanzania_Ward_Population.csv` | [Download](https://github.com/Heed725/Tanzania_Admin_Shapefiles/raw/main/Tanzania_Ward_Population.csv) |

**Historical Boundaries (Zipped Shapefiles)**

| Dataset | File | Download |
|:---|:---|:---:|
| 📜 Regions — 1988 Census | `geo_1_tz1988.zip` | [Download](https://github.com/Heed725/Tanzania_Admin_Shapefiles/raw/main/geo_1_tz1988.zip) |
| 📜 Regions — 2002 Census | `geo_1_tz2002.zip` | [Download](https://github.com/Heed725/Tanzania_Admin_Shapefiles/raw/main/geo_1_tz2002.zip) |
| 📜 Regions — 2012 Census | `geo_1_tz2012.zip` | [Download](https://github.com/Heed725/Tanzania_Admin_Shapefiles/raw/main/geo_1_tz2012.zip) |
| 📜 Districts — 1988 Census | `geo_2_tz1988.zip` | [Download](https://github.com/Heed725/Tanzania_Admin_Shapefiles/raw/main/geo_2_tz1988.zip) |
| 📜 Districts — 2002 Census | `geo_2_tz2002.zip` | [Download](https://github.com/Heed725/Tanzania_Admin_Shapefiles/raw/main/geo_2_tz2002.zip) |
| 📜 Districts — 2012 Census | `geo_2_tz2012.zip` | [Download](https://github.com/Heed725/Tanzania_Admin_Shapefiles/raw/main/geo_2_tz2012.zip) |

</details>

<br>

**Clone with Git:**

```bash
git clone https://github.com/Heed725/Tanzania_Admin_Shapefiles.git
```

---

## 🗂️ Data Catalog

### Current Administrative Boundaries

| Layer | Shapefile | Admin Level | Description |
|:---|:---|:---:|:---|
| **Regions** | `Region.shp` | 1 | Primary administrative divisions of mainland Tanzania and Zanzibar |
| **District Councils** | `District_Council.shp` | 2 | Sub-regional administrative units |
| **Wards** | `Wards.shp` | 3 | Administrative divisions below the district level |
| **Villages** | `villages.shp` | 4 | Smallest official administrative unit in rural areas |

### Electoral Boundaries

| Layer | Shapefile | Description |
|:---|:---|:---|
| **Constituencies** | `Constituencies.shp` | Electoral boundaries for parliamentary representation |

### Historical Administrative Boundaries

Census-year snapshots useful for temporal analysis and demographic studies.

| Census Year | Regions (Admin 1) | Districts (Admin 2) |
|:---:|:---:|:---:|
| **1988** | `geo_1_tz1988.zip` | `geo_2_tz1988.zip` |
| **2002** | `geo_1_tz2002.zip` | `geo_2_tz2002.zip` |
| **2012** | `geo_1_tz2012.zip` | `geo_2_tz2012.zip` |

### Population Data

Join-ready CSV files with population statistics for each administrative level.

| File | Level |
|:---|:---|
| `Tanzania_Region_Population.csv` | Regional |
| `Tanzania_District_Population.csv` | District |
| `Tanzania_Ward_Population.csv` | Ward |

### Physical Features

| File | Description |
|:---|:---|
| `water_bodies.zip` | Major water bodies including lakes and rivers |

---

## ⚙️ Technical Specifications

| Property | Value |
|:---|:---|
| **Data Format** | Esri Shapefile (`.shp`) and CSV (`.csv`) |
| **Coordinate Reference System** | WGS 84 (`EPSG:4326`) |
| **Encoding** | UTF-8 |

---

## 🛠️ Usage Examples

### 🗺️ Using in QGIS

1. Download and unzip the repository.
2. Open **QGIS Desktop**.
3. From the **Browser** panel, drag and drop a shapefile (e.g., `Region.shp`) onto the map canvas.
4. To add population data, drag `Tanzania_Region_Population.csv` into the **Layers** panel.
5. Right-click the `Region` layer → **Properties** → **Joins** and join the layer with the CSV on a common field (e.g., region name).

![QGIS Example](https://github.com/Heed725/Tanzania_Admin_Shapefiles/assets/81416694/287b32d0-0805-4c6e-8120-165b6f383e9b)

### 🐍 Python & GeoPandas

```python
import geopandas as gpd
import matplotlib.pyplot as plt

# Load the regions shapefile
regions = gpd.read_file("Tanzania_Admin_Shapefiles/Region.shp")
print(regions.head())

# Plot
fig, ax = plt.subplots(1, 1, figsize=(10, 10))
regions.plot(ax=ax, color="#E6F0FF", edgecolor="black")
ax.set_title("Administrative Regions of Tanzania", fontsize=16)
ax.set_xlabel("Longitude")
ax.set_ylabel("Latitude")
plt.tight_layout()
plt.show()
```

### 📊 R & `sf`

```r
library(sf)

# Load the districts shapefile
districts <- st_read("Tanzania_Admin_Shapefiles/District_Council.shp")
print(head(districts))

# Plot
plot(
  st_geometry(districts),
  border = "gray", col = "lightgreen",
  main = "Administrative Districts of Tanzania"
)
```

---

## 🤝 Contributing

Contributions are welcome! If you have updated data, corrections, or new layers to add:

1. **Fork** this repository
2. Create a new branch (`git checkout -b feature/new-layer`)
3. Commit your changes (`git commit -m "Add new layer"`)
4. Push to the branch (`git push origin feature/new-layer`)
5. Open a **Pull Request**

You can also [open an issue](https://github.com/Heed725/Tanzania_Admin_Shapefiles/issues) to report problems or suggest improvements.

---

## 📄 License

This dataset is made available under the **MIT License**. You are free to use, copy, modify, merge, publish, and distribute this data. See the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

The base data for these shapefiles was sourced and processed from public domain sources, including:

- [**GADM** — Database of Global Administrative Areas](https://gadm.org/)
- [**Tanzania National Bureau of Statistics (NBS)**](https://www.nbs.go.tz/)

---

<div align="center">

**⭐ If you find this repository useful, please consider giving it a star!**

</div>
