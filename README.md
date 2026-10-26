# Labadmin
**Remote administration and classroom management for Linux and Windows computer labs.**

**Labadmin** is an open-source, shellscript-based tool for **managing multiple Linux and Windows computers** from a Linux administration workstation. Designed primarily for **educational environments**, it helps teachers and system administrators discover classroom computers, select hosts visually, execute administrative actions, transfer files, and prepare machines for examinations.

## Contents
- [Features](#features)
- [Architecture and requirements](#architecture-and-requirements)
- [Demos](#Demos)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Available actions](#available-actions)
- [Create custom actions](#create-custom-actions)
- [License](#license)
- [Contact](#contact)

&nbsp; 
## Features
- **Classroom map:** display hosts in a preconfigured grid matching their physical position.
- **MAC-based discovery:** find lab computers on the local network (support **DHCP** IP changes).
- **Flexible host selection:** select all hosts, specific IDs, ranges, odd/even machines and some regex.
- **Linux and Windows administration:** execute remote script actions over SSH on Linux and Windows machines.
- **Sequential or concurrent execution:** run an actions one by one or all at once. 
- **Action monitoring:** monitorice action execution status for each host.
- **Extensibility:** add your own Bash or PowerShell actions.
- **Full set of administrative actions ready to use** (currently 113 for Linux and 33 for Windows). Some key actions are:
    * **Examination management**: configure restricted environment such as block all users, block usb devices, firewall rules, autobackup user data, block Virtualbox bridge mode, autorecord user screen and more restrictions.
    * **File transfers**: send heavy files using unicast, torrent or multicast.
    * **Send messages**: send and schedule messages to users.
    * **Firewall settings**: configure firewall rules, whitelists and blacklists.
    * **Virtualbox management**: import OVA files, start VM, delete VM, create snapshots, etc.
    * **Disk images**: dump disk and partition images and partition table  (using `partclone`  and `dd`).
    * **Display screens**: display hosts screenshots in a thumbnail grid and save screenshots.
    * **Other administrative tasks**: software installation, user accounts, process management, Windows activation and more!

<p align="center">
	
</p>

## Architecture and requirements
Labadmin runs on a **Linux administration workstation**, such as a teacher's computer or a dedicated management server. Managed computers can run **Linux or Windows**.

Each laboratory is described by a configuration file (located in `labs/*`) containing host identifiers, MAC addresses, and a grid representing the classroom layout. Labadmin discovers the configured hosts in the network, displays their status, and executes actions remotely on selected hosts.

All actions are executed synchronously. For asynchronously script execution, see [Labadmin Script Server](https://github.com/leomarcov/labadmin-script_server).

**Network requirements:** MAC-based discovery depends on local Layer 2 visibility. Machines on other VLANs or routed networks might be reachable over SSH without being discoverable by ARP. SSH access, host firewalls, credentials, and any action-specific dependencies must also be configured.

<p align="center">
	<img alt="image" src="https://github.com/user-attachments/assets/25cb9a19-11d7-44f7-bf2a-08cb6bcb0d1f" />
</p>

## Demos
You can see labadmin in action in short animations:
  * [Select hosts](https://github.com/user-attachments/assets/81403693-2d24-4de2-8a52-186654eb54cd)
  * [Screenshots Grid](https://github.com/user-attachments/assets/c9434d50-4968-42d5-879f-fcb6ae45ac17)
  * [Exec action in sequential mode](https://github.com/user-attachments/assets/172c8d39-b8fc-41e3-a927-04d44e707fb3)
  * [Exec action in concurrent mode (all in one panel)](https://github.com/user-attachments/assets/38a8eca6-9107-4e86-b671-045f43bf61fd)
  * [Exec actino in concurrent mode (in separate panels)](https://github.com/user-attachments/assets/c94870d4-b339-44c7-9f46-56ba2ef77def)

&nbsp;  
## Installation
### 1. Install Labadmin on the Linux administration workstation
```bash
# LINUX ADMIN
git clone https://github.com/leomarcov/labadmin /opt/labadmin
bash /opt/labadmin/install-linux-admin
```  
### 2. Install Labadmin on each managed host
```bash
# LINUX HOST
install_dir=$(mktemp  -d -t labadmin_install.XXXXXX)
git clone https://github.com/leomarcov/labadmin $install_dir
bash ${install_dir}/install-linux-agent -k '<YOUR_PUBLIC_KEY>'     # YOUR_PUBLIC_KEY -> SAME PUBLIC KEY CONFIGURED IN ADMIN 
rm -rf $install_dir
```
 ```powershell
# WINDOWS HOST
$installDir = Join-Path $env:TEMP ([guid]::NewGuid().ToString())
try {
    git clone https://github.com/leomarcov/labadmin.git $installDir
    if ($LASTEXITCODE -ne 0) { throw "Git clone failed" }
    & "$installDir\install-windows-agent.ps1" -sshPubKey '<YOUR_PUBLIC_KEY>     # YOUR_PUBLIC_KEY -> SAME PUBLIC KEY CONFIGURED IN ADMIN  
} finally { Remove-Item -LiteralPath $installDir -Recurse -Force -ErrorAction SilentlyContinue }
```
* `YOUR_PUBLIC_KEY`: Use the same public SSH key as the one configured in the administration workstation.
  * If no public key parameter is provided install will use public key from `<install_dir>/conf/labadmin.conf`. 
  * Do not use the sample keys in default `labadmin.conf`: generate your own keys or use keys generated when install admin.
  * Do not distribute the private key to hosts!

## Configuration
### Global settings
  * **Global config** settings are stored in file: `/opt/labadmin/conf/labadmin.conf`
  * When install admin default `labadmin.conf` is created (if file doesn't exist) and new **public/private SSH keys** are generated.
  * **IMPORTANT**
    * Ensure variables `ssh_pubkey` and `ssh_privkey` stores your own public and private keys for SSH authentication.
    * Use the **same** `ssh_pubkey` to config each host agent.
```bash
vi /opt/labadmin/conf/labadmin.conf
  default_lab="<YOUR_LAB>"             # Default lab file to use if not lab specified with -l param
  arpscan_timeout=500                  # Arp-scan timeout in miliseconds for get host status in map
  ssh_timeout=5                        # SSH host connection timeout in seconds
  autoscan_delay=60                    # Auto scan map delay in seconds

  ssh_port='58888'                     # SSH port to connect with Linux agents (Windows agents use ssh_port+1)
  ssh_pubkey='<YOUR_PUBLIC_KEY>'       # SSH public key for host auth (GENERATION: ssh-keygen -t ed25519 -C labadmin)
  ssh_privkey='<YOUR_PRIVATE_KEY>'     # SSH private key for host auth (GENERATION: ssh-keygen -t ed25519 -C labadmin)
```
  * If do you need create a new `labadmin.conf` copy template with default config [templates/labadmin.conf](templates/labadmin.conf) to `/opt/labadmin/conf/` and set permissions (`640` and `root:labadmin`).


### Lab configuration settings
  * **Labs configuration** settings are stored in directory: `/opt/labadmin/labs/`
  * The **filename** identifies the laboratory.
  * When install admin default `lab.test` lab is created (if no labs files exists).
  * **IMPORTANT**
    * Variable `map` must contain the layout of the hosts in your lab in a grid.
    * Variable `macs[]` must contain the MAC address for each host in your lab.
```bash
# Rename lab.test to your <LAB_NAME>
mv /opt/labadmin/labs/lab.test /opt/labadmin/labs/<YOUR-LAB_NAME>  # Set lab config filename to your lab ID name

# Edit lab config <YOUR_LAB>:
vi /opt/labadmin/labs/<YOUR_LAB>
 lab_name="<YOUR_LAB_NAME>"                                        # Lab name displayed in interface
 agent_os="linux"                                                  # Default agent operating system (linux or windows)

 # MAP LAYOUT FOR EACH HOST IN LAB
 # Break line is used for row separator
 # Space is used for column separator
 # Non-numeric chars are ignored
 map='
 56 55 54 53 52 51
 46 45 44 43 42 41
 36 35 34 33 32 31
 __ __ 24 23 22 21
 __ __ 14 13 12 11
 ' 

 # List of MACs for each host in map
 # macs[<host_id>]=<MAC>
 macs[11]="08:00:27:B5:EE:E8"
 macs[12]="08:00:27:2a:f0:f2"
 macs[13]="08:00:27:bb:07:9d"
...
```
  * To create a new lab file copy template with sample lab config [templates/lab.test](templates/lab.test):
```
cp /opt/labadmin/templates/lab.test /opt/labadmin/labs/<YOUR_LAB>    # Set lab config filename to your lab ID name
chmod 640 /opt/labadmin/labs/<YOUR_LAB>                              # Set file permissions
chown root:labadmin /opt/labadmin/labs/<YOUR_LAB>                    # Set file owner and groups
```

&nbsp;  
## Usage
### Labadmin TUI
  * Use `labadmin` command to start Labadmin using TUI with interactive mode and screen split into panels for map, log and action execution.
  * **Default lab** (defined in var `default_lab` in `labadmin.conf` file) is loaded with **default agent OS** (defined `agent_os` var in lab config) mode.
  * You can use parameters to change lab and OS mode when start:
```bash
labadmin                # Start labadmin using default config lab
labadmin -l A15         # Start labadmin using a15 lab file and default mode defined in a15
labadmin -l A15 -W      # Start labadmin using a15 lab file and Windows mode
labadmin -l A15 -L      # Start labadmin using a15 lab file and Linux mode
```

<details><summary>Parameter options</summary><p>
	
```
$ labadmin -h
  Labadmin TUI
   labadmin [-l lab_config] [-i face] [-W|-L] [-F]

  OPTIONS
   -l lab_id
	   Lab to use (config filename in labs/ directory). 
	   Overrides default_lab variable in labadmin config file.
	   Lab config files must be placed in labs/ directory.

   -i iface
       Network interface to use. Overrides iface variable in labadmin config file.

   -W 
       Force Windows server mode. Overrides agent_os variable in lab config file.

   -L 
       Force Linux server mode. Overrides agent_os variable in lab config file.

   -F 
      Force continue even check dependencies fail
```
</p></details>

### Labadmin CLI
  * Use `labadmin-cli` command to start Labadmin using CLI.
  * CLI execute only individual actions that can be parametrized: lab, host range, action to exec, action parameters, etc.
```
  Labadmin CLI
   labadmin-cli [-l lab_config] [-i face] [-r range] [-a action] [-1|-2|-3|-4|-5|-6|-7|-8|-9 param] [-W|-L] [-F] [-M]

  OPTIONS
   -l lab_config
	Lab config filename to use. Overrides default_lab variable in labadmin config file.
	Lab config files must be placed in labs/ directory.

   -i iface
	Network interface to use. Overrides iface variable in labadmin config file.

   -r range
	Hosts range to apply actions. For example: 11,34,23,21-28

   -a action
	Action to exec. For example: user/add

   -1|-2|-3|-4|-5|-6|-7|-8|-9 param
	Action parameter value to exec.

   -W 
	Force Windows agent OS mode. Overrides agent_os variable in lab config file.

   -L 
	Force Linux agent OS mode. Overrides agent_os variable in lab config file.

   -F 
	Force continue even check dependencies fail

   -M 
	Show MAP with selected hosts

  CLI SAMPLES
    labadmin-cli -r 5,12,15-20 -a exec/com -1 "du -sh /home/*"
    labadmin-cli -r all -a "software/packages/upgrade &" -1 y -2 y
```

&nbsp;  
## Available actions
Labadmin has a lot of actions ready to use! Actions are categorized for better organization.

### Linux actions
```
[clone/]               Manage partition image backups
  [gpt-table/]         Manage GPT partition table
    [restore-table]    Restore remote partition table
    [save-table]       Backup remote partition table and save in local path

  [mbr-table/]         Manage MBR partition table
    [add-part]         Create new partition
    [del-part]         Delete partition
    [resize-part]      Resize partition to grow until end of disk or next partition
    [restore-table]    Restore remote partition table
    [save-table]       Backup remote partition table and bootloader (first MB) and save in local path
    [show-table]       Show MBR partition table

  [multicast/]         Manage partition image backups using multicast
    [restore-dd]       Restore remote partition or disk using dd
    [restore-part]     Restore remote partition from local partclone image using multicast

  [unicast/]           Manage partition image backups using unicast
    [restore-dd]       Restore remote partition or disk using dd
    [restore-part]     Restore remote partition from local partclone image using unicast
    [save-part]        Clone remote partition and save to partclone image in local path using unicast

[conf/]                System config tasks
  [cron/]              Config root crontab file
    [add]              Add line to root crontab
    [remove]           Remove line from root crontab
    [show]             Show root crontab config

  [homeperm/]          Config home directories permissions to 0750
    [set]              Set HOME directories permissions to rwxr-x--- and config adduser DIR_MODE=750
    [show]             Show HOME directories with permissive access

  [networkmanager/]    Prevent specific group can manage network-manager
    [disable]          Restrict network-manager to prevent specific group can manage it
    [restore]          Restore network-manager permissions to allow all users manage it

  [sudoers/]           Config sudoers file
    [add]              Add new line in sudoers file
    [remove]           Remove line from sudoers file
    [show]             Show sudoers file

  [time/]              Set system date/hour and show current time
    [set]              Set system timedate
    [show]             Show system time

  [hostname]           Set hostname
  [mail]               Install and config Postfix SMTP client for send mails (only root account)

[exam/]                Create restrictive environment for take exams
  [backup/]            Manage exam backups autosaved when exam ends
    [del]              Delete exam backup
    [get]              Download exam backup to admin local machine
    [list]             List all exam saved and hidden in root account
    [wipe]             Wipe all exam backups!

  [check]              Check if host is blocked for exam
  [end]                Come back host to normal config when exam ends
  [start]              Config host for restrictive exam environment

[exec/]                Exec commands in hosts
  [com]                Exec commands in host
  [script]             Exec local script in host
  [win]                Open graphical command in host X session as current user privileges
  [win-admin]          Open graphical command in host X session with admin privileges

[file/]               Transfer files to/from host
  [copyfrom]          Copy files or directory from host to admin
  [copyto]            Copy files or directory from admin to host
  [download]          Download URL resource in host
  [multicast]         Copy files or directory from admin to host using MULTICAST
  [torrent]           Send local files to hosts using torrent

[labadmin/]           Manage Labadmin labs config in hosts
  [dependencies]      Check and install host dependencies for Labadmin

[misc/]               Miscellaneous actions
  [music]             The best melodies in your pcspeaker! :D
  [wallpaper]         Config user wallpaper
  [xmas]              Christmas congratulations for all users!

[msg/]                Send msg to host users
  [chat]              Starts text chat with logged user
  [clipboard]         Copy message to user clipboard
  [login-term]        Show text message next time user login in a terminal window
  [login-xpad]        Show text message next time user login in a xpad note
  [msg-term]          Open a text message in a terminal window
  [notify]            Send notify message to logged user

[net/]                Network configs and tools
  [iptables/]         Restrict network access using IPTABLES
    [allow]           Allow access to specific IP or domain in a whitelist
    [blacklist]       Start blacklist (delete all rules and allow all ips but exceptions)
    [delete]          Delete specific rule number
    [deny]            Deny access to specific IP or domain in a blacklist
    [flush]           Flush (clean) all rules
    [show]            Show all IPTABLES rules
    [whitelist]       Start whitelist (delete all rules and deny all ips but exceptions)

  [check-con]         Check network connectivity to gateway, Internet and DNS
  [force-1000]        Force negotiated speed to gigabit
  [speed-conf]        Show NIC card speed negotiated and poweroff slow hosts
  [speed-test]        Perform network speed test from admin to host

[process/]            Manage logged user process
  [cont]              Continue all process of logged user
  [kill]              Kill all process of logged users
  [list]              List all process of logged users
  [stop]              Stop all process of logged users
  [term]              Term all process of logged users

[screen/]             Take hosts screenshots and save or display it
  [grid]              Show screenshots hosts in a web grid view
  [save]              Save screenshots files hosts in local admin
  [show]              Show screenshots hosts dynamically

[service/]            Manage system services
  [disable]           Disable system service (no starts on startup)
  [enable]            Enable system service (starts on startup)
  [is-active]         Show if system service is active
  [journal]           Show system service journal
  [list]              List all system services
  [reload]            Reload system service
  [restart]           Restart system service
  [start]             Start system service
  [status]            Show system service status
  [stop]              Stop system service

[software/]           Automate software installation
  [packages/]         Manage package repositories
    [install]         Install a list of packages from repositories
    [uninstall]       Uninstall a list of package(s)
    [update]          Update package info from repositories
    [upgrade]         Update all packages to latest version from repositories

  [vbox_extpack]      Update VirtualBox Extension Pack

[user/]               Admin host users
  [add]               Add a user
  [del]               Delete user and his home directory
  [group]             Add/remove users from group
  [idle]              Show how much time user is idle (not using keyboard or mouse)
  [lock]              Lock users
  [pass]              Set user password
  [show]              Show users with PID >=1000, groups and sudoers config
  [size]              Show users sorted by HOME directory size
  [unlock]            Unlock users

[virtualbox/]         Manage VirtualBox using vboxmanage
  [bridge/]           Allow or deny use bridged network
    [disable]         Disable bridged network for all users
    [enable]          Enable bridged network for all users
    [status]          Show status of bridged network for all users

  [import]            Import .ova file
  [list]              List all machines
  [play]              Play machine
  [remove]            Remove virtual machine
  [rename]            Rename machine
  [snap]              Create snapshot
  [stop]              Stop machine

[anydesk]             Start anydesk connection to remote host
[poweroff]            Power OFF host
[poweron]             Power ON host using network
[reboot]              Reboot host
[reboot-grub]         Reboot hosts and select GRUB entry on boot
[ssh]                 Open SSH connection to host
[sysreq]              Send system request signal
```

### Windows actions
```
[conf/]               Windows configuration actions
  [get-time]          Set system date/hour and show current time
  [hostname]          Set hostname
  [set-time]          Set system date/hour and show current time

[exec/]               Exec commands and scripts
  [cmd]               Exec CMD interpreter
  [commands]          Exec commands in Windows PowerShell host
  [powershell]        Exec PowerShell interpreter

[file/]               Manage files and transfers
  [copyfrom]          Copy files or directory from host to admin
  [copyto]            Copy files or directory from admin to host
  [download]          Download URL resource in host Downloads folder
  [extract]           Extract file
  [remove]            Remove files and folders

[group/]              Manage local groups
  [add]               Add new group
  [auser]             Add user account to existing group
  [del]               Remove group
  [list]              Show groups list and show specific group info
  [ruser]             Remove user account from existing group

[license/]            Manage Windows license product key
  [activate]          Activate Windows license
  [status]            Show Windows activation status

[process/]            Manage system process
  [kill]              Kill process
  [list]              Show process list

[rdp/]                Manage Remote Desktop
  [connect]           Connect to remote desktop using Remmina
  [disable]           Disable remote desktop
  [enable]            Enable remote desktop for admin users

[user/]               Manage local users accounts
  [add]               Add new user account
  [agroup]            Add user account to existing group
  [del]               Remove user account
  [disable]           Disable user account
  [enable]            Enable user account
  [list]              Show user list and show specific user info
  [pass]              Set user password
  [rename]            Rename user account
  [rgroup]            Remove user account from existing group

[msg]                 Open message in notification pop-up
[poweroff]            Power OFF host
[poweron]             Power ON host using network
[reboot]              Reboot host
```

&nbsp;  
## Create custom actions
The easiest way to execute your own scripts is use the actions ``exec/com`` (execute comands) and ``exec/script`` (execute external script). However creating your own Labadmin actions you can add permanent actions and use the labadmin interface options to obtain more powerful scripts.

To add a new Labadmin action only need:
  * Create a action file following the labadmin interface. You can use template action located in [templates/action.template](templates/action.template).
  * Save the action file in ``actions/linux`` or ``actions/windows`` directory, and labadmin will recognize the file automatically when starts.

For more info refer to:
  * Action template: [templates/action.template](templates/action.template)
  * SSH sample: [actions/linux/user/add](actions/linux/user/add)
  * SSH admin+local+admin sample: [actions/linux/file/torrent](actions/linux/file/torrent)

&nbsp;  
# License
Labadmin is distributed under the [GNU General Public License v3](LICENSE).

# Contact
Labadmin is developed by Leonardo Marco, a sysadmin teacher at [CIFP Carlos III](https://cifpcarlos3.es/) in Cartagena, Murcia, Spain.

For questions, suggestions, and contributions: **labadmin@leonardomarco.com**.
