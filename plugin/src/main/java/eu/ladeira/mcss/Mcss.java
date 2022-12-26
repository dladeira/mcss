package eu.ladeira.mcss;

import java.io.OutputStream;
import java.lang.management.ManagementFactory;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.StringJoiner;

import org.bukkit.Bukkit;
import org.bukkit.plugin.java.JavaPlugin;
import org.bukkit.scheduler.BukkitRunnable;

import com.sun.management.OperatingSystemMXBean;

public class Mcss extends JavaPlugin {

	private static String secret;

	public static void setSecret(String newSecret) {
		secret = newSecret;	
	}

	private OperatingSystemMXBean osBean = ManagementFactory.getPlatformMXBean(OperatingSystemMXBean.class);

	@Override
	public void onEnable() {
		if (getConfig().isSet("secret")) {
			secret = getConfig().getString("secret");
			Bukkit.getLogger().info("Loaded secret from config");
		} else {
			Bukkit.getLogger().severe("Secret not found in config");
		}
		
		getCommand("register").setExecutor(new RegisterCmd());

		new BukkitRunnable() {
			public void run() {
				sendInfo();
			}
		}.runTaskTimer(this, 60, 60);
	}

	@Override
	public void onDisable() {
		if (secret != null) {
			getConfig().set("secret", secret);
			saveConfig();
		}
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

			Map<String, String> form = new HashMap<>();

			// Define the fields
			form.put("cpuUsage", String.valueOf(getCpuUsage()));
			form.put("ramUsage", String.valueOf(getRamUsage()));
			form.put("secret", secret);

			StringJoiner sj = new StringJoiner(",");
			for (Map.Entry<String, String> entry : form.entrySet())
				sj.add("\"" + entry.getKey() + "\": \"" + entry.getValue() + "\"");

			String finalString = "{" + sj + "}";

//			Bukkit.getLogger().info(finalString);
			byte[] out = finalString.getBytes(StandardCharsets.UTF_8);
			int length = out.length;

			con.setFixedLengthStreamingMode(length);
			con.connect();
			try (OutputStream os = con.getOutputStream()) {
				os.write(out);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
