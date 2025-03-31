# labadmin
<img align="left" src="https://cdn4.iconfinder.com/data/icons/online-marketing-hand-drawn-vol-3/52/monitor__television__computer__desktop__seo__service__marketing-128.png" width="80" >

Labadmin is a Linux tool, writed on Bash shellscript, capable to **remotely admin** a set of hosts running Linux or Windows. Is focused to work in educational environment controlling hosts in a computer laboratory. 
Labadmin aims to be a tool useful for IT teachers and computer lab sysadmins. 

&nbsp; 
## Main features
  * Discover hosts network status in a laboratory classroom by MAC address (works on **DHCP** networks!).
  * Show the status of each machine in a grid map according the preconfigured position in the lab. It's easy to identificate students computers by map location.
  * Flexible host selection using ranges. Can select all machines, only a row, odd and even machines, a specific list, etc.
  * Labadmin incorporate a **full set of administrative actions** ready to use (currently **113 for Linux** and **42 for Windows**). Some key actions are:
    * **Config a restrictive environment in a exam time**: block all users, block usb drivers, set restrictive firewall rules, autobackup exam user data, block Virtualbox bridge mode, autocapture screnshoots and others restrictions.
    * **Send heavy files using multiple protocols**: unicast, torrent or multicast.
    * Send and schedule messages to users.
    * Config firewall settings.
    * Virtualbox management (import ovas, play, delete, snapshots, etc.)
    * Transfer and copy disk partition images using ''partclone'' and ''dd''.
    * Show and save screenshots of selected hosts.
    * Show thumnails screenshots of map lab.
    * Other administrative tasks, like software installation, user accounts, process management, Windows activation, etc. 
	* Much more!
  * Monitorization of action execution status. If any error has ocurred in some host is noticed.
  * It's easy to create your own actions using Bash or Powershell languages.

<p align="center">
 <img src="https://github.com/user-attachments/assets/84b7a7f2-4c8e-444c-946c-ce9f39b3750d">
</p>

## Working schema
  * Labadmin use a dedicated machine to admin the students hosts (usually teacher computer or server).
    * **Admin must be installed in a Linux OS**.
    * Controlled hosts can be **Linux** or **Windows** OS computers.
  * All machines must be placed in the same broadcast domain. Labadmin uses MAC address to discover computers, so works in DHCP environments. 
  * Each lab must be defined previously in a config file ([templates/labtest](templates/labtest)). Lab config file stores:
    * MAC address for each host and a identification number.
    * Lab distribution: each id host must be placed in a grid according the real position in the lab.
  * When labadmin starts it discover the computers configured in the lab file, show a map to select them and exec actions in all selected hosts.
  * Labadmin works in real time, all actions all send synchronously at the moment. For manage scripts execution asynchronously may see [Labadmin Script Server](https://github.com/leomarcov/labadmin-script_server).

<p align="center">
  <img src="https://user-images.githubusercontent.com/32820131/66718797-596caa00-ede8-11e9-81fd-ed2d3af4e1b2.png">
</p>

## Demos
You can see labadmin in action in short animations:
  * [Poweron computers](https://user-images.githubusercontent.com/32820131/66718825-a5b7ea00-ede8-11e9-9047-5afdac835816.gif)
  * [Check network speed](https://user-images.githubusercontent.com/32820131/66718827-a94b7100-ede8-11e9-9eed-0f13c8b56ce3.gif)
  * [Add user](https://user-images.githubusercontent.com/32820131/66718830-a94b7100-ede8-11e9-8fbd-a738410d0ebb.gif)
  * [Exec command](https://user-images.githubusercontent.com/32820131/66718829-a94b7100-ede8-11e9-900d-9ae35d8c66b2.gif)
  * [Copy 2 GB file using unicast](https://user-images.githubusercontent.com/32820131/66718833-a9e40780-ede8-11e9-94a8-5667ed24a866.gif)
  * [Copy 2 GB file using multicast](https://user-images.githubusercontent.com/32820131/66718831-a94b7100-ede8-11e9-81d7-c3d8d6515ed5.gif)
  * [Copy 2 GB file using torrent](https://user-images.githubusercontent.com/32820131/66719197-fb8e9100-edec-11e9-8c98-4f143dbbce18.gif)
  * [Import Virtualbox ova](https://user-images.githubusercontent.com/32820131/66718837-aa7c9e00-ede8-11e9-9745-73aa8ce52a0e.gif)
  * [Start exam mode](https://user-images.githubusercontent.com/32820131/66718835-a9e40780-ede8-11e9-97e9-4fcd3c0f2f3c.gif)
  * [Check exam mode](https://user-images.githubusercontent.com/32820131/66718836-aa7c9e00-ede8-11e9-83dc-44fd4427b2e2.gif)
  * [End exam mode](https://user-images.githubusercontent.com/32820131/66718834-a9e40780-ede8-11e9-84af-24bfeff20a76.gif)


&nbsp;  
# Install
## Admin install (only Linux)
  * Admin must be installed in a Linux OS (Debian, Fedora and Ubuntu has been tested).
```bash
#### CLONE REPOSITORY AND COPY CONFIG TEMPLATE
git clone https://github.com/leomarcov/labadmin
cd labadmin
cp templates/labadmin.conf conf/

#### EDIT LABADMIN CONFIG
vi conf/labadmin.conf
 winrmuser="labadmin"                   # Windows labadmin local user to connecto with hosts
 winrmport="5985"                       # Windows WINRM port to use  
 winrmpass="<your_encrypted__pass>"     # GENERATE: read -p "Windows localuser pass to encrypt: " p; echo "$p" | openssl enc -aes-256-cbc  -a -salt -pbkdf2 | base64
 sshport="58888"                        # SSH port to connect with hosts
 sshpubkey='<your_public_key>'          # GENERATE: ssh-keygen -t rsa and copy pubkey and privatekey content in sshpubkey and sshprivatekey variables
 sshprivatekey='<your_private_key>'     #           you can delete id_rsa and id_rsa.pub generated after

#### INSTALL ADMIN
bash install admin
```  

#### Create config lab files
  * For each computer laboratory create a file in `/opt/labadmin/labs/` with config lab:

```bash
cd /opt/labadmin
cp labs/labtest labs/A11                # Set lab config filename to your lab ID name
vi /opt/labadmin/labs/A11
 labadmin="AULA 11"                     # Lab name
 srvmode="ssh"                          # Server mode (ssh or winrm)

 # List of MACs for each host in map
 # macs[<host_id>]=<MAC>
 macs[11]="08:00:27:B5:EE:E8"
 macs[12]="08:00:27:2a:f0:f2"
 macs[13]="08:00:27:bb:07:9d"
...

 # Map distritution for each host in lab
 # Break line is used for row separator
 # Space is used for column separator
 # Each character not iqual a number is discarted
 map='
 56 55 54 53 52 51
 46 45 34 33 32 31
 36 35 34 33 32 31
 __ __ 24 23 22 21
 __ __ 14 13 12 11
 ' 
```  

## Hosts install on Linux
  * Not agent labadmin software is installed, installer only need to install all needed dependences and configure the remote SSH access method.
```bash
git clone https://github.com/leomarcov/labadmin        # Clone repository
cd labadmin                                            # Access dir
cp xxxxx/labadmin.conf conf/                           # Copy your previus labadmin.conf with authentication data used for admin installation to conf/
bash install host                                      # Install and config labadmin in host machine
```  
  
## Hosts install on Windows
  * Enable WinRM access executing these commands in a PowerShell as Administrator:
 ```powershell
Enable-PSRemoting -Force
winrm set winrm/config/service/auth '@{Basic="true"}'
winrm set winrm/config/service '@{AllowUnencrypted="true"}'
winrm set winrm/config/winrs '@{MaxMemoryPerShellMB="1024"}'
sc.exe config winrm start= auto
Set-Item wsman:\localhost\client\trustedhosts *
```
  * Create `labadmin` user to connect with WinRM and hide user from login:

 ```powershell
$labadmin_user="labadmin"
while(!$labadmin_user_cred -OR $labadmin_user_cred.Username -ne "labadmin") { $labadmin_user_cred = Get-Credential -Credential $labadmin_user }
New-LocalUser -Name $labadmin_user -FullName "Labadmin user" -Password $labadmin_user_cred.Password
Set-LocalUser -Name $labadmin_user -PasswordNeverExpires:$true
Add-LocalGroupMember -Member $labadmin_user -SID "S-1-5-32-544"

# Hide user from login screen
New-Item 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon\SpecialAccounts\UserList' -Force | New-ItemProperty -Name $labadmin_user -Value 0 -PropertyType DWord -Force
```

&nbsp;  
# Usage
When labadmin starts loads default lab config file and operate in configured as default mode (Linux or Windows).
You can select other lab config and mode with parameters: ``-l <lab_file>`` and ``-L`` or ``-W``. 
```bash
labadmin                # Start labadmin using defualt config lab
labadmin -l A15         # Start labadin using a15 lab file and default mode defined in a15
labadmin -l A15 -W      # Start labadin using a15 lab file and Windows mode (WinRM)
labadmin -l A15 -L      # Start labadin using a15 lab file and Linux mode (SSH)
```

<details><summary>Parameter options</summary><p>
	
```
$ labadmin -h
  Labadmin TUI
   labadmin [-l lab_config] [-i face] [-W|-L] [-F]

  OPTIONS
   -l lab_config
	Lab config filename to use
	Lab config files must be placed in labs/ directory
	When not specified default file is used.

   -i iface
	Network interface to use. Overrides iface variable in labadmin config file.

   -W 
	Force Windows WINRM server mode. Overrides srvmode variable in lab config file.

   -L 
	Force Linux SSH server mode. Overrides srvmode variable in lab config file.

   -F 
	Force continue even check dependencies fail
```
</p></details>



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
Action selection allow navigate accros all available actions to select action to exec. Actions are organized in categories directories. 

It's possible to exec action in a iterative or concurrent way. By defualt iterative mode is used. To exec action in a concurrent mode use ``&`` symbol at end of action name. 
```bash
  > [/] Action: virtualbox/import         # Exec action in iterative mode
  > [/] Action: virtualbox/import&        # Exec action in concurrent mode
```

<p align="center"><img width="606" src="https://user-images.githubusercontent.com/32820131/66720700-947ad780-ee00-11e9-9701-03f1510da11f.png"></p>

This stage can be skipped using ``-a <action>`` parameter.
```bash 
labadmin -a virtualbox/import       # Exec labadmin and autoselect action virtualbox/import
labadmin -a "virtualbox/import&"    # Exec labadmin and autoselect action virtualbox/import in concurrent mode
```

## Action parametrization
Each action ask for needed parameters to exec according to action needs.

<p align="center"><img width="606" src="https://user-images.githubusercontent.com/32820131/66720709-b7a58700-ee00-11e9-9d14-ccff30a3c2c2.png"></p>

This stage can be skipped using ``-1 <value1> -2 <value2> ...`` parameters.
```bash 
# Exec labadmin and autoselect virtualbox/import action with parameters alumno and /home/e.ova
labadmin -a virtualbox/import -1 alumno -2 /home/e.ova  
```

## Action monitorization
On this stage labadmin exec action in each host and show output messages of each host execution.
If any error occurs labadmin shows at ending the machine list with errors.

<p align="center"><img width="606" src="https://user-images.githubusercontent.com/32820131/66720795-a8730900-ee01-11e9-8146-0c625924fdc4.png"></p>

&nbsp;  
# Available actions
Labadmin has a lot of actions ready to use! Actions are categorized for better organization.

## Linux actions
```
[clone/]             Manage partition image backups
  [mbr-table/]       Manage MBR partition table
    [add-part]       Create new partition
    [del-part]       Delete partition
    [resize-part]    Resize partition to grow until end of disk or next partition
    [restore-table]  Restore remote partition table
    [save-table]     Backup remote partition table and bootloader (first MB) and save in local path
    [show-table]     Show MBR partition table
	
  [multicast/]       Manage partition image backups using multicast
    [restore-dd]     Restore remote partition or disk using dd
    [restore-part]   Restore remote partition from local partclone image using multicast

  [unicast/]         Manage partition image backups using unicast
    [restore-dd]     Restore remote partition or disk using dd
    [restore-part]   Restore remote partition from local partclone image using unicast
    [save-part]      Clone remote partition and save to partclone image in local path using unicast

[conf/]              System config tasks
  [cron/]            Config root crontab file
    [add]            Add line to root crontab
    [remove]         Remove line from root crontab
    [show]           Show root crontab config

  [homeperm/]        Config home directories permissions to 0750
    [set]            Set HOME directories permissions to rwxr-x--- and config adduser DIR_MODE=750
    [show]           Show HOME directories with permissive access

  [networkmanager/]  Prevent specific group can manage network-manager
    [disable]        Restrict network-manager to prevent specific group can manage it
    [restore]        Restore network-manager permissions to allow all users manage it

  [sudoers/]         Config sudoers file
    [add]            Add new line in sudoers file
    [remove]         Remove line from sudoers file
    [show]           Show sudoers file

  [time/]            Set system date/hour and show current time
    [ntp]            Update system timedate using NTP
    [set]            Set system timedate
    [show]           Show system time
  [guardian]         Install labadmin guardian for check and mail "stranger things" in hosts
  [hostname]         Set hostname
  [mail]             Install and config Postfix SMTP client for send mails (only root account)

[exam/]              Create restrictive environment for take exams
  [backup/]          Manage exam backups autosaved when exam ends
    [del]            Delete exam(s) backup
    [download]       Download exam backup to local machine
    [list]           List all exam saved and hidden in root account
    [show]           Show content of exam backup
  [check]            Check if host is blocked for exam
  [end]              Come back host to normal config when exam ends
  [start]            Config host for restrictive exam environment

[exec/]              Exec commands in hosts
  [com]              Exec commands in host
  [script]           Exec local script in host
  [win]              Open window in host X session
  [win-admin]        Open window in host X session with admin privileges

[file/]              Transfer files to/from host
  [copyfrom]         Copy files or directory from host to admin
  [copyto]           Copy files or directory from admin to host
  [download]         Download URL resource in host
  [multicast]        Copy files or directory from admin to host using MULTICAST
  [torrent]          Download torrent resource in host
  [torrent-local]    Send local files to hosts using torrent

[labadmin/]          Manage Labadmin config in hosts
  [conf]             Update labadmin host config (sshport and sshpubkey) from lab file config
  [dependencies]     Check and install host dependencies for Labadmin

[misc/]              Miscellaneous actions
  [screenshot/]      Take host screenshot and save or display it
    [save]           Save multiple screenshot from host display
    [show]           Show host display animation 
  [music]            The best moeldies in your pcspeaker! :D

[msg/]               Send msg to host users
  [chat]             Starts text chat with logged user
  [login]            Show text message next time user login
  [msg-urls]         Config system for send notification when detect user is browsing some urls
  [notify]           Send notify message to logged user
  [win]              Show text message in a terminal window

[net/]               Network configs and tools
  [iptables/]        Restrict network access using IPTABLES
    [allow]          Allow access to specific IP or domain in a whitelist
    [blacklist]      Start blacklist (delete all rules and allow all ips but exceptions)
    [delete]         Delete specific rule number
    [deny]           Deny access to specific IP or domain in a blacklist
    [flush]          Flush (clean) all rules
    [list]           List all IPTABLES rules
    [show]           Show all IPTABLES rules
    [whitelist]      Start whitelist (delete all rules and deny all ips but exceptions)  
  [check-con]        Check network connectivity to gateway, Internet and DNS
  [force-1000]       Force negotiated speed to gigabit
  [speed-conf]       Show NIC card speed negotiated and poweroff slow hosts
  [speed-test]       Perform network speed test from admin to host

[process/]           Manage logged user process
  [cont]             Continue all process of logged user
  [kill]             Kill all process of logged users
  [list]             List all process of logged users
  [stop]             Stop all process of logged users
  [term]             Term all process of logged users

[service/]           Manage system services
  [disable]          Disable system service (no starts on startup)
  [enable]           Enable system service (starts on startup)
  [is-active]        Show if system service is active
  [journal]          Show system service journal
  [list]             List all system services
  [reload]           Reload system service
  [restart]          Restart system service
  [start]            Start system service
  [status]           Show system service status
  [stop]             Stop system service

[software/]          Automate software installation
  [packages/]        Manage package repositories
    [install]        Install a list of packages from repositories
    [uninstall]      Uninstall a list of package(s)
    [update]         Update package info from repositories
    [upgrade]        Update all packages to latest version from repositories  
  [vbox_extpack]     Update VirtualBox Extension Pack

[user/]              Admin host users
  [add]              Add a user
  [del]              Delete user and his home directory
  [group]            Add/remove users from group
  [idle]             Show how much time user is idle (not using keyboard or mouse)
  [lock]             Lock users
  [pass]             Set user password
  [show]             Show users with PID >=1000, groups and sudoers config
  [size]             Show users sorted by HOME directory size
  [unlock]           Unlock users

[virtualbox/]        Manage VirtualBox using vboxmanage
  [bridge/]          Allow or deny use bridged network
    [disable]        Disable bridged network for all users
    [enable]         Enable bridged network for all users
    [status]         Show status of bridged network for all users  
  [import]           Import .ova file
  [list]             List all machines
  [play]             Play machine
  [remove]           Remove virtual machine
  [rename]           Rename machine
  [snap]             Create snapshot
  [stop]             Stop machine 

[poweroff]           Power OFF host
[poweron]            Power ON host using network
[reboot]             Reboot host
[reboot-grub]        Reboot host
[ssh]                Open SSH connection to host
[sysreq]             Send system request signal

```

## Windows actions
```
[dfc/]               Deep Freeze command line control
  [conf]             Replace DP configuration using .rdx file (works frozen and unfrozen)
  [freeze]           Reboot system in frozen state (permanent)
  [serial]           Change license number
  [state]            Show DF state
  [unfreeze]         Reboot system in unfrozen state (permanent)

[exec/]              Exec commands and open interpreter in hosts
  [cmd]              Open CMD command line interface
  [com-cmd]          Exec commands in Windows CMD host using WINRM
  [com-ps]           Exec commands in Windows PowerShell host using WINRM
  [powershell]       Open PowerShell command line interface

[file/]              Manage files and transfers
  [download]         Download URL resource in host Downloads folder
  [remove]           Remove files and folders

[group/]             Manage local groups
  [add]              Add new group
  [auser]            Add user account to existing group
  [del]              Remove group
  [list]             Show groups list and show specific group info
  [ruser]            Remove user account from existing group

[license/]           Manage Windows license product key
  [activate]         Activate Windows license
  [status]           Show Windows activation status

[process/]           Manage system process
  [kill]             Kill process
  [list]             Show process list

[rdp/]               Manage Remote Desktop
  [connect]          Connect to remote desktop using Remmina
  [disable]          Disable remote desktop
  [enable]           Enable remote desktop for admin users

[software/]          Manage software
  [install]          Install package software silently
  [list]             List all installed software and show specific programs info

[user/]              Manage local users accounts
  [add]              Add new user account
  [agroup]           Add user account to existing group
  [del]              Remove user account
  [disable]          Disable user account
  [enable]           Enable user account
  [list]             Show user list and show specific user info
  [pass]             Set user password
  [rename]           Rename user account
  [rgroup]           Remove user account from existing group

[hostname]           Set hostname
[msg]                Open message in notification pop-up
[poweroff]           Power OFF host
[poweron]            Power ON host using network
[reboot]             Reboot host
[time]               Set system date/hour and show current time

```

&nbsp;  
# Add your own actions!
The easy way to exec your own scripts is use the actions ``exec/com`` (execute comands) and ``exec/script`` (execute external script). However creating your own labadmin actions you can add permanent actions and use the labadmin interface options to obtain more powerful scripts.

For add a new action to labadmin only need:
  * Create a action file following the labadmin interface. You can use template action located in [doc/action_template](doc/action_template).
  * Save the action file in ``actions/ssh`` or ``actions/winrm`` directory, and labadmin will recognize the file automatically when starts.

For more info refer to:
  * Action template: [doc/action_template](doc/action_template)
  * SSH sample: [actions/ssh/user/add](actions/ssh/user/add)
  * SSH admin+local+admin sample: [actions/ssh/file/torrent-local](actions/ssh/file/torrent-local)
  * WinRM sampple: [actions/winrm/user/add](actions/winrm/user/add)

&nbsp;  
# Lincense
Labadmin license is [GPLv3](LICENSE)

# Contact
My name is Leonardo Marco. I'm sysadmin teacher in [CIFP Carlos III](https://cifpcarlos3.es/), Cartagena, Murcia (Spain).

You can email me for suggestions, contributions, labadmin help or share your feelings: labadmin@leonardomarco.com
