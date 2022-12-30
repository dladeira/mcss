package eu.ladeira.mcss.events;

import java.util.HashMap;
import java.util.UUID;

import org.bukkit.Bukkit;
import org.bukkit.Location;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.block.BlockBreakEvent;
import org.bukkit.event.block.BlockPlaceEvent;
import org.bukkit.event.entity.PlayerDeathEvent;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerQuitEvent;
import org.bukkit.scheduler.BukkitRunnable;

import eu.ladeira.mcss.Mcss;
import eu.ladeira.mcss.StatsPlayer;

public class PlayerListener implements Listener {

	HashMap<UUID, Location> locations = new HashMap<UUID, Location>();

	public PlayerListener() {
		new BukkitRunnable() {
			public void run() {
				for (Player online : Bukkit.getOnlinePlayers()) {
					if (locations.containsKey(online.getUniqueId())) {
						StatsPlayer stats = Mcss.getStatsPlayer(online.getUniqueId());
						Location old = locations.get(online.getUniqueId());
						long distance = Math.round(online.getLocation().distance(old));

						if (old.getWorld().getName().equals(online.getWorld().getName()) && distance < 200) {
							stats.blocksTraveled += distance;
							Mcss.blocksTraveled += distance;
							locations.put(online.getUniqueId(), online.getLocation());
							continue;
						}
					}
					locations.put(online.getUniqueId(), online.getLocation());
				}
			}
		}.runTaskTimer(Mcss.plugin, 40, 40);
	}

	@EventHandler
	public void onPlayerJoin(PlayerJoinEvent e) {
		Mcss.getStatsPlayer(e.getPlayer().getUniqueId()); // Register player
	}

	@EventHandler
	public void onPlayerQuit(PlayerQuitEvent e) {
		Mcss.removeStatsPlayer(e.getPlayer().getUniqueId());
	}

	@EventHandler
	public void onPlayerDeath(PlayerDeathEvent e) {
		Mcss.getStatsPlayer(e.getEntity().getUniqueId()).deaths++;
		Mcss.deaths++;
	}

	@EventHandler
	public void onBlockBreak(BlockBreakEvent e) {
		Mcss.getStatsPlayer(e.getPlayer().getUniqueId()).blocksBroken++;
		Mcss.blocksBroken++;
	}

	@EventHandler
	public void onBlockPlace(BlockPlaceEvent e) {
		Mcss.getStatsPlayer(e.getPlayer().getUniqueId()).blocksPlaced++;
		Mcss.blocksPlaced++;
	}
}
