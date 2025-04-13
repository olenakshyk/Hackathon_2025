package test.project.model;

import java.util.ArrayList;
import java.util.List;

public class Cluster {
    private double centerLat;
    private double centerLon;
    private final List<Location> locations = new ArrayList<>();

    public Cluster(double centerLat, double centerLon) {
        this.centerLat = centerLat;
        this.centerLon = centerLon;
    }

    public void add(Location location) {
        locations.add(location);
        recalculateCenter();
    }

    private void recalculateCenter() {
        double sumLat = 0;
        double sumLon = 0;
        for (Location loc : locations) {
            sumLat += loc.getLat();
            sumLon += loc.getLon();
        }
        this.centerLat = sumLat / locations.size();
        this.centerLon = sumLon / locations.size();
    }

    public double getCenterLat() {
        return centerLat;
    }

    public double getCenterLon() {
        return centerLon;
    }

    public List<Location> getLocations() {
        return locations;
    }
}
