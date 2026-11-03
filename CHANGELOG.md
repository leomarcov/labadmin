# LABADMIN CHANGELOG

## [26.1015]
 * [**`ADDED`**] Windows scripts are executed using SSH (WinRM conection is removed from Labadmin)
 * [**`ADDED`**] New action type `scp` to copy file from/to hosts
 * [**`ADDED`**] New action attribute `script_interactive` to set interactive action mode
 * [**`ADDED`**] Action `windows/file/copyto` and `windows/file/copyfrom`
 * [**`ADDED`**] Script `update` to force update local Labadmin repository from GitHub
 * [**`ADDED`**] Script `install-windows-agent.ps1` to manage Windows agent installation
 * [**`ADDED`**] Script `install-linux-admin` autogenerate `labadmin.conf` file and public/private keys
 * [**`REMOV`**] File `lab.default` is replaced with `default_lab` variable defined in `labadmin.conf`
 * [**`ADDED`**] If only 1 lab file exists (and no `-l lab` or `default_lab` is defined) use this lab automatically
 * [**`REMOV`**] Deep Freeze actions
 * [**`FIXED`**] `CTRL+C` when reading params cancel only reading params and go back to main menu


## [26.1010]
* [**`FIXED`**] Tmux resize error eventually when some previous tmux instance still in memory
* [**`ADDED`**] Configured tmux interface for avoid select lines and show menus
* [**`ADDED`**] Double clic on MAP panel refresh map
* [**`ADDED`**] Tmux compact version show how to move to windows in help
* [**`ADDED`**] Map panel is dimmed when refresh map
* [**`ADDED`**] Custom contextual menu when right clic on status bar tab
* [**`FIXED`**] Labadmin exit when main LABADMIN panel is closed
* [**`FIXED`**] Read param overlaps prompt line
* [**`FIXED`**] Header line when host start executing action doesn't reach the end of the line
* [**`REMOV`**] Panel MAP host selection and keyboard interaction, now only from EXEC panel
* [**`ADDED`**] Map panel auto refresh according autoscan_delay global variable seconds
* [**`ADDED`**] Arrow history when prompt actions and params
* [**`FIXED`**] Action `screen/grid` autodelete old links automatically to avoid generate millions of links
* [**`FIXED`**] Action `screen/grid` autodelete folder for old grids executed and current grid executing
* [**`REMOV`**] Action `screen/grid` parameters delay and image quiality from `screen/grid` 
* [**`FIXED`**] `CTRL+C` when script execution not exit, sends `ctrl+c` to script process
* [**`ADDED`**] Action `sub` execution mode is executed in new panel

## [25.0400]
* [**`ADDED`**] New interface based on tmux with separated panels for MAP, LOG and EXECUTION
* [**`ADDED`**] New binary `labadmin-cli` for non interactive use

  
