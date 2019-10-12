# labadmin
Labadmin is Linux Bash script capable to remotely admin a set of hosts (Linux or Windows). It's an approach similar to Ansible, but Labadmin is focused to work in educational computer laboratory environment. 

**Main features**
  * Discover the network hosts in a laboratory classroom by MAC address, allowing DHCP networks.
  * Show the status of each machine in a map according the position in the classroom.
  * Flexible machine selection which operate using ranges. Can select all machines, only a row, pairs or odd machines, a specific list, etc.
  * Selection the action to exec in all selected machines. Labadmin incorporate a full set of actions ready to use (currently 133 for Linux and 40 for Windows). 
  * Monitorization of action execution status.
  * It's easy to create your own actions using Bash script or Powershell languages.
  
**Operating schema**
Labadmin use one (or more) admin machine that control a set of node hosts. 
  * All machines must be placed in the same broadcast domain.
  * Labadmin agent is installed in admin machine. Controlled hosts only are configured for remote access: SSH for Linux machines and WinRM for Windows machines, but no need specific labadmin software.


## Install
Once downloaded or cloned the project labadmin must be configured and installed in admin and node hosts.

### Create a config file for each classroom
  * Each classroom must be defined in a config file and placed in `labadmin/configs/` directory.
  * Config file is a Bash script where config variables are defined.
  * You can use the priveded `configs/test` file as template.   
  * Most important varialbes are:
    * `winrmuser` / `winrmpass` / `winrmport` for WinRM autentication and connection.
    * `sshuser` / `sshport` / `sshpubkey` / `sshprivatekey` for SSH autentication and connection.
    * `macs[]` array
```bash
#!/usr/bin/env bash
#===================================================================================
#        FILE: configs/test
# DESCRIPTION: Sample file for a lab config
#      AUTHOR: Leonardo Marco
#     LICENSE: GNU General Public License v3.0
#===================================================================================

#===============================================================================
# GLOBAL CONFIG
#===============================================================================
# Lab name to show in interface
labname="TEST LAB"

# Server default mode
# Possible values: winrm|ssh
srvmode="ssh"

# Network interface to use in admin machine
# Possible values: eth0, enp0s3, etc.
# Optional: $(labadmin_iface 8.8.8.8)    labadmin_iface function get iface used to route packages to ip 8.8.8.8
iface="$(labadmin_iface 8.8.8.8)"



#===============================================================================
# WINDOWS AUTHENTICACION CONFIG
#===============================================================================
# WINRM user in host machines with admin privileges used to exec remote commands
winrmuser="alumno"

# WINRM password
winrmpass="alumno"

# WINRM port
winrmport=5985



#===============================================================================
# LINNUX HOST AUTHENTICAION CONFIG
#===============================================================================
# SSH user admin for Linux hosts
sshuser=root

# SSH port por Linux hosts
sshport=58888

# SSH public and private keys used for SSH authentication. 
# Generation: ssh-keygen -t rsa
# Passowrd used for this private key is: hello
sshpubkey='ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCwKUYdvvpFRmm72jdBDAQbbfybWJseF2otlWMhgMCjyU6aAh9JJBscZZXEKF0kBaMC4GNHHUl559vI2KzZwjX5ADWnqWfb691IiqS/M8jL4vSkCHsYDUc34IrM3hZeIU8AY22cvvmvrKecdahIyDUBCu8T48fOS9rtHDqee6mFEen14yxWgHpuNyM4NQWWs1BqaHQd+W6aHvsa0UcrX64vB+pSyCfOk2Rm8Qb5s7jHyW4rKb9zh7MpAnGd/8dAM5EJPWYc0uPwVNP47rox11EKLtOnd5BhUqWC6elbXddtrHIDMR5AWezkW7I2vQyAPmJzqogYjpD8oHMOlIH3aV/H'
sshprivatekey='-----BEGIN RSA PRIVATE KEY-----
Proc-Type: 4,ENCRYPTED
DEK-Info: AES-128-CBC,258F06489C81B081D81BAAEE37D8299A

YunkDGz4rll+/Zo3gk3J0JDCpwCDIC+nb7q+qoOZ0FmLGyE1nvi0QiyURTocJLpf
ZHxb0ndcMB/j3kbvuQG4EtQlig8QO27TzY6HoWCvDsJOBIQy9idp/mehb3EE4AJl
VEDRUI2ziBalia4SUK3hZhIxzkVRlDayRopKoL6yJEsiJTV38D3RIZK24Uf19PPw
C3vq+DUJECczEr5lGkrYZa55wFB72l9gwX/5FqUE22UQIuo6pZehWIbiazyHBS9T
wKcGu6iCTZ8VJfDXAfIHxVyZmK4B3GENwRDSnTeSMgGX0nzH5hGNRnCn7v69kwkJ
TA5b77yXTkxHmYBqvR2mNwMKvCPQKjz3ECsX0uBYEwSpxgha+/7fD84jY5/N6upB
pOdY/6G19S2+ld9XcvOnFiGy9+8Prj1bD1ZpFSnHiYN3sZjOm58HOIHgQb4qgX+e
aEZNtWY0GDL0UwzpeqTAgFhnbU3LgJRLwS6aurtLG7BlF+BTNSPpxELJQ45DI4rz
vJBDabePNm+FO16iy9v5sTCPGocDS5Bn7WAOZ534/OPWn8kwyknxAxEzdzoREM7O
R9LSHpn+cGtJZKPw3ypBl9eAUmkDoAwNi8tU9vbatTbJV/fjbh3DvxHHRoBnHzuh
lbNXJqBQMf4lw/NmPg4EQ/5WWwOOLjor5KwaxJp9FdUlNIm5F8LXy96Z0dduqHEY
qe58cvEts1icIZzlB30YW+lzqZHUC/xDXoAeoRrKqWGoipqzrRM2ysP6b2SqsG1p
CAUgFcQpHE0MFGCcvBTQ/Hm6a5tYzyM2YEPjtbYHSXx//453RAGumrftrU1qGR5K
ZkQIB5JftvVy91OQrkIRUujAPWnxy+3MuBEcFZQbqEMs72yohEbmysBfvy8zQ9kx
4tXG8FFydOYpK6vDJkqbYP3V/kOwpsTxcN0svfruMUcB9mc1iYVgPWY7cnXD+IJO
veoF1F2m/wf1I2iOle0pLIvTCZpge6MNpKhS8k09bz5OSS7tkvPk8+N6hR7uWGxa
55HKxhocEZj05RLF88BXiCw4UXDE0DXAdgHNMajnq6MuUDTAB33ARLRwwEfkJnmW
JdcFKOG/C97OKCHj7NtE/OQkXc4H+N/qVl/W0/pMnYI0plnEKNHqcq+NbQx1Hau5
35FbmZEyHd96jCQglGQpCCtQOW3rIAwJgRnZSH+auo7I3xceJruMs9WpcnU1Uynw
nldcxI6iHtzE9Jtq1dA2OKvj/JLWl5leC59Pva+bhQlsDggI+Kp8S720M1YQ7Pkt
P6hiVQ+BScNTk3gOvKBL5DzRf5P5MMuMQtC4juqK8hEMw8db1VBl/cMBwUpUYiL2
fuWaHpxTSj/qAAe+Yk33z43y1P4SpseIN6nEKLKQOZP8fZ1XjuGjEgBn1ujPPvtB
jFGhDwdsyf8ygmspS8YLfWKxVWmvnkqy9tWxz30jH5+oSdTfSTrS/HotEsVQor74
CEg7ul+hHzRkKFGdSUJUg+BQacTiiBSzzUPMaJp9ZCyd87e+6/FSwMu7wJQl5ybL
i4Dpsu3goOZ3klssLflkQw9vn4niOj+Ry/EpM/mM+rgzDGerSeaPem1tdGwO94Oy
-----END RSA PRIVATE KEY-----'



#===============================================================================
# LAB HOSTS DISTRIBUTION
#===============================================================================
# LIST OF MACS FOR EACH HOST 
# macs[<host_id>]="<host_mac>""
macs[11]=08:00:27:76:23:47
macs[12]=08:00:27:2a:f0:f2
macs[13]=08:00:27:bb:07:9d
macs[21]=08:00:27:a3:71:79
macs[22]=08:00:27:86:57:65
macs[23]=08:00:27:fd:ea:f2
macs[24]=08:00:27:98:cb:c3
macs[25]=08:00:27:e5:1f:7e
macs[31]=08:00:27:78:b8:5c		
macs[32]=08:00:27:7F:9D:BC
macs[33]=08:00:27:05:64:37
macs[33]=08:00:27:DC:CF:11
macs[34]=08:00:27:ba:42:62
macs[35]=08:00:27:ba:42:61
macs[41]=08:00:27:14:65:f7
macs[42]=08:00:27:a3:71:79
macs[43]=08:00:27:a3:71:89
macs[44]=08:00:27:a3:71:99
macs[45]=08:00:27:a3:71:09


# MAP DISTRIBUTION FOR EACH HOST IN MAP
# Break line is used for row separator
# Space is used for column separator
# Each character not iqual a number is discarted
# If map is not defined it will be distributed automatically filling width of the screen
map='
45 44 43 42 41
35 34 33 32 31
25 24 23 22 21
__ __ 13 12 11
'


#### HOST COLORS
# Hosts to show with different color in map
# map_color[<host_id>]="color"

#map_color[11]="${S_I}"          
#map_color[12]="${S_I}"  
```
### Admin install
  * Admin must be installed in a Linux machine (Debian, Fedora or Ubuntu).
  * 

  * Exec: `install -A -c config_file` 
```bash
./install -A test          # Install labadmin in admin machine using test as default classroom 
```

### Linux host install
  * In Linux hosts installer only need to install all needed dependences and configure the remote SSH access method.
  * Exec: `install.sh -H -c config_file`
```bash
./install -H -c test       # Install labadmin in host machine using test configuration (SSH pubkey and iface) 
```  
  
### Windows host install
  * In Windows 7 first install last version of Windows Management Framework: https://docs.microsoft.com/es-es/powershell/wmf/5.1/install-configure.
  * Then enable WinRM access executing these commands in a PowerShell:
 ```javascript
Enable-PSRemoting -Force
winrm set winrm/config/service/auth '@{Basic="true"}'
winrm set winrm/config/service '@{AllowUnencrypted="true"}'
winrm set winrm/config/winrs '@{MaxMemoryPerShellMB="1024"}'
sc.exe config winrm start= auto
Set-Item wsman:\localhost\client\trustedhosts *

```

## Usage
  * Labadmin can operate in interactive or parametrized mode (use labadmin -h for more parameters info).
  * Each execution has 5 stages: discover, host selection, action selection, action parametrization and action monitorization.
  
### Discover

