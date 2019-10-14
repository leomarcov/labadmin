#!/usr/bin/env bash
#===================================================================================
# LABADMIN APT INSTALLER MODULE
#         FILE: installer-apt
#
#  DESCRIPTION: Functions for specific APT install
#
#       AUTHOR: Leonardo Marco (labadmin@leonardomarco.com)
#	   LICENSE: GNU General Public License v3.0
#      VERSION: 2019.03
#      CREATED: 16.02.2017
#===================================================================================

#### GLOBAL VARIABLES
installer_name="APT"


#=== FUNCTION ==================================================================
#        NAME: installer_check
# DESCRIPTION: checks if this installer is suitable in current system
# EXIT CODE
#	0 if installer is suitable in current system
#	1 if instller is NOT suitable in current system
#===============================================================================
function installer_check() {
	which dpkg &>/dev/null && which apt &>/dev/null
	return $?
}


#=== FUNCTION ==================================================================
#        NAME: installer_install
# DESCRIPTION: install a list of packages from APT repositories
# PARAMETERS:
#	$@	List of packages to install
#===============================================================================
function installer_install() {
	yes | DEBIAN_FRONTEND=noninteractive apt-get install -y $@
	return $?
} 


#=== FUNCTION ==================================================================
#        NAME: installer_search
# DESCRIPTION: search if a package es availabe in repositories
# PARAMETERS:
#	$1	package name to search
#===============================================================================
function installer_search() {
	apt-cache pkgnames | grep -q "^${1}$"
	return $?
}



#=== FUNCTION ==================================================================
#        NAME: installer_uninstall
# DESCRIPTION: uninstall list of packages
# PARAMETERS:
#	$@	List of packages to uninstall
#===============================================================================
function installer_uninstall() {
	DEBIAN_FRONTEND=noninteractive apt-get -y purge $@
	return $?
}


#=== FUNCTION ==================================================================
#        NAME: installer_update
# DESCRIPTION: update packages info from repositories
#===============================================================================
function installer_update() {
	apt-get update
	return $?
}


#=== FUNCTION ==================================================================
#        NAME: installer_upgrade
# DESCRIPTION: update all packages to latest version
#===============================================================================
function installer_upgrade() {
	yes | DEBIAN_FRONTEND=noninteractive apt-get -y dist-upgrade
	return $?
}

