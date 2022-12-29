package eu.ladeira.mcss.events;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.StringJoiner;

import org.bukkit.Bukkit;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.AsyncPlayerChatEvent;
import org.bukkit.event.player.PlayerCommandPreprocessEvent;

import eu.ladeira.mcss.Mcss;

public class MessagesListener implements Listener {
	
	@EventHandler
	public void onMsgSent(AsyncPlayerChatEvent e) {
		sendMsg(e.getPlayer(), e.getMessage());
		Mcss.messages++;
	}
	
	@EventHandler
	public void onWhisper(PlayerCommandPreprocessEvent e) {
		String msg = e.getMessage();
		if (msg.startsWith("/tell") || msg.startsWith("/w") || msg.startsWith("/whisper") || msg.startsWith("/msg")) {
			Mcss.whispers++;
		}
	}
	
	public void sendMsg(Player sender, String msg) {
		if (Mcss.secret == null) {
			Bukkit.getLogger().severe("Secret not configured! Register server with /register [secret]");
			return;
		}

		try {
			URL obj = new URL("http://192.168.100.100:3021/plugin/chat-msg");
			HttpURLConnection con = (HttpURLConnection) obj.openConnection();

			// Setting basic post request
			con.setRequestMethod("POST");
			con.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
			con.setRequestProperty("Accept", "application/json");
			con.setDoOutput(true);

			Map<String, String> form = new HashMap<String, String>();
			
			form.put("secret", Mcss.secret);
			form.put("sender", sender.getName());
			form.put("msg", msg);

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

//				int statusCode = con.getResponseCode();

//				if (statusCode >= 200 && statusCode >= 400) {
//					Scanner s = new Scanner(con.getErrorStream()).useDelimiter("\\A");
//					String response = s.hasNext() ? s.next() : "";

					
//				} else {
//					Scanner s = new Scanner(con.getInputStream()).useDelimiter("\\A");
//					String response = s.hasNext() ? s.next() : "";
//				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
