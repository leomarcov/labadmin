# LABADMIN CHANGELOG

## [26.1015]
 * [**Added**] Windows scripts are executed using SSH (WinRM conection is removed from Labadmin)
 * [**Added**] New action type `scp` to copy file from/to hosts
 * [**Added**] New action attribute `script_interactive` to set interactive action mode
 * [**Added**] Action `windows/file/copyto` and `windows/file/copyfrom`
 * [**Added**] Script `update` to force update local Labadmin repository from GitHub
 * [**Added**] Script `install-windows-agent.ps1` to manage Windows agent installation
 * [**Added**] Script `install-linux-admin` autogenerate `labadmin.conf` file and public/private keys
 * [**Remov**] File `lab.default` is replaced with `default_lab` variable defined in `labadmin.conf`
 * [**Added**] If only 1 lab file exists (and no `-l lab` or `default_lab` is defined) use this lab automatically
 * [**Remov**] Deep Freeze actions


## [26.1010]
* **Fixed**: tmux resize error eventually when some previous tmux instance still in memory
* **Added**: configured tmux interface for avoid select lines and show menus
* **Added**: double clic on MAP panel refresh map
* **Added**: tmux compact version show how to move to windows in help
* **Added**: map panel is dimmed when refresh map
* **Added**: personal contextual menu when right clic on status bar tab
* **Fixed**: labadmin closed when main LABADMIN panel is closed
* **Fixed**: read param overlaps prompt line
* **Fixed**: header line when host start executing action doesn't reach the end of the line
* **Remov**: panel MAP host selection and keyboard interaction, now only from EXEC panel
* **Added**: map panel auto refresh according autoscan_delay global variable seconds
* **Added**: arrow history when prompt actions and params
* **Fixed**: action `screen/grid` autodelete old links automatically to avoid generate millions of links
* **Fixed**: action `screen/grid` autodelete folder for old grids executed and current grid executing
* **Remov**: action `screen/grid` parameters delay and image quiality from `screen/grid` 
* **Fixed**: ctrl+c when script execution not exit, sends `ctrl+c` to script process
* **Added**: sub exec is executed in new window

## [25.0400]
* **Added**: new interface based on tmux with separated panels for MAP, LOG and EXECUTION
* **Added**: new binary `labadmin-cli` for non interactive use

  
