# labadmin
Labadmin is a Linux Bash script capable to remotely admin a set of hosts (Linux or Windows). It's an approach similar to Ansible, but Labadmin is focused to work in educational environment  on hosts in a computer laboratory. 
It's a tool useful for teachers and sysadmins. 

## Main features
  * Discover the network status hosts in a laboratory classroom by MAC address, working on DHCP networks.
  * Show the status of each machine in a grid map according the preconfigured position. It's easy to identificate students computers by classroom location.
  * Flexible machine selection using ranges. Can select all machines, only a row, odd and even machines, a specific list, etc.
  * A set of actions to exec in selected machines. Labadmin incorporate a full set of actions ready to use (currently 133 for Linux and 40 for Windows). Some key actions are:
    * Config a restrictive environment in a exam time.
    * Send heavy files using multiple modes (unicast, torrent or mulsticast).
    * Send and schedule messages to users
    * Config firewall settings.
    * Transfer and copy disk partition images.
    * Show and save screenshots.
    * Other administrative task, like software installation, user accounts, process management, Windows activation, etc. 
  * Monitorization of action execution status. If any error has ocurred in some host is noticed.
  * It's easy to create your own actions using Bash script or Powershell languages.

## Execution demo


## Working schema
  * Labadmin use a dedicated machine to admin the students hosts (usually teacher computer). Admin must be installed in a Linux OS. Controlled hosts can be Linux or Windows OS computers.
  * All machines must be placed in the same broadcast domain.
  * Each lab must be defined in a config file. This file stores:
    * Authentication config to use (SSH and/or WinRM).
    * MAC address for each host and a identification number.
    * Lab distribution: each id host must be placed in a grid position according the real position.
  * When labadmin starts discovers the computers configured in the lab file, show a map to select them and exec actions in all selected hosts.

![Labadmin schema](https://github.com/leomarcov/labadmin/blob/master/doc/images/schema.png?raw=true "Labadmin schema")


&nbsp;  
# Install
Once downloaded or cloned the project, labadmin must be configured for each lab and installed in admin and each controlled host.

## Create a config files
  * Each lab must be defined in a config file and placed in `labadmin/configs/` directory. This file is a Bash script where config variables are defined.
  * You can use the provided [configs/test](configs/test) file as template.   
  * For more information refer to [test](configs/test) config file comments.
    

## Admin install
  * Admin must be installed in a Linux machine (Debian, Fedora or Ubuntu).
  * Exec: `./install -A -c config_file`, where config file is the name of the file located in `configs` directory to use as a default config when labadmin is open. 
  * Optionally you can use `ask` config file as default config. This config file asks in each execution what config file to use.
```bash
./install -A test          # Install labadmin in admin machine using test config file as default lab 
```

## Linux controlled hosts install
  * In Linux controlled hosts installer only need to install all needed dependences and configure the remote SSH access method. Not agent labadmin software is installed.
  * Exec: `install.sh -H -c config_file`, where config file is the name of the lab config file located in `configs` directory where the host is placed. It's important that SSH variables are correctly set in config file. 
```bash
./install -H -c test       # Install labadmin in host machine using test config file configuration
```  
  
## Windows controlled host install
  * In Windows 7 first install last version of Windows Management Framework: https://www.microsoft.com/en-us/download/details.aspx?id=54616.
  * Then enable WinRM access executing these commands in a PowerShell as Administrator:
 ```javascript
Enable-PSRemoting -Force
winrm set winrm/config/service/auth '@{Basic="true"}'
winrm set winrm/config/service '@{AllowUnencrypted="true"}'
winrm set winrm/config/winrs '@{MaxMemoryPerShellMB="1024"}'
sc.exe config winrm start= auto
Set-Item wsman:\localhost\client\trustedhosts *

```

&nbsp;  
# Usage
Labadmin can operate in interactive or parametrized mode (use `labadmin -h` for parameter info).

Each execution has 5 stages: discover, host selection, action selection, action parametrization and action monitorization.
  
## Discover
Discover stage search for each host MAC in config file the current IP associated and his state (OFF, ON and listening in configured port (SSH or WinrM) or ON but not listening in config port).

Once all network info has been recollected labadmin shows a grid map according the position configured for each host and his actual state.
  
## Host selection

## Action selection

## Action parametrization

## Action monitorization

# Contact
My name is Leonardo Marco. Im sysadmin teacher in [CIFP Carlos III](https://cifpcarlos3.es/), Cartagena, Murcia (Spain).

You can contact me for suggestions, contributions or help by email: labadmin@leonardomarco.com
