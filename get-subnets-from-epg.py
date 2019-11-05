# This program reads a list of epg's from a csv file, makes an api call to retreive the 
# EPG info, then prints out the corresponding subnet belonging to the EPG.
#
# Author: Jason Crandall


import requests
import json
import re
import string

# Parameters:
document = ""
tenant = ""
app_profile = ""
user = ""
password = ""
apiUrl = ""
authUrl = ""

file = open(document, "r")
epgList = file.readlines()
file.close()

vlanList = []
subnetList = []

# Parse the Vlan ID from the epgs and store in a list
for epg in epgList:
       vlanID = re.findall("\d+", epg)
       vlanList.append(vlanID[0])

# Use the toast api call to obtain the subnet from the epginfo call
for i in vlanList:
       print(i)
       url = (apiUrl + "epginfo?tenant=%s&ap=%s&epg=L_Vlan%s" % (tenant, app_profile, i))

       # Open a session
       s = requests.session()

       # Post user information to receive authentication token
       s.post(authUrl, data={"unid": user, "pass": password}, verify=False)

       # Load the results
       data = s.get(url, verify=False)
       jsonData = json.loads(data.text)
       subnet = jsonData['result']['subnets'][0]['ip']
       subnetList.append(subnet)

for subnet in subnetList:
       print(subnet)
