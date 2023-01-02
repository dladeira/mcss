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
	public int characters;
	public int whispers;
	public int commands;
	public int deaths;
	public int blocksBroken;
	public int blocksPlaced;
	public int blocksTraveled;
	public int itemsCrafted;

	public StatsPlayer(UUID uuid) {
		this.uuid = uuid;
		this.username = Bukkit.getOfflinePlayer(uuid).getName();
		this.playtime = 0;
		this.messages = 0;
		this.characters = 0;
		this.whispers = 0;
		this.commands = 0;
		this.blocksBroken = 0;
		this.blocksPlaced = 0;
		this.blocksTraveled = 0;
		this.itemsCrafted = 0;
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
			data.put("characters", String.valueOf(stats.characters));
			data.put("whispers", String.valueOf(stats.whispers));
			data.put("commands", String.valueOf(stats.commands));
			data.put("deaths", String.valueOf(stats.deaths));
			data.put("blocksBroken", String.valueOf(stats.blocksBroken));
			data.put("blocksPlaced", String.valueOf(stats.blocksPlaced));
			data.put("blocksTraveled", String.valueOf(stats.blocksTraveled));
			data.put("itemsCrafted", String.valueOf(stats.itemsCrafted));
			data.put("location", "(" + Math.round(player.getLocation().getX()) + ", " + Math.round(player.getLocation().getY()) + ", " + Math.round(player.getLocation().getZ()) + ")");
			
			stats.playtime = 0;
			stats.messages = 0;
			stats.characters = 0;
			stats.whispers = 0;
			stats.commands = 0;
			stats.deaths = 0;
			stats.blocksBroken = 0;
			stats.blocksPlaced = 0;
			stats.blocksTraveled = 0;
			
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
