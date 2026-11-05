#!/usr/bin/env bash

shopt -s expand_aliases
alias reccat='~/code/bash/0recursive_cat_with_filenames.sh'
touch all-in-one.txt
reccat PROJECT-STATE.md > all-in-one.txt
sed -n 'H
$ {g
   s/<\!--/²/g;s/-->/³/g
:a
   s/²[^³]*³//g
   t a
   s/.//p
   }' index.html > tmpdex
echo "Commented out index.html, for display within an html page." >> all-in-one.txt
echo "<!--" >> all-in-one.txt
reccat tmpdex >> all-in-one.txt
echo "-->" >> all-in-one.txt
reccat src >> all-in-one.txt
echo "<html><body>" > tmpdex2
cat all-in-one.txt >> tmpdex2
echo "</body></html>" >> tmpdex2
mv tmpdex2 ~/code/websites/tothrees/thisispubliccodeorisit/index.html
rm tmpdex
