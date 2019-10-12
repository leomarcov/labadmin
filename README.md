# labadmin
Labadmin is Linux Bash based script for remotely admin Linux or Windows hosts in a computer lab environment. 
With labadmin you can:
  * Discover the machines in set of computer classrooms (search by preconfigured MAC).
  * Show the status machine in a classrom map.
  * Select the machines to operate using flexible ranges.
  * Select an action to exec in all selected machines. 
  * Monitor the status of execution in each machine.
 
Labadmin schema use one (or more) admin hosts that control a set of node hosts. All machines must be placed in the same network.


  
Admin install
---------------------
  * Admin must be installed in a Linux machine (Debian, Fedora or Ubuntu).
  * Download or clone the project.
  * Create a classrom config file and save it con configs folder.
    * Config file is a Bash script where config variables are defined.
    * You can use the test config file as template:
  * Exec: install -A 

Linux host install
---------------------
  * In Linux host install only install all needed dependences and configure the remote SSH access method.
  * Exec: install.sh -H -c config_file
  
Windows host install
---------------------
