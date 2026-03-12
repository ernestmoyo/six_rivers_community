"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Layers,
  ZoomIn,
  ZoomOut,
  Locate,
  Building2,
  Sprout,
  TreePine,
  Beef,
  ChevronRight,
  X,
  Filter,
  Eye,
  EyeOff,
  Map,
  Satellite,
} from "lucide-react";
import {
  demoVillages,
  demoFarmers,
  demoNurseries,
  demoCattleIncidents,
} from "@/lib/demo-data";
import { OPERATIONAL_ZONES, MAP_CONFIG } from "@/lib/constants";
import Link from "next/link";

// MapLibre GL types
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

type SelectedFeature = {
  type: "village" | "ward" | "district" | "region";
  name: string;
  properties: Record<string, unknown>;
};

const BASEMAPS = {
  streets: {
    label: "Streets",
    icon: Map,
    url: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  },
  satellite: {
    label: "Satellite",
    icon: Satellite,
    // ESRI World Imagery (free, no API key required)
    url: {
      version: 8,
      sources: {
        "esri-satellite": {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          maxzoom: 18,
          attribution: "Esri, Maxar, Earthstar Geographics",
        },
      },
      layers: [
        {
          id: "esri-satellite-layer",
          type: "raster",
          source: "esri-satellite",
          minzoom: 0,
          maxzoom: 18,
        },
      ],
    } as maplibregl.StyleSpecification,
  },
  hybrid: {
    label: "Hybrid",
    icon: Satellite,
    // Satellite + CartoDB labels overlay
    url: {
      version: 8,
      sources: {
        "esri-satellite": {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          maxzoom: 18,
          attribution: "Esri, Maxar, Earthstar Geographics",
        },
        "carto-labels": {
          type: "raster",
          tiles: [
            "https://basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}@2x.png",
          ],
          tileSize: 256,
          maxzoom: 18,
        },
      },
      layers: [
        {
          id: "esri-satellite-layer",
          type: "raster",
          source: "esri-satellite",
          minzoom: 0,
          maxzoom: 18,
        },
        {
          id: "carto-labels-layer",
          type: "raster",
          source: "carto-labels",
          minzoom: 0,
          maxzoom: 18,
        },
      ],
    } as maplibregl.StyleSpecification,
  },
} as const;

const BOUNDARY_LAYERS = [
  { id: "regions", label: "Regions", color: "#6366f1", opacity: 0.08, lineWidth: 3 },
  { id: "districts", label: "Districts", color: "#8b5cf6", opacity: 0.1, lineWidth: 2 },
  { id: "wards", label: "Wards", color: "#f59e0b", opacity: 0.12, lineWidth: 1.5 },
  { id: "villages", label: "Villages", color: "#22c55e", opacity: 0.15, lineWidth: 1 },
] as const;

const OVERLAY_LAYERS = [
  { id: "farmers", label: "Farmers", icon: Sprout, color: "#3b82f6" },
  { id: "nurseries", label: "Nurseries", icon: TreePine, color: "#f59e0b" },
  { id: "cattle", label: "Cattle Incidents", icon: Beef, color: "#ef4444" },
] as const;

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeBasemap, setActiveBasemap] = useState<keyof typeof BASEMAPS>("streets");

  // Filter state
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [selectedWard, setSelectedWard] = useState<string>("all");
  const [selectedVillageName, setSelectedVillageName] = useState<string>("all");

  // Layer visibility
  const [visibleBoundaries, setVisibleBoundaries] = useState<string[]>([
    "villages",
    "wards",
    "districts",
  ]);
  const [visibleOverlays, setVisibleOverlays] = useState<string[]>([]);

  // Feature detail panel
  const [selectedFeature, setSelectedFeature] = useState<SelectedFeature | null>(null);

  // Filter options derived from GeoJSON data
  const [districts, setDistricts] = useState<string[]>([]);
  const [wards, setWards] = useState<string[]>([]);
  const [villageNames, setVillageNames] = useState<string[]>([]);
  const [geoData, setGeoData] = useState<Record<string, GeoJSON.FeatureCollection>>({});

  // Sidebar open state
  const [filterOpen, setFilterOpen] = useState(true);

  // Load GeoJSON data
  useEffect(() => {
    const files = ["regions", "districts", "wards", "villages"];
    Promise.all(
      files.map((f) =>
        fetch(`/geo/${f}.geojson`)
          .then((r) => r.json())
          .then((data) => [f, data] as [string, GeoJSON.FeatureCollection])
      )
    ).then((results) => {
      const data: Record<string, GeoJSON.FeatureCollection> = {};
      for (const [key, fc] of results) {
        data[key] = fc;
      }
      setGeoData(data);

      // Extract unique district names from villages layer
      if (data.villages) {
        const dists = new Set<string>();
        const allWards = new Set<string>();
        const allVills = new Set<string>();
        for (const f of data.villages.features) {
          const p = f.properties!;
          if (p.District_N) dists.add(p.District_N as string);
          if (p.Ward_Name) allWards.add(p.Ward_Name as string);
          if (p.Vil_Mtaa_N) allVills.add(p.Vil_Mtaa_N as string);
        }
        setDistricts([...dists].sort());
        setWards([...allWards].sort());
        setVillageNames([...allVills].sort());
      }
    });
  }, []);

  // Compute filtered wards/villages based on selected filters
  const filteredWards = useCallback(() => {
    if (!geoData.villages) return [];
    const ws = new Set<string>();
    for (const f of geoData.villages.features) {
      const p = f.properties!;
      if (selectedDistrict === "all" || p.District_N === selectedDistrict) {
        if (p.Ward_Name) ws.add(p.Ward_Name as string);
      }
    }
    return [...ws].sort();
  }, [geoData, selectedDistrict]);

  const filteredVillageNames = useCallback(() => {
    if (!geoData.villages) return [];
    const vs = new Set<string>();
    for (const f of geoData.villages.features) {
      const p = f.properties!;
      if (selectedDistrict !== "all" && p.District_N !== selectedDistrict) continue;
      if (selectedWard !== "all" && p.Ward_Name !== selectedWard) continue;
      if (p.Vil_Mtaa_N) vs.add(p.Vil_Mtaa_N as string);
    }
    return [...vs].sort();
  }, [geoData, selectedDistrict, selectedWard]);

  // Initialize MapLibre GL
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_CONFIG.style,
      center: [MAP_CONFIG.defaultCenter.lng, MAP_CONFIG.defaultCenter.lat],
      zoom: MAP_CONFIG.defaultZoom,
      minZoom: MAP_CONFIG.minZoom,
      maxZoom: MAP_CONFIG.maxZoom,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.addControl(
      new maplibregl.ScaleControl({ maxWidth: 200, unit: "metric" }),
      "bottom-right"
    );

    map.on("load", () => {
      setMapLoaded(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Add GeoJSON sources and layers when data and map are ready
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || Object.keys(geoData).length === 0) return;

    // Add boundary sources and layers
    for (const layer of BOUNDARY_LAYERS) {
      const data = geoData[layer.id];
      if (!data) continue;

      const sourceId = `${layer.id}-source`;
      if (map.getSource(sourceId)) continue;

      map.addSource(sourceId, { type: "geojson", data });

      // Fill layer
      map.addLayer({
        id: `${layer.id}-fill`,
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": layer.color,
          "fill-opacity": layer.opacity,
        },
      });

      // Line layer
      map.addLayer({
        id: `${layer.id}-line`,
        type: "line",
        source: sourceId,
        paint: {
          "line-color": layer.color,
          "line-width": layer.lineWidth,
          "line-opacity": 0.7,
        },
      });

      // Label layer for villages
      if (layer.id === "villages") {
        map.addLayer({
          id: `${layer.id}-label`,
          type: "symbol",
          source: sourceId,
          layout: {
            "text-field": ["get", "Vil_Mtaa_N"],
            "text-size": 10,
            "text-anchor": "center",
            "text-allow-overlap": false,
          },
          paint: {
            "text-color": "#1e3a2f",
            "text-halo-color": "#ffffff",
            "text-halo-width": 1.5,
          },
          minzoom: 11,
        });
      }

      // Label layer for wards
      if (layer.id === "wards") {
        map.addLayer({
          id: `${layer.id}-label`,
          type: "symbol",
          source: sourceId,
          layout: {
            "text-field": ["get", "ward_name"],
            "text-size": 12,
            "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
            "text-anchor": "center",
            "text-allow-overlap": false,
          },
          paint: {
            "text-color": "#92400e",
            "text-halo-color": "#ffffff",
            "text-halo-width": 1.5,
          },
          minzoom: 9,
          maxzoom: 11,
        });
      }

      // Label layer for districts
      if (layer.id === "districts") {
        map.addLayer({
          id: `${layer.id}-label`,
          type: "symbol",
          source: sourceId,
          layout: {
            "text-field": ["coalesce", ["get", "dist_name"], ["get", "District_N"]],
            "text-size": 14,
            "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
            "text-anchor": "center",
            "text-allow-overlap": false,
          },
          paint: {
            "text-color": "#5b21b6",
            "text-halo-color": "#ffffff",
            "text-halo-width": 2,
          },
          minzoom: 7,
          maxzoom: 9,
        });
      }
    }

    // Add point overlay sources
    // Farmers
    const farmerGeoJSON: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: demoFarmers
        .filter((f) => f.farmLocationLat != null && f.farmLocationLng != null)
        .map((f) => ({
          type: "Feature" as const,
          geometry: {
            type: "Point" as const,
            coordinates: [f.farmLocationLng!, f.farmLocationLat!],
          },
          properties: { name: f.name, village: f.villageName, area: f.farmAreaHectares },
        })),
    };

    if (!map.getSource("farmers-source")) {
      map.addSource("farmers-source", { type: "geojson", data: farmerGeoJSON });
      map.addLayer({
        id: "farmers-points",
        type: "circle",
        source: "farmers-source",
        paint: {
          "circle-radius": 6,
          "circle-color": "#3b82f6",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
        },
        layout: { visibility: "none" },
      });
    }

    // Nurseries
    const nurseryGeoJSON: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: demoNurseries
        .filter((n) => n.locationLat != null && n.locationLng != null)
        .map((n) => ({
          type: "Feature" as const,
          geometry: {
            type: "Point" as const,
            coordinates: [n.locationLng!, n.locationLat!],
          },
          properties: { name: n.name, village: n.villageName, capacity: n.capacitySeedlings },
        })),
    };

    if (!map.getSource("nurseries-source")) {
      map.addSource("nurseries-source", { type: "geojson", data: nurseryGeoJSON });
      map.addLayer({
        id: "nurseries-points",
        type: "circle",
        source: "nurseries-source",
        paint: {
          "circle-radius": 8,
          "circle-color": "#f59e0b",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
        },
        layout: { visibility: "none" },
      });
      map.addLayer({
        id: "nurseries-label",
        type: "symbol",
        source: "nurseries-source",
        layout: {
          "text-field": ["get", "name"],
          "text-size": 10,
          "text-offset": [0, 1.5],
          "text-anchor": "top",
          visibility: "none",
        },
        paint: {
          "text-color": "#92400e",
          "text-halo-color": "#ffffff",
          "text-halo-width": 1,
        },
      });
    }

    // Cattle incidents
    const cattleGeoJSON: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: demoCattleIncidents.map((c) => ({
        type: "Feature" as const,
        geometry: {
          type: "Point" as const,
          coordinates: [c.locationLng, c.locationLat],
        },
        properties: {
          village: c.villageName,
          type: c.incidentType,
          severity: c.severity,
          herdSize: c.estimatedHerdSize,
          description: c.description,
        },
      })),
    };

    if (!map.getSource("cattle-source")) {
      map.addSource("cattle-source", { type: "geojson", data: cattleGeoJSON });
      map.addLayer({
        id: "cattle-points",
        type: "circle",
        source: "cattle-source",
        paint: {
          "circle-radius": 7,
          "circle-color": [
            "match",
            ["get", "severity"],
            "high",
            "#ef4444",
            "moderate",
            "#f59e0b",
            "#22c55e",
          ],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
        },
        layout: { visibility: "none" },
      });
    }

    // Click handlers for village polygons
    map.on("click", "villages-fill", (e) => {
      if (!e.features || e.features.length === 0) return;
      const feature = e.features[0];
      const p = feature.properties;
      setSelectedFeature({
        type: "village",
        name: p.Vil_Mtaa_N || "Unknown",
        properties: p,
      });
    });

    map.on("click", "wards-fill", (e) => {
      if (!e.features || e.features.length === 0) return;
      const feature = e.features[0];
      const p = feature.properties;
      setSelectedFeature({
        type: "ward",
        name: p.ward_name || "Unknown",
        properties: p,
      });
    });

    // Cursor change on hover
    for (const layer of ["villages-fill", "wards-fill"]) {
      map.on("mouseenter", layer, () => {
        map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", layer, () => {
        map.getCanvas().style.cursor = "";
      });
    }
  }, [mapLoaded, geoData]);

  // Update boundary layer visibility
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    for (const layer of BOUNDARY_LAYERS) {
      const visibility = visibleBoundaries.includes(layer.id) ? "visible" : "none";
      const fillLayer = map.getLayer(`${layer.id}-fill`);
      const lineLayer = map.getLayer(`${layer.id}-line`);
      const labelLayer = map.getLayer(`${layer.id}-label`);
      if (fillLayer) map.setLayoutProperty(`${layer.id}-fill`, "visibility", visibility);
      if (lineLayer) map.setLayoutProperty(`${layer.id}-line`, "visibility", visibility);
      if (labelLayer) map.setLayoutProperty(`${layer.id}-label`, "visibility", visibility);
    }
  }, [visibleBoundaries, mapLoaded]);

  // Update overlay layer visibility
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    for (const layer of OVERLAY_LAYERS) {
      const visibility = visibleOverlays.includes(layer.id) ? "visible" : "none";
      const pointLayer = map.getLayer(`${layer.id}-points`);
      const labelLayer = map.getLayer(`${layer.id}-label`);
      if (pointLayer) map.setLayoutProperty(`${layer.id}-points`, "visibility", visibility);
      if (labelLayer) map.setLayoutProperty(`${layer.id}-label`, "visibility", visibility);
    }
  }, [visibleOverlays, mapLoaded]);

  // Apply district/ward/village filter to village layer
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const villageSource = map.getSource("villages-source") as maplibregl.GeoJSONSource;
    if (!villageSource || !geoData.villages) return;

    let filtered = geoData.villages.features;

    if (selectedDistrict !== "all") {
      filtered = filtered.filter((f) => f.properties!.District_N === selectedDistrict);
    }
    if (selectedWard !== "all") {
      filtered = filtered.filter((f) => f.properties!.Ward_Name === selectedWard);
    }
    if (selectedVillageName !== "all") {
      filtered = filtered.filter((f) => f.properties!.Vil_Mtaa_N === selectedVillageName);
    }

    villageSource.setData({ type: "FeatureCollection", features: filtered });

    // Also filter wards source if district is selected
    const wardSource = map.getSource("wards-source") as maplibregl.GeoJSONSource;
    if (wardSource && geoData.wards) {
      let filteredWards = geoData.wards.features;
      if (selectedDistrict !== "all") {
        filteredWards = filteredWards.filter((f) => {
          const dName = (f.properties!.dist_name as string || "").toLowerCase();
          return dName.includes(selectedDistrict.toLowerCase());
        });
      }
      if (selectedWard !== "all") {
        filteredWards = filteredWards.filter(
          (f) => f.properties!.ward_name === selectedWard
        );
      }
      wardSource.setData({ type: "FeatureCollection", features: filteredWards });
    }

    // Fit bounds to filtered features if a filter is active
    if (filtered.length > 0 && (selectedDistrict !== "all" || selectedWard !== "all" || selectedVillageName !== "all")) {
      const bounds = new maplibregl.LngLatBounds();
      for (const f of filtered) {
        const coords = f.geometry!;
        if (coords.type === "Polygon") {
          for (const ring of (coords as GeoJSON.Polygon).coordinates) {
            for (const c of ring) bounds.extend(c as [number, number]);
          }
        } else if (coords.type === "MultiPolygon") {
          for (const poly of (coords as GeoJSON.MultiPolygon).coordinates) {
            for (const ring of poly) {
              for (const c of ring) bounds.extend(c as [number, number]);
            }
          }
        }
      }
      map.fitBounds(bounds, { padding: 50, maxZoom: 14 });
    }
  }, [selectedDistrict, selectedWard, selectedVillageName, mapLoaded, geoData]);

  // Zone quick navigation
  const flyToZone = (zoneKey: string) => {
    const map = mapRef.current;
    if (!map) return;
    const zone = OPERATIONAL_ZONES[zoneKey as keyof typeof OPERATIONAL_ZONES];
    if (!zone) return;

    // Set district filter based on zone
    if (zoneKey === "usangu_basin") {
      setSelectedDistrict("Mbarali");
    } else if (zoneKey === "psolo") {
      setSelectedDistrict("Kilombero");
    }
    setSelectedWard("all");
    setSelectedVillageName("all");

    map.flyTo({
      center: [zone.center.lng, zone.center.lat],
      zoom: zone.zoom,
      duration: 1500,
    });
  };

  const resetFilters = () => {
    setSelectedDistrict("all");
    setSelectedWard("all");
    setSelectedVillageName("all");
    const map = mapRef.current;
    if (map) {
      map.flyTo({
        center: [MAP_CONFIG.defaultCenter.lng, MAP_CONFIG.defaultCenter.lat],
        zoom: MAP_CONFIG.defaultZoom,
        duration: 1000,
      });
    }
  };

  // Switch basemap — re-adds all GeoJSON layers after style change
  const switchBasemap = useCallback(
    (key: keyof typeof BASEMAPS) => {
      const map = mapRef.current;
      if (!map || key === activeBasemap) return;
      setActiveBasemap(key);

      const bm = BASEMAPS[key];
      const style = bm.url;

      // Save current center/zoom
      const center = map.getCenter();
      const zoom = map.getZoom();

      map.setStyle(style as string | maplibregl.StyleSpecification);

      // After new style loads, re-add all GeoJSON layers
      map.once("styledata", () => {
        // Re-add boundary layers
        for (const layer of BOUNDARY_LAYERS) {
          const data = geoData[layer.id];
          if (!data) continue;
          const sourceId = `${layer.id}-source`;
          if (map.getSource(sourceId)) continue;

          map.addSource(sourceId, { type: "geojson", data });

          const isSatellite = key === "satellite" || key === "hybrid";
          const lineColor = isSatellite ? "#ffffff" : layer.color;
          const textColor = isSatellite ? "#ffffff" : layer.id === "villages" ? "#1e3a2f" : layer.id === "wards" ? "#92400e" : "#5b21b6";

          map.addLayer({
            id: `${layer.id}-fill`,
            type: "fill",
            source: sourceId,
            paint: { "fill-color": layer.color, "fill-opacity": isSatellite ? 0.15 : layer.opacity },
            layout: { visibility: visibleBoundaries.includes(layer.id) ? "visible" : "none" },
          });
          map.addLayer({
            id: `${layer.id}-line`,
            type: "line",
            source: sourceId,
            paint: { "line-color": lineColor, "line-width": layer.lineWidth, "line-opacity": isSatellite ? 0.9 : 0.7 },
            layout: { visibility: visibleBoundaries.includes(layer.id) ? "visible" : "none" },
          });

          if (layer.id === "villages") {
            map.addLayer({
              id: `${layer.id}-label`,
              type: "symbol",
              source: sourceId,
              layout: {
                "text-field": ["get", "Vil_Mtaa_N"],
                "text-size": 10,
                "text-anchor": "center",
                "text-allow-overlap": false,
                visibility: visibleBoundaries.includes(layer.id) ? "visible" : "none",
              },
              paint: { "text-color": textColor, "text-halo-color": isSatellite ? "rgba(0,0,0,0.7)" : "#ffffff", "text-halo-width": 1.5 },
              minzoom: 11,
            });
          }
          if (layer.id === "wards") {
            map.addLayer({
              id: `${layer.id}-label`,
              type: "symbol",
              source: sourceId,
              layout: {
                "text-field": ["get", "ward_name"],
                "text-size": 12,
                "text-anchor": "center",
                "text-allow-overlap": false,
                visibility: visibleBoundaries.includes(layer.id) ? "visible" : "none",
              },
              paint: { "text-color": textColor, "text-halo-color": isSatellite ? "rgba(0,0,0,0.7)" : "#ffffff", "text-halo-width": 1.5 },
              minzoom: 9,
              maxzoom: 11,
            });
          }
          if (layer.id === "districts") {
            map.addLayer({
              id: `${layer.id}-label`,
              type: "symbol",
              source: sourceId,
              layout: {
                "text-field": ["coalesce", ["get", "dist_name"], ["get", "District_N"]],
                "text-size": 14,
                "text-anchor": "center",
                "text-allow-overlap": false,
                visibility: visibleBoundaries.includes(layer.id) ? "visible" : "none",
              },
              paint: { "text-color": textColor, "text-halo-color": isSatellite ? "rgba(0,0,0,0.7)" : "#ffffff", "text-halo-width": 2 },
              minzoom: 7,
              maxzoom: 9,
            });
          }
        }

        // Re-add overlay point layers
        const overlayConfigs = [
          {
            id: "farmers",
            data: {
              type: "FeatureCollection" as const,
              features: demoFarmers
                .filter((f) => f.farmLocationLat != null && f.farmLocationLng != null)
                .map((f) => ({
                  type: "Feature" as const,
                  geometry: { type: "Point" as const, coordinates: [f.farmLocationLng!, f.farmLocationLat!] },
                  properties: { name: f.name, village: f.villageName },
                })),
            },
            color: "#3b82f6",
          },
          {
            id: "nurseries",
            data: {
              type: "FeatureCollection" as const,
              features: demoNurseries
                .filter((n) => n.locationLat != null && n.locationLng != null)
                .map((n) => ({
                  type: "Feature" as const,
                  geometry: { type: "Point" as const, coordinates: [n.locationLng!, n.locationLat!] },
                  properties: { name: n.name, village: n.villageName },
                })),
            },
            color: "#f59e0b",
          },
          {
            id: "cattle",
            data: {
              type: "FeatureCollection" as const,
              features: demoCattleIncidents.map((c) => ({
                type: "Feature" as const,
                geometry: { type: "Point" as const, coordinates: [c.locationLng, c.locationLat] },
                properties: { village: c.villageName, severity: c.severity },
              })),
            },
            color: "#ef4444",
          },
        ];

        for (const cfg of overlayConfigs) {
          if (!map.getSource(`${cfg.id}-source`)) {
            map.addSource(`${cfg.id}-source`, { type: "geojson", data: cfg.data });
            map.addLayer({
              id: `${cfg.id}-points`,
              type: "circle",
              source: `${cfg.id}-source`,
              paint: {
                "circle-radius": cfg.id === "nurseries" ? 8 : cfg.id === "cattle" ? 7 : 6,
                "circle-color": cfg.id === "cattle"
                  ? ["match", ["get", "severity"], "high", "#ef4444", "moderate", "#f59e0b", "#22c55e"]
                  : cfg.color,
                "circle-stroke-color": "#ffffff",
                "circle-stroke-width": 2,
              },
              layout: { visibility: visibleOverlays.includes(cfg.id) ? "visible" : "none" },
            });
          }
        }

        // Re-add click handlers
        map.on("click", "villages-fill", (e) => {
          if (!e.features || e.features.length === 0) return;
          const feature = e.features[0];
          setSelectedFeature({ type: "village", name: feature.properties.Vil_Mtaa_N || "Unknown", properties: feature.properties });
        });
        map.on("click", "wards-fill", (e) => {
          if (!e.features || e.features.length === 0) return;
          const feature = e.features[0];
          setSelectedFeature({ type: "ward", name: feature.properties.ward_name || "Unknown", properties: feature.properties });
        });
        for (const layer of ["villages-fill", "wards-fill"]) {
          map.on("mouseenter", layer, () => { map.getCanvas().style.cursor = "pointer"; });
          map.on("mouseleave", layer, () => { map.getCanvas().style.cursor = ""; });
        }

        map.setCenter(center);
        map.setZoom(zoom);
      });
    },
    [activeBasemap, geoData, visibleBoundaries, visibleOverlays]
  );

  const toggleBoundary = (id: string) => {
    setVisibleBoundaries((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const toggleOverlay = (id: string) => {
    setVisibleOverlays((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  // Match selected feature to demo village for detail
  const matchedDemoVillage = selectedFeature?.type === "village"
    ? demoVillages.find(
        (v) =>
          v.name.toLowerCase() === selectedFeature.name.toLowerCase() ||
          selectedFeature.name.toLowerCase().includes(v.name.toLowerCase().split(" ")[0])
      )
    : null;

  return (
    <div className="flex flex-col h-screen">
      <Header title="Operational Map" subtitle="Real boundaries from Tanzania Admin Shapefiles" />

      <div className="flex flex-1 relative overflow-hidden">
        {/* Sidebar - Filters & Layers */}
        <div
          className={`${
            filterOpen ? "w-72" : "w-0"
          } transition-all duration-300 bg-background border-r overflow-hidden flex-shrink-0`}
        >
          <div className="w-72 h-full overflow-y-auto p-4 flex flex-col gap-5">
            {/* Zone Quick Nav */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Operational Zones
              </h3>
              <div className="flex gap-2">
                {Object.entries(OPERATIONAL_ZONES).map(([key, zone]) => (
                  <Button
                    key={key}
                    size="sm"
                    variant={
                      (key === "usangu_basin" && selectedDistrict === "Mbarali") ||
                      (key === "psolo" && selectedDistrict === "Kilombero")
                        ? "default"
                        : "outline"
                    }
                    className="text-xs flex-1"
                    onClick={() => flyToZone(key)}
                  >
                    {zone.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Cascading Filters */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Filters
                </h3>
                {(selectedDistrict !== "all" || selectedWard !== "all" || selectedVillageName !== "all") && (
                  <Button variant="ghost" size="sm" className="h-6 text-xs px-2" onClick={resetFilters}>
                    Reset
                  </Button>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <Label className="text-xs mb-1 block">District</Label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => {
                      setSelectedDistrict(e.target.value);
                      setSelectedWard("all");
                      setSelectedVillageName("all");
                    }}
                    className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="all">All Districts</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-xs mb-1 block">Ward</Label>
                  <select
                    value={selectedWard}
                    onChange={(e) => {
                      setSelectedWard(e.target.value);
                      setSelectedVillageName("all");
                    }}
                    className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="all">All Wards</option>
                    {filteredWards().map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-xs mb-1 block">Village</Label>
                  <select
                    value={selectedVillageName}
                    onChange={(e) => setSelectedVillageName(e.target.value)}
                    className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="all">All Villages</option>
                    {filteredVillageNames().map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Boundary Layers */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Boundary Layers
              </h3>
              <div className="flex flex-col gap-1">
                {BOUNDARY_LAYERS.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => toggleBoundary(layer.id)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted text-left text-xs transition-colors"
                  >
                    {visibleBoundaries.includes(layer.id) ? (
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5 text-muted-foreground/50" />
                    )}
                    <div
                      className="h-3 w-3 rounded-sm border"
                      style={{
                        backgroundColor: visibleBoundaries.includes(layer.id)
                          ? layer.color + "30"
                          : "transparent",
                        borderColor: layer.color,
                      }}
                    />
                    <span
                      className={
                        visibleBoundaries.includes(layer.id) ? "font-medium" : "text-muted-foreground"
                      }
                    >
                      {layer.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Data Overlays */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Data Overlays
              </h3>
              <div className="flex flex-col gap-1">
                {OVERLAY_LAYERS.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => toggleOverlay(layer.id)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted text-left text-xs transition-colors"
                  >
                    {visibleOverlays.includes(layer.id) ? (
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5 text-muted-foreground/50" />
                    )}
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: visibleOverlays.includes(layer.id) ? layer.color : "transparent",
                        border: `2px solid ${layer.color}`,
                      }}
                    />
                    <span
                      className={
                        visibleOverlays.includes(layer.id) ? "font-medium" : "text-muted-foreground"
                      }
                    >
                      {layer.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-auto pt-3 border-t">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-muted rounded-md p-2 text-center">
                  <p className="font-bold text-sm">277</p>
                  <p className="text-muted-foreground">Villages</p>
                </div>
                <div className="bg-muted rounded-md p-2 text-center">
                  <p className="font-bold text-sm">55</p>
                  <p className="text-muted-foreground">Wards</p>
                </div>
                <div className="bg-muted rounded-md p-2 text-center">
                  <p className="font-bold text-sm">2</p>
                  <p className="text-muted-foreground">Districts</p>
                </div>
                <div className="bg-muted rounded-md p-2 text-center">
                  <p className="font-bold text-sm">5</p>
                  <p className="text-muted-foreground">Regions</p>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 text-center">
                Source: Tanzania Admin Shapefiles
              </p>
            </div>
          </div>
        </div>

        {/* Toggle sidebar button */}
        <button
          onClick={() => setFilterOpen(!filterOpen)}
          className="absolute top-4 z-10 bg-background border rounded-r-md p-1.5 shadow-md hover:bg-muted transition-colors"
          style={{ left: filterOpen ? "288px" : "0px" }}
        >
          {filterOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Filter className="h-4 w-4" />
          )}
        </button>

        {/* Map Container */}
        <div className="flex-1 relative">
          <div ref={mapContainer} className="w-full h-full" />

          {/* Loading indicator */}
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 z-10">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                <p className="text-sm text-muted-foreground">Loading map...</p>
              </div>
            </div>
          )}

          {/* Basemap Switcher */}
          <div className="absolute bottom-4 right-4 flex gap-1 bg-background/90 backdrop-blur-sm rounded-lg border shadow-md p-1 z-10">
            {Object.entries(BASEMAPS).map(([key, bm]) => {
              const Icon = bm.icon;
              return (
                <button
                  key={key}
                  onClick={() => switchBasemap(key as keyof typeof BASEMAPS)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    activeBasemap === key
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {bm.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature Detail Panel */}
        {selectedFeature && (
          <div className="w-80 border-l bg-background overflow-y-auto flex-shrink-0">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Badge variant="secondary" className="text-[10px] mb-1">
                    {selectedFeature.type}
                  </Badge>
                  <h3 className="font-semibold">{selectedFeature.name}</h3>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => setSelectedFeature(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Properties table */}
              <div className="flex flex-col gap-2 text-xs">
                {selectedFeature.type === "village" && (
                  <>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-muted-foreground">District</span>
                      <span className="font-medium">
                        {selectedFeature.properties.District_N as string}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-muted-foreground">Ward</span>
                      <span className="font-medium">
                        {selectedFeature.properties.Ward_Name as string}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-muted-foreground">Region</span>
                      <span className="font-medium">
                        {selectedFeature.properties.Region_Nam as string}
                      </span>
                    </div>
                  </>
                )}
                {selectedFeature.type === "ward" && (
                  <>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-muted-foreground">District</span>
                      <span className="font-medium">
                        {selectedFeature.properties.dist_name as string}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-muted-foreground">Region</span>
                      <span className="font-medium">
                        {selectedFeature.properties.reg_name as string}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* If it matches a demo village, show operational data */}
              {matchedDemoVillage && (
                <div className="mt-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Operational Data
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Card>
                      <CardContent className="p-2.5 text-center">
                        <p className="text-lg font-bold">
                          {matchedDemoVillage.population.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Population</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-2.5 text-center">
                        <p className="text-lg font-bold">{matchedDemoVillage.farmerCount}</p>
                        <p className="text-[10px] text-muted-foreground">Farmers</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-2.5 text-center">
                        <p className="text-lg font-bold">
                          {matchedDemoVillage.seedlingCount.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Seedlings</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-2.5 text-center">
                        <p className="text-lg font-bold">
                          {matchedDemoVillage.distanceToNpKm
                            ? `${matchedDemoVillage.distanceToNpKm}km`
                            : "N/A"}
                        </p>
                        <p className="text-[10px] text-muted-foreground">To NP</p>
                      </CardContent>
                    </Card>
                  </div>
                  <Link href={`/villages/${matchedDemoVillage.id}`}>
                    <Button variant="outline" size="sm" className="w-full mt-3 text-xs gap-1">
                      View Village Detail <ChevronRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
