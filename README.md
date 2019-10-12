# labadmin
Labadmin is a Linux Bash script capable to remotely admin a set of hosts (Linux or Windows). It's an approach similar to Ansible, but Labadmin is focused to work in educational environment  on hosts in a computer laboratory. 
It's a tool useful for teachers and sysadmins. 

## Main features
  * Discover the network status hosts in a laboratory classroom by MAC address, working on DHCP networks.
  * Show the status of each machine in a map according the position in the classroom.
  * Flexible machine selection using ranges. Can select all machines, only a row, odd and even machines, a specific list, etc.
  * A set of actions to exec in selected machines. Labadmin incorporate a full set of actions ready to use (currently 133 for Linux and 40 for Windows). Some key actions are:
    * Config a restrictive environment in a exam time.
    * Send heavy files using multiple modes (unicast, torrent or mulsticast).
    * Send and schedule messages to users
    * Config firewall settings.
    * Copy disk partition images.
    * Other administrative task, like software installation, user accounts, process management, Windows activation, etc. 
  * Monitorization of action execution status. If any error has ocurred in some host is noticed.
  * It's easy to create your own actions using Bash script or Powershell languages.
  
## Working schema
  * Labadmin use a dedicated machine to admin the students hosts. Admin must be installed in a Linux OS. Students hosts can be Linux or Windows OS computers.
  * All machines must be placed in the same broadcast domain.
  * Each classroom must be defined in a config file. This file stores:
    * Authentication config to use (SSH and/or WinRM).
    * MAC address for each host and a identification number.
    * Classroom distribution: each id host must be placed in a grid position according the real position.
  * When labadmin starts discovers the computers configured in the classroom file, show a map to select them and exec actions in all selected hosts.

![Labadmin schema](https://github.com/leomarcov/labadmin/blob/master/doc/images/schema.png?raw=true "Labadmin schema")

# Install
Once downloaded or cloned the project, labadmin must be configured and installed in admin and each student host.

## Create a config files
  * Each classroom must be defined in a config file and placed in `labadmin/configs/` directory. This file is a Bash script where config variables are defined.
  * You can use the provided [configs/test](configs/test) file as template.   
  * Most important config varialbes are:
    * `winrmuser` / `winrmpass` / `winrmport` for WinRM autentication and connection.
    * `sshuser` / `sshport` / `sshpubkey` / `sshprivatekey` for SSH autentication and connection.
    * `macs[]` array with the MAC address of hosts. The array is indexed by ID host, each host will be identificated with this number. Any number should be used, but it's recommended use simple numbers, for example use 32 for computer in a row 3 column 2.
    * `map` store the location of each host ID in the classroom. Each not number character is used as column separator and each new line as a row separator. 
    

## Admin install
  * Admin must be installed in a Linux machine (Debian, Fedora or Ubuntu).
  * Exec: `./install -A -c config_file`, where config file is the name of the file located in `configs` directory to use as a default config when labadmin is open. Optionally you can use `ask` config file as default config. This config file asks in each execution what config file to use.
```bash
./install -A test          # Install labadmin in admin machine using test as default classroom 
```

## Linux host install
  * Linux hosts installer only need to install all needed dependences and configure the remote SSH access method.
  * Exec: `install.sh -H -c config_file`, where config file is the name of the file located in `configs` directory where the host is placed. It's important that SSH variables are correctly set in config file. 
```bash
./install -H -c test       # Install labadmin in host machine using test configuration
```  
  
## Windows host install
  * In Windows 7 first install last version of Windows Management Framework: hhttps://www.microsoft.com/en-us/download/details.aspx?id=54616.
  * Then enable WinRM access executing these commands in a PowerShell:
 ```javascript
Enable-PSRemoting -Force
winrm set winrm/config/service/auth '@{Basic="true"}'
winrm set winrm/config/service '@{AllowUnencrypted="true"}'
winrm set winrm/config/winrs '@{MaxMemoryPerShellMB="1024"}'
sc.exe config winrm start= auto
Set-Item wsman:\localhost\client\trustedhosts *

```

# Usage
  * Labadmin can operate in interactive or parametrized mode (use `labadmin -h` for parameter info).
  * Each execution has 5 stages: discover, host selection, action selection, action parametrization and action monitorization.
  
## Discover

