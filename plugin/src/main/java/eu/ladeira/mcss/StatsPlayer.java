package eu.ladeira.mcss;

import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.bukkit.Bukkit;

public class StatsPlayer {

	public UUID uuid;
	public String username;
	
	private Map<String, Double> stats;

	public StatsPlayer(UUID uuid, Map<String, Double> defaultStats) {
		this.uuid = uuid;
		this.username = Bukkit.getOfflinePlayer(uuid).getName();
		this.stats = defaultStats;
	}
	
	public void replaceStatsMap(Map<String, Double> newMap) { // Used in clearing stats
		this.stats = newMap;
	}
	
	public Set<String> getStatsKeys() {
		return stats.keySet();
	}
	
	public void incrementStat(String index) {
		incrementStat(index, 1);
	}
	
	public void incrementStat(String index, double amount) {
		stats.put(index, stats.get(index) + amount);
	}
	
	public Double getStat(String index) {
		return stats.get(index);
	}
}
