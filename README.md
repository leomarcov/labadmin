# labadmin
<img align="left" src="https://cdn4.iconfinder.com/data/icons/online-marketing-hand-drawn-vol-3/52/monitor__television__computer__desktop__seo__service__marketing-128.png">

Labadmin is a Linux Bash script capable to remotely admin a set of hosts (Linux or Windows). It's an approach similar to Ansible, but Labadmin is focused to work in educational environment  on hosts in a computer laboratory. 

Labadmin aims to be a tool useful for teachers and computer lab sysadmins. 

&nbsp; 
## Main features
  * Discover the network status hosts in a laboratory classroom by MAC address, working on DHCP networks.
  * Show the status of each machine in a grid map according the preconfigured position. It's easy to identificate students computers by classroom location.
  * Flexible machine selection using ranges. Can select all machines, only a row, odd and even machines, a specific list, etc.
  * A set of actions to exec in selected machines. Labadmin incorporate a full set of actions ready to use (currently 133 for Linux and 40 for Windows). Some key actions are:
    * Config a restrictive environment in a exam time.
    * Send heavy files using multiple modes (unicast, torrent or mulsticast).
    * Send and schedule messages to users
    * Config firewall settings.
    * Virtualbox management (import ovas, play, delete, snapshots, etc.)
    * Transfer and copy disk partition images.
    * Show and save screenshots.
    * Other administrative task, like software installation, user accounts, process management, Windows activation, etc. 
  * Monitorization of action execution status. If any error has ocurred in some host is noticed.
  * It's easy to create your own actions using Bash script or Powershell languages.

## Demos
  * [Poweron computers](https://user-images.githubusercontent.com/32820131/66718825-a5b7ea00-ede8-11e9-9047-5afdac835816.gif)
  * [Check network speed](https://user-images.githubusercontent.com/32820131/66718827-a94b7100-ede8-11e9-9eed-0f13c8b56ce3.gif)
  * [Add user](https://user-images.githubusercontent.com/32820131/66718830-a94b7100-ede8-11e9-8fbd-a738410d0ebb.gif)
  * [Exec command](https://user-images.githubusercontent.com/32820131/66718829-a94b7100-ede8-11e9-900d-9ae35d8c66b2.gif)
  * [Copy 2.1GB file using multicast](https://user-images.githubusercontent.com/32820131/66718831-a94b7100-ede8-11e9-81d7-c3d8d6515ed5.gif)
  * [Copy 2.1GB file using unicast](https://user-images.githubusercontent.com/32820131/66718833-a9e40780-ede8-11e9-94a8-5667ed24a866.gif)
  * [Copy 2.1GB file using torrent](https://user-images.githubusercontent.com/32820131/66719197-fb8e9100-edec-11e9-8c98-4f143dbbce18.gif)
  * [Import Virtualbox ova](https://user-images.githubusercontent.com/32820131/66718837-aa7c9e00-ede8-11e9-9745-73aa8ce52a0e.gif)
  * [Start exam mode](https://user-images.githubusercontent.com/32820131/66718834-a9e40780-ede8-11e9-84af-24bfeff20a76.gif)
  * [Check exam mode](https://user-images.githubusercontent.com/32820131/66718836-aa7c9e00-ede8-11e9-83dc-44fd4427b2e2.gif)
  * [End exam mode](https://user-images.githubusercontent.com/32820131/66718834-a9e40780-ede8-11e9-84af-24bfeff20a76.gif)
  
## Working schema
  * Labadmin use a dedicated machine to admin the students hosts (usually teacher computer). Admin must be installed in a Linux OS. Controlled hosts can be Linux or Windows OS computers.
  * All machines must be placed in the same broadcast domain.
  * Each lab must be defined in a config file. This file stores:
    * Authentication config to use (SSH and/or WinRM).
    * MAC address for each host and a identification number.
    * Lab distribution: each id host must be placed in a grid position according the real position.
  * When labadmin starts discovers the computers configured in the lab file, show a map to select them and exec actions in all selected hosts.

<p align="center">
  <img src="https://user-images.githubusercontent.com/32820131/66718797-596caa00-ede8-11e9-81fd-ed2d3af4e1b2.png">
</p>


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
install -A test          # Install labadmin in admin machine using test config file as default lab 
```

## Linux controlled hosts install
  * In Linux controlled hosts installer only need to install all needed dependences and configure the remote SSH access method. Not agent labadmin software is installed.
  * Exec: `install.sh -H -c config_file`, where config file is the name of the lab config file located in `configs` directory where the host is placed. It's important that SSH variables are correctly set in config file. 
```bash
install -H -c test       # Install labadmin in host machine using test config file configuration
```  
  
## Windows controlled host install
  * In Windows 7 first install last version of Windows Management Framework: https://www.microsoft.com/en-us/download/details.aspx?id=54616.
  * Then enable WinRM access executing these commands in a PowerShell as Administrator:
 ```powershell
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
When run labadmin script starts using default lab config file and default mode (Linux or Windows) defined in this config.
You can run labadmin using any configuration and mode with parameters: ``-c`` and ``-L`` or ``-W``. 
```bash
labadmin            # Start labadmin using defualt config lab
labadmin -c a15     # Start labadin using a15 config file and default mode defined in a15
labadmin -c 15 -W   # Start labadin using a15 config file and Windows mode (WinRM)
```

Each action execution has 5 stages: discover, host selection, action selection, action parametrization and action monitorization.
  
## Discover
Discover stage search current IP for each host MAC in lab config file and checks the net state (is ON or OFF and listening or not). Once all network info has been recollected labadmin shows a grid map according the configured position.
<p align="center"><img width="606" src="https://user-images.githubusercontent.com/32820131/66719829-faf9f880-edf4-11e9-9183-f43c3aff4d3b.png"></p>
  
## Host selection
On this stage admin user select controlled hosts range where exec the action. Some range samples are:
  * ``a|all|*``: select all hosts
  * ``11,23,51``: select hosts 11, 23 and 51
  * ``11-20``: select hosts 11 to 20
  * ``2,3,11-15``: select hosts 2, 3, 11, 12, 13, 14 and 15
  * ``all /odd``: select all odds hosts
  * ``11-20 /even``: select hosts 12, 14, 16, 18 and 20
```
  > Select range (h for help): a             # Select all hosts
  > Select range (h for help): 11,23,51      # Select hosts 11, 23 and 51
  > Select range (h for help): 11-20         # Select host 11 to 20
  > Select range (h for help): 2,3,11-15     # Select host 2, 3 and 11 to 15
  > Select range (h for help): all /odd      # Select all odd hosts
  > Select range (h for help): 11-20 /even   # Select hosts 12, 14, 16, 18 and 20
```


<p align="center"><img width="606" src="https://user-images.githubusercontent.com/32820131/66719892-ed913e00-edf5-11e9-82ee-31acae5282ca.png"></p>

This stage can be skipped using ``-r <range>`` parameter.


## Action selection
Action selection allow navigate accros all available actions to select action to exec. Actions are organized in categories folders. 

It's possible to exec action in a iterative or concurrent way. By defualt iterative mode is used. To exec action in a concurrent mode use ``&`` symbol at end of action name. 
```bash
  > [/] Action: virtualbox/import         # Exec action in iterative mode
  > [/] Action: virtualbox/import&        # Exec action in concurrent mode
```

<p align="center"><img width="606" src="https://user-images.githubusercontent.com/32820131/66720050-dc493100-edf7-11e9-903d-163fd90160c5.png"></p>

This stage can be skipped using ``-a <action>`` parameter.


## Action parametrization
Each action ask for needed parameters to exec according to action needs.

<p align="center"><img width="606" src="https://user-images.githubusercontent.com/32820131/66720086-8032dc80-edf8-11e9-919b-8f8755fb9390.png"></p>

This stage can be skipped using ``-1 <value1> -2 <value2> ...`` parameters.

## Action monitorization


&nbsp;  
# Contact
My name is Leonardo Marco. I'm sysadmin teacher in [CIFP Carlos III](https://cifpcarlos3.es/), Cartagena, Murcia (Spain).

You can email me for suggestions, contributions, labadmin help or share your feelings: labadmin@leonardomarco.com
