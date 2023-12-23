#!/bin/zsh
umask g-w,o-w
setopt extended_glob
setopt nobeep
setopt autocd

# zshell completion-autosuggest fixes 
export ZDOTDIR="$HOME/.config/zsh"

ZFUNCDIR="${ZFUNCDIR:-$ZDOTDIR/functions}"
fpath=($ZFUNCDIR $fpath)
fpath+=(${ZDOTDIR:-~}/.antidote)
autoload -Uz $fpath[-1]/antidote
autoload compsec


export BROWSER='floorp'
export TERMINAL='wezterm'
export GTK_IM_MODULE=ibus
export XMODIFIERS=@im=dbus
export QT_IM_MODULE=ibus

# Quick and Dirty 1-liners
[[ $- != *i* ]] && return
[[ "$(whoami)" = "root" ]] && return
[[ -z "$FUNCNEST" ]] && export FUNCNEST=100

# antidote 
source $ZDOTDIR/.antidote/antidote.zsh
antidote load ${ZDOTDIR:-$HOME}/.zsh_plugins.txt
source $ZDOTDIR/.zsh_plugins.zsh
# antidote zstyles
[[ -e ${ZDOTDIR:-~}/.zstyles ]] && source ${ZDOTDIR:-~}/.zstyles

if [[ -f ~/.zshenv ]]; then
	mv ~/.zshenv ~/.zshenv.bak
fi
ln -s /home/redd/.config/zsh/.zshenv /home/redd/.zshenv
# antidote zshenv
[[ -f ~/.zprofile ]] || ln -s $ZDOTDIR/.zprofile ~/.zprofile
autoload -Uz compinit && compinit
# sysinfo 
nitch --fetch
