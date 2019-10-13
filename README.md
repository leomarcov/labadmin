# labadmin
<img align="left" src="https://cdn4.iconfinder.com/data/icons/online-marketing-hand-drawn-vol-3/52/monitor__television__computer__desktop__seo__service__marketing-128.png">

Labadmin is a Linux Bash script capable to remotely admin a set of hosts (Linux or Windows). It's an approach similar to Ansible, but Labadmin is focused to work in educational environment  on hosts in a computer laboratory. 

Labadmin aims to be a tool useful for IT teachers and computer lab sysadmins. 

&nbsp; 
## Main features
  * Discover the network status hosts in a laboratory classroom by MAC address, working on DHCP networks.
  * Show the status of each machine in a grid map according the preconfigured position. It's easy to identificate students computers by classroom location.
  * Flexible machine selection using ranges. Can select all machines, only a row, odd and even machines, a specific list, etc.
  * A set of actions to exec in selected machines. Labadmin incorporate a full set of actions ready to use (currently 133 for Linux and 40 for Windows). Some key actions are:
    * Config a restrictive environment in a exam time (block all users, block usb drivers, set restrictive firewall rules, autobackup exam user data, block Virtualbox bridge mode and others restrictions).
    * Send heavy files using multiple modes (unicast, torrent or mulsticast).
    * Send and schedule messages to users.
    * Config firewall settings.
    * Virtualbox management (import ovas, play, delete, snapshots, etc.)
    * Transfer and copy disk partition images.
    * Show and save screenshots.
    * Other administrative task, like software installation, user accounts, process management, Windows activation, etc. 
	* Much more!
  * Monitorization of action execution status. If any error has ocurred in some host is noticed.
  * It's easy to create your own actions using Bash script or Powershell languages.

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

## Demos
You can see labadmin in action in short animations:
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
When labadmin starts loads default lab config file and default mode (Linux or Windows) defined in this config.
You can change lab config loaded and mode with parameters: ``-c <config_file>`` and ``-L`` or ``-W``. 
```bash
labadmin            # Start labadmin using defualt config lab
labadmin -c a15     # Start labadin using a15 config file and default mode defined in a15
labadmin -c 15 -W   # Start labadin using a15 config file and Windows mode (WinRM)
labadmin -c 15 -L   # Start labadin using a15 config file and Linux mode (SSH)

```

Each action execution has 5 stages: discover, host selection, action selection, action parametrization and action monitorization.
  
## Discover
Discover stage search current IP for each host MAC in lab config file and checks the net state:
  * OFF machines: red dot
  * ON machines listening port: green 
  * ON machines not listening: red background
  
Once all network info has been recollected labadmin shows a grid map according the configured position.
<p align="center"><img width="606" src="https://user-images.githubusercontent.com/32820131/66719829-faf9f880-edf4-11e9-9183-f43c3aff4d3b.png"></p>
  
## Host selection
On this stage admin user select controlled hosts range where exec the action. 

Some range samples are:
``` bash
  > Select range (h for help): a                # Select all hosts
  > Select range (h for help): 11,23,51         # Select hosts 11, 23 and 51
  > Select range (h for help): 11-20            # Select host 11 to 20
  > Select range (h for help): 2,3,11-15        # Select host 2, 3 and 11 to 15
  > Select range (h for help): all /odd         # Select all odd hosts
  > Select range (h for help): 11-20 /even      # Select hosts 12, 14, 16, 18 and 20
```


<p align="center"><img width="606" src="https://user-images.githubusercontent.com/32820131/66719892-ed913e00-edf5-11e9-82ee-31acae5282ca.png"></p>

This stage can be skipped using ``-r <range>`` parameter.
```bash 
labadmin -r 11-23       # Exec labadmin and autoselect hosts from 11 to 23
```


## Action selection
Action selection allow navigate accros all available actions to select action to exec. Actions are organized in categories folders. 

It's possible to exec action in a iterative or concurrent way. By defualt iterative mode is used. To exec action in a concurrent mode use ``&`` symbol at end of action name. 
```bash
  > [/] Action: virtualbox/import         # Exec action in iterative mode
  > [/] Action: virtualbox/import&        # Exec action in concurrent mode
```

<p align="center"><img width="606" src="https://user-images.githubusercontent.com/32820131/66720700-947ad780-ee00-11e9-9701-03f1510da11f.png"></p>

This stage can be skipped using ``-a <action>`` parameter.
```bash 
labadmin -r a virtualbox/import       # Exec labadmin and autoselect action virtualbox/import
```

## Action parametrization
Each action ask for needed parameters to exec according to action needs.

<p align="center"><img width="606" src="https://user-images.githubusercontent.com/32820131/66720709-b7a58700-ee00-11e9-9d14-ccff30a3c2c2.png"></p>

This stage can be skipped using ``-1 <value1> -2 <value2> ...`` parameters.
```bash 
# Exec labadmin and autoselect virtualbox/import action with parameters alumno and /home/e.ova
labadmin -r a virtualbox/import -1 alumno -2 /home/e.ova  
```

## Action monitorization
On this stage labadmin exec action in each host and show output messages of each host execution.
If any error occurs labadmin shows at ending the machine list with errors.

<p align="center"><img width="606" src="https://user-images.githubusercontent.com/32820131/66720795-a8730900-ee01-11e9-8146-0c625924fdc4.png"></p>

&nbsp;  
# Actions
Labadmin has a lot of actions ready to use!

## Linux actions
```
[clone/]              Manage partition image backups
  [mbr-table/]        Manage MBR partition table
    [add-part]        Create new partition
    [del-part]        Delete partition
    [resize-part]     Resize partition to grow until end of disk or next partition
    [restore-table]   Restore remote partition table
    [save-table]      Backup remote partition table and bootloader (first MB) and save in local path
    [show-table]      Show MBR partition table
	
  [multicast/]        Manage partition image backups using multicast
    [restore-dd]      Restore remote partition or disk using dd
    [restore-part]    Restore remote partition from local partclone image using multicast

  [unicast/]          Manage partition image backups using unicast
    [restore-dd]      Restore remote partition or disk using dd
    [restore-part]    Restore remote partition from local partclone image using unicast
    [save-part]       Clone remote partition and save to partclone image in local path using unicast

[conf/]               System config tasks
  [cron/]             Config root crontab file
    [add]             Add line to root crontab
    [remove]          Remove line from root crontab
    [show]            Show root crontab config

  [homeperm/]         Config home directories permissions to 0750
    [set]             Set HOME directories permissions to rwxr-x--- and config adduser DIR_MODE=750
    [show]            Show HOME directories with permissive access

  [networkmanager/]   Prevent specific group can manage network-manager
    [disable]         Restrict network-manager to prevent specific group can manage it
    [restore]         Restore network-manager permissions to allow all users manage it

  [sudoers/]          Config sudoers file
    [add]             Add new line in sudoers file
    [remove]          Remove line from sudoers file
    [show]            Show sudoers file

  [time/]             Set system date/hour and show current time
    [ntp]             Update system timedate using NTP
    [set]             Set system timedate
    [show]            Show system time
  [guardian]          Install labadmin guardian for check and mail "stranger things" in hosts
  [hostname]          Set hostname
  [mail]              Install and config Postfix SMTP client for send mails (only root account)

[exam/]               Create restrictive environment for take exams
  [backup/]           Manage exam backups autosaved when exam ends
    [del]             Delete exam(s) backup
    [download]        Download exam backup to local machine
    [list]            List all exam saved and hidden in root account
    [show]            Show content of exam backup
  [check]             Check if host is blocked for exam
  [end]               Come back host to normal config when exam ends
  [start]             Config host for restrictive exam environment

[exec/]             Exec commands in hosts
  [com]             Exec commands in host
  [script]          Exec local script in host
  [win]             Open window in host X session
  [win-admin]       Open window in host X session with admin privileges

[file/]             Transfer files to/from host
  [copyfrom]        Copy files or directory from host to admin
  [copyto]          Copy files or directory from admin to host
  [download]        Download URL resource in host
  [multicast]       Copy files or directory from admin to host using MULTICAST
  [torrent]         Download torrent resource in host
  [torrent-local]   Send local files to hosts using torrent

[labadmin/]         Manage Labadmin config in hosts
  [conf]            Update labadmin host config (sshport and sshpubkey) from lab file config
  [dependencies]    Check and install host dependencies for Labadmin

[misc/]             Miscellaneous actions
  [screenshot/]     Take host screenshot and save or display it
    [save]          Save multiple screenshot from host display
    [show]          Show host display animation 
  [music]           The best moeldies in your pcspeaker! :D

[msg/]              Send msg to host users
  [chat]            Starts text chat with logged user
  [login]           Show text message next time user login
  [msg-urls]        Config system for send notification when detect user is browsing some urls
  [notify]          Send notify message to logged user
  [win]             Show text message in a terminal window

[net/]              Network configs and tools
  [iptables/]       Restrict network access using IPTABLES
    [allow]         Allow access to specific IP or domain in a whitelist
    [blacklist]     Start blacklist (delete all rules and allow all ips but exceptions)
    [delete]        Delete specific rule number
    [deny]          Deny access to specific IP or domain in a blacklist
    [flush]         Flush (clean) all rules
    [list]          List all IPTABLES rules
    [show]          Show all IPTABLES rules
    [whitelist]     Start whitelist (delete all rules and deny all ips but exceptions)  
  [check-con]       Check network connectivity to gateway, Internet and DNS
  [force-1000]      Force negotiated speed to gigabit
  [speed-conf]      Show NIC card speed negotiated and poweroff slow hosts
  [speed-test]      Perform network speed test from admin to host

[process/]          Manage logged user process
  [cont]            Continue all process of logged user
  [kill]            Kill all process of logged users
  [list]            List all process of logged users
  [stop]            Stop all process of logged users
  [term]            Term all process of logged users

[service/]          Manage system services
  [disable]         Disable system service (no starts on startup)
  [enable]          Enable system service (starts on startup)
  [is-active]       Show if system service is active
  [journal]         Show system service journal
  [list]            List all system services
  [reload]          Reload system service
  [restart]         Restart system service
  [start]           Start system service
  [status]          Show system service status
  [stop]            Stop system service

[software/]         Automate software installation
  [packages/]       Manage package repositories
    [install]       Install a list of packages from repositories
    [uninstall]     Uninstall a list of package(s)
    [update]        Update package info from repositories
    [upgrade]       Update all packages to latest version from repositories  
  [vbox_extpack]    Update VirtualBox Extension Pack

[user/]             Admin host users
  [add]             Add a user
  [del]             Delete user and his home directory
  [group]           Add/remove users from group
  [idle]            Show how much time user is idle (not using keyboard or mouse)
  [lock]            Lock users
  [pass]            Set user password
  [show]            Show users with PID >=1000, groups and sudoers config
  [size]            Show users sorted by HOME directory size
  [unlock]          Unlock users

[virtualbox/]       Manage VirtualBox using vboxmanage
  [bridge/]         Allow or deny use bridged network
    [disable]       Disable bridged network for all users
    [enable]        Enable bridged network for all users
    [status]        Show status of bridged network for all users  
  [import]          Import .ova file
  [list]            List all machines
  [play]            Play machine
  [remove]          Remove virtual machine
  [rename]          Rename machine
  [snap]            Create snapshot
  [stop]            Stop machine

[poweroff]          Power OFF host
[poweron]           Power ON host using network
[reboot]            Reboot host
[reboot-grub]       Reboot host
[ssh]               Open SSH connection to host
[sysreq]            Send system request signal

```

## Windows actions
```

```


&nbsp;  
# Lincense
License is [GPLv3](LICENSE)

# Contact
My name is Leonardo Marco. I'm sysadmin teacher in [CIFP Carlos III](https://cifpcarlos3.es/), Cartagena, Murcia (Spain).

You can email me for suggestions, contributions, labadmin help or share your feelings: labadmin@leonardomarco.com
