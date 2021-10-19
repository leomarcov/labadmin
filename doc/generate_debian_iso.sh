#!/usr/bin/env bash
# SOURCE: https://willhaley.com/blog/custom-debian-live-environment/

install_dir="$HOME/DEBIAN_LABADMIN_SOURCE"
arch="amd64"
debian_ver="stable"
hostname="labadmin_pxe"
iso_filename="debian_labadmin.iso"


# INSTALL PREREQUISITES
sudo apt-get install debootstrap squashfs-tools xorriso grub-pc-bin grub-efi-amd64-bin mtools

# BOOTSTRAP AND CONFIGURE DEBIAN
sudo debootstrap --arch="$arch" --variant=minbase "$debian_ver" "${install_dir}/chroot" http://ftp.us.debian.org/debian/


# CHROOT #############################################################################
sudo chroot "${install_dir}/chroot"

echo "$hostname" > /etc/hostname
apt-get update
apt-get install --no-install-recommends linux-image-${arch} live-boot systemd-sysv
apt-get install --no-install-recommends network-manager net-tools iproute2 xinit xterm vim

# INSTALL PACKAGES

passwd root
apt-get clean
exit
######################################################################################



sudo rm "${install_dir}/image/live/filesystem.squashfs"
mkdir -p "${install_dir}/"{scratch,image/live}
sudo mksquashfs "${install_dir}/chroot" "${install_dir}/image/live/filesystem.squashfs" -e boot

cp "${install_dir}/chroot/boot/vmlinuz-"* "${install_dir}/image/vmlinuz" && cp "${install_dir}/chroot/boot/initrd.img-"* "${install_dir}/image/initrd"

cat <<'EOF' > "${install_dir}/scratch/grub.cfg"

search --set=root --file /DEBIAN_CUSTOM

insmod all_video

set default="0"
set timeout=0

menuentry "Debian Live"" {
    linux /vmlinuz boot=live quiet nomodeset
    initrd /initrd
}
EOF

touch "${install_dir}/image/DEBIAN_CUSTOM"

rm "${install_dir}/scratch/core.img"
grub-mkstandalone --format=i386-pc --output="${install_dir}/scratch/core.img" --install-modules="linux normal iso9660 biosdisk memdisk search tar ls" --modules="linux normal iso9660 biosdisk search" --locales="" --fonts=""  "boot/grub/grub.cfg=${install_dir}/scratch/grub.cfg"

cat /usr/lib/grub/i386-pc/cdboot.img "${install_dir}/scratch/core.img" > "${install_dir}/scratch/bios.img"

rm "${install_dir}/${iso_filename}"
xorriso -as mkisofs -iso-level 3 -full-iso9660-filenames -volid "DEBIAN_CUSTOM" --grub2-boot-info --grub2-mbr /usr/lib/grub/i386-pc/boot_hybrid.img -eltorito-boot boot/grub/bios.img -no-emul-boot -boot-load-size 4 -boot-info-table  --eltorito-catalog boot/grub/boot.cat -output "${install_dir}/${iso_filename}"  -graft-points  "${install_dir}/image"  /boot/grub/bios.img="${install_dir}/scratch/bios.img"
