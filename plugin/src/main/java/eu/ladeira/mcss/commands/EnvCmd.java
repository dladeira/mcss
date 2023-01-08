package eu.ladeira.mcss.commands;

import org.bukkit.Bukkit;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;

import eu.ladeira.mcss.ApiHandler;
import net.md_5.bungee.api.ChatColor;

public class EnvCmd implements CommandExecutor {

	ApiHandler api;
	
	public EnvCmd(ApiHandler api) {
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
			sendMessage(sender, ChatColor.RED + "EROR: Invalid argument length");
		}
		
		int env = 0;
		
		try {
			env = Integer.parseInt(args[0]);
		} catch (Exception e) {
			sendMessage(sender, ChatColor.RED + "ERROR: Invalid enviroment " + env);
		}
		
		sendMessage(sender, ChatColor.YELLOW + "WARNING: This command is meant to be only used for testing purposes, please do not change it! (Default value: 1)");
		api.setEnv(env);
		
		return false;
	}
	
	public void sendMessage(CommandSender sender, String msg) {
		if (sender instanceof Player) {
			((Player) sender).sendMessage(msg);
		} else {
			Bukkit.getLogger().info(msg);
		}
	}
}
