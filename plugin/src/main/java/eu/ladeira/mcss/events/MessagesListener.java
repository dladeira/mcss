package eu.ladeira.mcss.events;

import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.AsyncPlayerChatEvent;
import org.bukkit.event.player.PlayerCommandPreprocessEvent;

import eu.ladeira.mcss.ApiHandler;
import eu.ladeira.mcss.DataHandler;

public class MessagesListener implements Listener {

	private DataHandler data;
	private ApiHandler api;

	public MessagesListener(DataHandler data, ApiHandler api) {
		this.data = data;
		this.api = api;
	}

	@EventHandler
	public void onMsgSent(AsyncPlayerChatEvent e) {
		api.onChatMessage(e.getPlayer(), e.getMessage());
		data.incrementStat(e.getPlayer(), "messages");
		data.incrementStat(e.getPlayer(), "characters", e.getMessage().length());
	}

	@EventHandler
	public void onWhisper(PlayerCommandPreprocessEvent e) {
		String msg = e.getMessage();
		if (msg.startsWith("/tell") || msg.startsWith("/w") || msg.startsWith("/whisper") || msg.startsWith("/msg")) {
			data.incrementStat(e.getPlayer(), "whispers");
		} else {
			data.incrementStat(e.getPlayer(), "commands");
		}
	}
}
