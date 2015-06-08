# set HOME path to default search PATH
if [[ $PATH != *"$HOME"* ]];then

	# set PATH so it includes user's private bin if it exists
	if [ -d "$HOME/bin" ] ; then
	    PATH="$HOME/bin:$PATH"
	fi

	# set PATH so it includes user's selenium installation
	if [ -d "$HOME/Selenium" ] ; then
	    PATH="$HOME/Selenium:$PATH"
	fi

    PATH=.:$HOME:$PATH

fi


alias notepad=gedit
alias npp=gedit
alias md=mkdir
alias r='cd $HOME'
alias s='cd $HOME/GitHome/BaudMeter/Sesame'
alias p='cd $HOME/GitHome/BaudMeter/Grapevine'
alias g='cd $HOME/GitHome/BaudMeter'
alias nm='cd $HOME/GitHome/BaudMeter/node_modules'
