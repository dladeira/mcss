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
import org.bukkit.event.inventory.CraftItemEvent;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerQuitEvent;
import org.bukkit.scheduler.BukkitRunnable;

import eu.ladeira.mcss.DataHandler;
import eu.ladeira.mcss.Mcss;

public class PlayerListener implements Listener {

	HashMap<UUID, Location> locations = new HashMap<UUID, Location>();
	private DataHandler data;
	
	public PlayerListener(final DataHandler data) {
		this.data = data;
		
		new BukkitRunnable() {
			public void run() {
				for (Player online : Bukkit.getOnlinePlayers()) {
					if (locations.containsKey(online.getUniqueId())) {
						Location old = locations.get(online.getUniqueId());
						long distance = Math.round(online.getLocation().distance(old));

						if (old.getWorld().getName().equals(online.getWorld().getName()) && distance < 200) {
							data.incrementStat(online, "blocksTraveled", distance);
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
		data.registerStatsPlayer(e.getPlayer()); // Register player
	}

	@EventHandler
	public void onPlayerQuit(PlayerQuitEvent e) {
		data.removeStatsPlayer(e.getPlayer().getUniqueId());
	}

	@EventHandler
	public void onPlayerDeath(PlayerDeathEvent e) {
		data.incrementStat(e.getEntity(), "deaths", 1);
	}

	@EventHandler
	public void onBlockBreak(BlockBreakEvent e) {
		data.incrementStat(e.getPlayer(), "blocksBroken", 1);
	}

	@EventHandler
	public void onBlockPlace(BlockPlaceEvent e) {
		data.incrementStat(e.getPlayer(), "blocksPlaced", 1);
	}
	
	@EventHandler
	public void onItemCraft(CraftItemEvent e) {
		data.incrementStat((Player) e.getWhoClicked(), "itemsCrafted", 1);
	}
}
