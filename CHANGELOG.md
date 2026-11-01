# LABADMIN CHANGELOG

## [26.1015]
 * [**`ADDED`**] Windows scripts are executed using SSH (WinRM conection is removed from Labadmin)
 * [**`ADDED`**] new action type `scp` to copy file from/to hosts
 * [**`ADDED`**] new action attribute `script_interactive` to set interactive action mode
 * [**`ADDED`**] action `windows/file/copyto` and `windows/file/copyfrom`
 * [**`ADDED`**] script `update` to force update local Labadmin repository from GitHub
 * [**`ADDED`**] script `install-windows-agent.ps1` to manage Windows agent installation
 * [**`ADDED`**] script `install-linux-admin` autogenerate `labadmin.conf` file and public/private keys
 * [**`REMOV`**] file `lab.default` is replaced with `default_lab` variable defined in `labadmin.conf`
 * [**`ADDED`**] if only 1 lab file exists (and no `-l lab` or `default_lab` is defined) use this lab automatically
 * [**`REMOV`**] deep Freeze actions
 * [**`FIXED`**] ctrl+C when reading params cancel only reading params and go back to main menu


## [26.1010]
* [**`FIXED`**] tmux resize error eventually when some previous tmux instance still in memory
* [**`ADDED`**] configured tmux interface for avoid select lines and show menus
* [**`ADDED`**] double clic on MAP panel refresh map
* [**`ADDED`**] tmux compact version show how to move to windows in help
* [**`ADDED`**] map panel is dimmed when refresh map
* [**`ADDED`**] personal contextual menu when right clic on status bar tab
* [**`FIXED`**] labadmin closed when main LABADMIN panel is closed
* [**`FIXED`**] read param overlaps prompt line
* [**`FIXED`**] header line when host start executing action doesn't reach the end of the line
* [**`REMOV`**] panel MAP host selection and keyboard interaction, now only from EXEC panel
* [**`ADDED`**] map panel auto refresh according autoscan_delay global variable seconds
* [**`ADDED`**] arrow history when prompt actions and params
* [**`FIXED`**] action `screen/grid` autodelete old links automatically to avoid generate millions of links
* [**`FIXED`**] action `screen/grid` autodelete folder for old grids executed and current grid executing
* [**`REMOV`**] action `screen/grid` parameters delay and image quiality from `screen/grid` 
* [**`FIXED`**] ctrl+c when script execution not exit, sends `ctrl+c` to script process
* [**`ADDED`**] sub exec is executed in new window

## [25.0400]
* [**`ADDED`**] new interface based on tmux with separated panels for MAP, LOG and EXECUTION
* [**`ADDED`**] new binary `labadmin-cli` for non interactive use

  
