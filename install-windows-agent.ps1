#Requires -RunAsAdministrator

#===================================================================================
# LABADMIN WINDOWS AGENT INSTALLATION
#         FILE: install-windows-agent.ps1
#         USE:  install-windows-agent.ps1 [-sshPort <int>] [-sshPubKey <string>]
#  DESCRIPTION: Install and config labadmin agent dependencias on Windows system
#
#       AUTHOR: Leonardo Marco (labadmin@leonardomarco.com)
#      LICENSE: GNU General Public License v3.0
#      VERSION: 2026.10.16
#      CREATED: 2026.10.16
#===================================================================================


#===============================================================================
#  OPTIONAL PARAMETERS
#        agentUser:     fixed value to labadmin
#        sshPort:       if missing -> use ssh_port+1 from lab/labadmin.conf -> if missing use 58889
#        sshPubKey:     if missing -> use ssh_pubkey from lab/labadmin.conf
#===============================================================================
param(
    [ValidateNotNullOrEmpty()]
    [string]$sshPubKey,

    [ValidateRange(1, 65535)]
    [int]$sshPort
)

$agentUser="labadmin"



#===============================================================================
#  CHECK CREDENTIALS
#===============================================================================
# Run as admin (#Requires not found when load install from URL)
if(!((New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator))) {
    throw "Must exec as Administrator"
}

#===============================================================================
#  READ CONFIG
#===============================================================================
# Try read missing parameters from bash config file conf/labadmin.conf
Write-Host "`nReading config" -ForegroundColor Green

try {
    $conf_path = Join-Path $PSScriptRoot 'conf/labadmin.conf'
    $conf_content = Get-Content -LiteralPath $conf_path -Raw -ErrorAction SilentlyContinue
} catch {}
    

# ssh_port
if(-not $PSBoundParameters.ContainsKey("sshPort")) {
    if($conf_content) {
        $match = [regex]::Match([string]$conf_content, '(?m)^[ \t]*' + "ssh_port" + '=([''"])([^\r\n]*?)\1')
        if ($match.Success) {
            Set-Variable -Name "sshPort" -Value (1+$match.Groups[2].Value) -ErrorAction SilentlyContinue
        }
    }
    if(-not $sshPort) {
        Set-Variable -Name "sshPort" -Value "58889" -ErrorAction SilentlyContinue
    }
}


# ssh_pubkey
if(-not $PSBoundParameters.ContainsKey("sshPubKey")) {
    if($conf_content) {
        $match = [regex]::Match([string]$conf_content, '(?m)^[ \t]*' + "ssh_pubkey" + '=([''"])([^\r\n]*?)\1')
        if ($match.Success) {
            Set-Variable -Name "sshPubKey" -Value $match.Groups[2].Value -ErrorAction Stop
        }
    }
}

# Validate values regardless of their source
if ([string]::IsNullOrWhiteSpace($sshPubKey)) {
    throw 'The SSH public key cannot be empty.'
}
if ($sshPort -lt 1 -or $sshPort -gt 65535) {
    throw 'The SSH port must be between 1 and 65535.'
}

Write-Host "SSH Port: $sshPort"
Write-Host "SSH PubKey: $sshPubkey"


#===============================================================================
#  CREATE LOCAL USER FOR SCRIPT EXECUTION
#===============================================================================
# Get agentUser credentials
Write-Host "`nConfiguring $agentUser user" -ForegroundColor Green

while(!$agentUser_cred -OR $agentUser_cred.Username -ne $agentUser) { $agentUser_cred = Get-Credential -Credential $agentUser }
if (-not (Get-LocalUser -Name $agentUser -ErrorAction SilentlyContinue)) {
    Write-Host "Creating local user $agentUser" -ForegroundColor Green
    New-LocalUser -Name $agentUser -FullName "Labadmin Script Server Agent" -Password $agentUser_cred.Password
}

Set-LocalUser -Name $agentUser -PasswordNeverExpires:$true
Add-LocalGroupMember -Member $agentUser -SID "S-1-5-32-544" -ErrorAction SilentlyContinue       # Add user to local Administrators group
# Hide user from login screen:
New-Item 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon\SpecialAccounts\UserList' -Force | New-ItemProperty -Name $agentUser -Value 0 -PropertyType DWord -Force



#===============================================================================
#  INSTALL OPENSSH SERVER CAPABILITY
#===============================================================================
Write-Host "`nInstalling OpenSSH Server capability" -ForegroundColor Green
Get-WindowsCapability -Online -Name 'OpenSSH.Server*' | Where-Object State -eq 'NotPresent' | ForEach-Object { Add-WindowsCapability -Online -Name $_.Name }
Start-Service sshd
Set-Service -Name sshd -StartupType Automatic



#===============================================================================
#  CONFIG SSH SERVER
#===============================================================================
Write-Host "`nConfiguring SSH server" -ForegroundColor Green

$ak_file = "$env:ProgramData\ssh\administrators_authorized_keys"

# Create the file if it does not exist
if (-not (Test-Path -LiteralPath $ak_file)) {
    New-Item -ItemType File -Path $ak_file -ErrorAction Stop | Out-Null
}

# Append the public key only if it is not already present
if (@(Get-Content -LiteralPath $ak_file -ErrorAction Stop) -cnotcontains $sshPubKey.Trim()) {
    Add-Content -LiteralPath $ak_file -Value $sshPubKey.Trim() -Encoding ascii -ErrorAction Stop
}
# Set authoriced keys file access only to Admins and SYSTEM
icacls.exe $ak_file /inheritance:r
icacls.exe $ak_file /grant:r '*S-1-5-32-544:F' '*S-1-5-18:F'

# Insert sshd_config configuration
$sshdconf_file = "$env:ProgramData\ssh\sshd_config"
$sshdconf_content = @(Get-Content -LiteralPath $sshdconf_file -ErrorAction Stop)

# Remove existing definitions, including those inside Match blocks
$sshdconf_content = @($sshdconf_content | Where-Object { $_ -notmatch '^\s*(Port|AllowUsers|PasswordAuthentication|PubkeyAuthentication|AuthenticationMethods)\s+' })

$new_settings = @(
    "Port $sshPort"
    "AllowUsers `"$agentUser`""
    'PasswordAuthentication no'
    'PubkeyAuthentication yes'
    'AuthenticationMethods publickey'
)

# Write the configuration as UTF-8 without BOM
[System.IO.File]::WriteAllLines( $sshdconf_file, [string[]]($new_settings + $sshdconf_content), [System.Text.UTF8Encoding]::new($false))

# Restart
Restart-Service sshd -ErrorAction Stop



#===============================================================================
#  CONFIG WINDOWS FIREWALL RULE
#===============================================================================
Write-Host "`nConfiguring Windows firewall rule" -ForegroundColor Green

# Remove the existing rule, if present
Get-NetFirewallRule -Name 'labadmin-ssh-in' -ErrorAction SilentlyContinue | Remove-NetFirewallRule -ErrorAction Stop

# Create the rule with the configured SSH port
New-NetFirewallRule -Name 'labadmin-ssh-in' -DisplayName 'Labadmin SSH Server' -Direction Inbound -Protocol TCP -LocalPort $sshPort -Action Allow -Enabled True -Profile Any -ErrorAction Stop | Out-Null