package eu.ladeira.mcss;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.StringJoiner;

import org.bukkit.Bukkit;
import org.bukkit.configuration.file.FileConfiguration;
import org.bukkit.entity.Player;
import org.bukkit.scheduler.BukkitRunnable;

public class ApiHandler {

	private String origin = "https://mcss.api.ladeira.eu";
	private String secret;

	private DataHandler dataHandler;

	public ApiHandler(DataHandler dataHandler) {
		this.dataHandler = dataHandler;

		loadSecret(); // Starts data transport loop if secret is found
	}

	public void onDisable() {
		if (secret != null) {
			Mcss.plugin.getConfig().set("secret", secret);
			Mcss.plugin.saveConfig();
		}
	}

	public void onChatMessage(Player sender, String content) {
		if (secret == null) {
			warnSecret();
			return;
		}

		try {
			URL obj = new URL(origin + "/plugin/chat-msg");
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();

			con.setRequestMethod("POST");
			con.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
			con.setRequestProperty("Accept", "application/json");
			con.setDoOutput(true);

			Map<String, String> data = new HashMap<String, String>();
			data.put("secret", this.secret);
			data.put("sender", sender.getName());
			data.put("msg", content);

			byte[] out = toJSON(data).getBytes(StandardCharsets.UTF_8);

			con.setFixedLengthStreamingMode(out.length);

			try {
				con.connect();
			} catch (Exception e) {
				Bukkit.getLogger().severe("Failed connecting to API Server when updating chat!");
				transportDataDelayed(100000);
				return;
			}

			try (OutputStream os = con.getOutputStream()) {
				os.write(out);

				int statusCode = con.getResponseCode();

				switch (statusCode) {
				case 200:
					break;
				case 404:
					this.secret = null;
					Bukkit.getLogger().severe("Invalid secret! (Server was deleted?)");
					return;
				default:
					Bukkit.getLogger().severe("Chat update failed for unexpected reason! (Response Code: " + statusCode + ")");
					return;
				}

			} catch (Exception e) {
				Bukkit.getLogger().severe("Chat update failed! (Invalid server resposne)");
			}
		} catch (Exception e) { // Code is wrong (invalid URL, invalid Protocol Type)
			e.printStackTrace();
			Bukkit.getLogger().severe("Something is wrong with the plugin, please report the error above to the developers");
		}
	}
	
	public String validateSecret(String secret) {
		try {
			URL obj = new URL(origin + "/servers/plugin-register");
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();

			con.setRequestMethod("POST");
			con.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
			con.setRequestProperty("Accept", "application/json");
			con.setDoOutput(true);

			Map<String, String> data = new HashMap<String, String>();
			data.put("secret", secret);

			byte[] out = toJSON(data).getBytes(StandardCharsets.UTF_8);

			con.setFixedLengthStreamingMode(out.length);

			try {
				con.connect();
			} catch (Exception e) {
				Bukkit.getLogger().severe("Failed connecting to API Server when validating secret!");
				transportDataDelayed(100000);
				return null;
			}

			try (OutputStream os = con.getOutputStream()) {
				os.write(out);

				int statusCode = con.getResponseCode();
				
				@SuppressWarnings("resource") // Eclipse is flagging incorrectly
				Scanner s = new Scanner(statusCode >= 400 ? con.getErrorStream() : con.getInputStream()).useDelimiter("\\A");
				String response = s.hasNext() ? s.next() : "";
				s.close();
				switch (statusCode) {
				case 200:
					return response;
				default:
					return null;
				}

			} catch (Exception e) {
				Bukkit.getLogger().severe("Secret validate failed! (Invalid server resposne)");
			}
		} catch (Exception e) { // Code is wrong (invalid URL, invalid Protocol Type)
			e.printStackTrace();
			Bukkit.getLogger().severe("Something is wrong with the plugin, please report the error above to the developers");
		}
		
		return null;
	}

	// Separate function for readability
	private void startDataTransportLoop() {
		transportData();
	}

	private void transportDataDelayed(int ms) {
		new BukkitRunnable() {
			public void run() {
				transportData();
			}
		}.runTaskLater(Mcss.plugin, ms / 50).getTaskId();
	}

	private void transportData() {
		if (secret == null) {
			warnSecret();
			return;
		}

		try {
			URL obj = new URL(origin + "/plugin/stats-update");
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();

			con.setRequestMethod("POST");
			con.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
			con.setRequestProperty("Accept", "application/json");
			con.setDoOutput(true);

			Map<String, String> data = dataHandler.getData();
			data.put("secret", this.secret);

			byte[] out = toJSON(data).getBytes(StandardCharsets.UTF_8);

			con.setFixedLengthStreamingMode(out.length);

			try {
				con.connect();
			} catch (Exception e) {
				Bukkit.getLogger().severe("Failed connecting to API Server! Retrying in 100 seconds (Servers down?)");
				transportDataDelayed(100000);
				return;
			}

			try (OutputStream os = con.getOutputStream()) {
				os.write(out);

				int statusCode = con.getResponseCode();
				int dataDelay = 0;
				int dataBuffer = 250;

				Scanner s = new Scanner(statusCode >= 400 ? con.getErrorStream() : con.getInputStream()).useDelimiter("\\A");
				String response = s.hasNext() ? s.next() : "";
				s.close();

				switch (statusCode) {
				case 200:
					int sendIn = Integer.parseInt(response.split(":")[1]);
					dataDelay = sendIn;
					Bukkit.getLogger().info("Sent data");
					break;
				case 404:
					this.secret = null;
					Bukkit.getLogger().severe("Invalid secret! (Server was deleted?)");
					return;
				case 425:
					int throttle = Integer.parseInt(response.split(":")[1]);
					dataDelay = throttle;
					break;
				case 429:
					Bukkit.getLogger().warning("[IMPORTANT] No storage left on MCSS server! Please allocate or buy more. Canceling future requests");
					return;
				default:
					Bukkit.getLogger().severe("Request failed for unexpected reason! Canceling future requests (Response Code: " + statusCode + ")");
					return;
				}

				transportDataDelayed(dataDelay + dataBuffer);
			} catch (Exception e) {
				Bukkit.getLogger().severe("Request failed! Retrying in 100 seconds (Invalid server resposne)");
				transportDataDelayed(100000);
			}
		} catch (Exception e) { // Code is wrong (invalid URL, invalid Protocol Type)
			e.printStackTrace();
			Bukkit.getLogger().severe("Something is wrong with the plugin, please report the error above to the developers");
		}
	}

	public void setSecret(String secret) {
		Boolean firstSet = this.secret == null;
		this.secret = secret;

		if (firstSet)
			startDataTransportLoop();
	}

	private void loadSecret() {
		FileConfiguration config = Mcss.plugin.getConfig();

		if (config.isSet("secret")) {
			secret = config.getString("secret");
			Bukkit.getLogger().info("Loaded secret from config");
			startDataTransportLoop();
		} else {
			warnSecret();
		}
	}

	private void warnSecret() {
		Bukkit.getLogger().warning("Secret not configured! Register server with /register [secret]");
	}

	private String toJSON(Map<String, String> data) {
		StringJoiner sj = new StringJoiner(",");
		for (Map.Entry<String, String> entry : data.entrySet())
			sj.add("\"" + entry.getKey() + "\":\"" + entry.getValue() + "\"");

		return "{" + sj + "}";
	}
}
