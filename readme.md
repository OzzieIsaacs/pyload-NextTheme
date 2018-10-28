## About

This is an improved "Next Theme" for pyload. I found the basics for this theme on this site: http://www.howto-blog.de/pyload-themes-installieren/

I improved it to make it work on smaller devices like tablets and smartphones, exchanged the mootools framework with modern jquery. 
It's based on bootstrap, which gives it a modern look&feel and a responsive design. I'd like to share it with you.

<img src="https://github.com/OzzieIsaacs/pyload-NextTheme/raw/master/screenshots/tablet_view.jpg" width="500"> 

<img src="https://github.com/OzzieIsaacs/pyload-NextTheme/raw/master/screenshots/queue.jpg" width="500">

<img src="https://github.com/OzzieIsaacs/pyload-NextTheme/raw/master/screenshots/phone_view.jpg" width="500">

<img src="https://github.com/OzzieIsaacs/pyload-NextTheme/raw/master/screenshots/adder.jpg" width="500">


## Installation

Stop your pyload Server

Copy all of the files from this repro from `template` folder to `/usr/share/pyload/module/web/templates`
Copy all of the files from this repro from `media` folder to `/usr/share/pyload/module/web/media`

Start your pyload Server

Log in to the webinterface. Navigate to settings, open the menu item webinterface. Enter the name of the new theme: "Next" in the template field.

Restart your pyload Server

## Additional Installationsteps for the "old pyload" 

If you are using a pyload version, not including the newest changes in the webinterface.py (after 15th of November 2017) you have to apply some changes in the file webinterface.py by yourself. Download the current version from the pyload project website (https://github.com/pyload/pyload/blob/stable/module/web/webinterface.py) and exchange the file in your pyload installation (normally in: /usr/share/pyload/module/web/). Afterwards restart your pyload Server

## Deactivate the new theme

Navigate to settings open the menu item webinterface. Enter the name of the old theme: "classic" or "default" (depending on how you installed it) in the template field.
