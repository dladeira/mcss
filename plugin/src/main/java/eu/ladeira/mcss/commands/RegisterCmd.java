package eu.ladeira.mcss.commands;

import org.bukkit.Bukkit;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

import eu.ladeira.mcss.ApiHandler;
import net.md_5.bungee.api.ChatColor;

public class RegisterCmd implements CommandExecutor {

	private ApiHandler api;
	
	public RegisterCmd(ApiHandler api) {
		this.api = api;
	}
	
	@Override
	public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
		if (sender instanceof Player) {
			if (!((Player) sender).isOp()) {
				sendMessage(sender, ChatColor.RED + "ERROR: Only administrators can use this command");
				return false;
			}
		}
		
		if (args.length != 1) {
			sendMessage(sender, ChatColor.RED + "ERROR: Incorrect argument count");
			return false;
		}

		String secret = args[0];

		sendMessage(sender, ChatColor.GRAY + "Validating secret..." + ChatColor.WHITE + " (" + args[0] + ")");
		String serverName = api.validateSecret(secret);
		if (serverName == null) {
			sendMessage(sender, ChatColor.RED + "ERROR: Invalid secret");
			return false;
		} else {
			sendMessage(sender, ChatColor.WHITE + "Registered as server " + ChatColor.BOLD + "" + ChatColor.GOLD + serverName);
			api.setSecret(secret);
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
}
