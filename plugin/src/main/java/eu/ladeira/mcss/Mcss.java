package eu.ladeira.mcss;

import java.io.OutputStream;
import java.lang.management.ManagementFactory;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Scanner;
import java.util.StringJoiner;
import java.util.UUID;

import org.bukkit.Bukkit;
import org.bukkit.entity.Player;
import org.bukkit.event.Listener;
import org.bukkit.plugin.Plugin;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitRunnable;

import com.sun.management.OperatingSystemMXBean;

import eu.ladeira.mcss.events.MessagesListener;
import eu.ladeira.mcss.events.PlayerListener;

public class Mcss extends JavaPlugin {

	public static String secret;

	public static int messages = 0;
	public static int characters = 0;
	public static int whispers = 0;
	public static int commands = 0;
	public static int deaths = 0;
	public static int blocksBroken = 0;
	public static int blocksPlaced = 0;
	public static int blocksTraveled = 0;
	public static int itemsCrafted = 0;

	public static HashSet<StatsPlayer> players = new HashSet<>();
	
	public static Plugin plugin;

	public static void setSecret(String newSecret) {
		secret = newSecret;
	}

	public static StatsPlayer getStatsPlayer(UUID uuid) {
		for (StatsPlayer stats : players) {
			if (stats.uuid == uuid) {
				return stats;
			}
		}

		StatsPlayer newPlayer = new StatsPlayer(uuid);
		players.add(newPlayer);
		return newPlayer;
	}

	public static void removeStatsPlayer(UUID uuid) {
		for (StatsPlayer stats : players) {
			if (stats.uuid == uuid) {
				players.remove(stats);
			}
		}
	}

	private OperatingSystemMXBean osBean = ManagementFactory.getPlatformMXBean(OperatingSystemMXBean.class);

	@Override
	public void onEnable() {
		Mcss.plugin = this;
		
		if (getConfig().isSet("secret")) {
			secret = getConfig().getString("secret");
			Bukkit.getLogger().info("Loaded secret from config");
		} else {
			Bukkit.getLogger().severe("Secret not found in config");
		}

		getCommand("register").setExecutor(new RegisterCmd());

		registerEvents(new MessagesListener(), new PlayerListener());

		for (Player player : Bukkit.getOnlinePlayers()) {
			getStatsPlayer(player.getUniqueId());
		}

		sendInfo(); // Is infinite loop, only run once
		startTimeLoop();
	}

	public void registerEvents(Listener... listeners) {
		for (Listener listener : listeners) {
			this.getServer().getPluginManager().registerEvents(listener, this);
		}
	}

	@Override
	public void onDisable() {
		if (secret != null) {
			getConfig().set("secret", secret);
			saveConfig();
		}
		
		Mcss.plugin = null;
	}

	public void startTimeLoop() {
		final int ticks = 40;

		new BukkitRunnable() {
			public void run() {
				for (StatsPlayer stats : players) {
					if (Bukkit.getPlayer(stats.uuid) != null) {
						stats.playtime += ticks;
					}
				}
			}
		}.runTaskTimer(this, ticks, ticks);
	}

	public int getRamUsage() {
		double rawMemUsed = Runtime.getRuntime().totalMemory() - Runtime.getRuntime().freeMemory();
		int memUsed = (int) Math.round(rawMemUsed / 1024 / 1024);
		int mem = Math.round(Runtime.getRuntime().totalMemory() / 1024 / 1024);
		int memPercent = (int) ((double) memUsed / (double) mem * 100d);

		return memPercent;
	}

	public int getCpuUsage() {
		return (int) Math.round(osBean.getCpuLoad() * 100);
	}

	public void sendInfoIn(long ms) {
		Bukkit.getLogger().info("Next in " + ms + "ms");
		new BukkitRunnable() {
			public void run() {
				sendInfo();
			}
		}.runTaskLater(this, ms / 50);
	}

	public Map<String, String> getForm() {
		Map<String, String> form = new HashMap<>();

		// Define the fields
		form.put("cpuUsage", String.valueOf(getCpuUsage()));
		form.put("ramUsage", String.valueOf(getRamUsage()));
		form.put("players", StatsPlayer.stringifyPlayers(players));

		form.put("messages", String.valueOf(messages));
		form.put("characters", String.valueOf(characters));
		form.put("whispers", String.valueOf(whispers));
		form.put("commands", String.valueOf(commands));
		
		form.put("deaths", String.valueOf(deaths));
		form.put("blocksBroken", String.valueOf(blocksBroken));
		form.put("blocksPlaced", String.valueOf(blocksPlaced));
		form.put("blocksTraveled", String.valueOf(blocksTraveled));
		form.put("itemsCrafted", String.valueOf(itemsCrafted));

		form.put("secret", secret);

		Mcss.messages = 0;
		Mcss.characters = 0;
		Mcss.whispers = 0;
		Mcss.commands = 0;
		
		Mcss.blocksBroken = 0;
		Mcss.blocksPlaced = 0;
		Mcss.blocksTraveled = 0;
		Mcss.deaths = 0;

		return form;
	}

	public void sendInfo() {
		if (secret == null) {
			Bukkit.getLogger().severe("Secret not configured! Register server with /register [secret]");
			return;
		}

		try {
			URL obj = new URL("http://192.168.100.100:3021/plugin/stats-update");
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();

			// Setting basic post request
			con.setRequestMethod("POST");
			con.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
			con.setRequestProperty("Accept", "application/json");
			con.setDoOutput(true);

			Map<String, String> form = getForm();

			StringJoiner sj = new StringJoiner(",");
			for (Map.Entry<String, String> entry : form.entrySet())
				sj.add("\"" + entry.getKey() + "\": \"" + entry.getValue() + "\"");

			String finalString = "{" + sj + "}";

			byte[] out = finalString.getBytes(StandardCharsets.UTF_8);
			int length = out.length;

			con.setFixedLengthStreamingMode(length);
			con.connect();

			try (OutputStream os = con.getOutputStream()) {
				os.write(out);

				int statusCode = con.getResponseCode();

				if (statusCode >= 200 && statusCode >= 400) {
					Scanner s = new Scanner(con.getErrorStream()).useDelimiter("\\A");
					String response = s.hasNext() ? s.next() : "";

					if (statusCode == 425) {// Sending too fast
						int wait = Integer.parseInt(response.split(":")[1]) + 250;
//						System.out.println("Throttled");
						sendInfoIn(wait);
					} else {
//						System.out.println("Request failed! (" + response + ")");
						sendInfoIn(2000);
					}
				} else {
					Scanner s = new Scanner(con.getInputStream()).useDelimiter("\\A");
					String response = s.hasNext() ? s.next() : "";

					int wait = Integer.parseInt(response.split(":")[1]) + 250;
					System.out.println("Sent data!");
					sendInfoIn(wait);
				}
			} catch (Exception e) {
				e.printStackTrace();
//				System.out.println("Request failed! (Exception)");
				sendInfoIn(2000);
			}
		} catch (Exception e) {
			e.printStackTrace();
//			System.out.println("Request failed! (Exception)");
			sendInfoIn(2000);
		}
	}
}
