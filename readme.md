## About

This is an improved "Next Theme" for pyload. I found basic theme on this site: http://www.howto-blog.de/pyload-themes-installieren/
I improved it a little bit to make it working on smaller devices like tablets and smartphones, and I'd like to share it with you.

## Installation

Stop your pyload Server

navigate to '/usr/share/pyload/module/web'
Open the file webinterface.py for editing
Search for the following line in the file:
`FileSystemLoader(join(PROJECT_DIR, "templates", "default")),`

Insert the following lines of code right after:

`"Next": FileSystemLoader(join(PROJECT_DIR, "templates", "Next")),`

Delete the file webinterface.pyc in the same folder.
 
Copy all of the files from this repro from `template` folder to `/usr/share/pyload/module/web/templates`
Copy all of the files from this repro from `media` folder to `/usr/share/pyload/module/web/media`

Restart your pyload Server

Log in to the webinterface. Navigate to settings open the menu item webinterface. Enter the name of the new theme: "Next" in the template field.

Restart your pyload server
