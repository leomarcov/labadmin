#!/usr/bin/env bash
#===================================================================================
# LABADMIN APT INSTALLER MODULE
#         FILE: installer-yum
#
#  DESCRIPTION: Functions for specific YUM install
#
#       AUTHOR: Leonardo Marco (labadmin@leonardomarco.com)
#	   LICENSE: GNU General Public License v3.0
#      VERSION: 2019.03
#      CREATED: 16.02.2017
#===================================================================================

#### GLOBAL VARIABLES
installer_name="YUM"


#=== FUNCTION ==================================================================
#        NAME: installer_check
# DESCRIPTION: checks if this installer is suitable in current system
# EXIT CODE
#	0 if installer is suitable in current system
#	1 if instller is NOT suitable in current system
#===============================================================================
function installer_check() {
	which rpm &>/dev/null && which yum &>/dev/null
	return $?
}


#=== FUNCTION ==================================================================
#        NAME: installer_install
# DESCRIPTION: install a list of packages from APT repositories
# PARAMETERS:
#	$@	List of packages to install
#===============================================================================
function installer_install() {
	yum -y install $@
	return $?
} 


#=== FUNCTION ==================================================================
#        NAME: installer_search
# DESCRIPTION: search if a package es availabe in repositories
# PARAMETERS:
#	$1	package name to search
#===============================================================================
function installer_search() {
	yum search "$1" 2>/dev/null | grep -iq "^${1}\."
	return $?
}



#=== FUNCTION ==================================================================
#        NAME: installer_uninstall
# DESCRIPTION: uninstall list of packages
# PARAMETERS:
#	$@	List of packages to uninstall
#===============================================================================
function installer_uninstall() {
	yum -y remove $@
	return $?
}

#=== FUNCTION ==================================================================
#        NAME: installer_update
# DESCRIPTION: update packages info from repositories
#===============================================================================
function installer_update() {
	yum check-update
	return $?
}


#=== FUNCTION ==================================================================
#        NAME: installer_upgrade
# DESCRIPTION: update all packages to latest version
#===============================================================================
function installer_upgrade() {
	yum -y upgrade
	return $?
}