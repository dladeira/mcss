package eu.ladeira.mcss;

import java.lang.management.ManagementFactory;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.StringJoiner;
import java.util.UUID;

import org.bukkit.Bukkit;
import org.bukkit.entity.Player;
import org.bukkit.scheduler.BukkitRunnable;

import com.sun.management.OperatingSystemMXBean;

public class DataHandler {

	private final int PLAYTIME_LOOP_FREQUENCY = 40;
	
	private Set<StatsPlayer> players;
	private Map<String, Double> stats;
	private OperatingSystemMXBean osBean;
	
	public DataHandler() {
		this.players = new HashSet<StatsPlayer>();
		this.osBean = ManagementFactory.getPlatformMXBean(OperatingSystemMXBean.class);
		this.stats = new HashMap<String, Double>();
		resetStats();
		
		// In case of server reload add all existing players
		for (Player player : Bukkit.getOnlinePlayers()) {
			registerStatsPlayer(player);
		}
		
		startTimeLoop();
	}
	
	public Map<String, String> getData() {
		Map<String, String> map = new HashMap<String, String>();

		map.put("players", stringifyPlayers());
		map.put("cpu", getCpuUsage());
		map.put("ram", getRamUsage());
		map.putAll(stringifyStats());
		
		resetStats();
		return map;
	}
	
	public void incrementStat(Player player, String index) {
		incrementStat(player, index, 1);
	}
	
	public void incrementStat(Player player, String index, double amount) {
		getStatsPlayer(player.getUniqueId()).incrementStat(index, amount);
		stats.put(index, stats.get(index) + amount);
	}
	
	public Double getStat(String index) {
		return stats.get(index);
	}
	
	public void registerStatsPlayer(Player player) {
		getStatsPlayer(player.getUniqueId());
	}
	
	public StatsPlayer getStatsPlayer(UUID uuid) {
		for (StatsPlayer stats : players) {
			if (stats.uuid == uuid) {
				return stats;
			}
		}

		StatsPlayer newPlayer = new StatsPlayer(uuid, getDefaultStats());
		players.add(newPlayer);
		
		return newPlayer;
	}
	
	public void removeStatsPlayer(UUID uuid) {
		for (StatsPlayer stats : players) {
			if (stats.uuid == uuid) {
				players.remove(stats);
			}
		}
	}
	
	private Map<String, Double> getDefaultStats() {
		Map<String, Double> map = new HashMap<>();
		
		map.put("playtime", 0D);
		map.put("messages", 0D);
		map.put("characters", 0D);
		map.put("whispers", 0D);
		map.put("commands", 0D);
		map.put("deaths", 0D);
		map.put("blocksBroken", 0D);
		map.put("blocksPlaced", 0D);
		map.put("blocksTraveled", 0D);
		map.put("itemsCrafted", 0D);
		
		return map;
	}
	
	private void resetStats() {
		this.stats = getDefaultStats();
		
		for (StatsPlayer player : players) {
			player.replaceStatsMap(getDefaultStats());
		}
	}
	
	private String getCpuUsage() {
		return String.valueOf((int) Math.round(osBean.getCpuLoad() * 100));
	}
	
	private String getRamUsage() {
		double rawMemUsed = Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory();
		int memUsed = (int) Math.round(rawMemUsed / 1024 / 1024);
		int mem = Math.round(Runtime.getRuntime().totalMemory() / 1024 / 1024);
		int memPercent = (int) ((double) memUsed / (double) mem * 100d);

		return String.valueOf(memPercent);
	}
	
	private Map<String, String> stringifyStats() {
		Map<String, String> data = new HashMap<String, String>();
		for (String index : this.stats.keySet()) {
			data.put(index, String.valueOf(stats.get(index)));
		}
		
		return data;
	}
	
	private String stringifyPlayers() {
		String string = "";

		StringJoiner array = new StringJoiner(",", "[", "]");
		for (StatsPlayer player : players) {
			array.add(toJSON(player));
		}
		
		string += array.toString();
		return string;
	}
	
	private String toJSON(StatsPlayer player) {
		Player bukkitPlayer = Bukkit.getPlayer(player.uuid);
		
		StringJoiner objectData = new StringJoiner(",", "{", "}");
		
		HashMap<String, String> data = new HashMap<String, String>();
		
		for (String index : player.getStatsKeys()) {
			data.put(index, String.valueOf(player.getStat(index)));
		}
		
		data.put("location", "(" + Math.round(bukkitPlayer.getLocation().getX()) + ", " + Math.round(bukkitPlayer.getLocation().getY()) + ", " + Math.round(bukkitPlayer.getLocation().getZ()) + ")");
		
		for (Entry<String, String> entry : data.entrySet()) {
			objectData.add("\\\"" + entry.getKey() + "\\\": \\\"" + entry.getValue() + "\\\"");
		}
		
		return objectData.toString();
	}
	
	private void startTimeLoop() {
		new BukkitRunnable() {
			public void run() {
				for (StatsPlayer stats : players) {
					if (Bukkit.getPlayer(stats.uuid) != null) {
						stats.incrementStat("playtime", PLAYTIME_LOOP_FREQUENCY);
					}
				}
			}
		}.runTaskTimer(Mcss.plugin, PLAYTIME_LOOP_FREQUENCY, PLAYTIME_LOOP_FREQUENCY);
	}
}
