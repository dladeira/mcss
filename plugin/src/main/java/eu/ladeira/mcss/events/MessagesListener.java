package eu.ladeira.mcss.events;

import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.AsyncPlayerChatEvent;
import org.bukkit.event.player.PlayerCommandPreprocessEvent;

import eu.ladeira.mcss.Mcss;

public class MessagesListener implements Listener {
	
	@EventHandler
	public void onMsgSent(AsyncPlayerChatEvent e) {
		Mcss.messages++;
	}
	
	@EventHandler
	public void onWhisper(PlayerCommandPreprocessEvent e) {
		String msg = e.getMessage();
		if (msg.startsWith("/tell") || msg.startsWith("/w") || msg.startsWith("/whisper") || msg.startsWith("/msg")) {
			Mcss.whispers++;
		}
	}
}
