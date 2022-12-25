package eu.ladeira.mcss;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.StringJoiner;

import org.bukkit.Bukkit;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

import net.md_5.bungee.api.ChatColor;

public class RegisterCmd implements CommandExecutor {

	@Override
	public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
		if (args.length != 1) {
			sendMessage(sender, ChatColor.RED + "ERROR: Incorrect argument count");
			return false;
		}

		String secret = args[0];

		sendMessage(sender, ChatColor.GRAY + "Validating secret..." + ChatColor.WHITE + " (" + args[0] + ")");
		String serverName = getServer(secret);
		if (serverName == null) {
			sendMessage(sender, ChatColor.RED + "ERROR: Invalid secret");
			return false;
		} else {
			sendMessage(sender, ChatColor.WHITE + "Registered as server " + ChatColor.BOLD + "" + ChatColor.GOLD + serverName);
			Mcss.setSecret(secret);
		}

		return true;
	}

	public void sendMessage(CommandSender sender, String msg) {
		if (sender instanceof Player) {
			((Player) sender).sendMessage(msg);
		} else {
			Bukkit.getLogger().info(msg);
		}
	}

	public String getServer(String secret) {
		try {
			URL obj = new URL("http://192.168.100.100:3021/plugin/server");
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();

			// Setting basic post request
			con.setRequestMethod("POST");
			con.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
			con.setRequestProperty("Accept", "application/json");
			con.setConnectTimeout(5000);
			con.setReadTimeout(5000);
			con.setDoOutput(true);

			Map<String, String> form = new HashMap<>();

			// Define the fields
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

//			int status = con.getResponseCode();
//			System.out.println("Status is " + status);

			BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
			String inputLine;
			StringBuffer content = new StringBuffer();
			while ((inputLine = in.readLine()) != null) {
				content.append(inputLine);
			}

			in.close();
			con.disconnect();

			return content.toString();
		} catch (Exception e) {
			return null;
		}
	}
}
