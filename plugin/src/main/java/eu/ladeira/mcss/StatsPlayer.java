package eu.ladeira.mcss;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map.Entry;
import java.util.StringJoiner;
import java.util.UUID;

import org.bukkit.Bukkit;
import org.bukkit.entity.Player;

public class StatsPlayer {

	public UUID uuid;
	public String username;
	public int playtime;
	public int messages;

	public StatsPlayer(UUID uuid) {
		this.uuid = uuid;
		this.username = Bukkit.getOfflinePlayer(uuid).getName();
		this.playtime = 0;
		this.messages = 0;
	}

	public static String stringifyPlayers(HashSet<StatsPlayer> players) {
		String string = "";

		StringJoiner array = new StringJoiner(",", "[", "]");
		for (StatsPlayer stats : players) {
			Player player = Bukkit.getPlayer(stats.uuid);
			
			if (player == null)
				continue;
			
			StringJoiner objectData = new StringJoiner(",", "{", "}");
			
			HashMap<String, String> data = new HashMap<String, String>();
			data.put("uuid", stats.uuid.toString());
			data.put("username", stats.username.toString());
			data.put("playtime", String.valueOf(stats.playtime));
			data.put("messages", String.valueOf(stats.messages));
			data.put("location", "(" + Math.round(player.getLocation().getX()) + ", " + Math.round(player.getLocation().getY()) + ", " + Math.round(player.getLocation().getZ()) + ")");
			
			stats.playtime = 0;
			
			for (Entry<String, String> entry : data.entrySet()) {
				objectData.add("\\\"" + entry.getKey() + "\\\": \\\"" + entry.getValue() + "\\\"");
			}
			
			array.add(objectData.toString());
		}
		
		string += array.toString();
		
		Bukkit.getLogger().info(string);
		return string;
	}
}
