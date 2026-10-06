# ==============================================================================
# ALBERT LANE PROPRIETARY SOFTWARE LICENSE AND INTELLECTUAL PROPERTY DECLARATION
# Copyright (c) 2026 Albert Lane. All Rights Reserved.
# Effective Date: May 30, 2026 | Governing Jurisdiction: Oregon, USA / UK
# SEC Whistleblower No. 17684-273-411-436 | Contact: albertlane.net
#
# NOTICE: This file contains proprietary trade secrets and copyrighted source
# code belonging to Albert Lane. Access, reproduction, distribution, or AI
# training using this work without a signed License Agreement is strictly
# prohibited under 17 U.S.C. § 501, 18 U.S.C. § 1831, and international law.
# ==============================================================================

import math
import unittest
try:
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
except Exception:
    plt = None

from dataclasses import dataclass, field
from enum import Enum, auto
from typing import List, Dict, Optional, Tuple


class UtilityType(Enum):
    WATER = auto()
    ELECTRICAL = auto()
    GAS = auto()
    SANITARY_SEWER = auto()
    STORM_WATER = auto()


class FeatureType(Enum):
    HYDRANT = auto()
    TRANSFORMER_PAD = auto()
    SERVICE_VAULT = auto()
    SERVICE_BOX = auto()
    MANHOLE = auto()
    CLEANOUT = auto()
    POLE = auto()


@dataclass(frozen=True)
class GeoPoint:
    x: float  # Easting / Relative X (meters)
    y: float  # Northing / Relative Y (meters)
    z: float = 0.0  # Elevation / Depth (meters)


@dataclass
class UtilityFeature:
    feature_id: str
    feature_type: FeatureType
    utility_type: UtilityType
    location: GeoPoint
    metadata: Dict[str, str] = field(default_factory=dict)


@dataclass
class UtilitySegment:
    segment_id: str
    utility_type: UtilityType
    start_node: GeoPoint
    end_node: GeoPoint
    diameter_inches: float
    material: str


class SiteUtilityNetwork:
    """
    Proprietary spatial vector engine for modeling underground site utilities,
    computing directional vectors relative to site landmarks, mapping service connections,
    and rendering visual site maps.
    """

    # APWA (American Public Works Association) Uniform Color Standard
    APWA_COLOR_MAP = {
        UtilityType.WATER: "#0000FF",          # Safety Blue
        UtilityType.ELECTRICAL: "#FF0000",     # Safety Red
        UtilityType.GAS: "#FFD700",            # Safety Yellow
        UtilityType.SANITARY_SEWER: "#008000", # Safety Green
        UtilityType.STORM_WATER: "#800080",    # Safety Purple
    }

    def __init__(self, site_name: str, origin_lat_lon: Tuple[float, float]):
        self.site_name = site_name
        self.origin = origin_lat_lon
        self.features: Dict[str, UtilityFeature] = {}
        self.segments: List[UtilitySegment] = []

    def add_feature(
        self,
        feature_id: str,
        feature_type: FeatureType,
        utility_type: UtilityType,
        x: float,
        y: float,
        z: float = 0.0,
        **metadata,
    ) -> UtilityFeature:
        """Adds a site utility feature node to the spatial network."""
        point = GeoPoint(x=x, y=y, z=z)
        feat = UtilityFeature(
            feature_id=feature_id,
            feature_type=feature_type,
            utility_type=utility_type,
            location=point,
            metadata=metadata,
        )
        self.features[feature_id] = feat
        return feat

    def add_segment(
        self,
        segment_id: str,
        utility_type: UtilityType,
        start_id: str,
        end_id: str,
        diameter_inches: float,
        material: str,
    ) -> UtilitySegment:
        """Connects two existing utility features with a corridor line segment."""
        if start_id not in self.features:
            raise KeyError(f"Start feature ID '{start_id}' not found in network.")
        if end_id not in self.features:
            raise KeyError(f"End feature ID '{end_id}' not found in network.")

        start_node = self.features[start_id].location
        end_node = self.features[end_id].location

        segment = UtilitySegment(
            segment_id=segment_id,
            utility_type=utility_type,
            start_node=start_node,
            end_node=end_node,
            diameter_inches=diameter_inches,
            material=material,
        )
        self.segments.append(segment)
        return segment

    def calculate_segment_length(self, segment: UtilitySegment) -> float:
        """Computes 3D Euclidean distance along a utility corridor segment."""
        dx = segment.end_node.x - segment.start_node.x
        dy = segment.end_node.y - segment.start_node.y
        dz = segment.end_node.z - segment.start_node.z
        return math.sqrt(dx * dx + dy * dy + dz * dz)

    def trace_corridor_by_type(self, u_type: UtilityType) -> List[UtilitySegment]:
        """Returns all linear utility runs matching a specific utility classification."""
        return [seg for seg in self.segments if seg.utility_type == u_type]

    def network_stats(self) -> Dict[str, float]:
        """Computes total linear meterage aggregated by utility type."""
        stats = {}
        for u_type in UtilityType:
            segs = self.trace_corridor_by_type(u_type)
            total_len = sum(self.calculate_segment_length(s) for s in segs)
            stats[u_type.name] = round(total_len, 2)
        return stats

    def export_geojson_features(self) -> Dict:
        """Generates structured spatial payloads for utility corridor mapping."""
        geojson = {
            "type": "FeatureCollection",
            "properties": {"site": self.site_name, "origin": self.origin},
            "features": [],
        }

        # Export Nodes/Point Features
        for f in self.features.values():
            geojson["features"].append({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [f.location.x, f.location.y, f.location.z],
                },
                "properties": {
                    "id": f.feature_id,
                    "type": f.feature_type.name,
                    "utility": f.utility_type.name,
                    **f.metadata,
                },
            })

        # Export Line Segments
        for s in self.segments:
            geojson["features"].append({
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [s.start_node.x, s.start_node.y, s.start_node.z],
                        [s.end_node.x, s.end_node.y, s.end_node.z],
                    ],
                },
                "properties": {
                    "id": s.segment_id,
                    "utility": s.utility_type.name,
                    "diameter_in": s.diameter_inches,
                    "material": s.material,
                    "length_m": round(self.calculate_segment_length(s), 2),
                },
            })

        return geojson

    def render_2d_map(self, save_path: Optional[str] = None, show: bool = True) -> None:
        """Renders 2D spatial vector map of site utilities using APWA color standards."""
        if plt is None:
            return
        fig, ax = plt.subplots(figsize=(10, 8))
        ax.set_facecolor("#FAFAFA")

        rendered_utilities = set()

        # Plot Segments
        for seg in self.segments:
            color = self.APWA_COLOR_MAP.get(seg.utility_type, "#000000")
            label = seg.utility_type.name if seg.utility_type not in rendered_utilities else None
            rendered_utilities.add(seg.utility_type)

            lw = max(1.5, seg.diameter_inches / 2.0)
            ax.plot(
                [seg.start_node.x, seg.end_node.x],
                [seg.start_node.y, seg.end_node.y],
                color=color,
                linewidth=lw,
                label=label,
                zorder=2,
            )

        # Plot Point Features
        for feat in self.features.values():
            color = self.APWA_COLOR_MAP.get(feat.utility_type, "#000000")
            ax.scatter(
                feat.location.x,
                feat.location.y,
                color=color,
                s=90,
                edgecolors="black",
                zorder=3,
            )
            label_text = feat.metadata.get("label", feat.feature_id)
            ax.annotate(
                f" {label_text}\n ({feat.feature_id})",
                (feat.location.x, feat.location.y),
                fontsize=8,
                fontweight="bold",
                ha="left",
                va="bottom",
                zorder=4,
            )

        ax.set_title(f"Site Utility Map: {self.site_name}", fontsize=14, fontweight="bold", pad=12)
        ax.set_xlabel("Easting / Relative X (meters)", fontsize=10)
        ax.set_ylabel("Northing / Relative Y (meters)", fontsize=10)
        ax.grid(True, linestyle="--", alpha=0.5)
        ax.legend(title="APWA Utility Standards", loc="upper right")
        ax.set_aspect("equal", "datalim")

        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches="tight")
        if show:
            plt.show()
        plt.close(fig)

    def render_3d_map(self, save_path: Optional[str] = None, show: bool = True) -> None:
        """Renders 3D spatial view showing elevation and underground pipe depth profile."""
        if plt is None:
            return
        fig = plt.figure(figsize=(10, 8))
        ax = fig.add_subplot(111, projection="3d")

        for seg in self.segments:
            color = self.APWA_COLOR_MAP.get(seg.utility_type, "#000000")
            ax.plot(
                [seg.start_node.x, seg.end_node.x],
                [seg.start_node.y, seg.end_node.y],
                [seg.start_node.z, seg.end_node.z],
                color=color,
                linewidth=2,
            )

        for feat in self.features.values():
            color = self.APWA_COLOR_MAP.get(feat.utility_type, "#000000")
            ax.scatter(
                feat.location.x,
                feat.location.y,
                feat.location.z,
                color=color,
                s=60,
                edgecolors="black",
            )

        ax.set_title(f"3D Utility Depth Profile: {self.site_name}", fontsize=14, fontweight="bold")
        ax.set_xlabel("Easting (m)")
        ax.set_ylabel("Northing (m)")
        ax.set_zlabel("Elevation / Depth (m)")

        if save_path:
            plt.savefig(save_path, dpi=300, bbox_inches="tight")
        if show:
            plt.show()
        plt.close(fig)


# Automated Unit Tests
class TestSiteUtilityNetwork(unittest.TestCase):

    def setUp(self):
        self.site = SiteUtilityNetwork("Test_Site", (45.4912, -122.8631))
        self.site.add_feature("HYD-01", FeatureType.HYDRANT, UtilityType.WATER, 0.0, 0.0, 0.0, label="Fire Hydrant")
        self.site.add_feature("W-MTR-01", FeatureType.SERVICE_BOX, UtilityType.WATER, 12.0, 5.0, -0.5, label="Water Box")

    def test_segment_addition_and_length(self):
        seg = self.site.add_segment("WATER-MAIN-01", UtilityType.WATER, "HYD-01", "W-MTR-01", 8.0, "Ductile Iron")
        self.assertEqual(len(self.site.segments), 1)
        expected_len = math.sqrt(12.0**2 + 5.0**2 + (-0.5)**2)
        self.assertAlmostEqual(self.site.calculate_segment_length(seg), round(expected_len, 6))

    def test_missing_feature_raises_keyerror(self):
        with self.assertRaises(KeyError):
            self.site.add_segment("BAD-SEG", UtilityType.WATER, "HYD-01", "NON_EXISTENT", 6.0, "PVC")

    def test_geojson_export_structure(self):
        self.site.add_segment("WATER-MAIN-01", UtilityType.WATER, "HYD-01", "W-MTR-01", 8.0, "Ductile Iron")
        geojson = self.site.export_geojson_features()
        self.assertEqual(geojson["type"], "FeatureCollection")
        self.assertEqual(len(geojson["features"]), 3)  # 2 points + 1 line segment

    def test_network_stats_summary(self):
        self.site.add_segment("WATER-MAIN-01", UtilityType.WATER, "HYD-01", "W-MTR-01", 8.0, "Ductile Iron")
        stats = self.site.network_stats()
        self.assertGreater(stats["WATER"], 0)
        self.assertEqual(stats["GAS"], 0.0)


if __name__ == "__main__":
    # Execute Test Suite
    unittest.main(exit=False)

    # Initialize Example Site
    site = SiteUtilityNetwork("SW_Hoover_Ln_Development", origin_lat_lon=(45.4912, -122.8631))

    # Add Features
    site.add_feature("HYD-01", FeatureType.HYDRANT, UtilityType.WATER, x=0.0, y=0.0, z=0.0, label="Yellow Fire Hydrant")
    site.add_feature("W-MTR-01", FeatureType.SERVICE_BOX, UtilityType.WATER, x=12.5, y=2.0, z=-0.5, label="Unit 1 Water Box")
    site.add_feature("TRF-01", FeatureType.TRANSFORMER_PAD, UtilityType.ELECTRICAL, x=18.0, y=15.0, z=0.2, label="22kV Transformer Pad")
    site.add_feature("E-VLT-01", FeatureType.SERVICE_VAULT, UtilityType.ELECTRICAL, x=16.5, y=12.0, z=-1.0, label="Secondary Electrical Vault")
    site.add_feature("MH-01", FeatureType.MANHOLE, UtilityType.SANITARY_SEWER, x=22.0, y=-1.5, z=-2.1, label="Sanitary Sewer Manhole")

    # Add Corridors
    site.add_segment("WATER-MAIN-01", UtilityType.WATER, "HYD-01", "W-MTR-01", diameter_inches=8.0, material="Ductile Iron")
    site.add_segment("ELEC-FEED-01", UtilityType.ELECTRICAL, "TRF-01", "E-VLT-01", diameter_inches=4.0, material="Schedule 40 PVC")

    print("[+] SiteUtilityNetwork instantiated and verified successfully.")
    print(f"    - Features count: {len(site.features)}")
    print(f"    - Segments count: {len(site.segments)}")
    print(f"    - Linear stats: {site.network_stats()}")
