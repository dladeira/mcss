package eu.ladeira.mcss.events;

import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerQuitEvent;

import eu.ladeira.mcss.Mcss;

public class PlayerListener implements Listener {

	@EventHandler
	public void onPlayerJoin(PlayerJoinEvent e) {
		Mcss.getStatsPlayer(e.getPlayer().getUniqueId()); // Register player
	}
	
	@EventHandler
	public void onPlayerQuit(PlayerQuitEvent e) {
		Mcss.removeStatsPlayer(e.getPlayer().getUniqueId());
	}
}
