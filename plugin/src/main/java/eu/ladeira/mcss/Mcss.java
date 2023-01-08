package eu.ladeira.mcss;

import org.bukkit.event.Listener;
import org.bukkit.plugin.Plugin;
import org.bukkit.plugin.java.JavaPlugin;

import eu.ladeira.mcss.commands.EnvCmd;
import eu.ladeira.mcss.commands.RegisterCmd;
import eu.ladeira.mcss.events.MessagesListener;
import eu.ladeira.mcss.events.PlayerListener;

public class Mcss extends JavaPlugin {

	public static Plugin plugin;

	private DataHandler dataHandler;
	private ApiHandler apiHandler;
	
	@Override
	public void onEnable() {
		Mcss.plugin = this;
		
		this.dataHandler = new DataHandler();
		this.apiHandler = new ApiHandler(dataHandler);

		getCommand("register").setExecutor(new RegisterCmd(apiHandler));
		getCommand("setenvmcss").setExecutor(new EnvCmd(apiHandler));

		registerEvents(new MessagesListener(dataHandler, apiHandler), new PlayerListener(dataHandler));
	}

	public void registerEvents(Listener... listeners) {
		for (Listener listener : listeners) {
			this.getServer().getPluginManager().registerEvents(listener, this);
		}
	}

	@Override
	public void onDisable() {
		apiHandler.onDisable();
		
		Mcss.plugin = null;
	}
}
